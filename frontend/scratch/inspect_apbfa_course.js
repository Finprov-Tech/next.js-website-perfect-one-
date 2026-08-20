import fs from 'fs';

const coursesTs = fs.readFileSync('src/data/courses.ts', 'utf8');

const slug = "advanced-program-in-business-finance-and-analytics";
const pos = coursesTs.indexOf(`"${slug}"`);

if (pos !== -1) {
  const start = coursesTs.lastIndexOf('{', pos);
  const end = coursesTs.indexOf('}', pos);
  const block = coursesTs.substring(start, end + 1);
  console.log('APBFA COURSE BLOCK IN courses.ts:\n', block);
} else {
  console.log('Slug not found in courses.ts!');
}
