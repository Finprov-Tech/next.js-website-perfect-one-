import fs from 'fs';

let content = fs.readFileSync('src/data/courses.ts', 'utf8');
const highlightsData = JSON.parse(fs.readFileSync('scratch/clean_real_highlights.json', 'utf8'));
const faqsData = JSON.parse(fs.readFileSync('scratch/exact_highlights_and_faqs_data.json', 'utf8'));

let updatedCount = 0;

for (const slug of Object.keys(highlightsData)) {
  const slugPattern = `"${slug}"`;
  const slugIndex = content.indexOf(slugPattern);

  if (slugIndex !== -1) {
    let start = content.lastIndexOf('{', slugIndex);
    let depth = 0, i = start;

    while (i < content.length) {
      if (content[i] === '{') depth++;
      else if (content[i] === '}') {
        depth--;
        if (depth === 0) {
          let block = content.substring(start, i + 1);

          // Update highlights
          const cleanH = highlightsData[slug] || [
            "100% Practical Industry-Aligned Curriculum",
            "Covers Indian & Foreign Accounting, GST & Taxation",
            "Practical Software Practice on Tally Prime, Zoho Books & SAP",
            "100% Placement Assistance with Mock Interviews & Resume Support"
          ];
          if (block.includes('"highlights"')) {
            block = block.replace(/"highlights":\s*\[[\s\S]*?\]/s, `"highlights": ${JSON.stringify(cleanH, null, 6)}`);
          } else {
            block = block.replace('{', `{\n    "highlights": ${JSON.stringify(cleanH, null, 6)},`);
          }

          // Update faqs
          const cleanF = faqsData[slug]?.faqs || [];
          if (cleanF.length > 0) {
            if (block.includes('"faqs"')) {
              block = block.replace(/"faqs":\s*\[[\s\S]*?\]/s, `"faqs": ${JSON.stringify(cleanF, null, 6)}`);
            } else {
              block = block.replace('{', `{\n    "faqs": ${JSON.stringify(cleanF, null, 6)},`);
            }
          }

          content = content.substring(0, start) + block + content.substring(i + 1);
          updatedCount++;
          break;
        }
      }
      i++;
    }
  }
}

console.log(`✓ Updated highlights and FAQs across ${updatedCount} courses in courses.ts!`);
fs.writeFileSync('src/data/courses.ts', content, 'utf8');
