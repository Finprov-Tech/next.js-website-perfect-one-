export type EventItem = {
  id: string;
  title: string;
  category: "Webinar" | "Workshop" | "Bootcamp" | "Placement Drive";
  date: string;
  time: string;
  mode: "Online" | "Onsite" | "Hybrid";
  location: string;
  speaker: {
    name: string;
    role: string;
    company: string;
    photo: string;
  };
  description: string;
  keyTakeaways: string[];
  seatsLeft: number;
  featured?: boolean;
};

export const eventsData: EventItem[] = [
  {
    id: "gst-filing-masterclass-2026",
    title: "Live GST 3.0 & Practical E-Invoicing Workshop",
    category: "Workshop",
    date: "Saturday, 14 Feb 2026",
    time: "10:00 AM – 1:00 PM IST",
    mode: "Hybrid",
    location: "Kochi Vyttila Centre & Online Live Zoom",
    speaker: {
      name: "CA Anand Kumar",
      role: "Partner & Head of Tax Training",
      company: "Finprov Academy",
      photo: "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=400&q=80",
    },
    description:
      "A hands-on, live practical workshop on real portal GST 3.0 returns filing (GSTR-1, GSTR-3B, GSTR-9), ITC reconciliation, and e-invoicing workflows for modern accounting professionals.",
    keyTakeaways: [
      "Live portal demo on GSTR-1 & GSTR-3B generation",
      "E-Invoicing rules & portal integration in Tally Prime",
      "Automated ITC Reconciliation techniques using MS Excel",
      "Q&A session with practicing Chartered Accountants",
    ],
    seatsLeft: 14,
    featured: true,
  },
  {
    id: "sap-fico-implementation-bootcamp",
    title: "SAP S/4HANA FICO Implementation Masterclass",
    category: "Workshop",
    date: "Wednesday, 18 Feb 2026",
    time: "06:30 PM – 08:30 PM IST",
    mode: "Online",
    location: "Interactive Online Webinar",
    speaker: {
      name: "Veena Vijayan",
      role: "Lead SAP Consultant & Corporate Trainer",
      company: "Ex-Big4 / Finprov",
      photo: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80",
    },
    description:
      "Discover real corporate SAP S/4HANA posting workflows, GL configuration, asset accounting, and financial closing procedures required by MNCs and Global Capability Centres.",
    keyTakeaways: [
      "Overview of SAP S/4HANA vs ECC architecture",
      "GL & Accounts Payable / Receivable posting demo",
      "Step-by-step roadmap to get SAP Certified",
      "Interactive Q&A on SAP consulting roles",
    ],
    seatsLeft: 22,
    featured: false,
  },
  {
    id: "big4-interview-career-blueprint",
    title: "Big 4 Audit & Accounting Career Blueprint Bootcamp",
    category: "Bootcamp",
    date: "Sunday, 22 Feb 2026",
    time: "02:00 PM – 06:00 PM IST",
    mode: "Onsite",
    location: "Finprov Bangalore Centre (Koramangala)",
    speaker: {
      name: "Anish Thomas",
      role: "Senior Director — Career & Placements",
      company: "Finprov Learning",
      photo: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=400&q=80",
    },
    description:
      "An intensive 4-hour boot camp designed for B.Com, M.Com, and MBA graduates preparing for technical interviews and case studies at EY, Deloitte, PwC, KPMG, and top MNCs.",
    keyTakeaways: [
      "Technical accounting question bank & answer frameworks",
      "Resume optimization for Big 4 Applicant Tracking Systems",
      "Live mock interview demonstration with expert feedback",
      "Direct referral pool for top bootcamp performers",
    ],
    seatsLeft: 8,
    featured: true,
  },
  {
    id: "gulf-vat-corporate-tax-webinar",
    title: "GCC Gulf VAT & UAE Corporate Tax Masterclass",
    category: "Webinar",
    date: "Thursday, 26 Feb 2026",
    time: "07:00 PM – 08:30 PM IST",
    mode: "Online",
    location: "Online Live Stream",
    speaker: {
      name: "Taniya Mathew",
      role: "GCC Tax Consultant & Academic Lead",
      company: "Finprov Academy",
      photo: "https://images.unsplash.com/photo-1580489944761-15a19d654956?auto=format&fit=crop&w=400&q=80",
    },
    description:
      "Learn the fundamentals of UAE Corporate Tax compliance, GCC VAT calculations, Zoho Books tax configuration, and remote accounting jobs for Gulf enterprises.",
    keyTakeaways: [
      "UAE Corporate Tax rate slabs & exempt income rules",
      "GCC VAT return filing procedures in FTA portal",
      "How to secure Gulf remote accounting projects from India",
      "Finprov GCC Certification pathway overview",
    ],
    seatsLeft: 35,
    featured: false,
  },
  {
    id: "finprov-mega-placement-drive-2026",
    title: "Finprov Mega Placement Drive FY2026",
    category: "Placement Drive",
    date: "Saturday, 07 Mar 2026",
    time: "09:30 AM – 04:30 PM IST",
    mode: "Onsite",
    location: "Finprov Kochi Centre (Vyttila Head Office)",
    speaker: {
      name: "Placement Cell",
      role: "25+ Hiring Employers & Recruiters",
      company: "MNCs & Audit Firms",
      photo: "https://images.unsplash.com/photo-1556761175-5973dc0f32e7?auto=format&fit=crop&w=400&q=80",
    },
    description:
      "Exclusive recruitment drive for Finprov certified students and finance job seekers. Spot interview rounds with 25+ hiring partners offering roles in Tax, SAP, Audit, and Digital Marketing.",
    keyTakeaways: [
      "On-spot technical interview rounds with recruiters",
      "Salary packages ranging from 3.2 LPA to 7.5 LPA",
      "Resume review counter & career counseling desk",
      "Immediate job offer letters for selected candidates",
    ],
    seatsLeft: 40,
    featured: true,
  },
  {
    id: "digital-marketing-ai-automation",
    title: "AI-Powered Digital Marketing & Growth Masterclass",
    category: "Webinar",
    date: "Tuesday, 10 Mar 2026",
    time: "06:00 PM – 07:30 PM IST",
    mode: "Online",
    location: "Live Interactive Webinar",
    speaker: {
      name: "Rahul Sharma",
      role: "Performance Marketing Lead",
      company: "Finprov Digital Academy",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80",
    },
    description:
      "Master modern AI tools (ChatGPT, Midjourney, Meta Ads AI) to build high-converting performance marketing funnels, SEO strategies, and automated sales workflows.",
    keyTakeaways: [
      "Building AI prompts for high-CTR ad copy & graphics",
      "Google Ads Search & Performance Max campaign setup",
      "Marketing automation workflows using Zapier & CRM",
      "Portfolio creation tips for digital marketing freelancers",
    ],
    seatsLeft: 28,
    featured: false,
  },
];

export const pastEvents = [
  {
    title: "Kerala Finance Conclave & Student Leadership Summit",
    date: "15 Jan 2026",
    attendees: "450+ Attendees",
    mode: "Onsite at Gokulam Park, Kochi",
    image: "https://images.unsplash.com/photo-1540575467063-178a50c2df87?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "National Accounting & GST Compliance Webinar",
    date: "28 Dec 2025",
    attendees: "1,200+ Online Attendees",
    mode: "Live Broadcast",
    image: "https://images.unsplash.com/photo-1515187029135-18ee286d815b?auto=format&fit=crop&w=600&q=80",
  },
  {
    title: "SAP S/4HANA Career Orientation Drive",
    date: "10 Dec 2025",
    attendees: "320+ Participants",
    mode: "Bangalore & Online",
    image: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=600&q=80",
  },
];
