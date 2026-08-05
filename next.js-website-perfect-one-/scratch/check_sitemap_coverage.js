import fs from 'fs';
import path from 'path';

// Load extracted sitemap SEO data
const sitemapData = JSON.parse(fs.readFileSync('scratch/extracted_sitemap_courses.json', 'utf8'));

// Load current courses
const coursesFile = fs.readFileSync('src/data/courses.ts', 'utf8');

console.log(`Checking 84 sitemap URLs against src/data/courses.ts...`);

// Parse existing slugs and aliases from courses.ts
const existingCourses = [];
const courseRegex = /{\s*"slug":\s*"([^"]+)"[\s\S]*?}/g;

// Simple slug search
sitemapData.forEach((item, i) => {
  const slug = item.slug;
  const inCourses = coursesFile.includes(`"${slug}"`);
  console.log(`[${i + 1}/84] ${slug} -> ${inCourses ? 'FOUND in courses.ts' : 'MISSING / Needs Alias or Entry'}`);
});
