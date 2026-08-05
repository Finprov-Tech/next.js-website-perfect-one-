import fs from 'fs';

let coursesTs = fs.readFileSync('src/data/courses.ts', 'utf8');

const apbfaSlug = "advanced-program-in-business-finance-and-analytics";
const apbfaIndex = coursesTs.indexOf(`"${apbfaSlug}"`);

if (apbfaIndex !== -1) {
  const start = coursesTs.lastIndexOf('{', apbfaIndex);
  let depth = 0, i = start;

  while (i < coursesTs.length) {
    if (coursesTs[i] === '{') depth++;
    else if (coursesTs[i] === '}') {
      depth--;
      if (depth === 0) {
        let block = coursesTs.substring(start, i + 1);

        const title = "Certification in Business Finance and Analytics (CBFA)";
        const heroDesc = "Build a strong foundation in finance and analytics with our Certification in Business Finance and Analytics (CBFA) course. Designed to meet current industry needs, this program helps you develop practical accounting and financial skills while introducing you to the latest AI-powered tools used by finance professionals. From working with AI-integrated accounting software to gaining hands-on experience with analytics tools and return filing simulation software, every session is focused on practical learning. With personalised attention from experienced trainers, you'll learn how to apply your knowledge in real business scenarios and be better prepared for careers in accounting, finance, and business analytics.";
        const snapshotText = "Finprov's Certification in Business Finance and Analytics (CBFA) is an 8-month program for graduates and professionals seeking to enhance their skills and advance their careers in finance, accounting, and business analytics. The course helps learners understand the basics of finance while also teaching them to use analytics tools and techniques widely used in today's workplace.\n\nThrough this program, students gain practical knowledge in accounting, direct and indirect taxation, business laws, ESI and EPF, MS Office, Tally Prime, SAP S/4HANA FI, and Zoho Books. The course also covers advanced analytics tools such as Tally Analytics, Power BI, MS Excel for data visualisation, Zoho Analytics, Tableau, and GitHub, helping learners understand how technology supports financial operations.";

        const topSkills = [
          "Practical Accounting & Financial Analysis",
          "AI-Enabled Excel & Data Visualisation",
          "Taxation, GST & Statutory Compliance",
          "Tally Analytics, Power BI & Tableau",
          "SAP S/4HANA FI & Zoho Books Mastery"
        ];

        const whoIsThisFor = [
          "Finance & Commerce Graduates",
          "Accounting Professionals & Business Analysts",
          "Data Analytics Aspirants",
          "Career Switchers & Business Professionals"
        ];

        const jobOpportunities = [
          "Financial Analyst",
          "Business Analyst",
          "Data Analyst",
          "FP&A Analyst",
          "Business Intelligence Analyst"
        ];

        const highlights = [
          "8-Month Comprehensive Dual-Domain Program",
          "Covering Finance, Accounting & Business Analytics",
          "Hands-on with Power BI, Tableau, Zoho Analytics & SAP FICO",
          "10+ Generative AI Tools & Return Filing Simulations",
          "100% Placement Assistance with Top MNC & Big 4 Partners"
        ];

        block = block
          .replace(/"title":\s*"(?:[^"\\]|\\.)*"/s, `"title": ${JSON.stringify(title)}`)
          .replace(/"heroDesc":\s*"(?:[^"\\]|\\.)*"/s, `"heroDesc": ${JSON.stringify(heroDesc)}`)
          .replace(/"snapshotText":\s*"(?:[^"\\]|\\.)*"/s, `"snapshotText": ${JSON.stringify(snapshotText)}`)
          .replace(/"topSkills":\s*\[[\s\S]*?\]/, `"topSkills": ${JSON.stringify(topSkills)}`)
          .replace(/"whoIsThisFor":\s*\[[\s\S]*?\]/, `"whoIsThisFor": ${JSON.stringify(whoIsThisFor)}`)
          .replace(/"jobOpportunities":\s*\[[\s\S]*?\]/, `"jobOpportunities": ${JSON.stringify(jobOpportunities)}`)
          .replace(/"highlights":\s*\[[\s\S]*?\]/, `"highlights": ${JSON.stringify(highlights)}`);

        coursesTs = coursesTs.substring(0, start) + block + coursesTs.substring(i + 1);
        console.log('✓ Successfully updated APBFA / CBFA course with its correct title, heroDesc, snapshotText, and offer sections!');
        break;
      }
    }
    i++;
  }
}

fs.writeFileSync('src/data/courses.ts', coursesTs, 'utf8');
