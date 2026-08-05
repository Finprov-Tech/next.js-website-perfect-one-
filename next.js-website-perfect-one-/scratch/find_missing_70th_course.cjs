const fs = require('fs');
const path = require('path');

const coursesTs = fs.readFileSync(path.join(__dirname, '..', 'src', 'data', 'courses.ts'), 'utf8');
const coursesMatch = coursesTs.match(/export const courses: Course\[\] = (\[[\s\S]*?\]);/);
const courses = coursesMatch ? JSON.parse(coursesMatch[1]) : [];
const existingSlugs = new Set(courses.map(c => c.slug.toLowerCase()));
const existingTitles = new Set(courses.map(c => c.title.toLowerCase()));

console.log(`Current dataset has ${courses.length} courses.`);

// Read raw_courses.json if exists
let rawCourses = [];
try {
  rawCourses = JSON.parse(fs.readFileSync(path.join(__dirname, 'raw_courses.json'), 'utf8'));
} catch (e) {}

// Read raw_scraped_courses.json if exists
let scrapedCourses = [];
try {
  scrapedCourses = JSON.parse(fs.readFileSync(path.join(__dirname, 'raw_scraped_courses.json'), 'utf8'));
} catch (e) {}

// Read discovered_urls.json if exists
let urls = [];
try {
  urls = JSON.parse(fs.readFileSync(path.join(__dirname, 'discovered_urls.json'), 'utf8'));
} catch (e) {}

console.log(`Checking raw_courses (${rawCourses.length}), scraped (${scrapedCourses.length}), urls (${urls.length})...`);

const candidateMisses = [];

[...rawCourses, ...scrapedCourses].forEach(c => {
  const title = c.title || c.heading || '';
  const url = c.url || c.link || '';
  if (title && !existingTitles.has(title.toLowerCase())) {
    candidateMisses.push({ title, url });
  }
});

urls.forEach(url => {
  const slug = url.split('/').filter(Boolean).pop();
  if (slug && !existingSlugs.has(slug.toLowerCase())) {
    candidateMisses.push({ title: slug, url });
  }
});

console.log("Candidate missing items found:", candidateMisses.length);
candidateMisses.forEach((m, idx) => {
  console.log(`${idx + 1}. Title/Slug: ${m.title} | URL: ${m.url}`);
});
