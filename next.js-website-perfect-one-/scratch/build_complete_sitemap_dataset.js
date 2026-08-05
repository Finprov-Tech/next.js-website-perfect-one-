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

// Read current courses.ts content
let coursesTs = fs.readFileSync('src/data/courses.ts', 'utf8');

// Load extracted sitemap data
const sitemapData = JSON.parse(fs.readFileSync('scratch/extracted_sitemap_courses.json', 'utf8'));

// Build detailed map of extracted sitemap courses
const extractedMap = {};

for (const item of sitemapData) {
  const filepath = path.join(cacheDir, `${item.slug}.html`);
  if (!fs.existsSync(filepath)) continue;

  const html = fs.readFileSync(filepath, 'utf8');

  // Extract FAQs
  const faqs = [];
  const faqRegex = /"name"\s*:\s*"([^"]+)"[\s\S]*?"text"\s*:\s*"([^"]+)"/g;
  let match;
  while ((match = faqRegex.exec(html)) !== null) {
    faqs.push({
      question: cleanText(match[1]),
      answer: cleanText(match[2])
    });
  }

  // Extract Curriculum Modules if available
  const modules = [];
  const accordionMatches = [...html.matchAll(/<div[^>]*class=["'][^"']*elementor-tab-title[^"']*["'][^>]*>([\s\S]*?)<\/div>[\s\S]*?<div[^>]*class=["'][^"']*elementor-tab-content[^"']*["'][^>]*>([\s\S]*?)<\/div>/gi)];
  accordionMatches.forEach(m => {
    const modTitle = cleanText(m[1]);
    const modContent = cleanText(m[2]);
    if (modTitle && modContent && !modTitle.includes('Contact') && !modTitle.includes('Menu')) {
      const topics = modContent.split(/[•\n]/).map(cleanText).filter(t => t.length > 3);
      modules.push({ title: modTitle, topics: topics.length > 0 ? topics : [modContent] });
    }
  });

  extractedMap[item.slug] = {
    slug: item.slug,
    sitemapUrl: item.sitemapUrl,
    seoTitle: item.title,
    h1: item.h1,
    metaDescription: item.metaDescription,
    canonicalUrl: item.canonicalUrl,
    faqs,
    curriculum: modules
  };
}

console.log(`Extracted detailed data for ${Object.keys(extractedMap).length} sitemap courses.`);

fs.writeFileSync('scratch/full_extracted_sitemap_map.json', JSON.stringify(extractedMap, null, 2));
