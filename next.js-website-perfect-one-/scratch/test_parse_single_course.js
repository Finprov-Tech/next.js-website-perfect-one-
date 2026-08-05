import fs from 'fs';

const html = fs.readFileSync('scratch/sitemap_html_cache/pg-diploma-in-business-accounting-and-taxation-course-pgbat.html', 'utf8');

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

// Find all headings and paragraphs / accordions
const headings = [...html.matchAll(/<h[234][^>]*>([\s\S]*?)<\/h[234]>/gi)].map(m => cleanText(m[1]));
console.log('Sample Headings:', headings.slice(0, 15));

// Find accordion titles and contents
const accordionTitles = [...html.matchAll(/<[^>]*class=["'][^"']*(?:accordion-title|tab-title|toggle-title|title)[^"']*["'][^>]*>([\s\S]*?)<\/[^>]+>/gi)].map(m => cleanText(m[1])).filter(t => t.length > 3 && t.length < 150);
console.log('\nSample Accordion Titles:', accordionTitles.slice(0, 15));

// Find all li items
const listItems = [...html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi)].map(m => cleanText(m[1])).filter(t => t.length > 5 && !t.includes('Home') && !t.includes('Menu') && !t.includes('Privacy'));
console.log('\nSample List Items:', listItems.slice(0, 10));
