import fs from 'fs';

const richData = JSON.parse(fs.readFileSync('scratch/rich_view_details_data.json', 'utf8'));
let coursesTs = fs.readFileSync('src/data/courses.ts', 'utf8');

// Iterate over extracted rich data
let updatedOverviewCount = 0;
let updatedHighlightsCount = 0;

for (const [slug, data] of Object.entries(richData)) {
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

          // If heroDesc is basic or default, update with extracted multi-paragraph overview
          if (data.aboutParagraphs && data.aboutParagraphs.length > 0) {
            const fullOverview = data.aboutParagraphs.join('\n\n');
            if (fullOverview.length > 80 && (!block.includes('"heroDesc"') || block.includes('Learn essential accounting') || block.includes('Take your accounting career'))) {
              if (block.includes('"heroDesc"')) {
                block = block.replace(/"heroDesc":\s*"(?:[^"\\]|\\.)*"/s, `"heroDesc": ${JSON.stringify(fullOverview)}`);
              } else {
                block = block.replace('{', `{\n    "heroDesc": ${JSON.stringify(fullOverview)},`);
              }
              updatedOverviewCount++;
            }
          }

          // If highlights exist, inject if missing or basic
          if (data.highlights && data.highlights.length >= 3 && (!block.includes('"highlights"') || block.includes('Support') || block.includes('100% Practical Industry-Aligned'))) {
            const cleanHighlights = data.highlights.filter(h => !h.includes('Support') && !h.includes('Contact Us') && !h.includes('All Courses'));
            if (cleanHighlights.length >= 3) {
              if (block.includes('"highlights"')) {
                block = block.replace(/"highlights":\s*\[[\s\S]*?\]/s, `"highlights": ${JSON.stringify(cleanHighlights, null, 6)}`);
              } else {
                block = block.replace('{', `{\n    "highlights": ${JSON.stringify(cleanHighlights, null, 6)},`);
              }
              updatedHighlightsCount++;
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

console.log(`✓ Updated overview text for ${updatedOverviewCount} courses!`);
console.log(`✓ Updated highlights for ${updatedHighlightsCount} courses!`);

fs.writeFileSync('src/data/courses.ts', coursesTs, 'utf8');
