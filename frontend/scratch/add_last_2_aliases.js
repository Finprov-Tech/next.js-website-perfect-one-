import fs from 'fs';

let content = fs.readFileSync('src/data/courses.ts', 'utf8');

// Add certification-in-business-finance-and-analytics to aliases of advanced-program-in-business-finance-and-analytics
content = content.replace(
  '"slug": "advanced-program-in-business-finance-and-analytics",',
  `"slug": "advanced-program-in-business-finance-and-analytics",\n    "aliases": [\n      "certification-in-business-finance-and-analytics",`
);

// Add certified-finance-manager entry or alias to financial-analyst-course
content = content.replace(
  '"slug": "financial-analyst-course",',
  `"slug": "financial-analyst-course",\n    "aliases": [\n      "certified-finance-manager",`
);

fs.writeFileSync('src/data/courses.ts', content, 'utf8');
console.log('✓ Added last 2 aliases');
