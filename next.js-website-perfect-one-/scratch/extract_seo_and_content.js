import fs from 'fs';
import path from 'path';

const cacheDir = 'scratch/sitemap_html_cache';
const urls = JSON.parse(fs.readFileSync('scratch/sitemap_urls.json', 'utf8'));

console.log(`Starting extraction of SEO & content from cached HTML files...`);

const results = [];

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

for (let i = 0; i < urls.length; i++) {
  const url = urls[i];
  const slug = url.replace('https://finprov.com/courses/', '').replace(/\/$/, '');
  const filepath = path.join(cacheDir, `${slug}.html`);

  if (!fs.existsSync(filepath)) {
    console.log(`Missing file for: ${slug}`);
    continue;
  }

  const html = fs.readFileSync(filepath, 'utf8');

  // Extract SEO elements
  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch ? cleanText(titleMatch[1]) : '';

  const metaDescMatch = html.match(/<meta\s+name=["']description["']\s+content=["']([^"']+)["']/i) ||
                        html.match(/<meta\s+property=["']og:description["']\s+content=["']([^"']+)["']/i);
  const metaDescription = metaDescMatch ? cleanText(metaDescMatch[1]) : '';

  const canonicalMatch = html.match(/<link\s+rel=["']canonical["']\s+href=["']([^"']+)["']/i);
  const canonicalUrl = canonicalMatch ? canonicalMatch[1] : url;

  const ogTitleMatch = html.match(/<meta\s+property=["']og:title["']\s+content=["']([^"']+)["']/i);
  const ogTitle = ogTitleMatch ? cleanText(ogTitleMatch[1]) : title;

  const ogImageMatch = html.match(/<meta\s+property=["']og:image["']\s+content=["']([^"']+)["']/i);
  const ogImage = ogImageMatch ? ogImageMatch[1] : '';

  // Extract H1
  const h1Match = html.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i);
  const h1 = h1Match ? cleanText(h1Match[1]) : '';

  // Extract JSON-LD Schemas
  const jsonLdMatches = [...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  const schemas = [];
  jsonLdMatches.forEach(m => {
    try {
      const parsed = JSON.parse(m[1]);
      schemas.push(parsed);
    } catch(e) {}
  });

  // Extract FAQs from schema or DOM
  const faqs = [];
  schemas.forEach(s => {
    if (s['@type'] === 'FAQPage' && Array.isArray(s.mainEntity)) {
      s.mainEntity.forEach(item => {
        if (item.name && item.acceptedAnswer && item.acceptedAnswer.text) {
          faqs.push({
            question: cleanText(item.name),
            answer: cleanText(item.acceptedAnswer.text)
          });
        }
      });
    }
  });

  // Extract highlights (look for bullet items or elemental list items)
  const highlights = [];
  const liMatches = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)];
  liMatches.forEach(m => {
    const text = cleanText(m[1]);
    if (text.length > 10 && text.length < 250 && !text.includes('Home') && !text.includes('Menu') && !text.includes('Privacy')) {
      if (!highlights.includes(text)) {
        highlights.push(text);
      }
    }
  });

  results.push({
    sitemapUrl: url,
    slug,
    title,
    h1,
    metaDescription,
    canonicalUrl,
    ogTitle,
    ogImage,
    faqs,
    highlightsCount: highlights.length,
    sampleHighlights: highlights.slice(0, 10),
    schemasCount: schemas.length
  });
}

fs.writeFileSync('scratch/extracted_sitemap_courses.json', JSON.stringify(results, null, 2));
console.log(`Extracted SEO data for ${results.length} / ${urls.length} course pages!`);
