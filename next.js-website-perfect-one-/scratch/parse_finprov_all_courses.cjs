const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('C:\\Users\\FINPROV\\.gemini\\antigravity\\brain\\ead95c60-fb6b-4e68-afad-79efb8792bf3\\.system_generated\\steps\\939\\content.md', 'utf8');

// Load current courses in dataset
const coursesTs = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'courses.ts'), 'utf8');
const coursesMatch = coursesTs.match(/export const courses: Course\[\] = (\[[\s\S]*?\]);/);
const courses = coursesMatch ? JSON.parse(coursesMatch[1]) : [];
const existingTitles = new Set(courses.map(c => c.title.toLowerCase().trim()));
const existingSlugs = new Set(courses.map(c => c.slug.toLowerCase().trim()));

console.log(`Current dataset count: ${courses.length}`);

// Find all course titles and links from the HTML / markdown content
const lines = content.split('\n');
const foundCourses = [];

lines.forEach(line => {
  if (line.includes('finprov.com/courses/') || line.includes('finprov.com/course/')) {
    const matches = line.matchAll(/\[([^\]]+)\]\((https?:\/\/[^\)]+)\)/g);
    for (const match of matches) {
      const name = match[1].trim();
      const url = match[2].trim();
      const slug = url.split('/').filter(Boolean).pop();
      if (name && slug && !['courses', 'about', 'contact', 'blog', 'privacy-policy', 'terms'].includes(slug.toLowerCase())) {
        foundCourses.push({ name, slug, url });
      }
    }
  }
});

// Remove duplicates
const uniqueFound = [];
const seenSlugs = new Set();
foundCourses.forEach(c => {
  if (!seenSlugs.has(c.slug.toLowerCase())) {
    seenSlugs.add(c.slug.toLowerCase());
    uniqueFound.push(c);
  }
});

console.log(`Found ${uniqueFound.length} unique course links on finprov.com/all-courses/ page.`);

const missing = [];
uniqueFound.forEach((c, i) => {
  const isPresent = existingSlugs.has(c.slug.toLowerCase()) || existingTitles.has(c.name.toLowerCase());
  if (!isPresent) {
    missing.push(c);
    console.log(`MISSING COURSE #${missing.length}: Name: "${c.name}" | Slug: "${c.slug}" | URL: ${c.url}`);
  }
});

console.log(`\nTotal missing courses found: ${missing.length}`);
