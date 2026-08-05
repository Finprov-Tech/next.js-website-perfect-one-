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

// Map slug to cached file
function findHtmlFile(slug) {
  const files = fs.readdirSync(cacheDir);

  // 1. Exact match
  if (files.includes(`${slug}.html`)) return `${slug}.html`;

  // 2. Normalize
  const normSlug = slug.replace(/-course$/, '').replace(/-uae$/, '').replace(/^post-graduate-/, 'pg-');
  const match = files.find(f => {
    const normF = f.replace('.html', '').replace(/-course$/, '').replace(/-uae$/, '').replace(/^post-graduate-/, 'pg-');
    return normF === normSlug || normF.includes(normSlug) || normSlug.includes(normF);
  });

  return match || null;
}

const snapshotMap = {};
const slugMatches = [...coursesTs.matchAll(/"slug":\s*"([^"]+)"/g)].map(m => m[1]);

console.log(`Extracting Course Snapshot paragraphs for ${slugMatches.length} primary courses...`);

slugMatches.forEach(slug => {
  const htmlFile = findHtmlFile(slug);
  if (!htmlFile) {
    console.log(`[!] File missing for: ${slug}`);
    return;
  }

  const html = fs.readFileSync(path.join(cacheDir, htmlFile), 'utf8');

  // Search for snapshot index
  const snapPos = html.toLowerCase().indexOf('snapshot');
  if (snapPos !== -1) {
    const afterSnap = html.substring(snapPos);
    // Find paragraphs or text blocks
    const pMatches = [...afterSnap.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
      .map(m => cleanText(m[1]))
      .filter(p => p.length > 35 &&
                   !p.includes('applied in the last') &&
                   !p.includes('Get Started') &&
                   !p.includes('Choose Your Perfect Course') &&
                   !p.includes('Hours of Learning') &&
                   !p.includes('FREE!'));

    if (pMatches.length > 0) {
      snapshotMap[slug] = pMatches[0];
    }
  }
});

console.log(`✓ Successfully extracted exact Course Snapshot text for ${Object.keys(snapshotMap).length} / ${slugMatches.length} courses!`);

// Print samples
console.log('\n--- Verified Live Course Snapshots ---');
['pg-diploma-in-indian-and-foreign-accounting-course', 'pg-diploma-in-business-accounting-and-taxation-course-pgbat', 'diploma-in-indian-accounting-dia'].forEach(s => {
  if (snapshotMap[s]) {
    console.log(`[${s}]:\n "${snapshotMap[s]}"\n`);
  }
});

// Update ONLY snapshotText in src/data/courses.ts (leaving heroDesc untouched)
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

          // Replace snapshotText ONLY
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
console.log(`✓ Updated snapshotText for ${updatedCount} courses while keeping heroDesc locked!`);
