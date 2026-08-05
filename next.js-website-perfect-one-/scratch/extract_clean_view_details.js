import fs from 'fs';
import path from 'path';

const cacheDir = 'scratch/sitemap_html_cache';
const urls = JSON.parse(fs.readFileSync('scratch/sitemap_urls.json', 'utf8'));

function cleanText(str) {
  if (!str) return '';
  return str
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function parsePageContent(html, slug) {
  // Isolate main content body by cutting off nav header and footer
  let mainHtml = html;
  const headerCut = mainHtml.indexOf('</header>');
  if (headerCut !== -1) mainHtml = mainHtml.substring(headerCut);
  const footerCut = mainHtml.indexOf('<footer');
  if (footerCut !== -1) mainHtml = mainHtml.substring(0, footerCut);

  // Extract all H1/H2/H3/H4 headings + surrounding paragraphs/lists
  const blocks = [];
  const sectionRegex = /<(h[1-4]|div|section)[^>]*>([\s\S]*?)<\/\1>/gi;

  // Extract headings
  const headings = [...mainHtml.matchAll(/<h[234][^>]*>([\s\S]*?)<\/h[234]>/gi)]
    .map(m => cleanText(m[1]))
    .filter(h => h.length > 3 && !h.includes('Support') && !h.includes('Contact Us') && !h.includes('All Courses') && !h.includes('Finprov School'));

  // Extract paragraphs
  const paragraphs = [...mainHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map(m => cleanText(m[1]))
    .filter(p => p.length > 40 && !p.includes('Copyright') && !p.includes('All Rights Reserved') && !p.includes('Skip to content'));

  // Extract bullet points
  const listItems = [...mainHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map(m => cleanText(m[1]))
    .filter(l => l.length > 10 && l.length < 250 && !l.includes('Home') && !l.includes('Menu') && !l.includes('Support') && !l.includes('Contact Us') && !l.includes('All Courses'));

  // Extract Accordions / Modules
  const modules = [];
  const accordionMatches = [...mainHtml.matchAll(/<(?:div|span|h3|h4|button)[^>]*class=["'][^"']*(?:elementor-tab-title|elementor-toggle-title|accordion-header|jkit-accordion-title)[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|span|h3|h4|button)>[\s\S]*?<(?:div|section)[^>]*class=["'][^"']*(?:elementor-tab-content|elementor-toggle-content|accordion-content|jkit-accordion-content)[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|section)>/gi)];

  accordionMatches.forEach((m, idx) => {
    const title = cleanText(m[1]);
    const content = cleanText(m[2]);
    if (title && content && !title.includes('Contact') && !title.includes('Menu')) {
      const topics = content.split(/[•\n\r,]/).map(cleanText).filter(t => t.length > 3 && t.length < 150);
      modules.push({
        title: title.startsWith('Module') || title.startsWith('Topic') ? title : `Module ${idx + 1}: ${title}`,
        topics: topics.length > 0 ? topics : [content]
      });
    }
  });

  // Extract FAQs
  const faqs = [];
  const faqBlocks = [...mainHtml.matchAll(/<div[^>]*itemprop=["']mainEntity["'][^>]*>([\s\S]*?)<\/div>/gi)];
  faqBlocks.forEach(b => {
    const qMatch = b[1].match(/<div[^>]*itemprop=["']name["'][^>]*>([\s\S]*?)<\/div>/i) || b[1].match(/<h[345][^>]*>([\s\S]*?)<\/h[345]>/i);
    const aMatch = b[1].match(/<div[^>]*itemprop=["']text["'][^>]*>([\s\S]*?)<\/div>/i) || b[1].match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (qMatch && aMatch) {
      faqs.push({
        question: cleanText(qMatch[1]),
        answer: cleanText(aMatch[1])
      });
    }
  });

  return {
    slug,
    headings,
    aboutParagraphs: paragraphs.slice(0, 5),
    highlights: listItems.slice(0, 12),
    modules,
    faqs
  };
}

console.log('Testing extraction across all 84 pages...');
const allExtracted = {};

let totalModulesExtracted = 0;
let totalParagraphsExtracted = 0;

for (let i = 0; i < urls.length; i++) {
  const url = urls[i];
  const slug = url.replace('https://finprov.com/courses/', '').replace(/\/$/, '');
  const filepath = path.join(cacheDir, `${slug}.html`);

  if (!fs.existsSync(filepath)) continue;

  const html = fs.readFileSync(filepath, 'utf8');
  const parsed = parsePageContent(html, slug);

  allExtracted[slug] = parsed;
  totalModulesExtracted += parsed.modules.length;
  totalParagraphsExtracted += parsed.aboutParagraphs.length;
}

console.log(`✓ Parsed ${Object.keys(allExtracted).length} pages!`);
console.log(` - Total Paragraphs: ${totalParagraphsExtracted}`);
console.log(` - Total Modules: ${totalModulesExtracted}`);

fs.writeFileSync('scratch/rich_view_details_data.json', JSON.stringify(allExtracted, null, 2));
