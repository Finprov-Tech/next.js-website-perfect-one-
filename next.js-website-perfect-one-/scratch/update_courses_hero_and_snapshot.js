import fs from 'fs';

let content = fs.readFileSync('src/data/courses.ts', 'utf8');
const exactData = JSON.parse(fs.readFileSync('scratch/exact_extracted_hero_and_snapshot.json', 'utf8'));

// 1. Ensure snapshotText field in Course interface
if (!content.includes('snapshotText?: string;')) {
  content = content.replace(
    'export interface Course {',
    `export interface Course {\n  snapshotText?: string;`
  );
  console.log('✓ Added snapshotText field to Course interface');
}

// 2. Update heroDesc and snapshotText across all courses
let updatedCount = 0;

for (const [slug, data] of Object.entries(exactData)) {
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

          // Update heroDesc (Image 4)
          if (data.heroDesc && data.heroDesc.length > 20) {
            if (block.includes('"heroDesc"')) {
              block = block.replace(/"heroDesc":\s*"(?:[^"\\]|\\.)*"/s, `"heroDesc": ${JSON.stringify(data.heroDesc)}`);
            } else {
              block = block.replace('{', `{\n    "heroDesc": ${JSON.stringify(data.heroDesc)},`);
            }
          }

          // Update snapshotText (Image 3)
          if (data.snapshotText && data.snapshotText.length > 20) {
            if (block.includes('"snapshotText"')) {
              block = block.replace(/"snapshotText":\s*"(?:[^"\\]|\\.)*"/s, `"snapshotText": ${JSON.stringify(data.snapshotText)}`);
            } else {
              block = block.replace('{', `{\n    "snapshotText": ${JSON.stringify(data.snapshotText)},`);
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

console.log(`✓ Updated heroDesc and snapshotText across ${updatedCount} courses in courses.ts!`);
fs.writeFileSync('src/data/courses.ts', content, 'utf8');
