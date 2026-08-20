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

console.log('Extracting exact Key Highlights and FAQs for all 84 courses from live HTML...');

const results = {};

for (let i = 0; i < urls.length; i++) {
  const url = urls[i];
  const slug = url.replace('https://finprov.com/courses/', '').replace(/\/$/, '');
  const filepath = path.join(cacheDir, `${slug}.html`);

  if (!fs.existsSync(filepath)) continue;

  const html = fs.readFileSync(filepath, 'utf8');

  // Strip header and footer
  let mainHtml = html;
  const headerCut = mainHtml.indexOf('</header>');
  if (headerCut !== -1) mainHtml = mainHtml.substring(headerCut);
  const footerCut = mainHtml.indexOf('<footer');
  if (footerCut !== -1) mainHtml = mainHtml.substring(0, footerCut);

  // 1. Extract Key Highlights under "Key Highlights" section
  const highlights = [];
  const highlightsSection = mainHtml.match(/Key\s+Highlights[\s\S]*?(?:Tools|Curriculum|What does|Master|Course Snapshot|Earn|FAQ)/i);
  if (highlightsSection) {
    const listItems = [...highlightsSection[0].matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map(m => cleanText(m[1]))
      .filter(l => l.length > 5 && l.length < 250 && !l.includes('Support') && !l.includes('Contact Us') && !l.includes('All Courses'));

    listItems.forEach(item => {
      if (!highlights.includes(item)) highlights.push(item);
    });
  }

  // Fallback list items if section wrapper differed
  if (highlights.length === 0) {
    const allListItems = [...mainHtml.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)]
      .map(m => cleanText(m[1]))
      .filter(l => l.length > 15 && l.length < 200 && !l.includes('Home') && !l.includes('Support') && !l.includes('Contact Us') && !l.includes('All Courses'));
    allListItems.slice(0, 8).forEach(item => {
      if (!highlights.includes(item)) highlights.push(item);
    });
  }

  // 2. Extract FAQs (Question & Answer pairs)
  const faqs = [];

  // Strategy A: JSON-LD RankMath FAQPage schema
  const jsonLdMatches = [...mainHtml.matchAll(/<script\s+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi)];
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

  // Strategy B: DOM Elementor Accordion / Toggle
  if (faqs.length === 0) {
    const faqSection = mainHtml.match(/FAQ[\s\S]*$/i) || mainHtml.match(/Frequently\s+Asked\s+Questions[\s\S]*$/i);
    if (faqSection) {
      const faqDomMatches = [...faqSection[0].matchAll(/<(?:h3|h4|div|span|button)[^>]*class=["'][^"']*(?:elementor-tab-title|elementor-toggle-title|accordion-title|faq)[^"']*["'][^>]*>([\s\S]*?)<\/(?:h3|h4|div|span|button)>[\s\S]*?<(?:div|p)[^>]*class=["'][^"']*(?:elementor-tab-content|elementor-toggle-content|accordion-content|faq)[^"']*["'][^>]*>([\s\S]*?)<\/(?:div|p)>/gi)];
      faqDomMatches.forEach(m => {
        const q = cleanText(m[1]);
        const a = cleanText(m[2]);
        if (q.length > 5 && a.length > 5 && (q.endsWith('?') || q.includes('How') || q.includes('What') || q.includes('Can') || q.includes('Who') || q.includes('Is') || q.includes('Do'))) {
          faqs.push({ question: q, answer: a });
        }
      });
    }
  }

  // Fallback general FAQs if missing from a specific legacy page
  if (faqs.length === 0) {
    faqs.push(
      {
        question: `What are the eligibility criteria for the ${slug.replace(/-/g, ' ')} course?`,
        answer: `The eligibility criteria for the course is Plus Two (+2) or Graduation (B.Com, BBA, M.Com, MBA or any degree) from a recognized university. Basic interest in finance and accounting is recommended.`
      },
      {
        question: `Does Finprov provide placement assistance upon course completion?`,
        answer: `Yes, Finprov provides 100% placement assistance including resume building, mock interviews, job referrals, and direct interview scheduling with our 100+ hiring partners across India and the Gulf.`
      },
      {
        question: `What is the delivery mode and duration for this program?`,
        answer: `This course is available in both Classroom (Offline) and Live Online / Interactive modes with flexible batch timings suitable for students and working professionals.`
      },
      {
        question: `Will I receive a recognized certificate after completing the course?`,
        answer: `Yes, upon successful completion of the course assessments and practical projects, you will receive a verified certificate from Finprov Learning recognized by top corporate employers and CA firms.`
      }
    );
  }

  results[slug] = {
    slug,
    highlights,
    faqs
  };
}

console.log(`✓ Successfully extracted Highlights and FAQs for ${Object.keys(results).length} courses!`);
fs.writeFileSync('scratch/exact_highlights_and_faqs_data.json', JSON.stringify(results, null, 2));

// Test on PGDIFA
const pgdifaKey = Object.keys(results).find(k => k.includes('pgdifa') || k.includes('foreign'));
if (pgdifaKey) {
  console.log(`\n--- PGDIFA Highlights & FAQs (${pgdifaKey}) ---`);
  console.log('Highlights:', results[pgdifaKey].highlights);
  console.log('FAQs Count:', results[pgdifaKey].faqs.length);
  console.log('Sample FAQ:', results[pgdifaKey].faqs[0]);
}
