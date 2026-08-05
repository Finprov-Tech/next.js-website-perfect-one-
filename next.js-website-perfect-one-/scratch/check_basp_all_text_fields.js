import fs from 'fs';

const coursesTs = fs.readFileSync('src/data/courses.ts', 'utf8');

const baspPos = coursesTs.indexOf('"business-accounting-specialist-program-basp"');
if (baspPos !== -1) {
  const start = coursesTs.lastIndexOf('{', baspPos);
  const end = coursesTs.indexOf('}', baspPos);
  const block = coursesTs.substring(start, end + 1);
  console.log('ALL TEXT FIELDS FOR BASP IN courses.ts:\n');
  const fields = ['shortDesc', 'heroDesc', 'snapshotText'];
  fields.forEach(f => {
    const match = block.match(new RegExp(`"${f}":\\s*"((?:[^"\\\\]|\\\\.)*)"`));
    if (match) {
      console.log(`[${f}]:\n  "${match[1]}"\n`);
    }
  });
}
