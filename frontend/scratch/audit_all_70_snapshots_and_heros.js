import fs from 'fs';

const coursesTs = fs.readFileSync('src/data/courses.ts', 'utf8');

const matches = [...coursesTs.matchAll(/\{\s*"jobOpportunities"[\s\S]*?\n  \}/g)];

console.log(`Auditing all ${matches.length} course objects for snapshotText and heroDesc...\n`);

let missingSnap = 0;
let missingHero = 0;

matches.forEach((m, idx) => {
  const block = m[0];
  const slugMatch = block.match(/"slug":\s*"([^"]+)"/);
  const titleMatch = block.match(/"title":\s*"([^"]+)"/);
  const heroMatch = block.match(/"heroDesc":\s*"((?:[^"\\]|\\.)*)"/);
  const snapMatch = block.match(/"snapshotText":\s*"((?:[^"\\]|\\.)*)"/);

  const slug = slugMatch ? slugMatch[1] : `Index ${idx}`;
  const title = titleMatch ? titleMatch[1] : 'Unknown';

  if (!snapMatch) {
    missingSnap++;
    console.log(`[MISSING snapshotText] -> ${slug} (${title})`);
  }
  if (!heroMatch) {
    missingHero++;
    console.log(`[MISSING heroDesc] -> ${slug} (${title})`);
  }
});

console.log(`\nAudit Complete: ${missingSnap} courses missing snapshotText, ${missingHero} courses missing heroDesc.`);
