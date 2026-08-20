const fs = require('fs');
const path = require('path');

const content = fs.readFileSync('C:\\Users\\FINPROV\\.gemini\\antigravity\\brain\\ead95c60-fb6b-4e68-afad-79efb8792bf3\\.system_generated\\steps\\939\\content.md', 'utf8');

// Load current 69 courses
const coursesTs = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'courses.ts'), 'utf8');
const coursesMatch = coursesTs.match(/export const courses: Course\[\] = (\[[\s\S]*?\]);/);
const courses = coursesMatch ? JSON.parse(coursesMatch[1]) : [];
const existingTitles = new Set(courses.map(c => c.title.toLowerCase().trim()));

// Find all URLs matching finprov.com
const urls = content.match(/https?:\/\/finprov\.com\/[a-zA-Z0-9\-\_\/]+/g) || [];
const courseUrls = new Set();

urls.forEach(url => {
  if (url.includes('/courses/') || url.includes('/course/')) {
    courseUrls.add(url);
  }
});

console.log(`Extracted ${courseUrls.size} unique course URLs from finprov.com/all-courses/ raw text:`);
const missing = [];
courseUrls.forEach(url => {
  const parts = url.split('/').filter(Boolean);
  const slug = parts.pop();
  const titleCandidate = slug.replace(/-/g, ' ');
  
  const isPresent = Array.from(existingTitles).some(t => t.includes(titleCandidate) || titleCandidate.includes(t));
  if (!isPresent && !['courses', 'all-courses', 'about-us', 'contact-us'].includes(slug)) {
    missing.push({ slug, url });
    console.log(`FOUND MISSING COURSE: "${slug}" -> URL: ${url}`);
  }
});

console.log(`\nTotal Missing Courses Identified: ${missing.length}`);
