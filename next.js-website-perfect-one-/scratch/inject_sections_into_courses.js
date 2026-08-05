import fs from 'fs';

let content = fs.readFileSync('src/data/courses.ts', 'utf8');
const sections = JSON.parse(fs.readFileSync('scratch/complete_course_sections.json', 'utf8'));

// 1. Update Course interface in courses.ts
if (!content.includes('topSkills?: string[];')) {
  content = content.replace(
    'export interface Course {',
    `export interface Course {
  topSkills?: string[];
  whoIsThisFor?: string[];
  jobOpportunities?: string[];
  eligibility?: string;
  instructors?: string[];
  certificateInfo?: string;`
  );
  console.log('✓ Updated Course interface with new section fields');
}

// 2. Inject fields for each course
let count = 0;
for (const [slug, data] of Object.entries(sections)) {
  const slugPattern = `"${slug}"`;
  const slugIndex = content.indexOf(slugPattern);

  if (slugIndex !== -1) {
    let start = content.lastIndexOf('{', slugIndex);
    let depth = 0, i = start;

    while (i < content.length) {
      if (content[i] === '{') depth++;
      else if (content[i] === '}') {
        depth--;
        if (depth === 0) {
          let block = content.substring(start, i + 1);

          if (data.topSkills && !block.includes('"topSkills"')) {
            block = block.replace('{', `{\n    "topSkills": ${JSON.stringify(data.topSkills, null, 6)},`);
          }
          if (data.whoIsThisFor && !block.includes('"whoIsThisFor"')) {
            block = block.replace('{', `{\n    "whoIsThisFor": ${JSON.stringify(data.whoIsThisFor, null, 6)},`);
          }
          if (data.jobOpportunities && !block.includes('"jobOpportunities"')) {
            block = block.replace('{', `{\n    "jobOpportunities": ${JSON.stringify(data.jobOpportunities, null, 6)},`);
          }
          if (data.eligibility && !block.includes('"eligibility"')) {
            block = block.replace('{', `{\n    "eligibility": ${JSON.stringify(data.eligibility)},`);
          }
          if (data.instructors && data.instructors.length > 0 && !block.includes('"instructors"')) {
            block = block.replace('{', `{\n    "instructors": ${JSON.stringify(data.instructors, null, 6)},`);
          }
          if (data.certificateInfo && !block.includes('"certificateInfo"')) {
            block = block.replace('{', `{\n    "certificateInfo": ${JSON.stringify(data.certificateInfo)},`);
          }

          content = content.substring(0, start) + block + content.substring(i + 1);
          count++;
          break;
        }
      }
      i++;
    }
  }
}

console.log(`✓ Injected sections into ${count} courses in courses.ts!`);
fs.writeFileSync('src/data/courses.ts', content, 'utf8');
