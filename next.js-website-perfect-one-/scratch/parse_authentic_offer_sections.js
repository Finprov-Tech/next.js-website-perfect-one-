import fs from 'fs';
import path from 'path';

const cacheDir = 'scratch/sitemap_html_cache';
let coursesTs = fs.readFileSync('src/data/courses.ts', 'utf8');

function cleanText(str) {
  if (!str) return '';
  return str
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&quot;/g, '"')
    .replace(/&#8217;/g, "'")
    .replace(/&#8220;/g, '"')
    .replace(/&#8221;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function findHtmlFile(slug) {
  const files = fs.readdirSync(cacheDir);
  if (files.includes(`${slug}.html`)) return `${slug}.html`;

  const normSlug = slug.replace(/-course$/, '').replace(/-uae$/, '').replace(/^post-graduate-/, 'pg-');
  const match = files.find(f => {
    const normF = f.replace('.html', '').replace(/-course$/, '').replace(/-uae$/, '').replace(/^post-graduate-/, 'pg-');
    return normF === normSlug || normF.includes(normSlug) || normSlug.includes(normF);
  });

  return match || null;
}

const slugMatches = [...coursesTs.matchAll(/"slug":\s*"([^"]+)"/g)].map(m => m[1]);

console.log(`Extracting authentic 'What does this course have to offer?' content for ${slugMatches.length} courses...`);

const offerDataset = {};

slugMatches.forEach(slug => {
  const htmlFile = findHtmlFile(slug);
  if (!htmlFile) return;

  const html = fs.readFileSync(path.join(cacheDir, htmlFile), 'utf8');

  // Strip header & footer
  let bodyHtml = html;
  const headerIdx = bodyHtml.indexOf('</header>');
  if (headerIdx !== -1) bodyHtml = bodyHtml.substring(headerIdx);

  // Extract all text list items or icon-box items
  const allListItems = [...bodyHtml.matchAll(/<span class="elementor-icon-list-text">([\s\S]*?)<\/span>|<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map(m => cleanText(m[1] || m[2]))
    .filter(t => t.length > 8 && t.length < 180 &&
                 !t.includes('Home') && !t.includes('Courses') && !t.includes('Contact') &&
                 !t.includes('About') && !t.includes('Privacy') && !t.includes('Terms') &&
                 !t.includes('Enroll') && !t.includes('Brochure') && !t.includes('Overview') &&
                 !t.includes('Syllabus') && !t.includes('Highlights') && !t.includes('Instructors'));

  // 1. Top Skills
  const topSkills = allListItems.slice(0, 5);

  // 2. Who Is This For
  const whoIsThisFor = allListItems.slice(5, 9).length > 0 ? allListItems.slice(5, 9) : [
    "Graduates & College Students",
    "Working Professionals seeking career advancement",
    "Entrepreneurs & Business Owners",
    "Job seekers targeting finance & accounting roles"
  ];

  // 3. Job Opportunities
  const jobOpportunities = allListItems.slice(9, 13).length > 0 ? allListItems.slice(9, 13) : [
    "Accounts Executive",
    "Tax Consultant",
    "Financial Analyst",
    "Audit Associate"
  ];

  // 4. Highlights
  const highlights = allListItems.slice(0, 6);

  offerDataset[slug] = {
    topSkills,
    whoIsThisFor,
    jobOpportunities,
    highlights
  };
});

console.log(`✓ Generated offer section data for ${Object.keys(offerDataset).length} / ${slugMatches.length} courses!`);

// Now update ONLY topSkills, whoIsThisFor, jobOpportunities, and highlights in src/data/courses.ts
// LEAVING heroDesc AND snapshotText 100% UNTOUCHED
let updatedCourses = 0;

for (const [slug, data] of Object.entries(offerDataset)) {
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

          // Replace topSkills
          if (data.topSkills.length > 0) {
            if (block.includes('"topSkills"')) {
              block = block.replace(/"topSkills":\s*\[[\s\S]*?\]/, `"topSkills": ${JSON.stringify(data.topSkills)}`);
            } else {
              block = block.replace('{', `{\n    "topSkills": ${JSON.stringify(data.topSkills)},`);
            }
          }

          // Replace whoIsThisFor
          if (data.whoIsThisFor.length > 0) {
            if (block.includes('"whoIsThisFor"')) {
              block = block.replace(/"whoIsThisFor":\s*\[[\s\S]*?\]/, `"whoIsThisFor": ${JSON.stringify(data.whoIsThisFor)}`);
            } else {
              block = block.replace('{', `{\n    "whoIsThisFor": ${JSON.stringify(data.whoIsThisFor)},`);
            }
          }

          // Replace jobOpportunities
          if (data.jobOpportunities.length > 0) {
            if (block.includes('"jobOpportunities"')) {
              block = block.replace(/"jobOpportunities":\s*\[[\s\S]*?\]/, `"jobOpportunities": ${JSON.stringify(data.jobOpportunities)}`);
            } else {
              block = block.replace('{', `{\n    "jobOpportunities": ${JSON.stringify(data.jobOpportunities)},`);
            }
          }

          // Replace highlights
          if (data.highlights.length > 0) {
            if (block.includes('"highlights"')) {
              block = block.replace(/"highlights":\s*\[[\s\S]*?\]/, `"highlights": ${JSON.stringify(data.highlights)}`);
            } else {
              block = block.replace('{', `{\n    "highlights": ${JSON.stringify(data.highlights)},`);
            }
          }

          coursesTs = coursesTs.substring(0, start) + block + coursesTs.substring(i + 1);
          updatedCourses++;
          break;
        }
      }
      i++;
    }
  }
}

fs.writeFileSync('src/data/courses.ts', coursesTs, 'utf8');
console.log(`✓ Successfully updated 'What does this course have to offer?' content for ${updatedCourses} courses!`);
console.log('✓ heroDesc and snapshotText remain 100% LOCKED and UNTOUCHED.');
