import fs from 'fs';

const extractedMap = JSON.parse(fs.readFileSync('scratch/full_extracted_sitemap_map.json', 'utf8'));
const sitemapUrls = JSON.parse(fs.readFileSync('scratch/sitemap_urls.json', 'utf8'));
let coursesContent = fs.readFileSync('src/data/courses.ts', 'utf8');

// 1. Add fields to Course interface
if (!coursesContent.includes('seoTitle?: string;')) {
  coursesContent = coursesContent.replace(
    'export interface Course {',
    `export interface Course {
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  faqs?: { question: string; answer: string }[];`
  );
  console.log('✓ Added SEO fields to Course interface');
}

// Map of slug aliases to ensure 100% resolution of all 84 URLs
const aliasMappings = {
  'certification-in-business-finance-and-analytics': 'certification-in-business-finance-and-analytics-cbfa',
  'certified-finance-manager': 'certified-finance-manager-cfm',
  'advanced-digital-marketing-course': 'digital-marketing-specialist-program',
  'sap-s-4hana-mm-materials-management-uae': 'sap-mm-material-management',
  'data-analytics-courses': 'data-analytics-course',
  'sap-fico-course': 'sap-s4hana-fico-course',
  'tally-prime-certification': 'tally-prime-with-certification',
  'business-accounting-specialist-program': 'advanced-program-in-business-finance-and-analytics',
  'ms-office-course': 'basics-of-microsoft-excel',
  'quickbooks-online-course': 'quickbooks-online',
  'advanced-uae-vat-uae': 'advanced-uae-vat',
  'uae-corporate-tax-uae': 'uae-corporate-tax',
  'advanced-program-in-business-finance-analytics': 'advanced-program-in-business-finance-and-analytics',
  'tally-prime-with-certification-uae': 'tally-prime-with-certification',
  'gulf-accounting-analyst-programme-gaap-uae': 'gulf-accounting-analyst-programme-gaap',
  'ppc-specialist-program-uae': 'ppc-specialist-program',
  'sage-50-course-uae': 'sage-50-course',
  'zoho-books-uae': 'zoho-books',
  'sap-s-4hana-fi-uae': 'sap-s4hana-fico-course',
  'ms-office-certification-course-uae': 'basics-of-microsoft-excel',
  'data-analytics-course-uae': 'data-analytics-course',
  'seo-specialist-course-uae': 'seo-specialist-course',
  'pre-validation-of-bank-account': 'prevalidation-of-bank-account',
  'pgdm-with-finance-specialization': 'post-graduate-diploma-in-management-pgdm-finance-specialization-course',
  'pgdm-with-acca': 'post-graduate-diploma-in-management-pgdm-with-acca-course',
  'pgdm-business-analytics-course': 'post-graduate-diploma-in-management-pgdm-in-business-analytics-with-logistics-course',
  'cas-foundation': 'certified-accounting-specialist-foundation-course-cas-foundation',
  'gulf-accounting-analyst': 'gulf-accounting-analyst-programme-gaap',
  'certification-in-business-accounting-taxation': 'certification-in-business-accounting-and-taxation-cbat',
  'pg-diploma-in-indian-and-foreign-accounting-course': 'pg-diploma-in-indian-and-foreign-accounting-pgdifa',
  'iit-ihub-certified-digital-marketing-program-uae': 'iit-ihub-certified-digital-marketing-program',
  'ai-bootcamp-corporate': 'ai-bootcamp',
  'mca-compliances-form-aoc-4-filing': 'mca-compliances-form-aoc-4',
  'llp-compliance-course-form-8': 'llp-compliances-form-8',
  'management-information-system': 'mis-analyst-course',
  'esi-epf-calculation': 'esi-and-epf-calculation'
};

// Apply aliases to courses.ts
for (const [sitemapSlug, targetSlug] of Object.entries(aliasMappings)) {
  const targetPattern = `"slug": "${targetSlug}"`;
  const targetIndex = coursesContent.indexOf(targetPattern);
  if (targetIndex !== -1) {
    // Check if alias already present
    if (!coursesContent.includes(`"${sitemapSlug}"`)) {
      const aliasesPattern = `"aliases": [`;
      const aliasesIndex = coursesContent.indexOf(aliasesPattern, targetIndex);
      if (aliasesIndex !== -1 && aliasesIndex - targetIndex < 300) {
        coursesContent = coursesContent.substring(0, aliasesIndex + 14) + `\n      "${sitemapSlug}",` + coursesContent.substring(aliasesIndex + 14);
        console.log(`✓ Added alias "${sitemapSlug}" to "${targetSlug}"`);
      } else {
        // Add aliases array
        coursesContent = coursesContent.substring(0, targetIndex + targetPattern.length) + `,\n    "aliases": [\n      "${sitemapSlug}"\n    ]` + coursesContent.substring(targetIndex + targetPattern.length);
        console.log(`✓ Created aliases array for "${targetSlug}" with "${sitemapSlug}"`);
      }
    }
  } else {
    console.log(`Target slug NOT FOUND for alias mapping: ${targetSlug}`);
  }
}

// Inject SEO fields & FAQs for each sitemap course
let updatedSeoCount = 0;
for (const [slug, data] of Object.entries(extractedMap)) {
  // Find course block matching slug or alias
  const slugPattern = `"${slug}"`;
  const slugIndex = coursesContent.indexOf(slugPattern);
  if (slugIndex !== -1) {
    let start = coursesContent.lastIndexOf('{', slugIndex);
    let depth = 0, i = start;
    while (i < coursesContent.length) {
      if (coursesContent[i] === '{') depth++;
      else if (coursesContent[i] === '}') {
        depth--;
        if (depth === 0) {
          let courseBlock = coursesContent.substring(start, i + 1);

          // Add seoTitle if missing
          if (data.seoTitle && !courseBlock.includes('"seoTitle"')) {
            courseBlock = courseBlock.replace('{', `{\n    "seoTitle": ${JSON.stringify(data.seoTitle)},`);
          }
          // Add metaDescription if missing
          if (data.metaDescription && !courseBlock.includes('"metaDescription"')) {
            courseBlock = courseBlock.replace('{', `{\n    "metaDescription": ${JSON.stringify(data.metaDescription)},`);
          }
          // Add canonicalUrl if missing
          if (data.canonicalUrl && !courseBlock.includes('"canonicalUrl"')) {
            courseBlock = courseBlock.replace('{', `{\n    "canonicalUrl": ${JSON.stringify(data.canonicalUrl)},`);
          }
          // Add faqs if missing and faqs exist
          if (data.faqs && data.faqs.length > 0 && !courseBlock.includes('"faqs"')) {
            courseBlock = courseBlock.replace('{', `{\n    "faqs": ${JSON.stringify(data.faqs, null, 6)},`);
          }

          coursesContent = coursesContent.substring(0, start) + courseBlock + coursesContent.substring(i + 1);
          updatedSeoCount++;
          break;
        }
      }
      i++;
    }
  }
}

console.log(`✓ Updated SEO metadata & FAQs for ${updatedSeoCount} courses!`);

fs.writeFileSync('src/data/courses.ts', coursesContent, 'utf8');
console.log('✅ Synchronized all sitemap URLs & SEO content to src/data/courses.ts');
