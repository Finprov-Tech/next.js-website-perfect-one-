import fs from 'fs';

const coursesTs = fs.readFileSync('src/data/courses.ts', 'utf8');

// Find all matches for BASP or business-accounting-specialist-program
const matches = [...coursesTs.matchAll(/\{\s*"jobOpportunities"[\s\S]*?\n  \}/g)];

console.log(`Total course objects in courses.ts: ${matches.length}`);

matches.forEach((m, idx) => {
  const block = m[0];
  if (block.includes('business-accounting-specialist-program') || block.includes('BASP')) {
    const slugMatch = block.match(/"slug":\s*"([^"]+)"/);
    const titleMatch = block.match(/"title":\s*"([^"]+)"/);
    const heroMatch = block.match(/"heroDesc":\s*"((?:[^"\\]|\\.)*)"/);
    const snapMatch = block.match(/"snapshotText":\s*"((?:[^"\\]|\\.)*)"/);

    console.log(`\n--- Course Object #${idx+1} ---`);
    console.log(`Slug: ${slugMatch ? slugMatch[1] : 'N/A'}`);
    console.log(`Title: ${titleMatch ? titleMatch[1] : 'N/A'}`);
    console.log(`heroDesc snippet: ${heroMatch ? heroMatch[1].substring(0, 70) + '...' : 'N/A'}`);
    console.log(`snapshotText snippet: ${snapMatch ? snapMatch[1].substring(0, 70) + '...' : 'N/A'}`);
  }
});
