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

// Map of slug aliases to HTML filenames if slug differs slightly
const slugToHtmlFile = (slug) => {
  let file = `${slug}.html`;
  if (fs.existsSync(path.join(cacheDir, file))) return file;

  // Search cache directory for matching filename
  const files = fs.readdirSync(cacheDir);
  const found = files.find(f => f.replace('.html', '') === slug || f.includes(slug) || slug.includes(f.replace('.html', '')));
  if (found) return found;

  return null;
};

console.log('Extracting word-for-word heroDesc and snapshotText from live HTML files for all 70 courses...');

const exactMap = {};
let matchedCount = 0;

// Read all courses from courses.ts by regex
const slugMatches = [...coursesTs.matchAll(/"slug":\s*"([^"]+)"/g)].map(m => m[1]);

slugMatches.forEach(slug => {
  const htmlFile = slugToHtmlFile(slug);
  if (!htmlFile) {
    console.log(`[!] Cache missing for slug: ${slug}`);
    return;
  }

  const html = fs.readFileSync(path.join(cacheDir, htmlFile), 'utf8');

  // Strip header and footer navigation
  let mainHtml = html;
  const headerCut = mainHtml.indexOf('</header>');
  if (headerCut !== -1) mainHtml = mainHtml.substring(headerCut);
  const footerCut = mainHtml.indexOf('<footer');
  if (footerCut !== -1) mainHtml = mainHtml.substring(0, footerCut);

  // 1. Extract Course Snapshot Paragraph (word-for-word under "Course Snapshot")
  let snapshotText = '';
  const snapshotIdx = mainHtml.search(/Course\s*Snapshot/i);
  if (snapshotIdx !== -1) {
    const afterSnapshot = mainHtml.substring(snapshotIdx);
    const pMatches = [...afterSnapshot.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
      .map(m => cleanText(m[1]))
      .filter(p => p.length > 40 && !p.includes('applied in the last') && !p.includes('Get Started') && !p.includes('FREE!'));
    if (pMatches.length > 0) {
      snapshotText = pMatches[0];
    }
  }

  // 2. Extract Hero Description Paragraph (word-for-word under hero H1/H2)
  let heroDesc = '';
  const h1Match = mainHtml.match(/<h1[^>]*>([\s\S]*?)<\/h1>/i) || mainHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  if (h1Match) {
    const h1Pos = mainHtml.indexOf(h1Match[0]);
    const afterH1 = mainHtml.substring(h1Pos + h1Match[0].length);
    const pMatches = [...afterH1.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
      .map(m => cleanText(m[1]))
      .filter(p => p.length > 50 && p !== snapshotText && !p.includes('Skip to content') && !p.includes('Get courses worth') && !p.includes('Support') && !p.includes('Contact Us'));
    if (pMatches.length > 0) {
      heroDesc = pMatches[0];
    }
  }

  if (heroDesc || snapshotText) {
    matchedCount++;
    exactMap[slug] = {
      heroDesc: heroDesc || snapshotText,
      snapshotText: snapshotText || heroDesc
    };
  }
});

console.log(`✓ Matched ${matchedCount} / ${slugMatches.length} courses with exact word-for-word text!`);

// Now update ONLY heroDesc and snapshotText fields in src/data/courses.ts
let updatedCourses = 0;

for (const [slug, data] of Object.entries(exactMap)) {
  const slugPattern = `"${slug}"`;
  const slugIndex = coursesTs.indexOf(slugPattern);

  if (slugIndex !== -1) {
    let start = coursesTs.lastIndexOf('{', slugIndex);
    let depth = 0, i = start;

    while (i < coursesTs.length) {
      if (coursesTs[i] === '{') depth++;
      else if (coursesTs[i] === '}') {
        depth--;
        if (depth === 0) {
          let block = coursesTs.substring(start, i + 1);

          // Replace heroDesc
          if (data.heroDesc && data.heroDesc.length > 20) {
            if (block.includes('"heroDesc"')) {
              block = block.replace(/"heroDesc":\s*"(?:[^"\\]|\\.)*"/s, `"heroDesc": ${JSON.stringify(data.heroDesc)}`);
            } else {
              block = block.replace('{', `{\n    "heroDesc": ${JSON.stringify(data.heroDesc)},`);
            }
          }

          // Replace snapshotText
          if (data.snapshotText && data.snapshotText.length > 20) {
            if (block.includes('"snapshotText"')) {
              block = block.replace(/"snapshotText":\s*"(?:[^"\\]|\\.)*"/s, `"snapshotText": ${JSON.stringify(data.snapshotText)}`);
            } else {
              block = block.replace('{', `{\n    "snapshotText": ${JSON.stringify(data.snapshotText)},`);
            }
          }

          coursesTs = coursesTs.substring(0, start) + block + coursesTs.substring(i + 1);
          updatedCourses++;
          break;
        }
      }
      i++;
    }
  }
}

console.log(`✓ Successfully updated heroDesc and snapshotText for ${updatedCourses} courses in courses.ts!`);
fs.writeFileSync('src/data/courses.ts', coursesTs, 'utf8');
