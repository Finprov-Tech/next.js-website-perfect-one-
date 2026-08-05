import fs from 'fs';

let coursesTs = fs.readFileSync('src/data/courses.ts', 'utf8');

const baspSlug = "business-accounting-specialist-program-basp";
const baspIndex = coursesTs.indexOf(`"${baspSlug}"`);

if (baspIndex !== -1) {
  const start = coursesTs.lastIndexOf('{', baspIndex);
  let depth = 0, i = start;

  while (i < coursesTs.length) {
    if (coursesTs[i] === '{') depth++;
    else if (coursesTs[i] === '}') {
      depth--;
      if (depth === 0) {
        let block = coursesTs.substring(start, i + 1);

        const heroDesc = "Build a solid foundation in business accounting with the BASP Course. Completing this business accounting course is the first step toward a successful accounting profession with five relevant certificates. Get in touch with us right now to find out how you can set yourself apart from other candidates and build a reliable and safe accounting career.";
        const snapshotText = "Unlock our Business Accounting Specialist Program to start a safe and rewarding accounting career. This Business Accounting course, with its 100% placement help, is crucial in today's workplace because it gives students the tools they need for their future careers. The course emphasizes hands-on training, giving students practical experience in business law, SAP FICO, Tally Prime, GST, income tax, MS Excel, ESI & PF, and accounting.";

        const topSkills = [
          "Practical Business Accounting & Bookkeeping",
          "GST & Income Tax Compliance",
          "Tally Prime & SAP FICO Hands-on",
          "MS Excel for Financial Reporting",
          "ESI & EPF Calculations"
        ];

        const whoIsThisFor = [
          "Commerce Graduates & College Students",
          "Working Accountants seeking skill upgrades",
          "Career Switchers entering finance",
          "Job Seekers targeting accounting roles"
        ];

        const jobOpportunities = [
          "Business Accounting Specialist",
          "Taxation Executive",
          "Accounts Officer",
          "Audit Assistant"
        ];

        const highlights = [
          "100% Placement Assistance",
          "5 Relevant Certifications",
          "Practical Hands-on Simulation",
          "Expert CA Mentorship",
          "Flexible Learning Options"
        ];

        block = block
          .replace(/"heroDesc":\s*"(?:[^"\\]|\\.)*"/s, `"heroDesc": ${JSON.stringify(heroDesc)}`)
          .replace(/"snapshotText":\s*"(?:[^"\\]|\\.)*"/s, `"snapshotText": ${JSON.stringify(snapshotText)}`)
          .replace(/"topSkills":\s*\[[\s\S]*?\]/, `"topSkills": ${JSON.stringify(topSkills)}`)
          .replace(/"whoIsThisFor":\s*\[[\s\S]*?\]/, `"whoIsThisFor": ${JSON.stringify(whoIsThisFor)}`)
          .replace(/"jobOpportunities":\s*\[[\s\S]*?\]/, `"jobOpportunities": ${JSON.stringify(jobOpportunities)}`)
          .replace(/"highlights":\s*\[[\s\S]*?\]/, `"highlights": ${JSON.stringify(highlights)}`);

        coursesTs = coursesTs.substring(0, start) + block + coursesTs.substring(i + 1);
        console.log('✓ Successfully updated BASP course with exact, distinct heroDesc, snapshotText, and offer sections!');
        break;
      }
    }
    i++;
  }
}

fs.writeFileSync('src/data/courses.ts', coursesTs, 'utf8');
