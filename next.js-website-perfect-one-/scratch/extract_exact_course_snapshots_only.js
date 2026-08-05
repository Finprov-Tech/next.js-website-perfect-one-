import fs from 'fs';
import path from 'path';

const cacheDir = 'scratch/sitemap_html_cache';
let coursesTs = fs.readFileSync('src/data/courses.ts', 'utf8');

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

// Find HTML filename for a slug
const getHtmlFile = (slug) => {
  const files = fs.readdirSync(cacheDir);
  const exact = files.find(f => f.replace('.html', '') === slug);
  if (exact) return exact;

  const partial = files.find(f => f.includes(slug) || slug.includes(f.replace('.html', '')));
  return partial || null;
};

console.log('Extracting exact "Course Snapshot" section paragraphs for all 70 courses...');

const snapshotMap = {};
const slugMatches = [...coursesTs.matchAll(/"slug":\s*"([^"]+)"/g)].map(m => m[1]);

slugMatches.forEach(slug => {
  const htmlFile = getHtmlFile(slug);
  if (!htmlFile) return;

  const html = fs.readFileSync(path.join(cacheDir, htmlFile), 'utf8');

  // Find "Course Snapshot" in the page HTML
  const snapshotPos = html.search(/Course\s*Snapshot/i);
  if (snapshotPos !== -1) {
    const afterHeading = html.substring(snapshotPos);
    // Find text inside <p> or <div> under Course Snapshot section
    const pMatches = [...afterHeading.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
      .map(m => cleanText(m[1]))
      .filter(p => p.length > 40 &&
                   !p.includes('applied in the last') &&
                   !p.includes('Get Started') &&
                   !p.includes('Choose Your Perfect Course') &&
                   !p.includes('FREE!'));

    if (pMatches.length > 0) {
      snapshotMap[slug] = pMatches[0];
    }
  }
});

console.log(`✓ Extracted exact Course Snapshot text for ${Object.keys(snapshotMap).length} / 70 courses!`);

// Print sample for PGDIFA and PGBAT
console.log('\n--- Sample Extracted Course Snapshots ---');
Object.keys(snapshotMap).slice(0, 3).forEach(slug => {
  console.log(`[${slug}]:\n  "${snapshotMap[slug]}"\n`);
});

// Update ONLY snapshotText in src/data/courses.ts (heroDesc remains locked)
let updatedCount = 0;

for (const [slug, text] of Object.entries(snapshotMap)) {
  const slugPattern = `"${slug}"`;
  const slugIndex = coursesTs.indexOf(slugPattern);

  if (slugIndex !== -1 && text) {
    let start = coursesTs.lastIndexOf('{', slugIndex);
    let depth = 0, i = start;

    while (i < coursesTs.length) {
      if (coursesTs[i] === '{') depth++;
      else if (coursesTs[i] === '}') {
        depth--;
        if (depth === 0) {
          let block = coursesTs.substring(start, i + 1);

          // Update ONLY snapshotText, leaving heroDesc untouched
          if (block.includes('"snapshotText"')) {
            block = block.replace(/"snapshotText":\s*"(?:[^"\\]|\\.)*"/s, `"snapshotText": ${JSON.stringify(text)}`);
          } else {
            block = block.replace('{', `{\n    "snapshotText": ${JSON.stringify(text)},`);
          }

          coursesTs = coursesTs.substring(0, start) + block + coursesTs.substring(i + 1);
          updatedCount++;
          break;
        }
      }
      i++;
    }
  }
}

fs.writeFileSync('src/data/courses.ts', coursesTs, 'utf8');
console.log(`✓ Successfully updated ONLY snapshotText across ${updatedCount} courses while keeping heroDesc locked!`);
