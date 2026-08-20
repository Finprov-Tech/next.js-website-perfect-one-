/**
 * Site-wide facts for Finprov Learning (sourced from finprov.com).
 * Keep contact details and stats in sync with the official site.
 */

export const site = {
  name: "Finprov Learning",
  tagline: "Excel in Accounting, Data Analytics and Digital Marketing",
  email: "contact@finprov.com",
  phone: "+91 89436 44444",
  phoneHref: "tel:+918943644444",
  whatsapp: "+91 87146 52031",
  whatsappHref: "https://wa.me/918714652031",
  headOffice: "Vyttila, Kochi, Kerala",
  bengaluruOffice: "AVS Compound, 80 Feet Rd, Koramangala, Bengaluru",
} as const;

export const siteStats = {
  placements: 4500,
  centres: 10,
  coursesOffered: 50,
  yearsExpertise: 40,
  hiringPartners: 300,
} as const;

export const locations = [
  "Kochi · Vyttila (HQ)",
  "Ernakulam South",
  "Kozhikode",
  "Trivandrum",
  "Kollam",
  "Alappuzha",
  "Manjeri",
  "Pandalam",
  "Bengaluru · Koramangala",
  "Bengaluru · Vijayanagar",
  "Online · Live Classes",
] as const;

/** Certification bodies & platforms the curriculum is built around. */
export const accreditations = [
  "NSDC",
  "Skill India",
  "IIT Palakkad iHub",
  "ISO 9001:2015",
  "ACCA",
  "CMA USA",
  "Tally Education",
  "SAP S/4HANA",
  "Zoho Books",
  "ICAI Syllabus Aligned",
] as const;

export const hiringCompanies = [
  "TCS",
  "Accenture",
  "IBM",
  "EXL",
  "Tata Power",
  "Federal Bank",
  "Muthoot Finance",
  "UST",
  "Regional CA Firms",
  "Gulf Accounting Firms",
] as const;

export const toolRows: string[][] = [
  ["Tally Prime", "SAP S/4HANA FI", "Zoho Books", "QuickBooks", "MS Excel", "Power BI", "GST Portal", "Winman"],
  ["Google Ads", "Meta Ads", "SEMrush", "Mailchimp", "WordPress", "Shopify", "Google Analytics", "HubSpot"],
  ["SQL", "Python", "OpenAI", "n8n", "Canva", "Looker Studio", "Income Tax e-Filing", "MS Office 365"],
];

export const placementPartnerRows: string[][] = [
  ["TCS", "Accenture", "IBM", "EXL", "Tata Power", "Federal Bank", "Muthoot Finance", "UST"],
  ["KPMG", "PwC", "EY", "Deloitte", "BDO", "Grant Thornton", "Regional CA Firms", "Gulf Accounting Firms"],
];

export const leadership = [
  { name: "Anand", fullName: "CA Anand Kumar H", role: "Founder & Chairman" },
  { name: "Veena", fullName: "CA Veena Vijayan", role: "Chief Executive Officer" },
  { name: "Taniya", fullName: "CA Taniya Mathew", role: "Academic Head — Kerala" },
  { name: "Anish", fullName: "CA Anish Thomas", role: "Academic Head — Karnataka" },
] as const;

export const whyChooseUs = [
  { title: "Curriculum led by Chartered Accountants", desc: "Programs designed and taught by CAs with 40+ years of combined industry practice." },
  { title: "Lifetime placement portal access", desc: "100% placement assistance with a dedicated portal that stays with you for life." },
  { title: "Internships & live client projects", desc: "Close real books, file real returns, and run real campaigns before your first job." },
  { title: "Communication & personality development", desc: "Interview training, group discussions, and soft-skill labs built into every program." },
  { title: "Scholarships, EMI & free courses", desc: "Free add-on courses worth ₹12,000 for selected students, plus flexible EMI plans." },
  { title: "7-day free trial", desc: "Sit in real classes before you commit — online, offline, or hybrid." },
] as const;

export const lifeAtFinprov = [
  { title: "Convocation", desc: "Every batch ends with learners recognised for their work alongside insights from industry guests." },
  { title: "Onam at Finprov", desc: "Pookkalam contests, sadhya, and the full Kerala festive spirit across all our centres." },
  { title: "Christmas Cheer", desc: "Secret Santa, carols, and celebration cake — December at Finprov is all about community." },
  { title: "Industrial Visits", desc: "Learners step inside real finance departments and agencies to see the work up close." },
  { title: "Speakup Sessions", desc: "Confidence-building sessions on language clarity and professional etiquette, without pressure." },
  { title: "Presentation Days", desc: "Learners present strategies and campaign plans, sharpening articulation like in a real firm." },
] as const;
