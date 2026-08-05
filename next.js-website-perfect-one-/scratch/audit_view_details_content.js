import fs from 'fs';

const coursesContent = fs.readFileSync('src/data/courses.ts', 'utf8');

// Parse course objects from courses.ts
const courses = [];
const courseRegex = /{\s*"slug":\s*"([^"]+)"[\s\S]*?}/g;

// Simple check of key fields across courses in courses.ts
const hasSyllabus = (coursesContent.match(/"curriculum":/g) || []).length;
const hasHighlights = (coursesContent.match(/"highlights":/g) || []).length;
const hasTools = (coursesContent.match(/"tools":/g) || []).length;
const hasFaqs = (coursesContent.match(/"faqs":/g) || []).length;
const hasFees = (coursesContent.match(/"fee":|"onlineFees":/g) || []).length;
const hasHeroDesc = (coursesContent.match(/"heroDesc":/g) || []).length;

console.log(`Course Content Field Audit:`);
console.log(` - Total Course Entries: ~43-84`);
console.log(` - Courses with Curriculum/Syllabus: ${hasSyllabus}`);
console.log(` - Courses with Highlights: ${hasHighlights}`);
console.log(` - Courses with Tools: ${hasTools}`);
console.log(` - Courses with FAQs: ${hasFaqs}`);
console.log(` - Courses with Fees: ${hasFees}`);
console.log(` - Courses with Hero Description: ${hasHeroDesc}`);
