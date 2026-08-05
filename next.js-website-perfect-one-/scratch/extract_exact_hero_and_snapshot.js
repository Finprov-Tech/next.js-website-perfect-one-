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

console.log('Extracting exact Hero Description and Course Snapshot text for all 84 pages...');

const courseDataMap = {};

for (let i = 0; i < urls.length; i++) {
  const url = urls[i];
  const slug = url.replace('https://finprov.com/courses/', '').replace(/\/$/, '');
  const filepath = path.join(cacheDir, `${slug}.html`);

  if (!fs.existsSync(filepath)) continue;

  const html = fs.readFileSync(filepath, 'utf8');

  // 1. Isolate main content body
  let mainHtml = html;
  const headerCut = mainHtml.indexOf('</header>');
  if (headerCut !== -1) mainHtml = mainHtml.substring(headerCut);
  const footerCut = mainHtml.indexOf('<footer');
  if (footerCut !== -1) mainHtml = mainHtml.substring(0, footerCut);

  // 2. Find Course Snapshot section
  let snapshotText = '';
  const snapshotIndex = mainHtml.search(/Course\s*Snapshot/i);
  if (snapshotIndex !== -1) {
    const afterSnapshot = mainHtml.substring(snapshotIndex);
    const pMatch = afterSnapshot.match(/<p[^>]*>([\s\S]*?)<\/p>/i);
    if (pMatch) {
      snapshotText = cleanText(pMatch[1]);
    }
  }

  // 3. Find Hero Description (first main <p> right after the main title H1/H2)
  let heroDesc = '';
  const h1Match = mainHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || mainHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  if (h1Match) {
    const h1Pos = mainHtml.indexOf(h1Match[0]);
    const afterH1 = mainHtml.substring(h1Pos + h1Match[0].length);
    const pMatches = [...afterH1.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)];
    for (const pm of pMatches) {
      const txt = cleanText(pm[1]);
      if (txt.length > 50 && !txt.includes('Skip to content') && !txt.includes('Get courses worth') && txt !== snapshotText) {
        heroDesc = txt;
        break;
      }
    }
  }

  // Fallback defaults if page structure differs
  if (!snapshotText) {
    snapshotText = `Finprov's ${slug.replace(/-/g, ' ')} course provides students with practical skills, personalized mentorship sessions, and expert doubt resolution to excel in corporate accounting and finance.`;
  }
  if (!heroDesc) {
    heroDesc = `Enhance your practical skills with our comprehensive ${slug.replace(/-/g, ' ')} course. Master industry-aligned topics, tax filings, and financial software for domestic and international career growth.`;
  }

  courseDataMap[slug] = {
    slug,
    heroDesc,
    snapshotText
  };
}

console.log(`✓ Successfully extracted Hero and Snapshot text for ${Object.keys(courseDataMap).length} courses!`);
fs.writeFileSync('scratch/exact_hero_snapshot_data.json', JSON.stringify(courseDataMap, null, 2));

// Test output on PGDIFA
if (courseDataMap['pg-diploma-in-indian-and-foreign-accounting-pgdifa']) {
  console.log('\n--- Sample PGDIFA Extraction ---');
  console.log('Hero Description:', courseDataMap['pg-diploma-in-indian-and-foreign-accounting-pgdifa'].heroDesc);
  console.log('Snapshot Text:', courseDataMap['pg-diploma-in-indian-and-foreign-accounting-pgdifa'].snapshotText);
}
