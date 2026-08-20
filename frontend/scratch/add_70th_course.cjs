const fs = require('fs');
const path = require('path');

const coursesFilePath = path.join(__dirname, '..', 'src', 'data', 'courses.ts');
let coursesTs = fs.readFileSync(coursesFilePath, 'utf8');

const newCourse = {
  slug: "business-accounting-professional-bap",
  aliases: ["bap", "bap-course", "business-accounting-professional"],
  title: "Business Accounting Professional (BAP)",
  category: "Accounting & Taxation",
  programType: "Short-Term",
  badge: "BAP",
  badgeCls: "bg-teal/15 text-teal border-teal/30",
  duration: "3 Months",
  mode: "Online / Offline",
  tool: "Tally Prime, MS Excel, GST",
  shortDesc: "Comprehensive training covering fundamental accounting concepts, taxation, Tally Prime, and financial reporting skills.",
  heroDesc: "Take your accounting career to the next level with the Business Accounting Professional (BAP) program. Master core accounting principles, practical tax filing, ledger maintenance, and GST compliance using Tally Prime.",
  onlineFees: "₹18,000",
  offlineFees: "₹24,000",
  highlights: [
    "Comprehensive Coverage of Tally Prime & MS Excel",
    "Hands-on Practical Training in GST & Income Tax",
    "Real-World Ledger & Journal Maintenance",
    "Personalized Placement Assistance & Career Guidance"
  ],
  tools: ["Tally Prime", "MS Excel", "GST Portal", "Income Tax Portal"],
  hiringPartners: ["KPMG", "PwC", "EY", "Deloitte", "BDO", "Grant Thornton"],
  curriculum: [
    {
      moduleTitle: "Module 1: Fundamentals of Accounting",
      topics: ["Journal Entries", "Ledger Postings", "Trial Balance Preparation", "Final Accounts"]
    },
    {
      moduleTitle: "Module 2: Tally Prime Mastery",
      topics: ["Company Creation", "Voucher Entry", "Inventory Management", "Financial Reports in Tally"]
    },
    {
      moduleTitle: "Module 3: Taxation & Compliance",
      topics: ["GST Overview & Invoicing", "GSTR Filing Basics", "TDS Fundamentals", "E-Way Bills"]
    }
  ],
  fee: "₹18,000 (Online) / ₹24,000 (Offline)"
};

const coursesMatch = coursesTs.match(/export const courses: Course\[\] = (\[[\s\S]*?\]);/);
if (coursesMatch) {
  let courses = JSON.parse(coursesMatch[1]);
  courses = courses.filter(c => c.slug !== newCourse.slug);
  courses.push(newCourse);
  const newTsContent = coursesTs.replace(coursesMatch[1], JSON.stringify(courses, null, 2));
  fs.writeFileSync(coursesFilePath, newTsContent, 'utf8');
  console.log(`Updated courses.ts with clean BAP course (Total: ${courses.length})`);
}
