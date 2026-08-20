import fs from 'fs';

let content = fs.readFileSync('src/data/courses.ts', 'utf8');

// Fix double commas
content = content.replace(/,,+/g, ',');

// Fix missing commas before title when aliases is present
content = content.replace(/("aliases"\s*:\s*\[[\s\S]*?\])\s*("title"\s*:)/g, '$1,\n    $2');

fs.writeFileSync('src/data/courses.ts', content, 'utf8');
console.log('✓ Cleaned up commas in courses.ts');
