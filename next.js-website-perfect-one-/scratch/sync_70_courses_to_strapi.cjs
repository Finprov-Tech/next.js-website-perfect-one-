const fs = require('fs');
const path = require('path');

// Load 70 courses from src/data/courses.ts
const coursesTs = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'courses.ts'), 'utf8');
const coursesMatch = coursesTs.match(/export const courses: Course\[\] = (\[[\s\S]*?\]);/);
const courses = coursesMatch ? JSON.parse(coursesMatch[1]) : [];

console.log(`Loaded ${courses.length} courses from src/data/courses.ts.`);

// Update cms/data/seed_courses.json
const seedData = {
  courses,
  version: "1.0.0",
  generatedAt: new Date().toISOString()
};

fs.mkdirSync(path.join(__dirname, '..', 'cms', 'data'), { recursive: true });
fs.writeFileSync(path.join(__dirname, '..', 'cms', 'data', 'seed_courses.json'), JSON.stringify(seedData, null, 2), 'utf8');

console.log('Successfully updated cms/data/seed_courses.json with 70 courses!');
