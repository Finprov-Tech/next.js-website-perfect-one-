const fs = require('fs');
const path = require('path');

const scratchDir = path.join(__dirname);
const files = fs.readdirSync(scratchDir);

const coursesTs = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'courses.ts'), 'utf8');
const coursesMatch = coursesTs.match(/export const courses: Course\[\] = (\[[\s\S]*?\]);/);
const courses = coursesMatch ? JSON.parse(coursesMatch[1]) : [];
const existingTitles = new Set(courses.map(c => c.title.toLowerCase().trim()));

console.log("Checking all JSON files in scratch folder...");

files.filter(f => f.endsWith('.json')).forEach(file => {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(scratchDir, file), 'utf8'));
    if (Array.isArray(data)) {
      data.forEach(item => {
        const title = (item.title || item.name || '').toLowerCase().trim();
        if (title && title.length > 3 && !existingTitles.has(title)) {
          console.log(`Found candidate in ${file}: ${item.title || item.name}`);
        }
      });
    }
  } catch (e) {}
});
