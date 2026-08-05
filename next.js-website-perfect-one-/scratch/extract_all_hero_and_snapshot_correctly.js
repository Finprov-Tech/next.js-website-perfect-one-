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

console.log('Extracting exact Hero Description and Course Snapshot text for all 84 course HTML files...');

const extractedMap = {};

for (let i = 0; i < urls.length; i++) {
  const url = urls[i];
  const slug = url.replace('https://finprov.com/courses/', '').replace(/\/$/, '');
  const filepath = path.join(cacheDir, `${slug}.html`);

  if (!fs.existsSync(filepath)) continue;

  const html = fs.readFileSync(filepath, 'utf8');

  // Strip header and footer
  let mainHtml = html;
  const headerCut = mainHtml.indexOf('</header>');
  if (headerCut !== -1) mainHtml = mainHtml.substring(headerCut);
  const footerCut = mainHtml.indexOf('<footer');
  if (footerCut !== -1) mainHtml = mainHtml.substring(0, footerCut);

  // 1. Extract Hero Description (Image 4): First major text paragraph on page
  const heroMatch = mainHtml.match(/Enhance your skills[\s\S]*?opportunities\./i) ||
                    mainHtml.match(/Master[\s\S]*?career\./i);

  const allParagraphs = [...mainHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
    .map(m => cleanText(m[1]))
    .filter(p => p.length > 50 && !p.includes('Support') && !p.includes('All Courses') && !p.includes('Skip to content') && !p.includes('Copyright') && !p.includes('applied in the last') && !p.includes('FREE!'));

  const heroDesc = heroMatch ? cleanText(heroMatch[0]) : (allParagraphs[0] || '');

  // 2. Extract Snapshot Text (Image 3): Text paragraph under "Course Snapshot" or containing "provides students with", "personalized mentorship", "fundamental knowledge"
  let snapshotText = '';
  const snapshotSection = mainHtml.match(/Course\s*Snapshot[\s\S]*?(?:What does|Highlights|Curriculum|Tools|Earn)/i);
  if (snapshotSection) {
    const sParagraphs = [...snapshotSection[0].matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
      .map(m => cleanText(m[1]))
      .filter(p => p.length > 50 && p !== heroDesc && !p.includes('FREE!') && !p.includes('applied in the last'));
    if (sParagraphs.length > 0) {
      snapshotText = sParagraphs[0];
    }
  }

  if (!snapshotText) {
    snapshotText = allParagraphs.find(p => p !== heroDesc && (p.includes('provides') || p.includes('mentorship') || p.includes('diploma') || p.includes('course') || p.includes('students'))) || allParagraphs[1] || heroDesc;
  }

  extractedMap[slug] = {
    slug,
    heroDesc,
    snapshotText
  };
}

console.log(`✓ Parsed exact Hero and Snapshot text for ${Object.keys(extractedMap).length} courses!`);
fs.writeFileSync('scratch/exact_extracted_hero_and_snapshot.json', JSON.stringify(extractedMap, null, 2));

// Test on PGDIFA
const pgdifaKey = Object.keys(extractedMap).find(k => k.includes('pgdifa') || k.includes('foreign'));
if (pgdifaKey) {
  console.log(`\n--- Perfect PGDIFA Extracted Content (${pgdifaKey}) ---`);
  console.log('Hero Description (Image 4):', extractedMap[pgdifaKey].heroDesc);
  console.log('\nCourse Snapshot Text (Image 3):', extractedMap[pgdifaKey].snapshotText);
}
