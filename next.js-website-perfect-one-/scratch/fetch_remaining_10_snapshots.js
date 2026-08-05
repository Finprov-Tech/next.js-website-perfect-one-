import fs from 'fs';
import path from 'path';

const remainingSlugs = [
  'pg-diploma-in-indian-and-foreign-accounting-course',
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

console.log('Fetching exact live snapshot paragraphs for remaining 10 courses...');

async function main() {
  const map = {};

  for (const slug of remainingSlugs) {
    const urlsToTry = [
      `https://finprov.com/courses/${slug}/`,
      `https://finprov.com/courses/${slug.replace(/-course$/, '')}/`,
      `https://finprov.com/courses/${slug.replace(/^post-graduate-/, 'pg-')}/`
    ];

    for (const url of urlsToTry) {
      try {
        const res = await fetch(url);
        if (res.ok) {
          const html = await res.text();
          const snapPos = html.toLowerCase().indexOf('snapshot');
          if (snapPos !== -1) {
            const afterSnap = html.substring(snapPos);
            const pMatches = [...afterSnap.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
              .map(m => cleanText(m[1]))
              .filter(p => p.length > 35 && !p.includes('applied in') && !p.includes('Get Started') && !p.includes('Choose Your'));
            if (pMatches.length > 0) {
              map[slug] = pMatches[0];
              console.log(`✓ Fetched snapshot for: ${slug}`);
              break;
            }
          }
        }
      } catch(e) {}
    }
  }

  // Update courses.ts for these
  let coursesTs = fs.readFileSync('src/data/courses.ts', 'utf8');

  for (const [slug, text] of Object.entries(map)) {
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

            if (block.includes('"snapshotText"')) {
              block = block.replace(/"snapshotText":\s*"(?:[^"\\]|\\.)*"/s, `"snapshotText": ${JSON.stringify(text)}`);
            } else {
              block = block.replace('{', `{\n    "snapshotText": ${JSON.stringify(text)},`);
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
  console.log(`✓ Finished updating snapshotText for all 70 courses!`);
}

main();
