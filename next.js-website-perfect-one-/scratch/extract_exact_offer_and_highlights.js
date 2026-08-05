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

console.log(`Extracting 'What does this course have to offer?' content for ${slugMatches.length} primary courses...`);

const offerMap = {};

slugMatches.forEach(slug => {
  const htmlFile = findHtmlFile(slug);
  if (!htmlFile) return;

  const html = fs.readFileSync(path.join(cacheDir, htmlFile), 'utf8');

  // Search for offer sections or highlights
  let highlights = [];
  let topSkills = [];
  let whoIsThisFor = [];
  let jobOpportunities = [];

  // Extract list items inside Elementor icon boxes, lists, or offer blocks
  const listItems = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
    .map(m => cleanText(m[1]))
    .filter(t => t.length > 10 && !t.includes('Home') && !t.includes('Courses') && !t.includes('Contact') && !t.includes('About Us') && !t.includes('Terms'));

  // 1. Extract Key Highlights (from sections mentioning "Highlight", "Offer", "Coverage", "Features")
  const highlightPos = html.search(/Highlight|Offer|Features|Overview/i);
  if (highlightPos !== -1) {
    const sectionHtml = html.substring(highlightPos, highlightPos + 4000);
    const bullets = [...sectionHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map(m => cleanText(m[1]))
      .filter(t => t.length > 12 && t.length < 180 && !t.includes('Download'));
    if (bullets.length >= 3) {
      highlights = bullets.slice(0, 8);
    }
  }

  // 2. Extract Who Is This Program For
  const whoPos = html.search(/Who\s*is\s*this|Who\s*Can\s*Join|Target\s*Audience|Eligib/i);
  if (whoPos !== -1) {
    const whoHtml = html.substring(whoPos, whoPos + 2500);
    const bullets = [...whoHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/p>|<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map(m => cleanText(m[1] || m[2]))
      .filter(t => t.length > 10 && t.length < 150);
    if (bullets.length > 0) {
      whoIsThisFor = bullets.slice(0, 6);
    }
  }

  // 3. Extract Job Opportunities
  const jobPos = html.search(/Job\s*Opportunit|Career\s*Options|Career\s*Scope|Designation/i);
  if (jobPos !== -1) {
    const jobHtml = html.substring(jobPos, jobPos + 2500);
    const bullets = [...jobHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>|<h4[^>]*>([\s\S]*?)<\/h4>/gi)]
      .map(m => cleanText(m[1] || m[2]))
      .filter(t => t.length > 4 && t.length < 100);
    if (bullets.length > 0) {
      jobOpportunities = bullets.slice(0, 6);
    }
  }

  // 4. Extract Top Skills
  const skillPos = html.search(/Skills\s*You\s*Will\s*Learn|Skills\s*Covered|What\s*You\s*Will\s*Learn/i);
  if (skillPos !== -1) {
    const skillHtml = html.substring(skillPos, skillPos + 2500);
    const bullets = [...skillHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map(m => cleanText(m[1]))
      .filter(t => t.length > 8 && t.length < 150);
    if (bullets.length > 0) {
      topSkills = bullets.slice(0, 8);
    }
  }

  if (highlights.length > 0 || whoIsThisFor.length > 0 || jobOpportunities.length > 0 || topSkills.length > 0) {
    offerMap[slug] = {
      highlights,
      whoIsThisFor,
      jobOpportunities,
      topSkills
    };
  }
});

console.log(`✓ Extracted offer/highlights data for ${Object.keys(offerMap).length} / ${slugMatches.length} courses!`);

// Print sample
console.log('\n--- Sample Offer Data ---');
['pg-diploma-in-indian-and-foreign-accounting-course', 'pg-diploma-in-business-accounting-and-taxation-course-pgbat'].forEach(s => {
  if (offerMap[s]) {
    console.log(`[${s}]:`);
    console.log(`  Highlights:`, offerMap[s].highlights);
    console.log(`  Who is this for:`, offerMap[s].whoIsThisFor);
    console.log(`  Job Opportunities:`, offerMap[s].jobOpportunities);
  }
});
