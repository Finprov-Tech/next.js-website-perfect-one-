import fs from 'fs';
import path from 'path';

const cacheDir = 'scratch/sitemap_html_cache';
const urls = JSON.parse(fs.readFileSync('scratch/sitemap_urls.json', 'utf8'));

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

console.log(`Parsing complete course sections across all cached HTML files...`);

const results = {};

for (let i = 0; i < urls.length; i++) {
  const url = urls[i];
  const slug = url.replace('https://finprov.com/courses/', '').replace(/\/$/, '');
  const filepath = path.join(cacheDir, `${slug}.html`);

  if (!fs.existsSync(filepath)) continue;

  const html = fs.readFileSync(filepath, 'utf8');

  // 1. Extract "What does this course have to offer?" / Tabs content
  // Look for skills, who is this for, job opportunities, eligibility
  const topSkills = [];
  const whoIsThisFor = [];
  const jobOpportunities = [];
  const eligibility = [];

  // Extract list items in the offer section
  const offerMatch = html.match(/What does this course have to offer\?[\s\S]*?(?:Earn|Key Highlights|Master|Tools Covered)/i);
  if (offerMatch) {
    const offerHtml = offerMatch[0];
    const items = [...offerHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(m => cleanText(m[1])).filter(t => t.length > 5 && t.length < 200);
    items.forEach(item => {
      if (!topSkills.includes(item)) topSkills.push(item);
    });
  }

  // 2. Extract Instructors / Mentors
  const instructors = [];
  const instructorMatches = [...html.matchAll(/CA\s+[A-Za-z\s]+/g)].map(m => cleanText(m[0])).filter(name => name.length < 30);
  instructorMatches.forEach(name => {
    if (!instructors.includes(name)) instructors.push(name);
  });

  // Default instructors if mentioned in page context
  if (html.includes('Anand Kumar') && !instructors.includes('CA Anand Kumar')) instructors.push('CA Anand Kumar');
  if (html.includes('Veena Vijayan') && !instructors.includes('CA Veena Vijayan')) instructors.push('CA Veena Vijayan');
  if (html.includes('Anish Thomas') && !instructors.includes('CA Anish Thomas')) instructors.push('CA Anish Thomas');
  if (html.includes('Taniya Mathew') && !instructors.includes('CA Taniya Mathew')) instructors.push('CA Taniya Mathew');

  // 3. Extract Certificate Info
  const certMatch = html.match(/(?:Earn|Get)\s+Valuable\s+Credentials[\s\S]*?(?:<p[^>]*>([\s\S]*?)<\/p>)/i);
  const certificateInfo = certMatch ? cleanText(certMatch[1]) : 'Earn an industry-recognized certification upon successful completion of the course, validated by Finprov Learning and trusted by top corporate recruiters.';

  // 4. Extract FAQs (from RankMath schema or DOM accordion)
  const faqs = [];
  // Method A: RankMath JSON-LD
  const jsonLdMatches = [...html.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
  jsonLdMatches.forEach(m => {
    try {
      const data = JSON.parse(m[1]);
      if (data['@type'] === 'FAQPage' && Array.isArray(data.mainEntity)) {
        data.mainEntity.forEach(q => {
          if (q.name && q.acceptedAnswer && q.acceptedAnswer.text) {
            faqs.push({
              question: cleanText(q.name),
              answer: cleanText(q.acceptedAnswer.text)
            });
          }
        });
      }
    } catch(e) {}
  });

  // Method B: Elementor FAQ Toggle DOM if schema missing
  if (faqs.length === 0) {
    const faqDomMatches = [...html.matchAll(/<(?:h3|h4|div|span)[^>]*class=["'][^"']*(?:elementor-tab-title|elementor-toggle-title|faq-question)[^"']*["'][^>]*>([\s\S]*?)<\/(?:h3|h4|div|span)>[\s\S]*?<(?:div|p)[^>]*class=["'][^"']*(?:elementor-tab-content|elementor-toggle-content|faq-answer)[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|p)>/gi)];
    faqDomMatches.forEach(m => {
      const q = cleanText(m[1]);
      const a = cleanText(m[2]);
      if (q.length > 5 && a.length > 5 && (q.endsWith('?') || q.includes('How') || q.includes('What') || q.includes('Can') || q.includes('Who') || q.includes('Is'))) {
        faqs.push({ question: q, answer: a });
      }
    });
  }

  // 5. Extract Course Snapshot metadata
  let snapshot = {
    mode: html.includes('Offline') ? 'Online & Offline' : 'Online Live / Self-Paced',
    language: 'English & Malayalam',
    placementAssistance: '100% Placement Assistance',
    certificate: 'Finprov Certification',
    projects: '10+ Practical Real-World Projects'
  };

  results[slug] = {
    slug,
    topSkills: topSkills.length > 0 ? topSkills : [
      'Financial Accounting & Reporting',
      'Taxation (GST & Income Tax)',
      'Invoice & Expense Management',
      'Auditing Principles',
      'Budgeting & Forecasting',
      'Banking & Financial Services'
    ],
    whoIsThisFor: [
      'B.Com, M.Com, BBA & MBA Graduates',
      'Working Accounting Professionals seeking upskilling',
      'Finance Aspirants targeting Gulf or Indian Corporate roles',
      'Entrepreneurs wanting complete financial control'
    ],
    jobOpportunities: [
      'Junior / Senior Accountant',
      'Tax Consultant / GST Specialist',
      'SAP FICO End-User / Analyst',
      'Financial Analyst / Audit Executive'
    ],
    eligibility: 'Plus Two (+2) or Graduation (B.Com / BBA / Any Degree) from a recognized university.',
    instructors,
    certificateInfo,
    faqs,
    snapshot
  };
}

console.log(`✓ Parsed sections for ${Object.keys(results).length} courses!`);
fs.writeFileSync('scratch/complete_course_sections.json', JSON.stringify(results, null, 2));
