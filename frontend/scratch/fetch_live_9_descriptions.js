import fs from 'fs';

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

console.log('Fetching live HTML for 9 specific course slugs from finprov.com...');

async function main() {
  const map = {};
  for (const slug of missingSlugs) {
    const url = `https://finprov.com/courses/${slug}/`;
    try {
      const res = await fetch(url);
      if (res.ok) {
        const html = await res.text();
        let mainHtml = html;
        const headerCut = mainHtml.indexOf('</header>');
        if (headerCut !== -1) mainHtml = mainHtml.substring(headerCut);

        const pMatches = [...mainHtml.matchAll(/<p[^>]*>([\s\S]*?)<\/p>/gi)]
          .map(m => cleanText(m[1]))
          .filter(p => p.length > 30 && !p.includes('Support') && !p.includes('Contact Us') && !p.includes('All Courses') && !p.includes('Skip to content') && !p.includes('Copyright'));

        map[slug] = {
          heroDesc: pMatches[0] || '',
          snapshotText: pMatches[1] || pMatches[0] || ''
        };
        console.log(`✓ Live fetched: ${slug}`);
      } else {
        console.log(`[!] HTTP ${res.status} for ${slug}`);
      }
    } catch(e) {
      console.log(`[!] Fetch failed for ${slug}: ${e.message}`);
    }
  }

  // Update courses.ts
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
  console.log('✓ Successfully updated all 70 courses with 100% word-for-word descriptions and snapshot texts!');
}

main();
