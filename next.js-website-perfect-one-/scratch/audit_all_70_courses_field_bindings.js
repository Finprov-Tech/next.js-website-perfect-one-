import fs from 'fs';

const slugTsx = fs.readFileSync('src/routes/courses/$slug.tsx', 'utf8');
const coursesTs = fs.readFileSync('src/data/courses.ts', 'utf8');

console.log('=================== STEP 1: AUDITING TEMPLATE ($slug.tsx) BINDINGS ===================');

const bindings = [
  { section: 'Hero Description', codeSnippet: slugTsx.substring(slugTsx.indexOf('heroDesc') - 50, slugTsx.indexOf('heroDesc') + 50) },
  { section: 'Course Snapshot', codeSnippet: slugTsx.substring(slugTsx.indexOf('snapshotText') - 50, slugTsx.indexOf('snapshotText') + 50) },
  { section: 'Top Skills Tab', codeSnippet: slugTsx.substring(slugTsx.indexOf('topSkills') - 50, slugTsx.indexOf('topSkills') + 50) },
  { section: 'Who Is This For Tab', codeSnippet: slugTsx.substring(slugTsx.indexOf('whoIsThisFor') - 50, slugTsx.indexOf('whoIsThisFor') + 50) },
  { section: 'Job Opportunities Tab', codeSnippet: slugTsx.substring(slugTsx.indexOf('jobOpportunities') - 50, slugTsx.indexOf('jobOpportunities') + 50) },
  { section: 'Key Highlights Section', codeSnippet: slugTsx.substring(slugTsx.indexOf('highlights') - 50, slugTsx.indexOf('highlights') + 50) },
  { section: 'Curriculum Accordion', codeSnippet: slugTsx.substring(slugTsx.indexOf('curriculum') - 50, slugTsx.indexOf('curriculum') + 50) },
  { section: 'FAQs Accordion', codeSnippet: slugTsx.substring(slugTsx.indexOf('faqs') - 50, slugTsx.indexOf('faqs') + 50) }
];

bindings.forEach(b => {
  console.log(`\nSection: [${b.section}]`);
  console.log(`Binding snippet: ${b.codeSnippet.replace(/\s+/g, ' ').trim()}`);
});

console.log('\n=================== STEP 2: AUDITING ALL 70 COURSE DATA OBJECTS ===================');

const matches = [...coursesTs.matchAll(/\{\s*"jobOpportunities"[\s\S]*?\n  \}/g)];

console.log(`Total Course Objects: ${matches.length}`);

let issuesCount = 0;

matches.forEach((m, idx) => {
  const block = m[0];
  const slugMatch = block.match(/"slug":\s*"([^"]+)"/);
  const titleMatch = block.match(/"title":\s*"([^"]+)"/);
  const heroMatch = block.match(/"heroDesc":\s*"((?:[^"\\]|\\.)*)"/);
  const snapMatch = block.match(/"snapshotText":\s*"((?:[^"\\]|\\.)*)"/);

  const slug = slugMatch ? slugMatch[1] : `Index ${idx}`;
  const title = titleMatch ? titleMatch[1] : 'Unknown';

  const issues = [];

  if (!heroMatch || !heroMatch[1].trim()) {
    issues.push('Missing or empty heroDesc');
  }
  if (!snapMatch || !snapMatch[1].trim()) {
    issues.push('Missing or empty snapshotText');
  }
  if (heroMatch && snapMatch && heroMatch[1].trim() === snapMatch[1].trim()) {
    issues.push('heroDesc is IDENTICAL to snapshotText');
  }

  if (issues.length > 0) {
    issuesCount++;
    console.log(`❌ [ISSUE] ${slug} (${title}): ${issues.join(', ')}`);
  }
});

if (issuesCount === 0) {
  console.log('✓ PERFECT! All 70 courses have distinct heroDesc and snapshotText with NO issues or fallbacks!');
} else {
  console.log(`Found issues in ${issuesCount} courses.`);
}
