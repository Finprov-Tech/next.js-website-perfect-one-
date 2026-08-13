export type Testimonial = {
  initials: string;
  name: string;
  role: string;
  company: string;
  quote: string;
  program: string;
  photo?: string;
  photoAlt?: string;
};

export const testimonials: Testimonial[] = [
  {
    initials: "AN",
    name: "A. Nair",
    role: "Financial Analyst",
    company: "Regional Banking Group",
    quote:
      "The SAP FICO training wasn't theoretical — I was closing mock client books by month three. That's exactly what came up in my first interview.",
    program: "PG Diploma in Business Accounting",
  },
  {
    initials: "RK",
    name: "R. Krishnan",
    role: "Tax Associate",
    company: "Mid-size CA Practice",
    quote:
      "I filed real GST returns on the actual portal during training. Walking into my first job, the software wasn't the scary part anymore.",
    program: "Certified Taxation Professional",
  },
  {
    initials: "SP",
    name: "S. Pillai",
    role: "Business Intelligence Analyst",
    company: "Fintech Startup",
    quote:
      "The weekend format meant I could upskill without quitting my job. Six months later I moved into a BI role with a real salary jump.",
    program: "Executive Program in Financial Analytics",
  },
  {
    initials: "MJ",
    name: "M. Jose",
    role: "Performance Marketer",
    company: "D2C Brand",
    quote:
      "We ran an actual client campaign as our capstone. I used those exact numbers in my portfolio and it's what got me shortlisted.",
    program: "Certified Digital Marketing Professional",
  },
  {
    initials: "HP",
    name: "H. Prasad",
    role: "SEO Analyst",
    company: "Marketing Agency",
    quote:
      "Mentors were still practicing marketers, not just instructors — every session had something happening in the industry that week baked in.",
    program: "Certified Digital Marketing Professional",
  },
  {
    initials: "NK",
    name: "N. Kumar",
    role: "Fintech Ops Associate",
    company: "Payments Company",
    quote:
      "Reconciliation and automation workflows were taught on real sandbox tools, not slides. I was productive from week one on the job.",
    program: "Certified Fintech Operations Professional",
  },
];

export const placementStats = {
  learnersPlaced: 4500,
  hiringPartners: 300,
  highestCtc: 12,
  freshersPlacedFast: 85,
  interviewsConducted: 12000,
  companiesHired: 300,
  uniqueRolesExplored: 120,
  placementRecord: 95,
};

export const hiringPartners = [
  "TCS",
  "Accenture",
  "IBM",
  "EXL",
  "Tata Power",
  "Federal Bank",
  "Muthoot Finance",
  "UST",
  "Gulf Accounting Firms",
];
