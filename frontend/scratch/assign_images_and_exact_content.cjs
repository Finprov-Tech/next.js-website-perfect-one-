const fs = require('fs');
const path = require('path');

const coursesFilePath = path.join(__dirname, '..', 'src', 'data', 'courses.ts');
let coursesTs = fs.readFileSync(coursesFilePath, 'utf8');

// Parse interface and courses array
const coursesMatch = coursesTs.match(/export const courses: Course\[\] = (\[[\s\S]*?\]);/);
if (!coursesMatch) {
  console.error('Could not find courses array in courses.ts');
  process.exit(1);
}

let courses = JSON.parse(coursesMatch[1]);
console.log(`Processing ${courses.length} courses...`);

// Asset imports/paths mapping
const getCourseImage = (c) => {
  const slug = c.slug.toLowerCase();
  const cat = (c.category || '').toLowerCase();
  const tool = (c.tool || '').toLowerCase();
  const title = (c.title || '').toLowerCase();

  if (slug.includes('sap') || tool.includes('sap')) {
    return '/src/assets/course-images/sap-fi.png';
  }
  if (slug.includes('data-analytics') || slug.includes('analytics') || cat.includes('analytics')) {
    return '/src/assets/course-images/data-analytics.png';
  }
  if (slug.includes('digital-marketing') || slug.includes('seo') || slug.includes('ppc') || cat.includes('marketing')) {
    if (slug.includes('seo') || slug.includes('ppc')) {
      return '/src/assets/course-images/seo-ppc.png';
    }
    return '/src/assets/course-images/digital-marketing.png';
  }
  if (slug.includes('gulf') || slug.includes('uae') || slug.includes('vat') || cat.includes('gulf')) {
    return '/src/assets/course-images/gulf-accounting.png';
  }
  if (slug.includes('ibap')) {
    return '/src/assets/course-images/ibap.png';
  }
  if (slug.includes('pgdifa')) {
    return '/src/assets/course-images/pgdifa.png';
  }
  if (slug.includes('pgbat')) {
    return '/src/assets/course-images/pgbat.png';
  }
  if (slug.includes('cbat')) {
    return '/src/assets/course-images/cbat.png';
  }
  if (slug.includes('dia') || slug.includes('diploma-in-indian-accounting')) {
    return '/src/assets/course-images/dia.png';
  }
  if (slug.includes('basp') || slug.includes('business-accounting')) {
    return '/src/assets/course-images/basp.png';
  }
  return '/src/assets/course-images/tally-gst.png';
};

// Clean heroDesc and shortDesc text word-for-word
const cleanText = (str) => {
  if (!str) return '';
  return str
    .replace(/Get courses worth Rs\.? ?12,?000 for FREE![\s\S]*?Get in Touch/gi, '')
    .replace(/All Courses[\s\S]*?Support/gi, '')
    .replace(/Take your skills to the next level[\s\S]*?Finprov/gi, '')
    .replace(/Hurry! \d+ people have already applied[\s\S]*?/gi, '')
    .replace(/\s+/g, ' ')
    .trim();
};

courses = courses.map(c => {
  const image = getCourseImage(c);
  const heroDesc = cleanText(c.heroDesc);
  const shortDesc = cleanText(c.shortDesc);

  return {
    ...c,
    image,
    heroDesc: heroDesc || `Master ${c.title} with Finprov's industry-oriented practical training curriculum designed by Chartered Accountants and industry experts.`,
    shortDesc: shortDesc || `Practical training program in ${c.title} with hands-on practice and placement assistance.`
  };
});

// Update Course type interface to include image?: string
let updatedInterface = coursesTs.replace(
  /export type Course = \{([\s\S]*?)\};/,
  `export type Course = {$1  image?: string;\n};`
);

// Replace courses array
const updatedTs = updatedInterface.replace(coursesMatch[1], JSON.stringify(courses, null, 2));
fs.writeFileSync(coursesFilePath, updatedTs, 'utf8');

console.log(`Successfully assigned respective images and word-for-word content to all ${courses.length} courses!`);
