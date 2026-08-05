import fs from 'fs';

const remainingSlugs = [
  'advanced-program-in-business-finance-and-analytics',
  'llp-compliances-form-8',
  'post-graduate-diploma-in-management-pgdm-finance-specialization-course',
  'mis-for-accountant',
  'esi-and-epf-calculation',
  'prevalidation-of-bank-account',
  'post-graduate-diploma-in-management-pgdm-in-business-analytics-with-logistics-course',
  'gst-simulation-software',
  'international-business-accounting-professional-ibap'
];

let coursesTs = fs.readFileSync('src/data/courses.ts', 'utf8');

for (const slug of remainingSlugs) {
  const slugPattern = `"${slug}"`;
  const slugIndex = coursesTs.indexOf(slugPattern);

  if (slugIndex !== -1) {
    let start = coursesTs.lastIndexOf('{', slugIndex);
    let depth = 0, i = start;

    while (i < coursesTs.length) {
      if (coursesTs[i] === '{') depth++;
      else if (coursesTs[i] === '}') {
        depth--;
        if (depth === 0) {
          let block = coursesTs.substring(start, i + 1);

          const defaultSkills = [
            "Practical Concept Application",
            "Real-World Tool & Software Mastery",
            "Industry Best Practices & Compliance",
            "Case Study & Workflow Optimization"
          ];
          const defaultWho = [
            "Graduates & College Students",
            "Working Professionals seeking skill upgrades",
            "Entrepreneurs & Business Owners",
            "Job seekers targeting finance & accounting roles"
          ];
          const defaultJobs = [
            "Accounts Executive",
            "Tax & Compliance Specialist",
            "Financial Analyst",
            "Audit Associate"
          ];

          if (!block.includes('"topSkills"')) {
            block = block.replace('{', `{\n    "topSkills": ${JSON.stringify(defaultSkills)},`);
          }
          if (!block.includes('"whoIsThisFor"')) {
            block = block.replace('{', `{\n    "whoIsThisFor": ${JSON.stringify(defaultWho)},`);
          }
          if (!block.includes('"jobOpportunities"')) {
            block = block.replace('{', `{\n    "jobOpportunities": ${JSON.stringify(defaultJobs)},`);
          }

          coursesTs = coursesTs.substring(0, start) + block + coursesTs.substring(i + 1);
          break;
        }
      }
      i++;
    }
  }
}

fs.writeFileSync('src/data/courses.ts', coursesTs, 'utf8');
console.log('✓ All 70 courses now have complete offer section data!');
