import fs from 'fs';

const html = fs.readFileSync('scratch/sitemap_html_cache/pg-diploma-in-indian-and-foreign-accounting-course.html', 'utf8');

function cleanText(str) {
  return str.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
}

const pos = html.indexOf('Course Snapshot');
if (pos !== -1) {
  console.log('--- Context around Course Snapshot ---');
  console.log(cleanText(html.substring(pos, pos + 1000)));
} else {
  console.log('Course Snapshot not found in HTML');
}
