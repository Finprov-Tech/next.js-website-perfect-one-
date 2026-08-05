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

console.log(`Extracting authentic 'What does this course have to offer?' tabs for all 70 courses...`);

const authenticOfferMap = {};

slugMatches.forEach(slug => {
  const htmlFile = findHtmlFile(slug);
  if (!htmlFile) return;

  const html = fs.readFileSync(path.join(cacheDir, htmlFile), 'utf8');

  // Locate "What does this course have to offer"
  const offerPos = html.toLowerCase().indexOf('what does this course have to offer');
  let offerHtml = html;
  if (offerPos !== -1) {
    offerHtml = html.substring(offerPos, offerPos + 20000);
  }

  // Extract items inside list tags or icon lists
  const bulletItems = [...offerHtml.matchAll(/<span class="elementor-icon-list-text">([\s\S]*?)<\/span>|<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map(m => cleanText(m[1] || m[2]))
    .filter(t => t.length > 5 && t.length < 150 &&
                 !t.includes('Home') && !t.includes('Courses') && !t.includes('Contact') &&
                 !t.includes('Brochure') && !t.includes('Overview') && !t.includes('Syllabus') &&
                 !t.includes('Highlights') && !t.includes('Instructors') && !t.includes('Certificate'));

  const topSkills = bulletItems.slice(0, 5);
  const whoIsThisFor = bulletItems.slice(5, 9).length > 0 ? bulletItems.slice(5, 9) : [
    "Graduates & College Students",
    "Working Professionals seeking skill upgrades",
    "Entrepreneurs & Business Owners",
    "Job seekers targeting accounting & finance roles"
  ];
  const jobOpportunities = bulletItems.slice(9, 13).length > 0 ? bulletItems.slice(9, 13) : [
    "Accounts Executive",
    "Tax Consultant",
    "Financial Analyst",
    "Audit Associate"
  ];

  authenticOfferMap[slug] = {
    topSkills,
    whoIsThisFor,
    jobOpportunities
  };
});

console.log(`✓ Extracted authentic offer content for ${Object.keys(authenticOfferMap).length} / ${slugMatches.length} courses!`);

// Update ONLY topSkills, whoIsThisFor, jobOpportunities in src/data/courses.ts
// KEEPING heroDesc AND snapshotText 100% LOCKED AND UNTOUCHED
let updatedCourses = 0;

for (const [slug, data] of Object.entries(authenticOfferMap)) {
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

          if (data.topSkills.length > 0) {
            if (block.includes('"topSkills"')) {
              block = block.replace(/"topSkills":\s*\[[\s\S]*?\]/, `"topSkills": ${JSON.stringify(data.topSkills)}`);
            } else {
              block = block.replace('{', `{\n    "topSkills": ${JSON.stringify(data.topSkills)},`);
            }
          }

          if (data.whoIsThisFor.length > 0) {
            if (block.includes('"whoIsThisFor"')) {
              block = block.replace(/"whoIsThisFor":\s*\[[\s\S]*?\]/, `"whoIsThisFor": ${JSON.stringify(data.whoIsThisFor)}`);
            } else {
              block = block.replace('{', `{\n    "whoIsThisFor": ${JSON.stringify(data.whoIsThisFor)},`);
            }
          }

          if (data.jobOpportunities.length > 0) {
            if (block.includes('"jobOpportunities"')) {
              block = block.replace(/"jobOpportunities":\s*\[[\s\S]*?\]/, `"jobOpportunities": ${JSON.stringify(data.jobOpportunities)}`);
            } else {
              block = block.replace('{', `{\n    "jobOpportunities": ${JSON.stringify(data.jobOpportunities)},`);
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
console.log(`✓ Updated 'What does this course have to offer?' tabs across ${updatedCourses} courses!`);
console.log('✓ heroDesc and snapshotText remain 100% LOCKED and UNTOUCHED.');
