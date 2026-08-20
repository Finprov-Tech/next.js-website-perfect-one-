const fs = require('fs');
const path = require('path');

const coursesTs = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'courses.ts'), 'utf8');
const coursesMatch = coursesTs.match(/export const courses: Course\[\] = (\[[\s\S]*?\]);/);
const courses = coursesMatch ? JSON.parse(coursesMatch[1]) : [];

console.log(`Current courses.ts total count: ${courses.length}`);

// List all titles & slugs
courses.forEach((c, idx) => {
  console.log(`${idx + 1}. ${c.title} (${c.slug})`);
});
