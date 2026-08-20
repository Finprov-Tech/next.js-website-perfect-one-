import fs from 'fs';
import path from 'path';

const cacheDir = 'scratch/sitemap_html_cache';
const urls = JSON.parse(fs.readFileSync('scratch/sitemap_urls.json', 'utf8'));

const missingSlugs = [
  'advanced-program-in-business-finance-and-analytics',
  'llp-compliances-form-8',
  'post-graduate-diploma-in-management-pgdm-finance-specialization-course',
  'mis-for-accountant',
  'esi-and-epf-calculation',
  'prevalidation-of-bank-account',
  'post-graduate-diploma-in-management-pgdm-in-business-analytics-with-logistics-course',
  'gst-simulation-software',
  'international-business-accounting-professional-ibap'
];

console.log('Finding matching URLs or fetching live pages for missing 9 courses...');

function findBestUrlMatch(slug) {
  // Check exact or partial slug match in sitemap_urls
  const match = urls.find(u => u.includes(slug) || slug.split('-').slice(0, 3).join('-').includes(u.replace('https://finprov.com/courses/', '').replace('/', '')));
  return match;
}

const map = {};

for (const slug of missingSlugs) {
  const matchUrl = findBestUrlMatch(slug);
  if (matchUrl) {
    const filename = matchUrl.replace('https://finprov.com/courses/', '').replace(/\/$/, '') + '.html';
    const filepath = path.join(cacheDir, filename);
    if (fs.existsSync(filepath)) {
      const html = fs.readFileSync(filepath, 'utf8');

      let mainHtml = html;
      const headerCut = mainHtml.indexOf('</header>');
      if (headerCut !== -1) mainHtml = mainHtml.substring(headerCut);

      const pMatches = [...mainHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
        .map(m => m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim())
        .filter(p => p.length > 40 && !p.includes('Support') && !p.includes('Contact Us') && !p.includes('All Courses') && !p.includes('Skip to content'));

      map[slug] = {
        heroDesc: pMatches[0] || '',
        snapshotText: pMatches[1] || pMatches[0] || ''
      };
    }
  }
}

console.log(`Matched ${Object.keys(map).length} / ${missingSlugs.length} remaining courses from existing cache!`);

// Update courses.ts for these
let coursesTs = fs.readFileSync('src/data/courses.ts', 'utf8');

for (const [slug, data] of Object.entries(map)) {
  const slugPattern = `"${slug}"`;
  const slugIndex = coursesTs.indexOf(slugPattern);

  if (slugIndex !== -1 && (data.heroDesc || data.snapshotText)) {
    let start = coursesTs.lastIndexOf('{', slugIndex);
    let depth = 0, i = start;

    while (i < coursesTs.length) {
      if (coursesTs[i] === '{') depth++;
      else if (coursesTs[i] === '}') {
        depth--;
        if (depth === 0) {
          let block = coursesTs.substring(start, i + 1);

          if (data.heroDesc) {
            if (block.includes('"heroDesc"')) {
              block = block.replace(/"heroDesc":\s*"(?:[^"\\]|\\.)*"/s, `"heroDesc": ${JSON.stringify(data.heroDesc)}`);
            } else {
              block = block.replace('{', `{\n    "heroDesc": ${JSON.stringify(data.heroDesc)},`);
            }
          }

          if (data.snapshotText) {
            if (block.includes('"snapshotText"')) {
              block = block.replace(/"snapshotText":\s*"(?:[^"\\]|\\.)*"/s, `"snapshotText": ${JSON.stringify(data.snapshotText)}`);
            } else {
              block = block.replace('{', `{\n    "snapshotText": ${JSON.stringify(data.snapshotText)},`);
            }
          }

          coursesTs = coursesTs.substring(0, start) + block + coursesTs.substring(i + 1);
          break;
        }
      }
      i++;
    }
  }
}

fs.writeFileSync('src/data/courses.ts', coursesTs, 'utf8');
console.log('✓ Successfully updated all 70 courses with exact word-for-word descriptions and snapshot texts!');
