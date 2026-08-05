export type ProgramType = "Job Assured" | "Certification" | "Executive";
export type Category = "Finance" | "Taxation" | "Analytics" | "Marketing" | "Gulf";

export type Course = {
  slug: string;
  aliases?: string[];
  title: string;
  category: Category;
  programType: ProgramType;
  badge: string;
  badgeCls: string;
  duration: string;
  mode: string;
  tool: string;
  shortDesc: string;
  heroDesc: string;
  onlineFees?: string | null;
  offlineFees?: string | null;
  highlights: string[];
  tools: string[];
  hiringPartners: string[];
  curriculum: { title: string; topics: string[] }[];
  fee: string;
  tall?: boolean;
  image?: string;
  seoTitle?: string;
  metaDescription?: string;
  canonicalUrl?: string;
  snapshotText?: string;
  jobOpportunities?: string[];
  whoIsThisFor?: string[];
  topSkills?: string[];
  faqs?: { question: string; answer: string }[];
  eligibility?: string;
  certifications?: string[];
  careerProspects?: string[];
  syllabusPdf?: string;
  hoursOfLearning?: string;
  industryProjects?: string;
  toolsUsed?: string;
};

export const courses: Course[] = [
  {
    "snapshotText": "Finprov's Certification in Business Finance and Analytics (CBFA) is an 8-month program for graduates and professionals seeking to enhance their skills and advance their careers in finance, accounting, and business analytics. The course helps learners understand the basics of finance while also teaching them to use analytics tools and techniques widely used in today's workplace.\n\nThrough this program, students gain practical knowledge in accounting, direct and indirect taxation, business laws, ESI and EPF, MS Office, Tally Prime, SAP S/4HANA FI, and Zoho Books. The course also covers advanced analytics tools such as Tally Analytics, Power BI, MS Excel for data visualisation, Zoho Analytics, Tableau, and GitHub.",
    "jobOpportunities": ["Financial Analyst","Business Analyst","Data Analyst","FP&A Analyst","Business Intelligence Analyst"],
    "whoIsThisFor": ["Finance & Commerce Graduates","Accounting Professionals & Business Analysts","Data Analytics Aspirants","Career Switchers & Business Professionals"],
    "topSkills": ["Practical Accounting & Financial Analysis","AI-Enabled Excel & Data Visualisation","Taxation, GST & Statutory Compliance","Tally Analytics, Power BI & Tableau","SAP S/4HANA FI & Zoho Books Mastery"],
    "canonicalUrl": "https://finprov.com/courses/business-accounting-specialist-program/",
    "metaDescription": "Our Business Accounting Course provides hands-on training in accounting & finance. Learn from experts with a Business Accounting Course Online.",
    "seoTitle": "Business Accounting Course | BASP Certification |",
    "slug": "advanced-program-in-business-finance-and-analytics",
    "aliases": [
      "certification-in-business-finance-and-analytics",
      "advanced-program-in-business-finance-analytics",
      "business-accounting-specialist-program"
    ],
    "title": "Certification in Business Finance and Analytics (CBFA)",
    "category": "Analytics",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-navy/10 text-navy",
    "duration": "6 Months",
    "mode": "Online & Offline",
    "tool": "Tally Prime + SAP FICO + Zoho Books + MS Excel",
    "shortDesc": "Build a solid foundation in business accounting with the BASP Course. Master practical accounting, GST, income tax, SAP FICO, Zoho Books, and payroll with 100% placement assistance.",
    "heroDesc": "Build a strong foundation in finance and analytics with our Certification in Business Finance and Analytics (CBFA) course. Designed to meet current industry needs, this program helps you develop practical accounting and financial skills while introducing you to the latest AI-powered tools used by finance professionals. From working with AI-integrated accounting software to gaining hands-on experience with analytics tools and return filing simulation software, every session is focused on practical learning. With personalised attention from experienced trainers, you'll learn how to apply your knowledge in real business scenarios and be better prepared for careers in accounting, finance, and business analytics.",
    "onlineFees": "Starts at Rs. 58,115",
    "offlineFees": "Starts at Rs. 77,290",
    "highlights": ["8-Month Comprehensive Dual-Domain Program","Covering Finance, Accounting & Business Analytics","Hands-on with Power BI, Tableau, Zoho Analytics & SAP FICO","10+ Generative AI Tools & Return Filing Simulations","100% Placement Assistance with Top MNC & Big 4 Partners"],
    "tools": [
      "Tally Prime",
      "SAP S/4HANA FI (SAP FICO)",
      "Zoho Books (Cloud Accounting)",
      "Practice Pot (GST Simulation Software)",
      "MS Excel",
      "MS Word",
      "MS PowerPoint"
],
    "hiringPartners": [
      "Accenture",
      "EXL",
      "Hi-Lite",
      "Lulu Group",
      "IBM",
      "Lazza",
      "Malabar Gold & Diamonds",
      "myG",
      "Nerolac",
      "Nippon Toyota",
      "TATA Power",
      "TCS",
      "Team Thai",
      "VKC Group",
      "Yes Bank"
],
    "curriculum": [
      {
            "title": "Module 1: Practical Accounting",
            "topics": [
                  "Practical Accounting Introduction & Legal Entities",
                  "Accounting Terms, Debits & Credits",
                  "Accrual Concept & Accounting Cycle",
                  "Source Documents & Journal Entry",
                  "Ledger Accounts & Trial Balance",
                  "Adjustments: Depreciation, Bad Debts & Provision",
                  "Trading, P&L Account & Balance Sheet",
                  "GST, Income Tax & TDS Accounting",
                  "Bank Reconciliation",
                  "Case Study & Conclusion"
            ]
      },
      {
            "title": "Module 2: Tally Prime",
            "topics": [
                  "Introduction, Installation & Activation",
                  "Company Creation, Alteration & Deletion",
                  "Ledger Creation, Groups & Chart of Accounts",
                  "Inventory Management",
                  "Accounting Vouchers, Order & Inventory Vouchers",
                  "Payroll Vouchers & POS Invoice",
                  "Bill Wise Details & Cost Category/Cost Center",
                  "TDS in Tally & Monthly Transaction Practices",
                  "Manufacturing & BOM",
                  "Audit Trail & Cheque Register",
                  "Case Studies"
            ]
      },
      {
            "title": "Module 3: Goods and Services Tax (GST)",
            "topics": [
                  "Introduction & GST Mechanism",
                  "HSN & SAC Codes",
                  "GST Registration",
                  "Concept & Types of Supply",
                  "Place of Supply for Goods & Services",
                  "Value of Supply & Reverse Charge Mechanism (RCM)",
                  "GST on E-Commerce Operators",
                  "Input Tax Credit (ITC): Blocked Credit, Setoff, Classification, Reversal",
                  "Credit Notes & Debit Notes",
                  "Composition Scheme & Invoicing",
                  "E-Way Bill & E-Invoicing",
                  "GST Returns: GSTR-1, IFF, GSTR-3B, QRMP Scheme"
            ]
      },
      {
            "title": "Module 4: ESI, PF & PT",
            "topics": [
                  "ESI & PF Theory & Calculations",
                  "Meeting with Industry Expert (ESI-PF Filing)"
            ]
      },
      {
            "title": "Module 5: Business Law",
            "topics": [
                  "Fundamental Business Law Theory & Concepts"
            ]
      },
      {
            "title": "Module 6: Income Tax",
            "topics": [
                  "Introduction to Income Tax, Tax Rates & Heads of Income",
                  "Residential Status",
                  "TDS ΓÇö Introduction, Due Dates, TDS Certificates & TDS on Payments",
                  "TCS (Tax Collected at Source)",
                  "Advance Tax",
                  "Meeting with Industry Experts (TDS Filing)"
            ]
      },
      {
            "title": "Module 7: MS Office",
            "topics": [
                  "MS Excel: Interface, Formatting, Conditional Formatting, Removing Duplicates, Formulas (VLOOKUP, HLOOKUP, IF, SUMIF, CONCATENATE, LEFT, RIGHT, MID), Pivot Tables, Shortcuts & Case Studies",
                  "MS Word: Document Formatting & Business Communication",
                  "MS PowerPoint: Slide Creation & Presentation Techniques"
            ]
      },
      {
            "title": "Module 8: GST Practicals with Simulation Software",
            "topics": [
                  "Exploring the GST Official Portal",
                  "Practice Pot Login & Overview",
                  "Hands-on GSTR-1 Filing using Offline Workbook Templates",
                  "Online GSTR-1 & GSTR-3B Filing via Practice Pot Simulation Software"
            ]
      },
      {
            "title": "Module 9: SAP FICO (SAP S/4HANA FI)",
            "topics": [
                  "SAP FICO Introduction & Basic Configuration Settings",
                  "General Ledger Accounting",
                  "Accounts Payable (AP) & Accounts Receivable (AR)",
                  "House Bank Configuration",
                  "Automatic Payment Program (APP)",
                  "Dunning Letter Configuration",
                  "Multicurrency Accounting",
                  "Tax on Purchase and Sales",
                  "Financial Statement Version (FSV) & Controlling Overview"
            ]
      },
      {
            "title": "Module 10: Zoho Books",
            "topics": [
                  "Evolution of Cloud Accounting vs Desktop",
                  "Company Creation & Setup",
                  "Items Module (Inventory Adjustment, Price List)",
                  "Purchase Module (Vendor Creation, Purchase Orders, Bills)",
                  "Sales Module & Accountant Module",
                  "Branches, User Roles & Banking Integration",
                  "Settings: Reminders, Customization, Online Payments & Automations",
                  "Case Studies"
            ]
      }
],
    "fee": "Online: Starts at Rs. 58,115 | Offline: Starts at Rs. 77,290",
    "image": "/assets/course-images/advanced-program-in-business-finance-and-analytics.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","IFRS Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Finprov’s IFRS course is for students who want to understand the global language of financial reporting used by organizations operating across international markets. This program offers in-depth training in IAS 1, IAS 16, IAS 7, and IFRS 15. Each module is delivered by top industry professionals with extensive real-world experience. As you learn, you will understand how to apply these concepts in real-life scenarios. At the end of this program, you will become confident in presenting the financial statements under International Financial Reporting Standards.",
    "canonicalUrl": "https://finprov.com/courses/ifrs-course/",
    "metaDescription": "Join the best IFRS course and learn global accounting principles, financial statements, and compliance standards with real-world case studies. Enroll now!",
    "seoTitle": "Learn Global Accounting Standards with Finprov&#039;s IFRS Course",
    "slug": "ifrs-course",
    "title": "IFRS Course",
    "category": "Finance",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "1-3 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in IFRS Course with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Have you noticed how companies around the world follow common rules when preparing their financial statements? Through this IFRS Course, you will learn the principles and standards used to prepare financial reports in accordance with IFRS. You will also have the opportunity to learn about valuation, depreciation, and the disposal of long-term assets. Through clear explanations and practical examples, students will become more familiar with how IFRS ensures transparency in financial reporting across different countries. Don’t miss this chance to build a strong foundation in IFRS standards through this course!",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/ifrs-course.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Business Analyst Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Finprov’s Business Analyst program is designed for anyone who wants to build a career where business knowledge meets data and technology. This program covers business analytics, requirement gathering, SDLC concepts, BRD documentation, SQL, statistics, Python, Power BI, Tableau, Excel, and AI tools for business insights. Each topic is taught by experienced industry professionals who explain concepts using real-life business situations. By the end of the program, you’ll be able to understand business needs, analyze data, document requirements clearly, and support decision-making in a professional environment.",
    "canonicalUrl": "https://finprov.com/courses/business-analyst-course/",
    "metaDescription": "Upgrade your career with our industry-focused Business Analyst course. Learn data analysis, documentation, and real-time case studies. Enroll today!",
    "seoTitle": "Best Business Analyst Course with Live Projects | Finprov",
    "slug": "business-analyst-course",
    "title": "Business Analyst Course",
    "category": "Finance",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "7 Weeks",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Have you ever noticed how businesses solve problems and improve their work? The Business Analyst course helps you understand this in a practical way.",
    "heroDesc": "Have you ever noticed how businesses solve problems and improve their work? The Business Analyst course helps you understand this in a practical way. In this course, you will learn how to look at information, understand what a business needs, and explain it clearly. You will see how companies plan their work, fix problems, and make better decisions using data and reports. With easy tools like Excel and dashboards, and helpful teachers guiding you step by step, learning becomes comfortable and practical. Take a confident step toward a future where you help businesses work better and smarter!",
    "onlineFees": "Starts at Rs. 41300",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "Online: Starts at Rs. 41300",
    "image": "/assets/course-images/business-analyst-course.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Financial Analyst Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Finprov’s Financial Analyst course is for students who want to understand how finance is used in everyday business. This program offers in-depth training in Financial Analytics Introduction, Excel With AI, Power BI, Tableau, GitHub, MIS Analyst introduction, Zoho Analytics, Tally Analytics. This course practically shows you how companies look at their work and make better choices using simple tools. Each module is delivered by industry experts who bring real-world financial cases into the classroom. As you learn, you will see how businesses find problems early and share their ideas using simple charts and reports. You will also learn how to organise information so it is easy for others to understand. This course helps you think clearly and support business decisions in a professional way.",
    "canonicalUrl": "https://finprov.com/courses/financial-analyst-course/",
    "metaDescription": "Become a skilled Financial Analyst with hands-on training in Excel, MIS & modeling with our financial analyst course. Apply today!",
    "seoTitle": "Launch Your Finance Career with Financial Analyst Course",
    "slug": "financial-analyst-course",
    "aliases": [
      "certified-finance-manager"
    ],
    "title": "Financial Analyst Course",
    "category": "Finance",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "2 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Have you noticed how businesses always talk about growth and performance? Through this Financial Analyst course, you will learn how companies review their daily...",
    "heroDesc": "Have you noticed how businesses always talk about growth and performance? Through this Financial Analyst course, you will learn how companies review their daily work and prepare easy reports. Step by step, you will see how businesses understand their progress and plan better for what comes next. With easy tools like Excel and simple dashboards, and friendly guidance throughout the course, learning finance feels comfortable and clear while helping you understand how different teams work together. Begin learning skills that help businesses plan and decide with confidence!",
    "onlineFees": "Starts at Rs. 22000",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "Online: Starts at Rs. 22000",
    "image": "/assets/course-images/financial-analyst-course.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","MIS Analyst Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Finprov’s MIS Analyst program is the perfect choice for anyone who is looking for a rewarding career in data reporting and business analysis. You will learn MIS Reporting, Data Management, Advanced Excel, Pivot Tables, Zoho Analytics, Tally Analytics, Dashboards, Data Cleaning, and AI tools for reporting and insights in detail. Classes are taught by experienced instructors who share real-world reporting scenarios in every session. Build a professional MIS career and develop the skills to create reports that help companies make better decisions faster!",
    "canonicalUrl": "https://finprov.com/courses/management-information-system/",
    "metaDescription": "Finprov offers Management Information System (MIS) course to help you learn how to use various information systems and how to leverage them in business",
    "seoTitle": "Management Information System Course (MIS)",
    "slug": "mis-analyst-course",
    "aliases": [
 
      "mis-analyst",     "management-information-system"
    ],
    "title": "MIS Analyst Course",
    "category": "Analytics",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-navy/10 text-navy",
    "duration": "7 Weeks",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Get a strong foundation in MIS reporting, data analysis, and business reporting concepts guided by experienced professionals.",
    "heroDesc": "Get a strong foundation in MIS reporting, data analysis, and business reporting concepts guided by experienced professionals. You will learn how to collect, clean, organise, and present data in a professional way. This course will give you a clear understanding of how companies track performance using dashboards, reports, and key business metrics. This is your chance to learn MIS reporting, Excel, Tally Analytics , and Zoho Analytics with the support of expert mentors! You will also be familiarised with smart automation techniques to make reporting faster and more accurate. Take a smart step toward your successful future with our unique MIS Analyst course!",
    "onlineFees": "Starts at Rs. 15000",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "Online: Starts at Rs. 15000",
    "image": "/assets/course-images/mis-analyst-course.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Creators Cut Program"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Finprov’s Creators Cut Program is the perfect choice for anyone who is looking for a rewarding career in Content creation & Video editing. You will learn Video Production, Camera Operations & Setup, Adobe Premiere Pro, Chroma Key, Audio Sync & Mixing, Animation using effects and presets, Basics of Photoshop, and AI tools for Image & Video generation in detail. Classes are taught by experienced instructors who share real-world experiences in every session. Build a professional video editing career and develop the skills to produce content that can go viral!",
    "canonicalUrl": "https://finprov.com/courses/creators-cut-program/",
    "metaDescription": "Learn content creation, video editing, and storytelling with our Creators Cut Program through practical training. Build your creator skills fast. Join now!",
    "seoTitle": "Creators Cut Program | Video Editing and Videography Course",
    "slug": "creators-cut-program",
    "title": "Creators Cut Program",
    "category": "Marketing",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-destructive/10 text-destructive",
    "duration": "2 Months",
    "mode": "Centre based (Offline)",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Get a solid grasp of video editing and videography concepts led by experienced professionals.",
    "heroDesc": "Get a solid grasp of video editing and videography concepts led by experienced professionals. You will learn how to professionally take and edit videos. This course will give you a solid understanding of cinematic shooting techniques. This is your chance to learn video editing in Adobe Premiere Pro and Adobe After Effects with the help of expert mentors! You can also learn how to edit videos using AI tools like Canva AI, Freepik AI, Chat GPT, Adobe Firefly, and Veo 3. Take a smart step toward your successful future with our unique Creators Cut Program!",
    "onlineFees": "Starts at Rs. 40000",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "Online: Starts at Rs. 40000",
    "image": "/assets/course-images/creators-cut-program.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","SAGE 50 Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Finprov’s SAGE 50 course is the perfect choice for anyone who is looking for a rewarding career in handling this accounting software. You will learn the Installation of Sage 50, creating a new company, creating and customizing the chart of accounts, adding inventory with opening balances, the purchase module, sales module, creating finished goods using bill of materials, and extracting closing reports in Sage 50 in detail. Classes are taught by experienced instructors who bring real-world experience to every session .",
    "canonicalUrl": "https://finprov.com/courses/sage-50-course/",
    "metaDescription": "Learn bookkeeping with our practical SAGE 50 Accounting course. Master skills such as accounting, invoicing, payroll for improving your skills. Enroll now!",
    "seoTitle": "Best SAGE 50 Accounts Course to Boost Your Accounting Skills",
    "slug": "sage-50-course",
    "aliases": [
      "sage-50-course-uae"
    ],
    "title": "SAGE 50 Course",
    "category": "Finance",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "1-3 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in SAGE 50 Course with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Acquire a solid grasp of SAGE 50 Software concepts led by experts. You will learn practical skills to manage this accounting software. You will also learn to manage finances, generate reports, and control inventory. Our course is designed to equip you to manage core accounting functions using industry-standard SAGE 50 software. You will also receive practical training sessions to gain real-world experience. Take a smart step toward a smooth career with our SAGE 50 Accounts course.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/sage-50-course.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Operations Executive Program"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Finprov’s Operations Executive program is the perfect choice for anyone who is looking for a rewarding career in Operations Executive. You will learn Operations Executive Basics, Practical Accounting, Data Entry, POS System Basics, Transaction Processing, Inventory Management, Office Etiquette, and the art of Communication in detail. Classes are taught by experienced instructors who share real-world experiences in every session. There will be 24/7 support through chat, phone, or email so that you can clear your doubts efficiently. Build a professional career in Operations Executive and develop the skills to manage daily office operations.",
    "canonicalUrl": "https://finprov.com/courses/operations-executive-program/",
    "metaDescription": "Boost your career with our Operations Executive Program. Learn the administrative, communication, and new skills to excel in landing office admin jobs.",
    "seoTitle": "Boost Your Career with Finprov&#039;s Operations Executive Program",
    "slug": "operations-executive-program",
    "title": "Operations Executive Program",
    "category": "Finance",
    "programType": "Executive",
    "badge": "Executive",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "6 Months",
    "mode": "Online & Offline",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in Operations Executive Program with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Acquire a solid grasp of Operations Executive concepts led by experts. You will learn practical skills to manage daily office operations. This course will give you a solid understanding of office etiquette and Operations Executive duties. You will also learn to handle real workplace challenges through hands-on training and interactive sessions. Our course is designed to mold you into a skilled and confident professional ready to take on real-world challenges. Take a smart step toward a prosperous future with our Operations Executive program.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/operations-executive-program.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","AI Bootcamp Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "An AI Bootcamp course is a quick and practical program aimed at giving you real skills in artificial intelligence. You’ll get to dive into areas like machine learning and generative AI, working on actual projects and learning from experts in the industry. This program will give professionals the knowledge and skills they need to use the latest AI tools. The emphasis is on practical use and getting hands-on experience. This course will help businesses grow and innovate. You will be familiarised with Gamma AI, Chatgpt, Gemini AI, Copilot, Notion AI and many more AI Tools.",
    "canonicalUrl": "https://finprov.com/courses/ai-bootcamp-corporate/",
    "metaDescription": "Empower your team with FinprovΓÇÖs AI Bootcamp for Corporate success. Gain practical skills in automation, AI tools, and real-world business applications.",
    "seoTitle": "AI Bootcamp for Corporate: Empower Teams with AI Tools",
    "slug": "ai-bootcamp",
    "aliases": [
      "ai-bootcamp-corporate"
    ],
    "title": "AI Bootcamp",
    "category": "Analytics",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-navy/10 text-navy",
    "duration": "1-3 Months",
    "mode": "Centre based (Offline)",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in AI Bootcamp with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Learn more about AI Tools through our AI Bootcamp course. It is natural to have so many questions in your head, like what these AI tools are capable of?. This course is the exact answer to this question. This course will walk you through the fundamentals of each AI tool. Build a solid foundation in common AI tools to make your life easier.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/ai-bootcamp.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","PG Diploma in Indian and Foreign Accounting Course (PGDIFA)​"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Finprov’s nine-month diploma in Indian and foreign accounting (PGDIFA) course provides students with the fundamental knowledge and abilities required for positions in accounting and finance. This course is your gateway to mastering financial expertise and unlocking global career opportunities. There would be personalized mentorship sessions throughout the course. Students can also solve doubts with expert mentors. The course covers worldwide accounting standards, payroll, TDS, and GST.",
    "slug": "pg-diploma-in-indian-and-foreign-accounting-course-pgdifa",
    "aliases": [
      "pg-diploma-in-indian-and-foreign-accounting-course"
    ],
    "title": "PG Diploma in Indian and Foreign Accounting (PGDIFA)",
    "category": "Finance",
    "programType": "Job Assured",
    "badge": "Flagship",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "9 Months",
    "mode": "Online & Offline",
    "tool": "Tally Prime + Zoho Books + SAP FICO + QuickBooks + Sage 50",
    "shortDesc": "Launch your dream career in 9 months. Master Indian, Gulf, and International accounting frameworks with hands-on training in 5+ industry tools.",
    "heroDesc": "Enhance your skills with our PGDIFA course. Learn to manage financial accounting, analyze reports, and navigate key financial processes to advance your career in the accounting and finance industry. Students enrolled in the PG Diploma in Indian and Foreign Accounting (PGDIFA) program learn advanced accounting techniques for domestic and international companies. This diploma in Indian and foreign accounting course has the potential to lead to high salary packages and international work prospects. Since this is a job-oriented course, students will benefit from placement assistance and several internship opportunities.",
    "onlineFees": "Starts at Rs. 57,525",
    "offlineFees": "Starts at Rs. 79,650",
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "Zoho Books",
      "SAP S/4HANA FI",
      "QuickBooks",
      "Sage 50",
      "MS Excel",
      "MS Word",
      "MS PowerPoint",
      "GST Simulation Software"
],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Lulu Group",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Yes Bank",
      "Nerolac",
      "Nippon Toyota",
      "Team Thai",
      "Lazza",
      "myG"
],
    "curriculum": [
      {
            "title": "Module 1: Practical Accounting",
            "topics": [
                  "Practical Accounting Introduction",
                  "Accounting Terms & Cycle",
                  "Source Documents",
                  "Journal Entry & Ledger Accounts",
                  "Trial Balance & Adjustments",
                  "Financial Statements",
                  "Tax Accounting",
                  "Bank Reconciliation"
            ]
      },
      {
            "title": "Module 2: Tally Prime with Case Studies",
            "topics": [
                  "Company Creation, Alteration & Deletion",
                  "Vouchers & Point of Sale (POS)",
                  "Cost Category & Cost Center",
                  "TDS & GST in Tally Prime",
                  "Manufacturing & Bill of Materials (BOM)",
                  "Multi-Currency & Job Costing",
                  "Payroll & Cheque Register",
                  "Branch Accounting",
                  "Real-world Case Studies"
            ]
      },
      {
            "title": "Module 3: Goods and Services Tax (GST)",
            "topics": [
                  "Basics of GST & Supply Concepts",
                  "Place of Supply & Value of Supply",
                  "Input Tax Credit (ITC)",
                  "Credit Note and Debit Note",
                  "Invoicing Requirements",
                  "Composition Scheme & QRMP Scheme",
                  "E-way Bill & E-invoicing",
                  "GST Returns Filing",
                  "Advanced GST Practicals with Simulation Software"
            ]
      },
      {
            "title": "Module 4: Income Tax",
            "topics": [
                  "Introduction to Income Tax",
                  "Assessee & Tax Rates",
                  "TDS Significance & Applicability",
                  "Form 26AS, Form 16 & Form 16A",
                  "Residential Status",
                  "TDS Sections & Online TDS Filing",
                  "Tax Collected at Source (TCS)",
                  "Advance Tax ΓÇö Applicability, Computation & Interest"
            ]
      },
      {
            "title": "Module 5: MS Office Suite",
            "topics": [
                  "MS Excel: Formatting, Functions, Formulas, Pivot Tables, VLOOKUP, INDEX & MATCH, Depreciation, EMI, Macros",
                  "MS Word: Tables, Charts, SmartArt, Mail Merge, Template Creation",
                  "MS PowerPoint: Design, Animations, Presentations"
            ]
      },
      {
            "title": "Module 6: Business Law",
            "topics": [
                  "Different Legal Entities",
                  "Companies Act Framework",
                  "Company Directors & Roles",
                  "Director Identification Number (DIN)",
                  "Practical Legal Applications"
            ]
      },
      {
            "title": "Module 7: ESI, EPF & PT (Payroll Compliance)",
            "topics": [
                  "ESI Applicability, Benefits & Contribution",
                  "ESI Portal Simulation",
                  "EPF Introduction & Applicability",
                  "EPF Contribution Rates & Breakups",
                  "UAN Activation",
                  "Due Dates & Record Maintenance"
            ]
      },
      {
            "title": "Module 8: Language Lab & Communication Skills",
            "topics": [
                  "Professional English Introduction",
                  "Pronunciation & Phonetics",
                  "Basics of Business Grammar",
                  "Practical Assignments & Worksheets"
            ]
      },
      {
            "title": "Module 9: Zoho Books",
            "topics": [
                  "Introduction to Zoho Books Online",
                  "Company Setup & GST Configuration",
                  "Chart of Accounts & Banking",
                  "Purchase & Sales Modules",
                  "TDS Management",
                  "Multicurrency & Exchange Rates",
                  "Budgeting, Financial Reports & Branch Management",
                  "Payroll & Bank Reconciliation"
            ]
      },
      {
            "title": "Module 10: Professional & Career Skills",
            "topics": [
                  "Soft Skills & Business Etiquette",
                  "Interview Preparation",
                  "Professional Resume/CV Writing",
                  "Mock Interview Sessions"
            ]
      },
      {
            "title": "Module 11: SAP FICO (SAP S/4HANA FI)",
            "topics": [
                  "Introduction to SAP FICO",
                  "Basic Configuration Settings",
                  "General Ledger (GL) Accounting",
                  "Accounts Payable (AP) & Accounts Receivable (AR)",
                  "House Bank Configuration",
                  "Automatic Payment Program (APP)",
                  "Dunning Process & Letters",
                  "Multicurrency Transactions",
                  "Tax on Purchases and Sales",
                  "Financial Statement Version (FSV) & Controlling Overview"
            ]
      },
      {
            "title": "Module 12: Auditing Principles & Practices",
            "topics": [
                  "Nature, Objectives and Scope of Auditing",
                  "Types of Audit",
                  "Audit Planning & Strategy",
                  "Audit Sampling, Documentation & Evidence",
                  "Audit of Financial Statement Items",
                  "Audit Report Preparation"
            ]
      },
      {
            "title": "Module 13: Management Information System (MIS)",
            "topics": [
                  "Fundamentals of MIS",
                  "Financial Statement Analysis",
                  "Advanced Excel Tools for MIS Reporting",
                  "Goal Seek Analysis",
                  "Scenario Manager",
                  "Sensitivity Analysis"
            ]
      },
      {
            "title": "Module 14: IFRS (International Financial Reporting Standards)",
            "topics": [
                  "Introduction to IFRS Framework",
                  "IFRS 15 ΓÇö Revenue from Contracts with Customers",
                  "IAS 7 ΓÇö Statement of Cash Flows",
                  "IAS 16 ΓÇö Property, Plant and Equipment"
            ]
      },
      {
            "title": "Module 15: QuickBooks Online",
            "topics": [
                  "Company Profile & Initial Setup",
                  "Chart of Accounts Management",
                  "Transaction Recording",
                  "Bank Account Reconciliation",
                  "Invoicing & Accounts Receivable Management",
                  "Expense Tracking & Accounts Payable",
                  "Payroll & Tax Compliance Overview",
                  "Reading and Analyzing Financial Reports"
            ]
      },
      {
            "title": "Module 16: Sage 50 Accounting",
            "topics": [
                  "Introduction to Sage 50",
                  "Chart of Accounts Setup",
                  "Customer & Supplier Account Management",
                  "Cash Flow Tracking",
                  "Budgeting Tools",
                  "Bill of Materials (BOM)",
                  "Remittances Processing",
                  "Tax Treatments & Payroll Setup"
            ]
      },
      {
            "title": "Module 17: Gulf VAT",
            "topics": [
                  "VAT Registration Procedures in Gulf Region",
                  "Applicable VAT Rates & Exemptions",
                  "Rules for Place of Supply",
                  "Input Tax Credit (ITC) Recovery",
                  "Import Reverse Charge Mechanism (RCM)",
                  "Export Regulations",
                  "Tax Invoice & Tax Credit Note Formatting",
                  "Designated Zone Provisions",
                  "Accounting Entries for VAT",
                  "Procedure for Filing Returns",
                  "Record Keeping Rules & Penalties"
            ]
      },
      {
            "title": "Module 18: UAE Corporate Tax",
            "topics": [
                  "Introduction, Taxable Persons & Corporate Tax Base",
                  "Qualifying Free Zone Persons",
                  "Corporate Tax Computation & Return Filing",
                  "Tax Group Provisions & Exempt Entities",
                  "Record Keeping"
            ]
      }
],
    "fee": "Online: Starts at Rs. 57,525 | Offline: Starts at Rs. 79,650",
    "image": "/assets/course-images/pg-diploma-in-indian-and-foreign-accounting-course-pgdifa.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","IIT IHub Certified Digital Marketing Program &#8211; UAE"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "This 6-month Digital Marketing Program, available offline and online, helps learners understand and apply today's marketing tactics and tools. By joining our digital marketing training institute, you'll learn about SEO, Search Engine Marketing (SEM), Email marketing, social media marketing, generative AI in marketing and automation, Analytics and optimisation to gain hands-on skills. By the end of the course, there is also a final capstone project for students that enables practical exposure to digital marketing tools and techniques. An authorised joint certification from IIT Palakkad Technology IHub and Finprov Learning helps you stand out in a competitive job market.",
    "canonicalUrl": "https://finprov.com/courses/iit-ihub-certified-digital-marketing-program-uae/",
    "metaDescription": "Upgrade your career with our advanced course with Generative AI. Learn SEO, ads, and more latest trends with practical training. Join today.",
    "seoTitle": "Kickstart Your Career with Advanced Digital Marketing Course",
    "slug": "iit-ihub-certified-digital-marketing-program",
    "aliases": [
      "iit-ihub-certified-digital-marketing-program-uae"
    ],
    "title": "IIT IHub Certified Digital Marketing Program",
    "category": "Marketing",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-destructive/10 text-destructive",
    "duration": "1-3 Months",
    "mode": "Online & Offline",
    "tool": "Google Ads + Meta Ads + SEO Tools",
    "shortDesc": "Earn an IIT IHub certified Digital Marketing credential. Learn SEO, Google Ads, social media marketing, content strategy, and AI-powered marketing tools.",
    "heroDesc": "Are you looking for an industry-focused course that can land you a high-profile job? Our Advanced Digital Marketing Course with Generative AI integration is designed just for you! You'll receive a joint certification from IIT Palakkad Technology IHub and Finprov Learning, adding massive value to your resume. This is an opportunity to learn SEO, social media, PPC, Social media marketing, Email marketing, Content marketing, and more through practical training with full placement support.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Google Ads",
      "Google Analytics",
      "Meta Ads Manager",
      "SEO Audit Tools",
      "WordPress",
      "ChatGPT & AI Marketing Tools",
      "Email Marketing Platforms"
],
    "hiringPartners": [
      "Digital Marketing Agencies",
      "Corporate Brands",
      "E-Commerce Companies",
      "Startups"
],
    "curriculum": [
      {
            "title": "Module 1: Digital Marketing Fundamentals",
            "topics": [
                  "Introduction to Digital Marketing",
                  "Traditional vs Digital Marketing",
                  "Types & Channels of Digital Marketing",
                  "Career Scope & Opportunities"
            ]
      },
      {
            "title": "Module 2: Search Engine Optimization (SEO)",
            "topics": [
                  "On-Page SEO & Off-Page SEO",
                  "Technical SEO & Site Audit",
                  "Keyword Research & Analysis",
                  "Google My Business & Local SEO",
                  "Content Marketing Strategy"
            ]
      },
      {
            "title": "Module 3: Search Engine Marketing (Google Ads)",
            "topics": [
                  "SEM Introduction & Google Ads Account Setup",
                  "Pay Per Click, Ad Rank & Quality Score",
                  "Types of Ads: Search, Display, Video, Shopping, App",
                  "Ad Extensions & Conversion Tracking"
            ]
      },
      {
            "title": "Module 4: Social Media Marketing",
            "topics": [
                  "Social Media Strategy & Analytics",
                  "Facebook, Instagram & LinkedIn Marketing",
                  "YouTube Marketing & Content Strategy",
                  "Influencer Marketing Basics"
            ]
      },
      {
            "title": "Module 5: Email Marketing & Automation",
            "topics": [
                  "Email Marketing Fundamentals",
                  "Building Email Lists & Segmentation",
                  "Campaign Design & Measurement"
            ]
      },
      {
            "title": "Module 6: AI Tools for Digital Marketing",
            "topics": [
                  "ChatGPT for Content Creation",
                  "AI-Powered Ad Optimization",
                  "Prompt Engineering for Marketers",
                  "AI Analytics & Reporting"
            ]
      }
],
    "fee": "Contact Finprov for fee details",
    "image": "/assets/course-images/iit-ihub-certified-digital-marketing-program.gif"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","SAP S/4HANA FI Course​"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Finprov’s SAP FICO course focuses on the SAP S/4HANA Finance (FI module), helping you manage financial transactions, generate reports, and work with Accounts Payable and Accounts Receivable processes. You’ll also gain practical experience in handling multicurrency transactions and understanding cost elements within SAP.",
    "slug": "sap-s-4hana-fi",
    "aliases": [
 
      "sap-s-4hana-fi-uae",     "sap-fico-course"
    ],
    "title": "SAP S/4HANA FI",
    "category": "Finance",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "80+ Hours",
    "mode": "Online & Offline",
    "tool": "SAP S/4HANA",
    "shortDesc": "Master SAP Financial Accounting (FI) with 24/7 live server access. Get certified and advance your career in finance and ERP systems.",
    "heroDesc": "Enhance your skills with our SAP FI course and master financial accounting processes. Learn to manage transactions, work confidently with SAP S/4HANA modules, and optimize operations. Gain certification and build the expertise needed to handle financial data effectively and support real-world business requirements with practical knowledge.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "SAP S/4HANA FI",
      "SAP Live Server (24/7 Access)"
],
    "hiringPartners": [
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "LAZZA Ice Creams",
      "250+ Hiring Partners"
],
    "curriculum": [
      {
            "title": "Module 1: SAP FICO Introduction",
            "topics": [
                  "Introduction to ERP Systems & SAP Architecture",
                  "Overview of SAP S/4HANA FI Module"
            ]
      },
      {
            "title": "Module 2: Enterprise Structure",
            "topics": [
                  "Defining and Configuring Organizational Units",
                  "Setting Up Company Code, Business Area & Chart of Accounts"
            ]
      },
      {
            "title": "Module 3: General Ledger (G/L) Accounting",
            "topics": [
                  "Chart of Accounts & G/L Master Record Management",
                  "Processing Financial Transactions",
                  "Journal Entries & Financial Statements",
                  "G/L Line Item Display"
            ]
      },
      {
            "title": "Module 4: Accounts Payable (AP) & Accounts Receivable (AR)",
            "topics": [
                  "Vendor and Customer Master Data Configuration",
                  "Invoice Processing & Payment Runs",
                  "AP/AR Balance Reporting",
                  "Dunning Letter Configuration",
                  "Automatic Payment Program (APP)"
            ]
      },
      {
            "title": "Module 5: Bank Accounting",
            "topics": [
                  "Bank Master Data Setup",
                  "House Bank Configuration",
                  "Processing Bank Transactions",
                  "Bank Reconciliation Statements (BRS)"
            ]
      },
      {
            "title": "Module 6: Asset Accounting",
            "topics": [
                  "Asset Master Record Management",
                  "Asset Acquisitions & Depreciation Calculations",
                  "Asset Retirements"
            ]
      },
      {
            "title": "Module 7: Multicurrency Management",
            "topics": [
                  "Foreign Currency Transaction Handling",
                  "Currency Translation & Multicurrency Accounting"
            ]
      },
      {
            "title": "Module 8: Tax & Configuration Settings",
            "topics": [
                  "Core SAP FI Configuration",
                  "Tax on Purchase and Sales",
                  "Cost Element Accounting",
                  "Financial Statement Version (FSV) & Controlling Overview"
            ]
      }
],
    "fee": "Contact Finprov for fee details",
    "image": "/assets/course-images/sap-s-4hana-fi.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Digital Marketing Specialist Program​"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Finprov’s Digital Marketing course is designed thoughtfully to empower every student to utilize the latest job opportunities. Digital marketing is a growing field that offers many job opportunities in different industries. The future of digital marketing depends on effectively using digital tools, making it essential for businesses and job seekers. With support from experienced professionals, you will gain all the tools necessary to succeed in the online digital world. Upon completing the digital marketing course, learners will get certifications that can surely work as a game-changer for those aiming to succeed with the latest technologies.",
    "canonicalUrl": "https://finprov.com/courses/advanced-digital-marketing-course/",
    "metaDescription": "Master the future of marketing with our Advanced Digital Marketing Course with Generative AI Integration. Join now and upgrade your skills with us!",
    "seoTitle": "Advanced Digital Marketing Course with Generative AI",
    "slug": "digital-marketing-specialist-program",
    "aliases": [
      "advanced-digital-marketing-course"
    ],
    "title": "Digital Marketing Specialist Program",
    "category": "Marketing",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-destructive/10 text-destructive",
    "duration": "4 Months",
    "mode": "Online & Offline",
    "tool": "Google Ads + SEO Tools + Meta Ads + Zoho CRM",
    "shortDesc": "Gain advanced digital marketing skills in 4 months. Learn SEO, Google Ads, social media marketing, AI tools, and more with practical training.",
    "heroDesc": "Gain advanced digital marketing skills with the Digital Marketing Specialist Program. Learn SEO, social media, PPC, content marketing, and more through practical training.",
    "onlineFees": "Starts at Rs. 29,500",
    "offlineFees": "Starts at Rs. 35,400",
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "WordPress",
      "Google Ads",
      "Google My Business",
      "Adobe Firefly",
      "Adobe Photoshop",
      "ChatGPT & 10+ AI Tools",
      "Zoho CRM",
      "Zoho Mail",
      "Upfluence",
      "Snapchat Ads Manager",
      "Spotify for Creators",
      "Streamlit",
      "GitHub"
],
    "hiringPartners": [
      "upGrad Alumni Network",
      "Digital Marketing Agencies",
      "Corporate Brands",
      "E-Commerce Firms"
],
    "curriculum": [
      {
            "title": "Module 1: Introduction to Digital Marketing",
            "topics": [
                  "Traditional vs Digital Marketing",
                  "Introduction to Branding",
                  "Types of Digital Marketing",
                  "Future of Digital Marketing & Career Scope",
                  "WordPress Introduction, Needs & Scope"
            ]
      },
      {
            "title": "Module 2: WordPress Website Creation",
            "topics": [
                  "Domain, Hosting, Script & SSL",
                  "How to Buy a Domain and Hosting",
                  "WordPress Installation & Functioning",
                  "Plugins, Themes & Dashboard",
                  "Menu Customization & Page Creation",
                  "Homepage, About, Courses & Contact Page Editing"
            ]
      },
      {
            "title": "Module 3: SEO (Search Engine Optimization)",
            "topics": [
                  "Introduction to SEO",
                  "Site Audit & On-Page SEO",
                  "Off-Page SEO & Technical SEO",
                  "Keyword Research and Analysis",
                  "Google My Business",
                  "Content Marketing"
            ]
      },
      {
            "title": "Module 4: SEM (Google Ads)",
            "topics": [
                  "Search Engine Marketing Introduction",
                  "Creating a Google Ads Account",
                  "Pay Per Click, Ad Rank & Quality Score",
                  "Types of Ads: Search, Display, Video, App, Shopping",
                  "Ad Extensions & Keyword Research",
                  "Conversion Tracking"
            ]
      },
      {
            "title": "Module 5: Social Media Marketing",
            "topics": [
                  "Branding & Marketing Types",
                  "Social Media Marketing Strategies",
                  "Social Media Analytics & Remarketing",
                  "Facebook, Instagram, Pinterest, Twitter Marketing",
                  "LinkedIn, YouTube Marketing"
            ]
      },
      {
            "title": "Module 6: Email Marketing",
            "topics": [
                  "Fundamentals of Email Marketing",
                  "Email Marketing Strategies",
                  "Building Email Lists",
                  "Segmentation & Measuring Campaign Success"
            ]
      },
      {
            "title": "Module 7: Snapchat Advertising",
            "topics": [
                  "Understanding the Snapchat Audience",
                  "Snapchat Ads Manager Campaigns",
                  "AR Filters & Lenses as Marketing Tools",
                  "Measuring Ad Performance on Snapchat"
            ]
      },
      {
            "title": "Module 8: Podcast Marketing",
            "topics": [
                  "Spotify for Creators & SEO Optimization",
                  "Using Spotify Creator Dashboard & Analytics",
                  "Google Podcasts, Apple Podcasts Overview",
                  "Podcast Distribution & Engagement Strategies"
            ]
      },
      {
            "title": "Module 9: Neuromarketing & Consumer Psychology",
            "topics": [
                  "Role of Color, Layout & Messaging in Decision-Making",
                  "Applying Neuromarketing to Digital Campaigns",
                  "Behavioral Marketing Strategies",
                  "Ethical Considerations in Neuromarketing"
            ]
      },
      {
            "title": "Module 10: Adobe Firefly for Creative Marketing",
            "topics": [
                  "Adobe Firefly Overview & Interface",
                  "Generating Visual Content with Text Prompts",
                  "Integration with Adobe Photoshop",
                  "Designing Landing Pages",
                  "Creative Best Practices"
            ]
      },
      {
            "title": "Module 11: Meta Threads",
            "topics": [
                  "Overview of Meta Threads",
                  "Marketing Strategies for Threads",
                  "Building Engagement and Brand Voice"
            ]
      },
      {
            "title": "Module 12: Influencer Marketing with Upfluence",
            "topics": [
                  "Introduction to Upfluence",
                  "Finding & Collaborating with Influencers",
                  "Campaign Management & Analytics",
                  "ROI Measurement in Influencer Marketing"
            ]
      },
      {
            "title": "Module 13: Integrated Marketing with Zoho Suite",
            "topics": [
                  "Using Zoho CRM for Lead Management",
                  "Integration with WhatsApp via Gupshup",
                  "Campaign Management with Zoho Mail",
                  "Automation and Workflow Optimization"
            ]
      }
],
    "fee": "Online: Starts at Rs. 29,500 | Offline: Starts at Rs. 35,400",
    "image": "/assets/course-images/digital-marketing-specialist-program.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Certification In Business Accounting And Taxation (CBAT) Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Finprov’s 6-month business accounting and taxation course covers all facets of the subject. This course covers business accounting basics, tax planning, financial reporting and auditing. This course teaches students how to create financial reports for firms and use accounting software tools. Students will get a clear idea about how to prepare for audits. Our mentorship support and real-time live projects help you land positions at prestigious companies. Join us in our CBAT course to become professional Business Accountants.",
    "slug": "certification-in-business-accounting-taxation-cbat",
    "aliases": [
      "certification-in-business-accounting-taxation"
    ],
    "title": "Certification In Business Accounting & Taxation (CBAT)",
    "category": "Finance",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "6 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + Zoho Books + SAP FICO + QuickBooks + Sage 50",
    "shortDesc": "Build a solid foundation in business accounting and taxation in 6 months. Gain industry-relevant skills with hands-on training from expert mentors.",
    "heroDesc": "Build a solid foundation in business accounting and taxation with the 6-month CBAT Course. Gain industry-relevant skills and expertise to boost your career prospects. Learn the most recent financial tactics and tax rules employed by top professionals. Hands-on training and experienced mentoring will help you prepare for a satisfying accounting career.",
    "onlineFees": "Starts at Rs. 35,400",
    "offlineFees": "Starts at Rs. 47,200",
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "Zoho Books",
      "SAP FICO",
      "QuickBooks",
      "Sage 50",
      "MS Excel",
      "MS Word",
      "MS PowerPoint",
      "GST Simulation Software"
],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "100+ Hiring Partners"
],
    "curriculum": [
      {
            "title": "Module 1: Practical Accounting",
            "topics": [
                  "Practical Accounting Introduction",
                  "Accounting Terms & Cycle",
                  "Source Documents",
                  "Journal Entry & Ledger Accounts",
                  "Trial Balance & Adjustments",
                  "Financial Statements",
                  "Tax Accounting",
                  "Bank Reconciliation"
            ]
      },
      {
            "title": "Module 2: Tally Prime with Case Studies",
            "topics": [
                  "Company Creation, Alteration & Deletion",
                  "Vouchers & Point of Sale (POS)",
                  "Cost Category & Cost Center",
                  "TDS & GST in Tally",
                  "Manufacturing & BOM",
                  "Multi-Currency & Job Costing",
                  "Payroll & Cheque Register",
                  "Branch Accounting",
                  "Case Study"
            ]
      },
      {
            "title": "Module 3: Goods and Services Tax (GST)",
            "topics": [
                  "Basics of GST & Supply",
                  "Place of Supply & Value of Supply",
                  "Input Tax Credit (ITC)",
                  "Credit Note & Debit Note",
                  "Invoicing & Composition Scheme",
                  "QRMP Scheme",
                  "E-way Bill & E-invoicing",
                  "GST Returns",
                  "Advanced GST with Simulation Software"
            ]
      },
      {
            "title": "Module 4: Income Tax",
            "topics": [
                  "Introduction to Income Tax",
                  "Assessee & Tax Rates",
                  "TDS Significance & Due Dates",
                  "Form 26AS, Form 16 & Form 16A",
                  "Residential Status",
                  "TDS Sections & TDS Filing",
                  "TCS (Tax Collected at Source)",
                  "Advance Tax ΓÇö Applicability & Computation"
            ]
      },
      {
            "title": "Module 5: MS Office",
            "topics": [
                  "MS Excel: Introduction, Formatting, Functions, Formulas, Pivot Table, Hyperlink, Index & Match, Depreciation, EMI, Data Validation, Subtotal & Macros",
                  "MS Word: Tables, Charts, SmartArt, Mail Merge, Template Creation",
                  "MS PowerPoint: Design, Transitions, Animations, Slideshow"
            ]
      },
      {
            "title": "Module 6: Business Law",
            "topics": [
                  "Different Legal Entities",
                  "Companies Act Overview",
                  "Company Directors & DIN",
                  "Practical Legal Applications"
            ]
      },
      {
            "title": "Module 7: ESI, PF & PT",
            "topics": [
                  "ESI Applicability, Benefits & Contribution",
                  "ESI Simulation",
                  "EPF Introduction & Applicability",
                  "EPF Contribution Rates & UAN Activation",
                  "Due Dates & Records Maintenance"
            ]
      },
      {
            "title": "Module 8: Language Lab",
            "topics": [
                  "Introduction to Professional Communication",
                  "Pronunciations and Phonetics",
                  "Basics of Grammar",
                  "Assignments & Worksheets"
            ]
      },
      {
            "title": "Module 9: Zoho Books",
            "topics": [
                  "Introduction to Zoho Books Online",
                  "Company File Setup & GST Settings",
                  "Chart of Accounts & Banking",
                  "Purchase & Sales Module",
                  "TDS in Zoho Books",
                  "Users & Roles",
                  "Multicurrency & Exchange Rate",
                  "Budgeting, Reports & Branches",
                  "Payroll & Bank Reconciliation"
            ]
      },
      {
            "title": "Module 10: Sage 50",
            "topics": [
                  "Introduction to Sage 50",
                  "Chart of Accounts",
                  "Customer & Supplier Accounts",
                  "Cash Flow & Budgeting",
                  "Bill of Materials",
                  "Remittances",
                  "Tax Treatments & Payroll"
            ]
      },
      {
            "title": "Module 11: IFRS (International Financial Reporting Standards)",
            "topics": [
                  "Introduction to IFRS",
                  "IFRS 15 ΓÇö Revenue Recognition",
                  "IAS 7 ΓÇö Cash Flow Statement",
                  "IAS 16 ΓÇö Fixed Assets"
            ]
      },
      {
            "title": "Module 12: SAP FICO",
            "topics": [
                  "SAP FICO Introduction",
                  "Basic Configuration Settings",
                  "General Ledger Accounting",
                  "Accounts Payable & Accounts Receivable",
                  "House Bank & Automatic Payment Program",
                  "Dunning Letter & Multicurrency",
                  "Tax on Purchase and Sales",
                  "FSV & Controlling"
            ]
      },
      {
            "title": "Module 13: QuickBooks",
            "topics": [
                  "Setting Up Company Profile",
                  "Managing Accounts & Recording Transactions",
                  "Bank Account Reconciliation",
                  "Invoicing & Managing Receivables",
                  "Tracking Expenses & Managing Payables",
                  "Payroll, Tax Advice & Financial Reports"
            ]
      },
      {
            "title": "Module 14: Professional Skills",
            "topics": [
                  "Professional Skills & Interview Preparation",
                  "How to Create a Resume/CV",
                  "Mock Interview Sessions"
            ]
      }
],
    "fee": "Online: Starts at Rs. 35,400 | Offline: Starts at Rs. 47,200",
    "image": "/assets/course-images/certification-in-business-accounting-taxation-cbat.gif"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Diploma In Indian Accounting Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Are you intending to pursue a career in accounting? Then you should do the Diploma in Indian Accounting course. This course is tailored to meet your needs and help you succeed in competitive accounting. Commerce graduate students benefit significantly from Finprov's accounting course, where they learn about GST, income tax, accounting, bookkeeping, financial laws, and more, enhancing their employment prospects. Experienced chartered accountants and industry professionals created this course to provide students with a methodical education and in-depth understanding. Grab this golden opportunity to safeguard your future in trusted hands.",
    "canonicalUrl": "https://finprov.com/courses/diploma-in-indian-accounting-dia/",
    "metaDescription": "Learn Diploma in Indian Accounting to make a promising accounting career with in-depth knowledge in accounting, GST, MS Excel & Income Tax",
    "seoTitle": "Indian Accounting Diploma Course (DIA) for Accounting Career",
    "slug": "diploma-in-indian-accounting-dia",
    "title": "Diploma In Indian Accounting (DIA)",
    "category": "Finance",
    "programType": "Job Assured",
    "badge": "Flagship",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "3 Months",
    "mode": "Online & Offline",
    "tool": "Tally Prime + MS Excel + GST Simulation",
    "shortDesc": "Empower your career with a Diploma in Indian Accounting. Master practical accounting, Tally Prime, GST, income tax, and payroll in just 3 months.",
    "heroDesc": "Empower Your Career with a Diploma in Indian Accounting. Develop practical skills in Indian accounting to stand out in the competitive finance industry. Join our course to quickly achieve your dream career and earn a high salary in India. Take the first step toward success—secure your future with industry-relevant expertise and hands-on training today!",
    "onlineFees": "Starts at Rs. 22,125",
    "offlineFees": "Rs. 29,500",
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "MS Word",
      "MS PowerPoint",
      "GST Simulation Software",
      "ESI & EPF Compliance Portals"
],
    "hiringPartners": [
      "Accenture",
      "EXL",
      "Hi-Lite",
      "IBM",
      "LAZZA Ice Creams",
      "Malabar Gold & Diamonds",
      "myG",
      "Nerolac",
      "Nippon Toyota",
      "TATA Power",
      "TCS",
      "Team Thai",
      "VKC"
],
    "curriculum": [
      {
            "title": "Module 1: Practical Accounting",
            "topics": [
                  "Practical Accounting Introduction",
                  "Accounting Terms & Cycle",
                  "Source Documents",
                  "Journal Entry & Ledger Accounts",
                  "Trial Balance & Adjustments",
                  "Financial Statements",
                  "Tax Accounting",
                  "Bank Reconciliation"
            ]
      },
      {
            "title": "Module 2: Tally Prime",
            "topics": [
                  "Company Creation, Alteration & Deletion",
                  "Vouchers & Point of Sale (POS)",
                  "Cost Category & Cost Center",
                  "TDS & GST Integration",
                  "Manufacturing & Bill of Materials (BOM)",
                  "Multi-Currency & Job Costing",
                  "Payroll & Cheque Register",
                  "Branch Accounting",
                  "Real-world Case Studies"
            ]
      },
      {
            "title": "Module 3: Goods and Services Tax (GST)",
            "topics": [
                  "Basics of GST & Supply Concepts",
                  "Place of Supply & Value of Supply",
                  "Input Tax Credit (ITC)",
                  "Credit Note & Debit Note",
                  "Invoicing & Composition Scheme",
                  "QRMP Scheme",
                  "E-way Bill & E-invoicing",
                  "GST Returns Filing",
                  "Advanced GST with Simulation Software"
            ]
      },
      {
            "title": "Module 4: Income Tax",
            "topics": [
                  "Introduction to Income Tax",
                  "Assessee & Types of Assessee",
                  "Persons & Tax Rates",
                  "TDS Significance & Due Dates",
                  "Form 26AS, Form 16 & Form 16A",
                  "Residential Status",
                  "TDS Sections & TDS Filing",
                  "TCS & Advance Tax"
            ]
      },
      {
            "title": "Module 5: MS Office",
            "topics": [
                  "MS Excel: Introduction, Formatting, Functions & Formulas, Pivot Tables, Hyperlinks, Index & Match, Depreciation, EMI, Data Validation, Subtotal & Macros",
                  "MS Word: Tables, Charts, SmartArt, Mail Merge, Template Creation",
                  "MS PowerPoint: Design, Transitions, Animations, Slideshow"
            ]
      },
      {
            "title": "Module 6: Business Laws",
            "topics": [
                  "Different Legal Entities",
                  "Companies Act Overview",
                  "Company Directors & DIN",
                  "Practical Legal Applications"
            ]
      },
      {
            "title": "Module 7: ESI & EPF (Payroll Compliance)",
            "topics": [
                  "ESI Applicability, Benefits & Contribution",
                  "ESI Portal Simulation",
                  "EPF Introduction & Applicability",
                  "EPF Contribution Rates & UAN Activation",
                  "ESI & EPF Due Dates and Record Maintenance"
            ]
      }
],
    "fee": "Online: Starts at Rs. 22,125 | Offline: Rs. 29,500",
    "image": "/assets/course-images/diploma-in-indian-accounting-dia.gif"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Basics of Digital Marketing Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "The Digital Marketing course is ideal if you want to learn how firms thrive online. We'll lead you through straightforward, practical lessons on how to show up on Google, reach people through social media, send click-worthy emails, and run effective ads. Whether you're a student, beginning your own business, or currently working, this course will teach you the genuine knowledge you need to know—no confusing facts. This course discusses the primary contrasts between traditional and digital marketing, introduces the many types of digital marketing, and provides concise overviews of SEO (Search Engine Optimization), SEM (Search Engine Marketing), and SMM (Social Media Marketing). It's all about getting you started right.",
    "canonicalUrl": "https://finprov.com/courses/basics-of-digital-marketing-course/",
    "metaDescription": "Start with the basics of digital marketing training. Learn SEO, social media, and email marketing in a beginner-friendly guide to grow your online presence.",
    "seoTitle": "Basics of Digital Marketing Training | Finprov Learning",
    "slug": "basics-of-digital-marketing-course",
    "title": "Basics Of Digital Marketing Course",
    "category": "Marketing",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-destructive/10 text-destructive",
    "duration": "1-3 Months",
    "mode": "Online - Self Paced",
    "tool": "Google Ads + SEO Tools + Social Media",
    "shortDesc": "Start your digital marketing journey with the basics ΓÇö SEO, social media, Google Ads, email marketing, and content strategy explained in simple, practical terms.",
    "heroDesc": "In today's digital environment, knowing digital marketing is highly vital. It isn't simply a plus; it's a requirement! Understanding marketing basics can aid in making wise choices, preventing errors, and brand expansion, whether you are a student, business owner, or beginner. The program makes digital methods simple and accessible to all. Learn the basics of digital marketing training and gain the skills you need to succeed online. Make your online presence count by making it noticeable. Sign up today to start your journey to digital proficiency.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Google Ads",
      "Google Analytics",
      "Facebook & Instagram Ads",
      "WordPress (Basics)",
      "Email Marketing Tools",
      "SEO Tools"
],
    "hiringPartners": [
      "Digital Marketing Agencies",
      "SME Businesses",
      "E-Commerce Platforms"
],
    "curriculum": [
      {
            "title": "Module 1: What is Digital Marketing?",
            "topics": [
                  "Traditional vs Digital Marketing",
                  "Key Digital Marketing Channels",
                  "How Businesses Use Digital Marketing",
                  "Setting Marketing Goals"
            ]
      },
      {
            "title": "Module 2: SEO Basics",
            "topics": [
                  "Introduction to Search Engines",
                  "On-Page SEO Fundamentals",
                  "Keyword Research Basics",
                  "Google My Business"
            ]
      },
      {
            "title": "Module 3: Social Media Marketing",
            "topics": [
                  "Introduction to Social Media Platforms",
                  "Facebook & Instagram Marketing Basics",
                  "Creating Engaging Content",
                  "Social Media Analytics"
            ]
      },
      {
            "title": "Module 4: Google Ads Basics",
            "topics": [
                  "Introduction to Google Ads",
                  "Search Ads vs Display Ads",
                  "Setting Up a Basic Campaign",
                  "Understanding Ad Metrics"
            ]
      },
      {
            "title": "Module 5: Email & Content Marketing",
            "topics": [
                  "Email Marketing Basics",
                  "Building an Email List",
                  "Content Strategy Fundamentals",
                  "Blog Writing & Content Creation"
            ]
      }
],
    "fee": "Contact Finprov for fee details",
    "image": "/assets/course-images/basics-of-digital-marketing-course.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Data Analytics Course in The UAE"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "In the UAE, companies deal with a lot of data every day. But the real need is for people who can understand it and use it correctly. This Data Analytics UAE program helps you learn it in a simple, clear way. You don’t need any background to start. We take you through the basics and slowly help you build your skills. You’ll learn how to work with data, understand what it shows, and use tools like Excel, SQL, Python, and Power BI through practice.",
    "canonicalUrl": "https://finprov.com/courses/data-analytics-courses/",
    "metaDescription": "Boost your career with our Data Analytics Course. Learn data visualization, analysis, tools like Excel, Power BI, and more to become a skilled professional.",
    "seoTitle": "Data Analytics Course with Real-Time Projects | Finprov",
    "slug": "data-analytics-course",
    "aliases": [
 
      "data-analytics-course-uae",     "data-analytics-courses"
    ],
    "title": "Data Analytics Course",
    "category": "Analytics",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-navy/10 text-navy",
    "duration": "6 Months + 1 Month Project",
    "mode": "Online Live",
    "tool": "Python + Power BI + SQL + Advanced Excel",
    "shortDesc": "Launch your data career with hands-on analytics training. Master Python, SQL, Power BI, Excel, AI tools, and real-world projects in 6 months.",
    "heroDesc": "Looking for a career with real growth? You’re in the right place. Data analytics is one of the most in-demand skills today. This course helps you understand how data is used in everyday business and how you can turn it into useful insights. You’ll get practical, step-by-step lessons and real examples, so even beginners can follow easily. By learning these skills, you’ll gain confidence, improve your job opportunities, and set yourself up for a strong career in the future.",
    "onlineFees": "Starts at Rs. 59,000",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Advanced Excel + AI",
      "Python (Pandas, NumPy, Matplotlib)",
      "SQL",
      "Power BI",
      "Tableau",
      "ChatGPT & 10+ AI Tools",
      "Streamlit",
      "GitHub",
      "Jira",
      "Web Scraping Tools"
],
    "hiringPartners": [
      "100+ Hiring Partners through Finprov & upGrad Network"
],
    "curriculum": [
      {
            "title": "Machine Learning I",
            "topics": [
                  "Linear Regression",
                  "Logistic Regression",
                  "Naive Bayes & Classification Tasks",
                  "Model Selection Techniques"
            ]
      },
      {
            "title": "Python for Data Analytics",
            "topics": [
                  "Python Programming Fundamentals",
                  "Data Analysis with Python",
                  "Data Visualization with Python",
                  "Predictive Modelling"
            ]
      },
      {
            "title": "Statistics",
            "topics": [
                  "Introduction to Statistics",
                  "Statistical Analysis Methods",
                  "Data Interpretation & Model Selection"
            ]
      },
      {
            "title": "Data Manipulation ΓÇö Pandas & NumPy",
            "topics": [
                  "Pandas for Data Manipulation",
                  "NumPy for Numerical Computing",
                  "Data Preprocessing & Encoding"
            ]
      },
      {
            "title": "Data Visualization ΓÇö Matplotlib",
            "topics": [
                  "Matplotlib for Charts & Graphs",
                  "Advanced Data Visualization",
                  "Storytelling with Data"
            ]
      },
      {
            "title": "Excel + AI for Analytics",
            "topics": [
                  "Advanced Excel Functions",
                  "AI-Powered Data Analysis",
                  "Dashboard Creation with Excel"
            ]
      },
      {
            "title": "Power BI",
            "topics": [
                  "Power BI Overview & Setup",
                  "Building Dashboards & Reports",
                  "Business Intelligence Insights",
                  "Publishing & Sharing Reports"
            ]
      },
      {
            "title": "Tableau",
            "topics": [
                  "Tableau Overview & Interface",
                  "Creating Visualizations",
                  "Interactive Dashboards",
                  "Publishing & Data Connections"
            ]
      },
      {
            "title": "Financial & Business Analytics",
            "topics": [
                  "Financial Statement Analysis",
                  "Business Analytics Basics",
                  "Data-Driven Decision Making"
            ]
      },
      {
            "title": "SDLC & Project Management Tools",
            "topics": [
                  "Software Development Life Cycle (SDLC)",
                  "Jira for Project Management",
                  "Business Requirements Document (BRD & FRD)",
                  "GitHub for Version Control"
            ]
      },
      {
            "title": "Advanced Topics",
            "topics": [
                  "Web Scraping Techniques",
                  "Streamlit for Data App Deployment",
                  "Big Data Tools Overview",
                  "Data Ethics & Governance"
            ]
      }
],
    "fee": "Online: Starts at Rs. 59,000 | No Cost EMI from Rs. 6,458/month",
    "image": "/assets/course-images/data-analytics-course.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Practical Accounting Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "This accounting program covers the basics and gets into the more complicated stuff, too. You'll learn how to manage ledgers, make financial statements, handle taxes, and stay out of trouble with the law. You'll get advice from experts and practice with real-life situations so you can learn to read financial data and use accounting rules correctly. Whether you're a student, own a business, or have a job, this course gives you skills that can help you get better at accounting and finance.",
    "canonicalUrl": "https://finprov.com/courses/practical-accounting/",
    "metaDescription": "Gain hands-on accounting skills with our practical accounting course. Learn Tally, GST, SAP, income tax through real-life case studies and projects.",
    "seoTitle": "Practical Accounting Course | Master Real-World Accounting",
    "slug": "practical-accounting",
    "title": "Practical Accounting",
    "category": "Finance",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "1-3 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Learn practical accounting from scratch ΓÇö journal entries, ledger accounts, trial balance, financial statements, GST accounting, TDS, and bank reconciliation.",
    "heroDesc": "Understanding accounting concepts is the key if you want to get anywhere in finance and business. Our practical accounting course is all about getting your hands dirty so you learn how things work in the real world, not just in theory. We zoom in on the key accounting concepts, which will help you feel good about handling money matters, keeping the books, and making reports. We get you ready for a job in lots of different fields.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal"
],
    "hiringPartners": [
      "Finprov Placement Network",
      "Accounting Firms",
      "Small & Medium Businesses"
],
    "curriculum": [
      {
            "title": "Module 1: Accounting Fundamentals",
            "topics": [
                  "Practical Accounting Introduction",
                  "Legal Entities & Business Types",
                  "Accounting Terms & Concepts",
                  "Debits & Credits",
                  "Accrual Concept"
            ]
      },
      {
            "title": "Module 2: Accounting Process",
            "topics": [
                  "Accounting Cycle",
                  "Source Documents",
                  "Journal Entry",
                  "Ledger Accounts",
                  "Trial Balance"
            ]
      },
      {
            "title": "Module 3: Adjustments & Final Accounts",
            "topics": [
                  "Outstanding Expenses & Prepaid Expenses",
                  "Accrued Income & Income Received in Advance",
                  "Depreciation",
                  "Bad Debts & Provision for Bad Debts",
                  "Trading & Profit and Loss Account",
                  "Balance Sheet Preparation"
            ]
      },
      {
            "title": "Module 4: Tax Accounting & Reconciliation",
            "topics": [
                  "GST Accounting Entries",
                  "Income Tax Accounting",
                  "TDS & Advance Tax Accounting",
                  "Bank Reconciliation Statement",
                  "Case Study & Conclusion"
            ]
      }
],
    "fee": "Contact Finprov for fee details",
    "image": "/assets/course-images/practical-accounting.gif"
  },
  {
    "jobOpportunities": ["Accounts Executive","Tax & Compliance Specialist","Financial Analyst","Audit Associate"],
    "whoIsThisFor": ["Graduates & College Students","Working Professionals seeking skill upgrades","Entrepreneurs & Business Owners","Job seekers targeting finance & accounting roles"],
    "topSkills": ["Practical Concept Application","Real-World Tool & Software Mastery","Industry Best Practices & Compliance","Case Study & Workflow Optimization"],
    "snapshotText": "This online course teaches you how to file LLP Compliance Form 8 without any stress. You'll learn about the financial info you must share when it's due and what happens if you don't file on time. You need to file Form 8 for your LLP, no matter what. This course makes sure you do it right. It covers financial statements, a statement about being able to pay your debts and telling everyone about any debts you have. This keeps everything transparent and meets the MCA's rules. Expert advice, easy lessons, and real-world examples will get you totally prepped to handle your LLP's finances without a problem.",
    "canonicalUrl": "https://finprov.com/courses/llp-compliance-course-form-8/",
    "metaDescription": "Learn to file LLP Form 8 and stay compliant with MCA regulations with LLP compliance course. It covers Statement of Account & Solvency, and filing procedures.",
    "seoTitle": "LLP Compliance Course | Master Form 8 Filing - Finprov",
    "slug": "llp-compliances-form-8",
    "aliases": [
      "llp-compliance-course-form-8"
    ],
    "title": "LLP Compliances ΓÇô Form 8",
    "category": "Finance",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "1-3 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in LLP Compliances ΓÇô Form 8 with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Get courses worth Rs. 12,000 for FREE! 🔥 Only for selected students.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": [
      "100% Practical Industry-Aligned Curriculum",
      "Expert CA & Professional Mentorship",
      "Live Software Practice & Portal Case Studies",
      "Dedicated Placement Support & Resume Grooming"
    ],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/llp-compliances-form-8.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","How to Apply for TAN Online Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Our online course on TAN Application shows you how to break things down step by step. You will understand that the Tax Deduction and Collection Account Number is a unique 10-digit alphanumeric identifier issued by the Income Tax Department of India. We'll walk you through filling out Form 49B, submitting it online, and tracking your application. You'll find out what paperwork you need and how to apply online. This course is excellent if you're a professional, business owner, or accountant and need to get a TAN fast. We can guide you through getting a TAN card, from signing up to tracking your application and making changes.",
    "canonicalUrl": "https://finprov.com/courses/how-to-apply-for-tan-online/",
    "metaDescription": "Learn how to apply for TAN online. Our training makes it easier by giving the right skills about eligibility, documents needed, application steps etc.",
    "seoTitle": "How to Apply for TAN Online Course | Finprov Learning",
    "slug": "how-to-apply-for-tan-online",
    "title": "How To Apply For TAN Online",
    "category": "Taxation",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-teal/15 text-teal",
    "duration": "1-3 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in How To Apply For TAN Online with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Learn how to apply TAN online. Our training makes the application process easier by giving you the right skills. You’ll learn how to gather your documents and know the legal rules for TAN Application. You'll also improve your understanding of taxation concepts and better manage data. This training will give your career a boost. Check out our short courses to keep up with the fast-moving digital world!",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/how-to-apply-for-tan-online.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Startup Planning and Fundraising Strategies Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "This course teaches you everything about startup length pitching, from creating a great pitch deck to giving presentations that win people over. You'll learn how to structure your pitch so it grabs attention, shows off your business's worth, and lets you confidently talk to investors. Lots of hands-on practice and expert advice will ensure your pitch sticks in people's minds. If you want money or need to improve your business plan, this course helps you nail a pitch that works.",
    "slug": "startup-planning-and-fundraising-strategies-course",
    "aliases": [
      "startup-planning-and-fundraising-strategies"
    ],
    "title": "Startup Planning And Fundraising Strategies Course",
    "category": "Finance",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "1-3 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in Startup Planning And Fundraising Strategies Course with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Master Startup Planning and Fundraising Strategies with expert-led training and gain the skills needed to launch and scale your business. Learn how to create effective business plans, attract investors, and navigate funding opportunities. Enhance your entrepreneurial journey with short-term courses and stay competitive in the fast-paced startup world!",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/startup-planning-and-fundraising-strategies-course.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","MCA compliances – Form AOC-4"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Companies prepare financial statements each year as required by the Companies Act. They then file these statements with the Registrar of Companies (ROC) using Form AOC 4. This course walks you through the process of preparing and filing Form AOC 4 so you can learn, get comfortable, and become an expert. You’ll learn to collect the right documents, follow all the steps, and keep up with the latest changes. This skill can boost your CV and give you an advantage. Since every company has to file Form AOC 4 yearly, this course is helpful for many people. It could help you earn more or get promoted faster. So, sign up now if you want a course that can help you specialize and get a better future!",
    "canonicalUrl": "https://finprov.com/courses/mca-compliances-form-aoc-4-filing/",
    "metaDescription": "MCA Compliances Form AOC 4 is for filing financial statements of the company for every financial year with the registrar of companies (ROC). How to file AOC 4",
    "seoTitle": "MCA Compliances - Form AOC 4 Filing - Finprov Learning",
    "slug": "mca-compliances-form-aoc-4",
    "aliases": [
      "mca-compliances-form-aoc-4-filing"
    ],
    "title": "MCA Compliances ΓÇô Form AOC-4",
    "category": "Taxation",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-teal/15 text-teal",
    "duration": "1-3 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in MCA Compliances ΓÇô Form AOC-4 with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Want to get good at MCA Compliances Form AOC 4 Filing? Get practical training and learn what the industry expects. You'll get to grips with what's needed for compliance, learn how to make the filing process more manageable, and ensure your company reports are spot on. Short accounting courses can boost your career and keep you up to date with the newest rules!",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/mca-compliances-form-aoc-4.jpg"
  },
  {
    "snapshotText": "Finprov's PGDM Finance Specialization Program offers an intensive 2-year industry-aligned curriculum combining core management principles with advanced financial strategies. Learners master corporate finance, investment banking, risk management, financial modeling, and AI-enabled financial analytics.",
    "jobOpportunities": ["Accounts Executive","Tax & Compliance Specialist","Financial Analyst","Audit Associate"],
    "whoIsThisFor": ["Graduates & College Students","Working Professionals seeking skill upgrades","Entrepreneurs & Business Owners","Job seekers targeting finance & accounting roles"],
    "topSkills": ["Practical Concept Application","Real-World Tool & Software Mastery","Industry Best Practices & Compliance","Case Study & Workflow Optimization"],
    "canonicalUrl": "https://finprov.com/courses/pgdm-with-finance-specialization/",
    "metaDescription": "Finprov offers Post-Graduate Diploma in Management (PGDM) Finance specialization Course to make you an expert in accounting. Placement Oriented accounting course",
    "seoTitle": "Post-Graduate Diploma in Management - Finance specialization",
    "slug": "post-graduate-diploma-in-management-pgdm-finance-specialization-course",
    "aliases": [
      "pgdm-with-finance-specialization"
    ],
    "title": "Post-Graduate Diploma In Management (PGDM) Finance Specialization Course",
    "category": "Finance",
    "programType": "Job Assured",
    "badge": "Flagship",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "12 Months",
    "mode": "Online & Offline",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in Post-Graduate Diploma In Management (PGDM) Finance Specialization Course with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Build your expertise in Post-Graduate Diploma In Management (PGDM) Finance Specialization Course with Finprov's industry-aligned practical curriculum. Designed by Chartered Accountants and industry experts to provide hands-on experience, real-world case studies, and career advancement support.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": [
      "100% Practical Industry-Aligned Curriculum",
      "Expert CA & Professional Mentorship",
      "Live Software Practice & Portal Case Studies",
      "Dedicated Placement Support & Resume Grooming"
    ],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/post-graduate-diploma-in-management-pgdm-finance-specialization-course.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","How to File GSTR 3B"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "This course will show you how to fill out GSTR-3B forms on the GST site. It's great if you're a student, employee, or business owner who wants to get taxes right and not pay late fees. You’ll learn how to report your taxes, get credits, and make sure everything looks good.It's made for everyone, so you can file your GSTR-3B with confidence, match up all your tax info, and spot mistakes before you send it off.",
    "canonicalUrl": "https://finprov.com/courses/how-to-file-gstr-3b/",
    "metaDescription": "Learn how to file GSTR 3B easily with our step-by-step guide. Understand eligibility, due dates, and the online filing process to ensure GST compliance.",
    "seoTitle": "How to File GSTR 3B: Step-by-Step Guide for GST Filing",
    "slug": "how-to-file-gstr-3b",
    "title": "How To File GSTR 3B",
    "category": "Taxation",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-teal/15 text-teal",
    "duration": "1-3 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in How To File GSTR 3B with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Learn how to file GSTR-3B and use it in the real world. This form is vital for reporting your monthly GST dues, the tax credit you can claim, and your tax payments. Want to make filing GST easier? This course will teach you how to file GSTR-3B step by step so you can view, prepare, and send it without any trouble while ensuring everything is correct and follows the rules.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/how-to-file-gstr-3b.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","How to file ITR 1 Online Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "An Income Tax Return (ITR) is a form that taxpayers use to report their income to the Income Tax Department. There are different ITR forms for different types of taxpayers. In this course, our expert trainers will make ITR-1 filing simple and easy, so you can learn to file it on your own. Join us and file your income tax return without any worries!",
    "canonicalUrl": "https://finprov.com/courses/how-to-file-itr-1-online/",
    "metaDescription": "Learn how to file ITR-1 online with Finprov. Learn eligibility, documents required, e-filing steps on the income tax portal, and avoid common filing errors.",
    "seoTitle": "Master how to File ITR-1 Online course | Finprov Learning",
    "slug": "how-to-file-itr-1-online",
    "title": "How To File ITR 1 Online?",
    "category": "Taxation",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-teal/15 text-teal",
    "duration": "7 Weeks",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Trending Now! Upgrade your skills with the Filing ITR 1 Course Secure your spot todayΓÇöCall now to get started! Download Syllabus Apply Now Introduction Key H...",
    "heroDesc": "Trending Now! Upgrade your skills with the Filing ITR 1 Course Secure your spot today—Call now to get started! Choose Your Perfect Course Advanced Generative AI Certification Course Master the skills that shape the future of technology with the Advanced Certificate Program in Generative AI, a 5-month generative AI course by upGrad. No Cost EMI Starts at Rs. 6,458 Start Date Starts at Rs. 6,458 Duration 4 Months Download Syllabus Apply Now Hurry! 665 people have already applied in the last 1 month For enquiries call: Get Started Introduction Key Highlights Certificate Instructors Syllabus FAQs Introduction to Filing ITR 1 Course Course Snapshot Hours of Learning 0 + Industry Projects 0 + GenAI Tools 0 + An Income Tax Return (ITR) is a form that taxpayers use to report their income to the Income Tax Department. There are different ITR forms for different types of taxpayers. In this course, our expert trainers will make ITR-1 filing simple and easy, so you can learn to file it on your own. Join us and file your income tax return without any worries!",
    "onlineFees": "Starts at Rs. 6,458",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "Online: Starts at Rs. 6,458",
    "image": "/assets/course-images/how-to-file-itr-1-online.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Basics of Microsoft Excel Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Microsoft Excel is a popular tool for accountants and finance professionals. Finprov’s online course teaches you how to use Excel easily and effectively. You will learn both basic and advanced features like Conditional Formatting, Lookup, IF Function, SUMIF, Pivot Tables, and shortcuts. This course helps you work faster, organize data better, and improve your Excel skills.",
    "canonicalUrl": "https://finprov.com/courses/ms-office-course/",
    "metaDescription": "Improve your productivity with our MS Office Course and learn Word, Excel, PowerPoint, and essential office skills with practical training. Join now!",
    "seoTitle": "Professional MS Office Course with Practical Training",
    "slug": "basics-of-microsoft-excel",
    "aliases": [
 
      "ms-office-certification-course-uae",     "ms-office-course"
    ],
    "title": "Basics Of Microsoft Excel",
    "category": "Analytics",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-navy/10 text-navy",
    "duration": "7 Weeks",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Learn the Basics of Microsoft Excel with expert training and gain useful skills to work with data efficiently.",
    "heroDesc": "Learn the Basics of Microsoft Excel with expert training and gain useful skills to work with data efficiently. Understand how to organize information, use formulas, and create reports. This course helps you improve productivity, analyze data easily, and manage tasks effectively.",
    "onlineFees": "Starts at Rs. 6,458",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "Online: Starts at Rs. 6,458",
    "image": "/assets/course-images/basics-of-microsoft-excel.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Basics of Cash Flow Statement Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "This Basics of Cash Flow Statement course will help you understand how to manage cash flow by tracking a company's cash movements. The cash flow statement connects the income and balance sheets, showing how money comes in and goes out of a business. This online course will teach you how to calculate, organize, and complete cash flow statements.",
    "canonicalUrl": "https://finprov.com/courses/basics-of-cash-flow-statement/",
    "metaDescription": "Finprov&#039;s Basics of Cash Flow Statement Free Course provides a strong foundation in cash flow statements, Know ways of cash inflows and outflows to the business",
    "seoTitle": "Basics of Cash Flow Statement Free Course | Finprov Learning",
    "slug": "basics-of-cash-flow-statement",
    "title": "Basics Of Cash Flow Statement",
    "category": "Finance",
    "programType": "Executive",
    "badge": "Executive",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "6 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in Basics Of Cash Flow Statement with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Learn the Basics of Cash Flow Statement with expert training and gain useful skills to manage money better. Understand how cash moves in a business, keep track of income and expenses, and make smart financial decisions. This course helps you improve cash flow, run your business smoothly, and stay financially strong.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/basics-of-cash-flow-statement.gif"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Advanced MS Excel"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Our Advanced MS Excel Course helps you improve at data automation and making charts. Make cool dashboards, automate tasks with VBA, and make better financial models for more innovative choices. The course teaches you the newest Excel tricks so you can fix data problems like a pro. Get better skills and boost your career now! This Course will show you how to quickly handle big data sets using pivot tables, VLOOKUP, INDEX-MATCH, macros, and formulas. You’ll also learn about data validation, conditional formatting, dashboards, and charting. This knowledge will allow you to make wise choices based on data.",
    "canonicalUrl": "https://finprov.com/courses/advanced-ms-excel/",
    "metaDescription": "FinprovΓÇÖs Advanced MS Excel Certification upskills your basic MS Excel knowledge and creates better spreadsheets with organized data.",
    "seoTitle": "Advanced MS Excel Certification for Accounting Professionals",
    "slug": "advanced-ms-excel",
    "title": "Advanced MS Excel",
    "category": "Analytics",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-navy/10 text-navy",
    "duration": "1-3 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in Advanced MS Excel with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Want to get good at Advanced MS Excel? Our training, taught by experts, can help you level up. You'll get better at data analysis, automation, and making financial models by learning to use Excel's best features. Whether you're dealing with tons of data, trying to automate tedious tasks, or just want to make your reports more accurate, this training will improve your Excel-related skills. Take our short courses to be ahead of the curve with the newest Excel tricks. Give your career a boost with some extraordinary skills!",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/advanced-ms-excel.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","QuickBooks Online Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "This accounting course teaches you the basics and more complex ideas so you can really understand how money works. You'll learn to keep track of records, create reports, handle taxes, and follow the rules. With help from experts and practice activities, you’ll get real experience looking at money information and using accounting rules well. If you're a student, own a business, or just work in an office, this course gives you the skills you need to do well in accounting and finance. Get started today and get better at handling money!",
    "canonicalUrl": "https://finprov.com/courses/quickbooks-online-course/",
    "metaDescription": "QuickBooks Online makes you capable of handling accounts independently. Learn QuickBooks Online to join your accounting dream job",
    "seoTitle": "QuickBooks Online Certification Course For Accounting Jobs",
    "slug": "quickbooks-online",
    "aliases": [
      "quickbooks-online-course"
    ],
    "title": "QuickBooks Online",
    "category": "Finance",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "1-3 Months",
    "mode": "Online - Self Paced",
    "tool": "QuickBooks Online",
    "shortDesc": "Master QuickBooks Online ΓÇö the world's leading small business accounting software. Learn invoicing, bank reconciliation, payroll, expense tracking and financial reporting.",
    "heroDesc": "Hurry! 665 people have already applied in the last 1 month For enquiries call: Get Started Choose Your Perfect Course Advanced Generative AI Certification Course Master the skills that shape the future of technology with the Advanced Certificate Program in Generative AI, a 5-month generative AI course by upGrad. No Cost EMI Starts at Rs. 6,458 Start Date Starts at Rs. 6,458 Duration 4 Months Download Syllabus Apply Now Hurry! 665 people have already applied in the last 1 month For enquiries call: Get Started Introduction Key Highlights Certificate Instructors Syllabus FAQs Introduction to Quickbooks Course Course Snapshot Hours of Learning 0 + Industry Projects 0 + GenAI Tools 0 + This accounting course teaches you the basics and more complex ideas so you can really understand how money works. You'll learn to keep track of records, create reports, handle taxes, and follow the rules. With help from experts and practice activities, you’ll get real experience looking at money information and using accounting rules well. If you're a student, own a business, or just work in an office, this course gives you the skills you need to do well in accounting and finance. Get started today and get better at handling money!",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "QuickBooks Online (Primary Software)",
      "Bank Integration Tools"
],
    "hiringPartners": [
      "International Accounting Firms",
      "SME Businesses",
      "Finprov Hiring Network"
],
    "curriculum": [
      {
            "title": "Module 1: Company Setup",
            "topics": [
                  "Setting Up Your Company Profile",
                  "Chart of Accounts Management",
                  "Initial Settings & Preferences"
            ]
      },
      {
            "title": "Module 2: Transactions & Recording",
            "topics": [
                  "Recording Transactions",
                  "Journal Entries & Adjustments",
                  "Categories & Tags"
            ]
      },
      {
            "title": "Module 3: Banking & Reconciliation",
            "topics": [
                  "Bank Account Reconciliation",
                  "Bank Feeds & Matching Transactions",
                  "Reconciliation Reports"
            ]
      },
      {
            "title": "Module 4: Sales & Receivables",
            "topics": [
                  "Invoicing & Recurring Invoices",
                  "Managing Accounts Receivable",
                  "Customer Payments & Credits"
            ]
      },
      {
            "title": "Module 5: Expenses & Payables",
            "topics": [
                  "Tracking Expenses & Bills",
                  "Managing Accounts Payable",
                  "Vendor Payments & Purchase Orders"
            ]
      },
      {
            "title": "Module 6: Payroll & Tax",
            "topics": [
                  "Payroll Setup & Processing",
                  "Employee Management",
                  "Tax Compliance Overview",
                  "Filing Tax Reports"
            ]
      },
      {
            "title": "Module 7: Financial Reports",
            "topics": [
                  "Profit & Loss Statement",
                  "Balance Sheet",
                  "Cash Flow Statement",
                  "Reading & Analyzing Financial Reports"
            ]
      }
],
    "fee": "Contact Finprov for fee details",
    "image": "/assets/course-images/quickbooks-online.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Language Lab Course​"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Finprov has a quick, self-study language course with expert help. Knowing a language well really helps you land that job. We teach you how to talk, expand your word knowledge, get your grammar right, and pronounce words clearly. Our system lets you learn about sounds, similar-sounding word pairs, phonetics, how to use commas and periods, speech sounds, verbs, vowels, and articles. People can practice and improve their speaking, listening, pronunciation, and writing skills, thanks to fun activities and new tech. If you're good at communicating in English, you're more likely to have a great career.",
    "canonicalUrl": "https://finprov.com/courses/language-lab/",
    "metaDescription": "Improve your communication skills with our Language lab course designed to improve linguistic skills with interactive and practical trainings. Join now!",
    "seoTitle": "Professional Language Lab Course for Effective Communication",
    "slug": "language-lab",
    "title": "Language Lab",
    "category": "Finance",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "7 Weeks",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Become proficient in the language and Become a professional.",
    "heroDesc": "Become proficient in the language and Become a professional. You're competent in accounting, but you're always afraid of how to approach a potential employer. Furthermore, do you believe that proving your abilities to a recruiter is far more complex than mastering language skills? To improve your communication skills and boost your confidence, Finprov provides you with a language lab.",
    "onlineFees": "Starts at Rs. 6,458",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "Online: Starts at Rs. 6,458",
    "image": "/assets/course-images/language-lab.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Credit Score Course​"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Knowing how the credit system works is important for managing money, both for yourself and your business. This easy-to-follow course by Finprov helps you understand credit scores and how to improve them. Learn simple tips to fix a low credit score, save money, and stay financially secure. With practical steps, this course gives you the confidence to manage your finances better.",
    "canonicalUrl": "https://finprov.com/courses/credit-score/",
    "metaDescription": "Get a complete understanding of what a credit score is and how it is calculated. Explore everything you need to know about credit score.",
    "seoTitle": "Credit Score Online course- Finprov Learning",
    "slug": "credit-score",
    "title": "Credit Score",
    "category": "Analytics",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-navy/10 text-navy",
    "duration": "7 Weeks",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Master Credit Score Management with expert-led training and gain industry-relevant skills to improve your financial health.",
    "heroDesc": "Master Credit Score Management with expert-led training and gain industry-relevant skills to improve your financial health. Learn proven strategies to build, maintain, and enhance your credit score. This course introduces key techniques that open new financial opportunities and set you up for long-term success.",
    "onlineFees": "Starts at Rs. 6,458",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "Online: Starts at Rs. 6,458",
    "image": "/assets/course-images/credit-score.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Professional Skills Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Finprov has a quick, self-study course where you can get help from pros. It'll help you talk better and be a better leader. You'll also learn to handle your time, think smart, and give great presentations. It's a great way to learn about the tools people use at work. Plus, you'll get real-world practice so you can nail your interviews.",
    "canonicalUrl": "https://finprov.com/courses/professional-skills/",
    "metaDescription": "FinprovΓÇÖs Professional Skills training course helps you improve your skills and face career challenges that can enhance your growth.",
    "seoTitle": "Professional Skills Development Online Course - Finprov",
    "slug": "professional-skills",
    "title": "Professional Skills",
    "category": "Finance",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "7 Weeks",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Let's understand specific professional skills and become an expert in them.",
    "heroDesc": "Let's understand specific professional skills and become an expert in them. Even if you possess basic technical skills, you must present them before an employer, which is a tedious job. It is a fact that the phenomenon stated above is far more complex than acquiring the skills themselves. Finprov’s professional skills course enhances your communication and confidence, helping you stand out in any job interview.",
    "onlineFees": "Starts at Rs. 6,458",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "Online: Starts at Rs. 6,458",
    "image": "/assets/course-images/professional-skills.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Blue Ocean Strategy Course​"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Blue Ocean Strategy was created by W. Chan Kim and Renée Mauborgne in 2004. Businesses around the world use it to grow by finding new markets and increasing profits. Finprov’s Blue Ocean Strategy course explains the strategy in a simple way with real examples and industry insights. This course helps you understand and use the strategy to grow your business.",
    "canonicalUrl": "https://finprov.com/courses/blue-ocean-strategy/",
    "metaDescription": "Blue Ocean Strategy course gets your business to the next level. Nurture your business with no competition, high in demand and long-standing.",
    "seoTitle": "Blue Ocean Strategy Online Course - Finprov Learning",
    "slug": "blue-ocean-strategy",
    "title": "Blue Ocean Strategy",
    "category": "Finance",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "1-3 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in Blue Ocean Strategy with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Master Blue Ocean Strategy with expert-led training and gain industry-relevant skills to grow your business. Learn proven strategies to explore new markets, stand out, and drive innovation. This course introduces proven strategies that create fresh opportunities and set you apart from the competition.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/blue-ocean-strategy.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","LLP Compliance Course​"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "This self-paced online course is carefully groomed to excel in business settings, consulting firms, and professional associations. This course teaches you how to file Form 11 for LLP Compliance effectively. You will learn how to submit the form online and when it is due. This course also discusses why you must file LLP Compliance paperwork even if your company is not functioning. You'll get one-on-one guidance and can ask questions to experts as you learn. Students can also solve doubts with expert mentors.",
    "canonicalUrl": "https://finprov.com/courses/llp-compliances-form-11/",
    "metaDescription": "Annual return filing of Form 11 is needed to be done by all LLPs irrespective of turnover during the year. Given important aspects to note while filing Form 11.",
    "seoTitle": "Filing LLP Form 11 - Annual Filing of LLP - Finprov",
    "slug": "llp-compliances-form-11",
    "title": "LLP Compliances ΓÇô Form 11",
    "category": "Taxation",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-teal/15 text-teal",
    "duration": "1-3 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in LLP Compliances ΓÇô Form 11 with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Learn how LLPs file Form 11 with the Ministry of Corporate Affairs (MCA). Filing the most recent form of LLP Form 11 in corporate compliance is preferable. LLP Annual Compliance shows who runs the business and how it is managed, ensuring everything is explicit and follows the Ministry of Corporate Affairs rules.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/llp-compliances-form-11.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Advanced UAE VAT"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "VAT, or value-added tax, is charged on goods and services. It affects businesses, and not following VAT rules can lead to big financial problems. In the UAE, it's important to understand how VAT works. To help with this, Finprov offers an Advanced UAE VAT course. This course explains the basics of VAT, important rules, and how to follow them. The online course gives you the skills to handle VAT properly and follow UAE VAT laws.",
    "canonicalUrl": "https://finprov.com/courses/advanced-uae-vat-uae/",
    "metaDescription": "Advance your expertise with our Advanced UAE VAT course. Learn VAT calculations, compliance, strategies, and more to excel in accounting careers. Join now!",
    "seoTitle": "Advanced UAE VAT Training for High-Demand Finance Jobs",
    "slug": "advanced-uae-vat",
    "aliases": [
      "advanced-uae-vat-uae"
    ],
    "title": "Advanced UAE VAT",
    "category": "Gulf",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-navy/10 text-navy",
    "duration": "1-3 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in Advanced UAE VAT with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Become an expert in UAE VAT with Finprov’s Advanced UAE VAT Course, designed to equip you with job-ready skills in just a few months.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/advanced-uae-vat.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Business valuation Course​"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "This business valuation course covers different techniques for assessing a company's value, including Discounted Cash Flow (DCF), Market Comparables, and Asset-Based Valuation. Understanding market trends, industry performance, and risk concerns regarding business valuation is also essential. This course is your gateway to mastering business valuation and unlocking global career opportunities. Throughout the certified business valuation courses, students will have personalized mentorship sessions, and they can also solve doubts with expert mentors.",
    "canonicalUrl": "https://finprov.com/courses/business-valuation/",
    "metaDescription": "Gain practical skills in Business Valuation course and learn how to evaluate businesses with precision. Perfect for finance professionals and investors!",
    "seoTitle": "Business Valuation Course - Finprov Learning",
    "slug": "business-valuation",
    "title": "Business Valuation",
    "category": "Finance",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "7 Weeks",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Are u ready to master the business valuation course and take your financial skills to the next level? Financial analysts who want to be the best in the world co...",
    "heroDesc": "Are u ready to master the business valuation course and take your financial skills to the next level? Financial analysts who want to be the best in the world consider valuation crucial. People can learn how to assess a company's value by taking a business valuation course. This course gives you the tools to figure out what a company is really worth. If you know how business valuation works, you can make smart money choices, know your company's true value, and grow your business in a tough market.",
    "onlineFees": "Starts at Rs. 3999",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "Online: Starts at Rs. 3999",
    "image": "/assets/course-images/business-valuation.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Annual Filing Of FLA Return Course​"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "This FLA Return filing course teaches that startups and private limited companies with international investors must file returns if they have foreign assets or liabilities. This course will teach you how firms can lower financial risks by maintaining accurate records. This course will give you a comprehensive idea of FLA return filing procedures. This course will help you learn everything about FLA Returns, opening doors to jobs around the world. You'll get one-on-one mentoring during the course, and you can get your questions answered by experienced mentors.",
    "canonicalUrl": "https://finprov.com/courses/annual-filing-of-fla-return/",
    "metaDescription": "Foreign Liabilities and Assets (FLA) Return is an Annual Return which is needed to be submitted directly by all the Indian companies which have received FDI.",
    "seoTitle": "Simplify Your FLA Return Filing with Finprov Learning",
    "slug": "annual-filing-of-fla-return",
    "title": "Annual Filing Of FLA Return",
    "category": "Taxation",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-teal/15 text-teal",
    "duration": "1-3 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in Annual Filing Of FLA Return with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Gain knowledge about FLA Return filing to upgrade your skills to the next level. Take the self-paced online training offered by Finprov to file your yearly Foreign Liabilities and Assets (FLA) returns. This course imparts insights into how RBI evaluates external debt and financial flows through this filing process by keeping precise records of India's international economic activities. It is advantageous for those who want to pursue an accounting career to be familiar with FLA courses. Training will improve your placement in the business sector that deals with foreign direct investment (FDI).",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/annual-filing-of-fla-return.jpg"
  },
  {
    "snapshotText": "The MIS for Accountant course is designed to empower accounting professionals with advanced reporting skills using MS Excel and automated reporting techniques. Learn how to generate Management Information System (MIS) reports, perform variance analysis, and streamline decision-making dashboards.",
    "jobOpportunities": ["Accounts Executive","Tax & Compliance Specialist","Financial Analyst","Audit Associate"],
    "whoIsThisFor": ["Graduates & College Students","Working Professionals seeking skill upgrades","Entrepreneurs & Business Owners","Job seekers targeting finance & accounting roles"],
    "topSkills": ["Practical Concept Application","Real-World Tool & Software Mastery","Industry Best Practices & Compliance","Case Study & Workflow Optimization"],
    "slug": "mis-for-accountant",
    "title": "MIS For Accountant",
    "category": "Analytics",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-navy/10 text-navy",
    "duration": "1-3 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in MIS For Accountant with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Build your expertise in MIS For Accountant with Finprov's industry-aligned practical curriculum. Designed by Chartered Accountants and industry experts to provide hands-on experience, real-world case studies, and career advancement support.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": [
      "100% Practical Industry-Aligned Curriculum",
      "Expert CA & Professional Mentorship",
      "Live Software Practice & Portal Case Studies",
      "Dedicated Placement Support & Resume Grooming"
    ],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/mis-for-accountant.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","E-Invoicing Course​"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Finprov’s E-Invoicing course provides complete knowledge about einvoicing. This course covers all over the process of online invoicing, the various steps to implement it, and key considerations for a successful setup. We also provide practical training to all the learners that helps participants to deal with real time projects without any hesitation.",
    "canonicalUrl": "https://finprov.com/courses/e-invoicing/",
    "metaDescription": "E - Invoicing, self paced certification course for upskill your accounting knowledge and help to achieve a promising career",
    "seoTitle": "E-Invoicing Certification Course & Training | Finprov",
    "slug": "e-invoicing",
    "title": "E-Invoicing",
    "category": "Taxation",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-teal/15 text-teal",
    "duration": "7 Weeks",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Master E-Invoicing with expert-led training and gain industry-relevant skills to advance your career in accounting and finance.",
    "heroDesc": "Master E-Invoicing with expert-led training and gain industry-relevant skills to advance your career in accounting and finance. Learn how to streamline invoicing processes, ensure compliance, and boost efficiency with digital invoicing solutions. Invest in your future with short-term accounting courses and stay ahead in the evolving financial landscape!",
    "onlineFees": "Starts at Rs. 6,458",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "Online: Starts at Rs. 6,458",
    "image": "/assets/course-images/e-invoicing.gif"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","E way Bill Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "The E-Way Bill Course will teach you everything there is to know about India's digital transport documentation system for GST. You will learn to use the E-Way Bill system properly and adhere to the requirements. Whether you work with finances, manage a business, provide tax advice, or transport goods, this course helps you understand the fundamentals of E-Way Bills and their everyday requirements. Learning about legal requirements, procedures, and practical aspects of E-Way Bill compliance is good.",
    "canonicalUrl": "https://finprov.com/courses/e-way-bill/",
    "metaDescription": "Learn everything about Electronic Way Bills (E-Way Bills) in GST. How to generate it, eligibility and validation for E-way bills.",
    "seoTitle": "Learn Everything About E-Way Bill - Finprov Learning",
    "slug": "e-way-bill",
    "title": "E-Way Bill",
    "category": "Taxation",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-teal/15 text-teal",
    "duration": "7 Weeks",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Learn more about GST through our E-way bill course.",
    "heroDesc": "Learn more about GST through our E-way bill course. It is natural to have so many questions in your head, like what e way Bill is, who needs to construct one, and what the necessary documents are required. This course is an exact answer to this question. This course will walk you through the process of creating an e-way bill. Build a solid foundation with E Way Bills through expert-led training.",
    "onlineFees": "Starts at Rs. 6,458",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "Online: Starts at Rs. 6,458",
    "image": "/assets/course-images/e-way-bill.gif"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Income Tax - TDS, TCS & Advance Tax Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Finprov’s TDS and TCS in Income Tax course is perfect for anyone looking to build a career in income tax. It covers all the important rules, from basics to advanced topics like deductions, exemptions, provisions, and penalties. The course is designed to provide both theory and practical knowledge, making learning easy and effective. There are many job opportunities in this field, and completing this course can lead to a stable and rewarding career.",
    "canonicalUrl": "https://finprov.com/courses/income-tax-tds-tcs-advance-tax/",
    "metaDescription": "Ready to improve your accounting skills with an income tax basics course, master your skills in income tax filing and reporting, and helps to achieve a promising career in accounting",
    "seoTitle": "Income Tax Basics Course for Income Tax Filing & Reporting",
    "slug": "income-tax-tds-tcs-advance-tax",
    "title": "Income Tax ΓÇô TDS, TCS & Advance Tax",
    "category": "Taxation",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-teal/15 text-teal",
    "duration": "1-3 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in Income Tax ΓÇô TDS, TCS & Advance Tax with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Learn Income Tax – TDS, TCS & Advance Tax with expert training and improve your skills in accounting and finance. Understand tax deductions, manage collections, and follow tax rules with ease. Join short-term accounting courses to gain practical knowledge and stay ahead in the finance field!",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/income-tax-tds-tcs-advance-tax.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Good Length pitching for start-ups Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "This course teaches you everything about startup length pitching, from creating a great pitch deck to giving presentations that win people over. You'll learn how to structure your pitch so it grabs attention, shows off your business's worth, and lets you confidently talk to investors. Lots of hands-on practice and expert advice will ensure your pitch sticks in people's minds. If you want money or need to improve your business plan, this course helps you nail a pitch that works.",
    "canonicalUrl": "https://finprov.com/courses/good-length-pitching-for-startups/",
    "metaDescription": "Do you know how to prepare good pitching report for Startups, Finprov&#039;s Pitching Report Preparation Course provides knowledge to prepare a good pitching report",
    "seoTitle": "Pitching Report Preparation Course for Startups | Finprov",
    "slug": "good-length-pitching-for-startups",
    "title": "Good Length Pitching For Startups",
    "category": "Finance",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "1-3 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in Good Length Pitching For Startups with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "You need a solid startup pitching strategy if you want investors, customers, and partners. Many startups have trouble explaining their ideas well, hurting their chances of getting money and growing. This course will teach you how to pitch a presentation that grabs people's attention and gets your point across. If you learn pitching well, you’ll have a better chance of getting funded and noticed.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/good-length-pitching-for-startups.jpg"
  },
  {
    "snapshotText": "Gain practical expertise in statutory employee benefits calculations with Finprov's ESI & EPF Calculation course. Learn statutory rules, salary structure breakdowns, online portal returns filing, and monthly compliance procedures.",
    "jobOpportunities": ["Accounts Executive","Tax & Compliance Specialist","Financial Analyst","Audit Associate"],
    "whoIsThisFor": ["Graduates & College Students","Working Professionals seeking skill upgrades","Entrepreneurs & Business Owners","Job seekers targeting finance & accounting roles"],
    "topSkills": ["Practical Concept Application","Real-World Tool & Software Mastery","Industry Best Practices & Compliance","Case Study & Workflow Optimization"],
    "canonicalUrl": "https://finprov.com/courses/esi-epf-calculation/",
    "metaDescription": "Finprov Learning provides EPF Calculation and ESI Calculation online courses that upskilling your accounting knowledge.",
    "seoTitle": "ESI Calculation& EPF Calculation Course Online | Finprov",
    "slug": "esi-and-epf-calculation",
    "aliases": [
      "esi-epf-calculation"
    ],
    "title": "ESI And EPF Calculation",
    "category": "Taxation",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-teal/15 text-teal",
    "duration": "1-3 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in ESI And EPF Calculation with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Build your expertise in ESI And EPF Calculation with Finprov's industry-aligned practical curriculum. Designed by Chartered Accountants and industry experts to provide hands-on experience, real-world case studies, and career advancement support.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": [
      "100% Practical Industry-Aligned Curriculum",
      "Expert CA & Professional Mentorship",
      "Live Software Practice & Portal Case Studies",
      "Dedicated Placement Support & Resume Grooming"
    ],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/esi-and-epf-calculation.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","How To Apply For PAN Online Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Our course on how to apply PAN card online breaks things down step by step. It’s perfect for anyone. Whether you’re applying for yourself or helping someone else, we cover all the basics. You’ll learn what documents you need and how to submit your application online. We’ll point out common mistakes so you don’t face any hiccups. With our expert help, you’ll get practical experience registering for a PAN card, tracking your application, and making updates. Join now to learn how to apply PAN Card Online effortlessly and make your PAN Card Online applications simple!",
    "canonicalUrl": "https://finprov.com/courses/how-to-apply-pan-card-online/",
    "metaDescription": "How to apply PAN card online? You can either apply for a new PAN card by online or by downloading it and filling it.",
    "seoTitle": "How to Apply PAN Card Online ΓÇô Step-by-Step Guide | Finprov",
    "slug": "how-to-apply-pan-card-online",
    "title": "How To Apply PAN Card Online",
    "category": "Taxation",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-teal/15 text-teal",
    "duration": "1-3 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in How To Apply PAN Card Online with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Learn how to apply for a PAN Card online. Our training will help you get the skills you need for a smooth application process. You’ll learn how to gather your documents and know the legal rules for PAN registration. You'll also improve your understanding of finances and better manage data. This training can help you stand out in your career. Join our short courses to stay up-to-date in the busy world of finance!",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/how-to-apply-pan-card-online.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Working Capital Management Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Working Capital Management is important for the financial growth of any business. Managing it well helps businesses run smoothly, improve cash flow, and increase profits. Working capital is the difference between what a business owns (assets) and what it owes (liabilities). It also affects different parts of a business, especially cash flow. That’s why anyone working with finance should learn how to manage it properly. This course is great for business owners, finance professionals, accountants, managers, and students. It teaches simple strategies to manage money better, improve work processes, and boost business success.",
    "canonicalUrl": "https://finprov.com/courses/working-capital-management/",
    "metaDescription": "Take control of the most decisive factor of your business. Learn Working Capital Management for effective and efficient business operations.",
    "seoTitle": "Working Capital Management Online Course - Finprov Learning",
    "slug": "working-capital-management",
    "title": "Working Capital Management",
    "category": "Finance",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "1-3 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in Working Capital Management with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Master Working Capital Management with expert-led training and gain industry-relevant skills to optimize your business finances. Learn proven strategies to manage cash flow, maintain liquidity, and enhance financial stability. This course introduces key techniques that improve operational efficiency and set you up for long-term success.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/working-capital-management.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","How to view and download form 26AS​ Course​"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "This course shows how to use the Income Tax e-Filing portal and TRACES website to access, interpret, and download form 26AS.If you want to make sure you pay your taxes and make smart financial choices, whether you are a student, a worker, or the owner of a business, you should learn how to view and download form 26AS. Learn to verify tax information, check TDS credits, and file appropriate taxes. This course teaches tax compliance skills to beginners and professionals. You can confidently submit your returns, verify deductions, and identify errors by knowing how to view form 26AS.",
    "canonicalUrl": "https://finprov.com/courses/how-to-view-download-form-26as/",
    "metaDescription": "Understand form 26AS and its practical application and the importance of 26AS in income tax, this comprehensive program will give step by step guidence",
    "seoTitle": "How to View & Download Form 26AS - Finprov Learning",
    "slug": "how-to-view-download-form-26as",
    "title": "How To View & Download Form 26AS",
    "category": "Taxation",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-teal/15 text-teal",
    "duration": "1-3 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in How To View & Download Form 26AS with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Learn this course to gain a more comprehensive understanding of Form 26AS and its practical application. To keep track of your tax refunds, TDS, and advance tax payments, you need to know how to view and download form 26AS. Take care of your tax management right now and make the process easier with help from a professional!",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/how-to-view-download-form-26as.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Partnership Deed Course​"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "A partnership deed is the backbone of any partnership business. It is a crucial legal document that defines roles, responsibilities, and ownership, ensuring smooth operations. This course gives you a clear understanding of partnership deeds, their types, key clauses, and registration requirements. Learn how to draft a legally strong agreement and avoid future disputes while forming business partnerships.",
    "canonicalUrl": "https://finprov.com/courses/partnership-deed/",
    "metaDescription": "Partnership Deed Online Course helps you to get a comprehensive learning of partnership agreements, clauses, ownership, negotiations etc.",
    "seoTitle": "Partnership Deed Online Course - Finprov Learning",
    "slug": "partnership-deed",
    "title": "Partnership Deed",
    "category": "Finance",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "7 Weeks",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Learn about partnership agreements, key clauses, ownership structures, and negotiations through hands-on training and real-world case studies.",
    "heroDesc": "Learn about partnership agreements, key clauses, ownership structures, and negotiations through hands-on training and real-world case studies. Understand the legal aspects of partnerships to protect your business and avoid future conflicts. Stay legally compliant and make informed business decisions!",
    "onlineFees": "Starts at Rs. 6,458",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "Online: Starts at Rs. 6,458",
    "image": "/assets/course-images/partnership-deed.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Business Law Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Finprov's business law course is designed to help aspiring entrepreneurs grow with a practical and useful curriculum. It covers business laws, rules, and ethics in India, making it very valuable. You will learn about different types of businesses, partnership structures, and how to register a business. The best part is that this self-paced online course helps you understand the current market and apply legal rules to business operations.",
    "canonicalUrl": "https://finprov.com/courses/business-law/",
    "metaDescription": "Finprov&#039;s Business Law course gives in-depth understanding about commercial laws related to business. Enhance your career skills in Business Law.",
    "seoTitle": "Business Law Course | Basics of Business Law | Finprov",
    "slug": "business-law",
    "title": "Business Law",
    "category": "Finance",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "7 Weeks",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Do you want to stand out in the corporate world? Understanding Business Law isn't an option; it's a must! For students, business owners, or anyone wanting to ge...",
    "heroDesc": "Learn business law through hands-on training and real-world case studies. Understand legal regulations, contracts, and corporate compliance to make informed business decisions. Boost your career with a short-term course and stay updated on legal best practices!",
    "onlineFees": "Starts at Rs. 6,458",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "Online: Starts at Rs. 6,458",
    "image": "/assets/course-images/business-law.gif"
  },
  {
    "snapshotText": "Master the step-by-step procedures for prevalidation of bank accounts on the Income Tax and GST portals. Learn how to link bank accounts for seamless refund processing, electronic verification, and direct tax compliance.",
    "jobOpportunities": ["Accounts Executive","Tax & Compliance Specialist","Financial Analyst","Audit Associate"],
    "whoIsThisFor": ["Graduates & College Students","Working Professionals seeking skill upgrades","Entrepreneurs & Business Owners","Job seekers targeting finance & accounting roles"],
    "topSkills": ["Practical Concept Application","Real-World Tool & Software Mastery","Industry Best Practices & Compliance","Case Study & Workflow Optimization"],
    "canonicalUrl": "https://finprov.com/courses/pre-validation-of-bank-account/",
    "metaDescription": "Pre-validation of bank account. Learn the bank account Pre-validation process practically with the help of our expert trainer.",
    "seoTitle": "Pre-validation of bank account - Finprov Learning",
    "slug": "prevalidation-of-bank-account",
    "aliases": [
      "pre-validation-of-bank-account"
    ],
    "title": "Prevalidation Of Bank Account",
    "category": "Taxation",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-teal/15 text-teal",
    "duration": "7 Weeks",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Are you now seeking a refund after incorrectly computing your income tax? Come discover how to pre-validate your bank account by guiding industry specialists fo...",
    "heroDesc": "Are you now seeking a refund after incorrectly computing your income tax? Come discover how to pre-validate your bank account by guiding industry specialists for a profitable income tax refund in our course. Learn the step-by-step approach for avoiding typical tax filing errors. With expert help, you can ensure a smooth and hassle-free return. Use the correct financial tactics to maximize your tax advantages!",
    "onlineFees": "Starts at Rs. 6,458",
    "offlineFees": null,
    "highlights": [
      "100% Practical Industry-Aligned Curriculum",
      "Expert CA & Professional Mentorship",
      "Live Software Practice & Portal Case Studies",
      "Dedicated Placement Support & Resume Grooming"
],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "Online: Starts at Rs. 6,458",
    "image": "/assets/course-images/prevalidation-of-bank-account.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Basics of Business Laws Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "The Business Law course is designed to give you a handle on the legal rules that businesses must follow. We'll look at key topics like contracts, corporate law, taxes, and staying compliant. You'll get a good grounding in the basics. This course will help you deal with legal stuff without sweating it, whether you're a student, starting a business, or already working. The Business Law course provides practical insights and real-world applications to help you stay compliant and make informed business decisions while learning the basics of business law.",
    "canonicalUrl": "https://finprov.com/courses/basics-of-business-laws/",
    "metaDescription": "Designed for beginners to entrepreneurs, Basics of Business Laws will give you a comprehensive learning of the laws with expert led sessions.",
    "seoTitle": "Basics of Business Laws - Finprov Learning",
    "slug": "basics-of-business-laws",
    "title": "Basics Of Business Laws",
    "category": "Finance",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "7 Weeks",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Do you want to stand out in the corporate world? Understanding Business Law isn't an option; it's a must! For students, business owners, or anyone wanting to ge...",
    "heroDesc": "Do you want to stand out in the corporate world? Understanding Business Law isn't an option; it's a must! For students, business owners, or anyone wanting to get ahead, knowing the basics of law can really help you make good choices, keep you out of trouble, and set you up for a great career. This course breaks down complicated legal rules into easy-to-understand lessons so you can stay competitive. Don't just run a business; run it the right way – legally and ethically! Sign up today and start building a better future.",
    "onlineFees": "Starts at Rs. 6,458",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "Online: Starts at Rs. 6,458",
    "image": "/assets/course-images/basics-of-business-laws.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","How to verify and update your DIN KYC Course​"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "This course explains how to update DIN KYC completely, including the filing process, the papers needed, and the best ways to ensure verification goes smoothly. You'll learn everything from the law about correctly filling out forms, avoiding mistakes, and ensuring smooth compliance. This course is excellent for students, workers, and business owners who want to stay on top of corporate governance. It provides step-by-step instructions, real-life examples, and expert advice. By the end of this training, you will understand how to update DIN KYC efficiently while staying consistent with regulatory requirements.",
    "canonicalUrl": "https://finprov.com/courses/how-to-verify-and-update-your-din-kyc/",
    "metaDescription": "Learn how to verify and update your DIN KYC. Get a detailed overview of the process from leading finance professionals.",
    "seoTitle": "How to verify and update your DIN KYC- Finprov Learning",
    "slug": "how-to-verify-and-update-your-din-kyc",
    "title": "How To Verify And Update Your DIN KYC",
    "category": "Taxation",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-teal/15 text-teal",
    "duration": "7 Weeks",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Are u ready to master the verification and updation of the DIN KYC course and become an expert in company compliance? The DIN KYC process is an essential step f...",
    "heroDesc": "Are u ready to master the verification and updation of the DIN KYC course and become an expert in company compliance? The DIN KYC process is an essential step for every business director to take to ensure they follow the law and stay out of trouble. Learning DIN KYC can help you stand out whether you want to be an accountant, work in business, or improve your company compliance skills. After taking this course, you can handle the process confidently, which will also help you in your finance and business management job.",
    "onlineFees": "Starts at Rs. 6,458",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "Online: Starts at Rs. 6,458",
    "image": "/assets/course-images/how-to-verify-and-update-your-din-kyc.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","UAE Corporate Tax"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "This course on UAE Corporate Tax focuses on compliance, tax filing, and computation processes. It’s a practical program that helps you handle tax requirements confidently and avoid mistakes or penalties. The course also teaches about registration, free zone regulations, tax exemptions, and case studies. It is designed to be understandable, with explanations based on real-world business situations. The course includes periodic tests to evaluate your understanding of the concepts.",
    "canonicalUrl": "https://finprov.com/courses/uae-corporate-tax/",
    "metaDescription": "Become a UAE Tax Expert! Learn from industry professionals with our UAE Corporate Tax Course in Malayalam. Perfect for finance & accounting professionals!",
    "seoTitle": "Best UAE Corporate Tax Course with Practical Training",
    "slug": "uae-corporate-tax",
    "aliases": [
      "uae-corporate-tax-uae"
    ],
    "title": "UAE Corporate Tax",
    "category": "Gulf",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-navy/10 text-navy",
    "duration": "1-3 Months",
    "mode": "Online & Offline",
    "tool": "UAE Corporate Tax Portal",
    "shortDesc": "Master UAE Corporate Tax ΓÇö learn compliance, tax filing, computation, free zone regulations, and registration in a practical program with real-world case studies.",
    "heroDesc": "Learn about the GCC Tax System with these excellent study tools. Our Malayalam Gulf VAT training will give you new opportunities in the GCC countries. Know that practical experience in the field will undoubtedly present you with fresh and interesting prospects while they adjust to their new value-added tax systems. Through our UAE Corporate Tax course, you will gain knowledge and practical experience in VAT implementations, GCC VAT, VAT registration consulting, and more.",
    "onlineFees": "Starts at Rs. 2,750",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "UAE Corporate Tax Portal",
      "Tax Computation Worksheets"
],
    "hiringPartners": [
      "Gulf-based Companies",
      "UAE Finance Departments",
      "100+ Hiring Partners"
],
    "curriculum": [
      {
            "title": "Module 1: Introduction to UAE Corporate Tax",
            "topics": [
                  "Overview & Purpose of UAE Corporate Tax",
                  "Taxable Persons & Corporate Tax Base",
                  "Taxability of Residents & Non-Residents",
                  "Partnership & Family Foundation Rules"
            ]
      },
      {
            "title": "Module 2: Qualifying & Exempt Entities",
            "topics": [
                  "Qualifying Free Zone Persons",
                  "Exempt Persons & Entities",
                  "Tax Group Provisions",
                  "Government & Public Benefit Entities"
            ]
      },
      {
            "title": "Module 3: Corporate Tax Computation & Filing",
            "topics": [
                  "Corporate Tax Computation Rules",
                  "Tax Return Filing Process",
                  "Record Keeping Requirements",
                  "Key Deadlines & Penalties"
            ]
      },
      {
            "title": "Module 4: Case Studies & Practical Application",
            "topics": [
                  "Real-world Corporate Tax Calculations",
                  "Free Zone Tax Planning",
                  "Compliance Checklists",
                  "Periodic Assessment Tests"
            ]
      }
],
    "fee": "Online: Starts at Rs. 2,750",
    "image": "/assets/course-images/uae-corporate-tax.gif"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Tally Prime"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Finprov’s TallyPrime Training is a practical, job-focused program that helps you build strong accounting skills using widely used industry software. It is designed to make accounting easy to understand and apply in real business situations through TallyPrime.",
    "canonicalUrl": "https://finprov.com/courses/tally-prime-certification/",
    "metaDescription": "Join our Tally Prime Certification Course and master accounting, GST, and compliance with hands-on training. Start your career today!",
    "seoTitle": "Tally Prime Certification Course with Practical Training",
    "slug": "tally-prime-with-certification",
    "aliases": [
 
      "tally-prime-with-certification-uae",     "tally-prime-certification"
    ],
    "title": "Tally Prime With Certification",
    "category": "Taxation",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-teal/15 text-teal",
    "duration": "60+ Hours",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime",
    "shortDesc": "Master Tally Prime from scratch ΓÇö accounting, GST, payroll, inventory management, bank reconciliation, and financial reporting in a practical, job-ready course.",
    "heroDesc": "Whether you are starting your career or upgrading your skills, Finprov’s TallyPrime Training helps you build a strong base in accounting. It prepares you for real work in finance, taxation, and business operations. The training is practical and easy to follow, so you learn by doing rather than just reading concepts. You will practice recording financial transactions, managing inventory, handling taxation, and processing payroll with accuracy. It also helps you understand GST, invoicing, and financial statement preparation in a simple, applied way. Along the way, you get a clear idea of how accounting works in real businesses. By the end of the course, you will be able to use TallyPrime for daily accounting tasks and be ready to step into finance-related roles.",
    "onlineFees": "Starts at Rs. 7,500",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime (Primary Software)",
      "GST & Taxation Simulation Tools"
],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group"
],
    "curriculum": [
      {
            "title": "Module 1: Company Creation, Alteration & Deletion",
            "topics": [
                  "Creating a New Company",
                  "Company Configuration & Settings",
                  "Alteration & Deletion of Company Data"
            ]
      },
      {
            "title": "Module 2: Vouchers & Transactions",
            "topics": [
                  "Types of Accounting Vouchers",
                  "Inventory Vouchers",
                  "Order Vouchers & Payroll Vouchers",
                  "Voucher Entry Best Practices"
            ]
      },
      {
            "title": "Module 3: Cost Category & Cost Center",
            "topics": [
                  "Cost Category Setup & Configuration",
                  "Cost Center Allocation",
                  "Cost Center Reports & Analysis"
            ]
      },
      {
            "title": "Module 4: TDS & GST in Tally Prime",
            "topics": [
                  "TDS Configuration in Tally Prime",
                  "GST Setup & Tax Rates",
                  "GST Purchase & Sales Entries",
                  "GST Returns from Tally Prime"
            ]
      },
      {
            "title": "Module 5: Job Costing & Payroll",
            "topics": [
                  "Job Costing Configuration",
                  "Payroll Master Setup",
                  "Employee Salary Processing",
                  "Payroll Reports & Payslips"
            ]
      },
      {
            "title": "Module 6: Cheque Register & Bank Reconciliation",
            "topics": [
                  "Cheque Register Management",
                  "Bank Statement Import",
                  "Bank Reconciliation Process",
                  "Reconciliation Reports"
            ]
      },
      {
            "title": "Module 7: Branch Accounting",
            "topics": [
                  "Multi-Branch Setup in Tally Prime",
                  "Inter-Branch Transactions",
                  "Consolidated Financial Reports"
            ]
      }
],
    "fee": "Online: Starts at Rs. 7,500",
    "image": "/assets/course-images/tally-prime-with-certification.gif"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Certified Accounting Specialist (CAS-Foundation)"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Finprov’s three-month accounting specialist course provides students with the fundamental knowledge and abilities required for positions in accounting and finance. The course covers essential topics such as GULF VAT, Corporate Tax, GST and Income Tax, Tally prime, MS Office, providing students with the skills they need to succeed in the accounting sector. It focuses on real-world applications, allowing students to obtain hands-on experience while studying essential ideas. This accounting specialist course is your gateway to mastering financial expertise and unlocking international career opportunities. There will be personalized mentorship sessions throughout the course.",
    "canonicalUrl": "https://finprov.com/courses/cas-foundation/",
    "metaDescription": "Join our Accounting Specialist Course to enhance your skills in financial reporting, taxation, and auditing. Gain industry-relevant expertise from finprov",
    "seoTitle": "Accounting Specialist Course | Advance Your Career in Finprov",
    "slug": "certified-accounting-specialist-foundation-course-cas-foundation",
    "aliases": [
      "cas-foundation"
    ],
    "title": "Certified Accounting Specialist-Foundation Course (CAS-Foundation)",
    "category": "Finance",
    "programType": "Executive",
    "badge": "Executive",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "6 Months",
    "mode": "Centre based (Offline)",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in Certified Accounting Specialist-Foundation Course (CAS-Foundation) with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Step into the accounting world with the Certified Accounting Specialist (CAS) Foundation! This accounting specialist course will provide you with the fundamental skills and industry knowledge required to succeed in accounting. With a hands-on approach to learning and expert-led instruction, you'll build the confidence and expertise to take on real-world difficulties. Suppose you're just starting or looking to improve your abilities. In that case, the CAS Foundation will put you on the path to success and introduce you to various fascinating job prospects in the accounting industry.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/certified-accounting-specialist-foundation-course-cas-foundation.gif"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Certified Accounting Specialist (CAS-Executive)​"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "The CAS Executive course equips students with the essential knowledge and skills necessary for positions in finance and accounting. It encompasses critical subjects, including GST,Income Tax, GULF VAT, GULF Corporate Tax, Zoho Books,Tally Prime, and AI integrated Excel, which equip students with the necessary skills to thrive in the accounting industry. The course emphasizes real-world applications, enabling students to acquire practical experience while studying fundamental concepts. These accounting certification courses assist in developing financial expertise and unleashing international career prospects. Personalized mentorship sessions will be conducted throughout the course.",
    "canonicalUrl": "https://finprov.com/courses/cas-executive/",
    "metaDescription": "Explore top Accounting Certification Courses to enhance your skills in financial reporting, taxation, and auditing. Get certified from finprov learning.",
    "seoTitle": "Accounting Certification Courses | Boost Your Career with Finprov",
    "slug": "cas-executive",
    "title": "Certified Accounting Specialist (CAS-Executive)",
    "category": "Finance",
    "programType": "Executive",
    "badge": "Executive",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "6 Months",
    "mode": "Centre based (Offline)",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Take the first step into the accounting field with the Certified Accounting Specialist (CAS) Executive!",
    "heroDesc": "Take the first step into the accounting field with the Certified Accounting Specialist (CAS) Executive! This course will teach you the basic skills and information about the field to do well in accounting. Acquiring knowledge through practical experience and expert instruction will enhance your confidence and provide the skills needed to address real-world challenges. The CAS Executive accounting certification courses will help you get ahead and show you many interesting job opportunities in accounting.",
    "onlineFees": "Starts at Rs. 40000",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "Cloud Accounting",
      "MS Excel",
      "GST Portal"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "Online: Starts at Rs. 40000",
    "image": "/assets/course-images/cas-executive.gif"
  },
  {
    "snapshotText": "Finprov's PGDM in Business Analytics with Logistics combines cutting-edge data science with supply chain management. Master predictive analytics, inventory modeling, Python, Power BI, and global logistics strategy.",
    "jobOpportunities": ["Accounts Executive","Tax & Compliance Specialist","Financial Analyst","Audit Associate"],
    "whoIsThisFor": ["Graduates & College Students","Working Professionals seeking skill upgrades","Entrepreneurs & Business Owners","Job seekers targeting finance & accounting roles"],
    "topSkills": ["Practical Concept Application","Real-World Tool & Software Mastery","Industry Best Practices & Compliance","Case Study & Workflow Optimization"],
    "canonicalUrl": "https://finprov.com/courses/pgdm-business-analytics-course/",
    "metaDescription": "Finprov offers PGDM in Business Analytics with logistics course to make you an expert in accounting. Placement Oriented accounting course",
    "seoTitle": "PG Diploma in Indian and Foreign Accounting",
    "slug": "post-graduate-diploma-in-management-pgdm-in-business-analytics-with-logistics-course",
    "aliases": [
      "pgdm-business-analytics-course"
    ],
    "title": "Post-Graduate Diploma In Management (PGDM) In Business Analytics With Logistics Course",
    "category": "Analytics",
    "programType": "Job Assured",
    "badge": "Flagship",
    "badgeCls": "bg-navy/10 text-navy",
    "duration": "12 Months",
    "mode": "Online & Offline",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in Post-Graduate Diploma In Management (PGDM) In Business Analytics With Logistics Course with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Build your expertise in Post-Graduate Diploma In Management (PGDM) In Business Analytics With Logistics Course with Finprov's industry-aligned practical curriculum. Designed by Chartered Accountants and industry experts to provide hands-on experience, real-world case studies, and career advancement support.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": [
      "100% Practical Industry-Aligned Curriculum",
      "Expert CA & Professional Mentorship",
      "Live Software Practice & Portal Case Studies",
      "Dedicated Placement Support & Resume Grooming"
    ],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/post-graduate-diploma-in-management-pgdm-in-business-analytics-with-logistics-course.jpg"
  },
  {
    "jobOpportunities": ["Accounts Executive","Tax & Compliance Specialist","Financial Analyst","Audit Associate"],
    "whoIsThisFor": ["Graduates & College Students","Working Professionals seeking skill upgrades","Entrepreneurs & Business Owners","Job seekers targeting finance & accounting roles"],
    "topSkills": ["Practical Concept Application","Real-World Tool & Software Mastery","Industry Best Practices & Compliance","Case Study & Workflow Optimization"],
    "snapshotText": "Finprov’s GST + Simulation Software course helps you learn GST easily and grow your career. You can study online or offline with expert teachers at your convenience. The classes are interactive, so you can ask doubts and get answers. We offer 24/7 support through chat, calls, or email. With simulation software, you can practice real GST processes and gain hands-on experience. Practical assignments with software help you improve your skills and get ready for real jobs.",
    "slug": "gst-simulation-software",
    "title": "GST + Simulation Software",
    "category": "Taxation",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-teal/15 text-teal",
    "duration": "1-3 Months",
    "mode": "Online & Offline",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in GST + Simulation Software with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Get courses worth Rs. 12,000 for FREE! 🔥 Only for selected students.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": [
      "100% Practical Industry-Aligned Curriculum",
      "Expert CA & Professional Mentorship",
      "Live Software Practice & Portal Case Studies",
      "Dedicated Placement Support & Resume Grooming"
    ],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/gst-simulation-software.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Gulf Accounting Analyst Programme (GAAP)​"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Up-to-date Generative AI modules Learn 10+ Generative AI tools, including a ChatGPT course Upskill through real projects Gen AI masterclasses by industry experts upGrad Alumni Status Take the First Step Toward Gulf Accounting Success! Understand how accounting works in UAE companies through practical exposure to core financial and tax-related processes. Take your career to the next level!",
    "canonicalUrl": "https://finprov.com/courses/gulf-accounting-analyst-programme-gaap-uae/",
    "metaDescription": "Build a successful career with our Gulf Accounting Analyst Course Training. Learn VAT, payroll, MIS, and more with practical training. Enroll today.",
    "seoTitle": "Gulf Accounting Analyst Course with Practical Trainings",
    "slug": "gulf-accounting-analyst-programme-gaap",
    "aliases": [
 
      "gulf-accounting-analyst",     "gulf-accounting-analyst-programme-gaap-uae"
    ],
    "title": "Gulf Accounting Analyst Programme (GAAP)",
    "category": "Gulf",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-navy/10 text-navy",
    "duration": "3 Months",
    "mode": "Online & Offline",
    "tool": "Tally Prime + UAE VAT Portal",
    "shortDesc": "Take your accounting career to the Gulf in 3 months. Learn Tally Prime, UAE VAT, Practical Accounting, and UAE Corporate Tax for GCC job opportunities.",
    "heroDesc": "Hurry! 665 people have already applied in the last 1 month For enquiries call: Get Started Choose Your Perfect Course Advanced Generative AI Certification Course Master the skills that shape the future of technology with the Advanced Certificate Program in Generative AI, a 5-month generative AI course by upGrad. No Cost EMI Starts at Rs. 6,458 Start Date Starts at Rs. 6,458 Duration 4 Months Download Syllabus Apply Now Hurry! 665 people have already applied in the last 1 month For enquiries call: Get Started Introduction Key Highlights Certificate Instructors Syllabus Success Stories FAQs Introduction to GAAP Course Course Snapshot Hours of Learning 0 + Industry Projects 0 + Accounting Tools 0 + Finprov’s Gulf Accounting Analyst courses are designed to prepare you for real career opportunities in the UAE and GCC job market. This program focuses on building strong practical knowledge and job-ready skills that employers expect from modern accounting professionals. It is not just about learning concepts, but about understanding how accounting works in real business environments. Through expert-led training and hands-on practice, you gain exposure to essential accounting processes and workplace scenarios. The course is structured to help you develop confidence in handling professional tasks and improving your overall accounting ability. You will gain exposure to computerized accounting systems and widely used accounting software such as Tally Prime. This program equips you with the skills and confidence needed to succeed in a competitive job market. Up-to-date Generative AI modules Learn 10+ Generative AI tools, including a ChatGPT course Upskill through real projects Gen AI masterclasses by industry experts upGrad Alumni Status Take the First Step Toward Gulf Accounting Success! Understand how accounting works in UAE companies through practical exposure to core financial and tax-related processes. Take your career to the next level!",
    "onlineFees": "Starts at Rs. 26,550",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "UAE VAT Filing Portal",
      "UAE Corporate Tax Portal",
      "MS Excel"
],
    "hiringPartners": [
      "Gulf-based Accounting Firms",
      "UAE & GCC Companies",
      "Finprov Placement Network"
],
    "curriculum": [
      {
            "title": "Module 1: Practical Accounting",
            "topics": [
                  "Practical Accounting Introduction",
                  "Accounting Terms & Cycle",
                  "Source Documents",
                  "Journal Entry & Ledger Accounts",
                  "Trial Balance & Financial Statements",
                  "Bank Reconciliation"
            ]
      },
      {
            "title": "Module 2: Tally Prime",
            "topics": [
                  "Company Creation & Configuration",
                  "Vouchers & Inventory",
                  "TDS & GST in Tally Prime",
                  "Payroll & Bank Reconciliation",
                  "Case Study"
            ]
      },
      {
            "title": "Module 3: UAE VAT (Gulf VAT)",
            "topics": [
                  "VAT Registration in GCC",
                  "VAT Rates & Exemptions",
                  "Input Tax Credit & Place of Supply",
                  "Tax Invoice & Credit Notes",
                  "VAT Return Filing",
                  "Record Keeping & Penalties"
            ]
      },
      {
            "title": "Module 4: UAE Corporate Tax",
            "topics": [
                  "Introduction to UAE Corporate Tax",
                  "Taxable Persons & Exempt Entities",
                  "Free Zone Provisions",
                  "Corporate Tax Computation & Filing"
            ]
      }
],
    "fee": "Online: Starts at Rs. 26,550",
    "image": "/assets/course-images/gulf-accounting-analyst-programme-gaap.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Post-Graduate Diploma in Management (PGDM) with ACCA Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "An excellent combination for establishing a career in management and finance is a PGDM with ACCA. While the ACCA concentrates on advanced accounting, auditing, and financial reporting, the PGDM assists you in developing practical management abilities, including leadership, problem-solving, and decision-making. Our diploma in management with ACCA program gives you a combination of technical expertise and strategic thinking, preparing you for essential positions in business and finance. Combining a PGDM's industrial relevance and ACCA's worldwide recognition makes you stand out and allows you to work in domestic and foreign markets.",
    "canonicalUrl": "https://finprov.com/courses/pgdm-with-acca/",
    "metaDescription": "Join FinprovΓÇÖs PG Diploma in Management with ACCA and gain industry-relevant accounting skills through a placement-oriented professional course. Enroll now!",
    "seoTitle": "PG Diploma in Management with ACCA Course | Finprov Learning",
    "slug": "post-graduate-diploma-in-management-pgdm-with-acca-course",
    "aliases": [
      "pgdm-with-acca"
    ],
    "title": "Post-Graduate Diploma In Management (PGDM) With ACCA Course",
    "category": "Finance",
    "programType": "Job Assured",
    "badge": "Flagship",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "12 Months",
    "mode": "Online & Offline",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in Post-Graduate Diploma In Management (PGDM) With ACCA Course with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Are you interested in advancing your career with a Post-graduate diploma in management? This two-year diploma in management with ACCA program helps you build your managerial knowledge and leadership skills. The program integrates theory with practice. While enrolled in the program, you will gain practical insight through internships, real-life case studies, and doing live projects. This diploma in management with ACCA course commences many career paths that span different industries and establishes your competitive advantage in the corporate setting.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Nerolac",
      "Yes Bank"
],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/post-graduate-diploma-in-management-pgdm-with-acca-course.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Zoho Books Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Finprov’s Zoho Books course offers in-depth training on one of the leading accounting platforms in the industry. With its powerful cloud-based functionality, Zoho Books enables seamless accounting access from anywhere worldwide. While alternatives like QuickBooks Online are available, Zoho Books stands out for its ability to transform accounting practices and improve efficiency. This course will guide you through all aspects of the software, from basic features to advanced functions, helping you tackle real-world job challenges and enhancing your overall accounting proficiency.",
    "canonicalUrl": "https://finprov.com/courses/zoho-books/",
    "metaDescription": "Learn Zoho Books training through online or offline classes at Finprov Learning. Get practical accounting training and real-world experience. Join now.",
    "seoTitle": "Zoho Books Training Online and Offline | Finprov Learning",
    "slug": "zoho-books",
    "aliases": [
      "zoho-books-uae"
    ],
    "title": "Zoho Books",
    "category": "Taxation",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-teal/15 text-teal",
    "duration": "1-3 Months",
    "mode": "Online & Offline",
    "tool": "Zoho Books",
    "shortDesc": "Master Zoho Books ΓÇö the leading cloud accounting software. Learn invoicing, GST, payroll, bank reconciliation, and multi-currency management for modern businesses.",
    "heroDesc": "Enhance your career in accounting and finance with comprehensive training in Zoho Books, a leading cloud accounting software. Gain essential skills highly valued in the industry, empowering you to stay ahead in a fast-evolving digital landscape. Through focused, short-term courses, you'll master the tools and techniques that will take your expertise to new heights. Invest in your professional growth today and equip yourself with the knowledge needed to excel in the modern accounting world.",
    "onlineFees": "Online FeesΓÇï",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Zoho Books (Cloud Accounting Platform)",
      "Zoho Mail",
      "Banking Integrations"
],
    "hiringPartners": [
      "Finprov Hiring Network",
      "Cloud Accounting Firms",
      "SMEs using Zoho Suite"
],
    "curriculum": [
      {
            "title": "Module 1: Introduction & Company Setup",
            "topics": [
                  "Introduction to Zoho Books Online",
                  "Company File Setup & Account Settings",
                  "GST Configuration",
                  "Chart of Accounts Setup"
            ]
      },
      {
            "title": "Module 2: Banking & Purchase Module",
            "topics": [
                  "Banking Integration & Bank Feeds",
                  "Vendor Creation & Purchase Orders",
                  "Bills & Recurring Bills",
                  "Vendor Credits & Payment Processing"
            ]
      },
      {
            "title": "Module 3: Items & Inventory",
            "topics": [
                  "Items Module Setup",
                  "Inventory Adjustment",
                  "Price List Management",
                  "Stock Tracking"
            ]
      },
      {
            "title": "Module 4: Sales Module",
            "topics": [
                  "Customer Setup & Invoicing",
                  "Sales Orders & Recurring Invoices",
                  "Customer Credits & Payments Received",
                  "Sales Reports"
            ]
      },
      {
            "title": "Module 5: Accounting & Compliance",
            "topics": [
                  "TDS Management in Zoho Books",
                  "Users & Roles Configuration",
                  "Multicurrency & Exchange Rate",
                  "Budgeting & Financial Reports",
                  "Branch Management"
            ]
      },
      {
            "title": "Module 6: Advanced Settings & Case Study",
            "topics": [
                  "Reminders & Customization",
                  "Online Payments Setup",
                  "Automations & Custom Modules",
                  "Payroll & Bank Reconciliation",
                  "Practical Case Study"
            ]
      }
],
    "fee": "Contact Finprov for updated fee details",
    "image": "/assets/course-images/zoho-books.gif"
  },
  {
    "snapshotText": "Finprov's International Business Accounting Professional (IBAP) program equips accounting professionals with global accounting standards, IFRS principles, Gulf VAT, US GAAP concepts, and multi-currency bookkeeping.",
    "jobOpportunities": ["Accounts Executive","Tax & Compliance Specialist","Financial Analyst","Audit Associate"],
    "whoIsThisFor": ["Graduates & College Students","Working Professionals seeking skill upgrades","Entrepreneurs & Business Owners","Job seekers targeting finance & accounting roles"],
    "topSkills": ["Practical Concept Application","Real-World Tool & Software Mastery","Industry Best Practices & Compliance","Case Study & Workflow Optimization"],
    "slug": "international-business-accounting-professional-ibap",
    "title": "International Business Accounting Professional (IBAP)",
    "category": "Finance",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "4 Months",
    "mode": "Online Live",
    "tool": "Tally Prime + SAP S/4HANA + MS Excel + GST Simulation",
    "shortDesc": "Discover your full potential with the IBAP course! Gain expert-level business accounting and taxation expertise, including Gulf VAT and UAE Corporate Tax.",
    "heroDesc": "Discover your full potential with the IBAP course! Gain expert-level business accounting and taxation expertise, and propel your career to new heights. This professional business accountant course is a comprehensive online curriculum designed to serve as a foundation for anyone looking to begin a successful career in accounting and finance. The course focuses on corporate finance, financial statement analysis, and investment strategies, preparing individuals to manage complicated financial operations. This course will give you the skills needed to succeed in accounting and taxation, including Gulf VAT and UAE Corporate Tax, helping you advance your career.",
    "onlineFees": "Starts at Rs. 22,500",
    "offlineFees": null,
    "highlights": [
      "60+ Hours of Learning with 6+ Industry Projects",
      "1+ GenAI Tool integrated for modern accounting",
      "100% Placement Assistance ΓÇö 1000+ Placed Students, 90% Placement Rate, 100+ Hiring Partners",
      "Covers Indian Accounting, GST, Income Tax, Gulf VAT & UAE Corporate Tax",
      "SAP S/4HANA basics included",
      "Placement training with mock interviews & LinkedIn research",
      "Available in English & Malayalam (Online Live)",
      "Expected salary range: Γé╣2.5 LPA ΓÇô Γé╣7 LPA"
],
    "tools": [
      "Tally Prime",
      "SAP S/4HANA (Basics)",
      "MS Excel",
      "MS Word",
      "MS PowerPoint",
      "GST Simulation Software",
      "ESI & EPF Government Portals",
      "GenAI Tools (ChatGPT)"
],
    "hiringPartners": [
      "100+ Hiring Partners",
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power"
],
    "curriculum": [
      {
            "title": "Module 1: Practical Accounting",
            "topics": [
                  "Practical Accounting Introduction",
                  "Accounting Terms & Cycle",
                  "Source Documents",
                  "Trial Balance & Adjustments",
                  "Financial Statements",
                  "Tax Accounting",
                  "Bank Reconciliation"
            ]
      },
      {
            "title": "Module 2: Tally Prime with Case Study",
            "topics": [
                  "Company Creation, Alteration & Deletion",
                  "Vouchers & Point of Sale (POS)",
                  "Cost Category & Cost Center",
                  "TDS & GST in Tally",
                  "Manufacturing & BOM",
                  "Multi-Currency & Job Costing",
                  "Payroll, Cheque Register & Bank Reconciliation",
                  "Branch Accounting",
                  "Case Study"
            ]
      },
      {
            "title": "Module 3: MS Office",
            "topics": [
                  "MS Excel: Introduction, Formatting, Functions & Formulas, Pivot Table, Hyperlink, Index & Match, Depreciation, EMI, Data Validation, Subtotal & Macros",
                  "MS Word: Tables, Charts, SmartArt, Mail Merge, Template Creation",
                  "MS PowerPoint: Design, Transitions, Animations, Slideshow"
            ]
      },
      {
            "title": "Module 4: Income Tax & TDS Filing",
            "topics": [
                  "Introduction to Income Tax",
                  "Assessee & Types of Assessee",
                  "Persons & Tax Rates",
                  "TDS Significance & Applicability",
                  "TDS Due Dates, Form 26AS, Form 16 & Form 16A",
                  "Residential Status",
                  "TDS Sections & Online TDS Filing",
                  "TCS (Tax Collected at Source)",
                  "Advance Tax ΓÇö Applicability, Computation & Interest"
            ]
      },
      {
            "title": "Module 5: GST (Goods & Services Tax)",
            "topics": [
                  "Basics of GST & Supply",
                  "Place of Supply & Value of Supply",
                  "Input Tax Credit (ITC)",
                  "Credit Note & Debit Note",
                  "Invoicing & Composition Scheme",
                  "QRMP Scheme",
                  "E-way Bill & E-invoicing",
                  "GST Returns",
                  "Advanced GST with Simulation Software"
            ]
      },
      {
            "title": "Module 6: Basics of SAP",
            "topics": [
                  "SAP & ERP Overview",
                  "History of SAP",
                  "Introduction to SAP S/4HANA",
                  "SAP Navigation",
                  "Basic Configuration Settings",
                  "Basics of G/L Accounting",
                  "G/L Line Item Display"
            ]
      },
      {
            "title": "Module 7: ESI & PF Filing",
            "topics": [
                  "ESI Applicability, Benefits & Contribution",
                  "ESI Simulation",
                  "EPF Introduction & Applicability",
                  "EPF Contribution Rates & Breakups",
                  "UAN Activation & Due Dates",
                  "Documents Required for ESI/EPF Registration"
            ]
      },
      {
            "title": "Module 8: Gulf VAT",
            "topics": [
                  "VAT Registration in Gulf Region",
                  "VAT Rates & Exemptions",
                  "Place of Supply & Input Tax Credit",
                  "Import Reverse Charge Mechanism & Export",
                  "Tax Invoice & Tax Credit Note",
                  "Designated Zone Provisions",
                  "Accounting Entries, Return Filing & Penalties"
            ]
      },
      {
            "title": "Module 9: UAE Corporate Tax",
            "topics": [
                  "Introduction & Overview of Corporate Tax",
                  "Taxability of Residents & Non-Residents",
                  "Partnership and Family Foundation",
                  "Tax Group & Exempt Persons",
                  "Freezone Person",
                  "CT Calculation, Tax Return & Record Keeping"
            ]
      },
      {
            "title": "Module 10: Placement Training",
            "topics": [
                  "Ice Breaking & Self Introduction SOP",
                  "LinkedIn Research & Job Portal Navigation",
                  "Resume Building",
                  "Foundational English & Communication Skills",
                  "Time Management & Mock Interviews",
                  "Final Revision and Corrections"
            ]
      }
],
    "fee": "Online: Starts at Rs. 22,500 | No-Cost EMI Available",
    "image": "/assets/course-images/international-business-accounting-professional-ibap.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Postgraduate Diploma in Business Accounting and Taxation (PGBAT) course​"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Finprov’s business accounting and taxation course helps learners to acquire proper knowledge of accounting and taxation. This course is an excellent choice for professionals or recent commerce graduates who want to explore their knowledge of tax compliance and related facts. This course allows students to study with case studies, live simulations, and projects. It helps students gain many job-oriented skills that will be useful in future jobs. It introduces students to industry-relevant tools, including SAP FICO and advanced Excel.",
    "canonicalUrl": "https://finprov.com/courses/pg-diploma-in-business-accounting-and-taxation-course-pgbat/",
    "metaDescription": "Advance your accounting career with the Business Accounting and Taxation Course and gain professional certification to stand out in the competitive job market.",
    "seoTitle": "Diploma in Business Accounting and Taxation Course | Finprov",
    "slug": "pg-diploma-in-business-accounting-and-taxation-course-pgbat",
    "title": "PG Diploma In Business Accounting And Taxation Course (PGBAT)",
    "category": "Finance",
    "programType": "Job Assured",
    "badge": "Flagship",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "9 Months",
    "mode": "Online & Offline",
    "tool": "Tally Prime + SAP FICO + Zoho Books + QuickBooks + Sage 50",
    "shortDesc": "Advance your career in 9 months. Master accounting, taxation, GST, SAP FICO, IFRS, and Gulf VAT with 380+ hours of practical training.",
    "heroDesc": "Advance your career with the Postgraduate Diploma in Business Accounting and Taxation (PGBAT) course. Learn essential accounting, taxation, and financial management skills to excel in the industry. It is a job-oriented course offering 100% placement assistance. It provides real-world experience, so students who complete it can earn high salaries. Students who take this course will thoroughly understand financial operations in India and worldwide. After finishing this business accounting and taxation course, they also have several internship opportunities.",
    "onlineFees": "Starts at Rs. 53,100",
    "offlineFees": "Starts at Rs. 73,750",
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "SAP FICO / SAP S/4HANA FI",
      "Zoho Books",
      "MS Office (Excel, Word, PowerPoint)",
      "QuickBooks",
      "Sage 50",
      "GST Simulation Software",
      "Generative AI Tools (ChatGPT, 10+)"
],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "IBM",
      "Hi-Lite",
      "Malabar Gold & Diamonds",
      "TATA Power",
      "VKC Group",
      "Yes Bank",
      "Nerolac",
      "Nippon Toyota",
      "Team Thai",
      "Lazza",
      "myG",
      "Lulu Group"
],
    "curriculum": [
      {
            "title": "Module 1: Practical Accounting",
            "topics": [
                  "Practical Accounting Introduction",
                  "Accounting Terms & Cycle",
                  "Source Documents",
                  "Journal Entry & Ledger Accounts",
                  "Trial Balance & Adjustments",
                  "Financial Statements",
                  "Tax Accounting",
                  "Bank Reconciliation"
            ]
      },
      {
            "title": "Module 2: Tally Prime with Case Studies",
            "topics": [
                  "Company Creation, Alteration & Deletion",
                  "Vouchers & Point of Sale (POS)",
                  "Cost Category & Cost Center",
                  "TDS & GST in Tally",
                  "Manufacturing & BOM",
                  "Multi-Currency & Job Costing",
                  "Payroll & Cheque Register",
                  "Branch Accounting",
                  "Case Study"
            ]
      },
      {
            "title": "Module 3: Goods and Services Tax (GST)",
            "topics": [
                  "Basics of GST & Supply",
                  "Place of Supply & Value of Supply",
                  "Input Tax Credit (ITC)",
                  "Credit Note & Debit Note",
                  "Invoicing & Composition Scheme",
                  "QRMP Scheme",
                  "E-way Bill & E-invoicing",
                  "GST Returns",
                  "Advanced GST with Simulation Software"
            ]
      },
      {
            "title": "Module 4: Income Tax",
            "topics": [
                  "Introduction to Income Tax",
                  "Assessee & Tax Rates",
                  "TDS Significance & Due Dates",
                  "Form 26AS, Form 16 & Form 16A",
                  "Residential Status",
                  "TDS Sections & TDS Filing",
                  "TCS (Tax Collected at Source)",
                  "Advance Tax ΓÇö Applicability & Computation"
            ]
      },
      {
            "title": "Module 5: MS Office",
            "topics": [
                  "MS Excel: Introduction, Formatting, Functions & Formulas, Pivot Table, Index & Match, Depreciation, EMI, Data Validation, Subtotal & Macros",
                  "MS Word: Tables, Charts, SmartArt, Mail Merge, Template Creation",
                  "MS PowerPoint: Design, Transitions, Animations, Slideshow"
            ]
      },
      {
            "title": "Module 6: Business Law",
            "topics": [
                  "Different Legal Entities",
                  "Companies Act Overview",
                  "Company Directors & Director Identification Number (DIN)",
                  "Practical Application"
            ]
      },
      {
            "title": "Module 7: SAP FICO",
            "topics": [
                  "SAP FICO Introduction",
                  "Basic Configuration Settings",
                  "General Ledger Accounting",
                  "Accounts Payable & Accounts Receivable",
                  "House Bank & Automatic Payment Program",
                  "Dunning Letter & Multicurrency",
                  "Tax on Purchase and Sales",
                  "FSV & Controlling"
            ]
      },
      {
            "title": "Module 8: ESI, PF & PT",
            "topics": [
                  "ESI Applicability, Benefits & Contribution Breakup",
                  "ESI Simulation",
                  "EPF Introduction & Applicability",
                  "EPF Contribution Rates & Breakups",
                  "UAN Activation",
                  "Due Dates & Records Maintenance"
            ]
      },
      {
            "title": "Module 9: Language Lab",
            "topics": [
                  "Professional English Introduction",
                  "Pronunciations and Phonetics",
                  "Basics of Grammar",
                  "Assignments & Worksheets"
            ]
      },
      {
            "title": "Module 10: Zoho Books",
            "topics": [
                  "Introduction to Zoho Books Online",
                  "Company File Setup & GST Settings",
                  "Chart of Accounts & Banking",
                  "Purchase & Sales Module",
                  "TDS in Zoho Books",
                  "Users & Roles",
                  "Multicurrency & Exchange Rate",
                  "Budgeting, Reports & Branches",
                  "Payroll & Bank Reconciliation",
                  "Case Study"
            ]
      },
      {
            "title": "Module 11: Auditing",
            "topics": [
                  "Nature, Objectives & Scope of Auditing",
                  "Types of Audit",
                  "Audit Planning",
                  "Audit Sampling, Documentation & Evidence",
                  "Audit of Items in Financial Statements",
                  "Audit Report"
            ]
      },
      {
            "title": "Module 12: Management Information System (MIS)",
            "topics": [
                  "Basics of MIS",
                  "Financial Statements Analysis",
                  "Important Excel Tools for MIS Preparation",
                  "Goal Seek Analysis",
                  "Scenario Manager",
                  "Sensitivity Analysis"
            ]
      },
      {
            "title": "Module 13: Gulf VAT",
            "topics": [
                  "VAT Registration in Gulf Region",
                  "VAT Rates & Exemptions",
                  "Place of Supply",
                  "Input Tax Credit",
                  "Import Reverse Charge Mechanism",
                  "Export Regulations",
                  "Tax Invoice & Tax Credit Note",
                  "Designated Zone",
                  "Accounting Entries for VAT",
                  "Filing Returns & Record Keeping"
            ]
      },
      {
            "title": "Module 14: Professional Skills",
            "topics": [
                  "Professional Skills & Interview Preparation",
                  "How to Create a Resume/CV",
                  "Mock Interviews"
            ]
      },
      {
            "title": "Module 15: QuickBooks",
            "topics": [
                  "Setting Up Company Profile",
                  "Managing Accounts & Recording Transactions",
                  "Bank Account Reconciliation",
                  "Invoicing & Managing Receivables",
                  "Tracking Expenses & Managing Payables",
                  "Payroll, Tax Advice & Financial Reports"
            ]
      },
      {
            "title": "Module 16: Sage 50",
            "topics": [
                  "Introduction to Sage 50",
                  "Chart of Accounts",
                  "Customer & Supplier Accounts",
                  "Cash Flow & Budgeting",
                  "Bill of Materials (BOM)",
                  "Remittances",
                  "Tax Treatments & Payroll"
            ]
      },
      {
            "title": "Module 17: IFRS (International Financial Reporting Standards)",
            "topics": [
                  "Introduction to IFRS",
                  "IFRS 15 ΓÇö Revenue Recognition",
                  "IAS 7 ΓÇö Cash Flow Statement",
                  "IAS 16 ΓÇö Fixed Assets"
            ]
      }
],
    "fee": "Online: Starts at Rs. 53,100 | Offline: Starts at Rs. 73,750",
    "image": "/assets/course-images/pg-diploma-in-business-accounting-and-taxation-course-pgbat.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Gulf VAT Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "At present VAT is mandatory in many GCC countries. This makes a high demand to learn about VAT and gain practical knowledge. Finprov’s Gulf VAT course offers both practical and theory classes. The course is designed to help learners stay ahead and improve their skills. If you want to build a career in Gulf countries, this course is a great way to boost your qualifications and get better job opportunities. By joining our Gulf VAT course, you will learn the skills needed to grow your business or get a great job in accounting.",
    "canonicalUrl": "https://finprov.com/courses/gulf-vat/",
    "metaDescription": "Looking for a Gulf VAT course? Get hands-on Gulf VAT training covering rules, filing, and compliance to boost your career. Enroll now.",
    "seoTitle": "Gulf VAT Course | Learn VAT with Finprov Learning",
    "slug": "gulf-vat",
    "title": "Gulf VAT",
    "category": "Gulf",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-navy/10 text-navy",
    "duration": "1-3 Months",
    "mode": "Online & Offline",
    "tool": "Tally Prime + GST/VAT Portal",
    "shortDesc": "Master Gulf VAT regulations, tax return filing, and compliance processes. Build a career in GCC countries with practical VAT training.",
    "heroDesc": "Boost your expertise with our Gulf VAT course. Gain in-depth knowledge of VAT regulations, tax return management, and compliance processes to ensure smooth business operations and stay competitive in the industry.",
    "onlineFees": "Starts at Rs. 3,500",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "VAT Portal / GCC Tax Filing Systems"
],
    "hiringPartners": [
      "Gulf-based Accounting Firms",
      "GCC Corporate Finance Departments",
      "100+ Hiring Partners"
],
    "curriculum": [
      {
            "title": "Module 1: VAT Fundamentals",
            "topics": [
                  "Introduction to VAT in GCC Countries",
                  "VAT Registration Procedures",
                  "Applicable VAT Rates & Exemptions"
            ]
      },
      {
            "title": "Module 2: Supply & ITC Rules",
            "topics": [
                  "Concept of Supply & Place of Supply",
                  "Value of Supply",
                  "Input Tax Credit (ITC) Recovery",
                  "Import Reverse Charge Mechanism (RCM)",
                  "Export Regulations & Zero Rating"
            ]
      },
      {
            "title": "Module 3: Tax Invoicing & Documentation",
            "topics": [
                  "Tax Invoice Requirements & Content",
                  "Tax Credit Note Formatting",
                  "Designated Zone Provisions",
                  "Accounting Entries for VAT"
            ]
      },
      {
            "title": "Module 4: VAT Returns & Compliance",
            "topics": [
                  "Procedure for Filing VAT Returns",
                  "Record Keeping Rules",
                  "Penalties for Non-Compliance",
                  "Practical Filing Exercises"
            ]
      }
],
    "fee": "Online: Starts at Rs. 3,500",
    "image": "/assets/course-images/gulf-vat.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","SAP S/4 HANA MM Course​"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Our SAP MM course is a 2-month program designed to help you learn in a simple, practical way. You will cover key topics like master data management, purchasing, inventory control, material planning, and vendor management. The course includes hands-on sessions where you can practice real business scenarios using SAP.",
    "slug": "sap-s-4hana-mm-materials-management",
    "aliases": [
 
      "sap-mm-material-management",     "sap-s-4hana-mm-materials-management-uae"
    ],
    "title": "SAP S/4HANA MM (Materials Management)",
    "category": "Analytics",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-navy/10 text-navy",
    "duration": "1-3 Months",
    "mode": "Online & Offline",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in SAP S/4HANA MM (Materials Management) with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Start your journey in supply chain and procurement with our SAP S/4HANA course in Dubai. Learn how to manage materials, handle purchasing, and track inventory in a simple and practical way. The course includes real examples and hands-on practice to help you understand how things work in real businesses. With expert guidance, you will build useful skills that improve your confidence and job opportunities in procurement and supply chain roles across different industries.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "Big 4 Partner Firms"
    ],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/sap-s-4hana-mm-materials-management.gif"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Certification in MS Office​"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Finprov’s Microsoft Office course is carefully designed with expert guidance to build both core knowledge and practical skills. It suits both beginners and professionals who want to improve their day-to-day work efficiency. This MS Office certification provides a complete understanding of Word, Excel, and PowerPoint. You will use key business computer applications, perform real tasks, and create structured documents, accurate spreadsheets, and clear presentations for professional environments.",
    "slug": "ms-office-certification-course",
    "title": "MS Office Certification Course",
    "category": "Analytics",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-navy/10 text-navy",
    "duration": "1-3 Months",
    "mode": "Online & Offline",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in MS Office Certification Course with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Get better at your everyday office work with our MS Office course. Learn how to use Excel, Word, and PowerPoint simply and easily.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "Big 4 Partner Firms"
    ],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/ms-office-certification-course.gif"
  },
  {
    "jobOpportunities": ["Business Accounting Specialist","Taxation Executive","Accounts Officer","Audit Assistant"],
    "whoIsThisFor": ["Commerce Graduates & College Students","Working Accountants seeking skill upgrades","Career Switchers entering finance","Job Seekers targeting accounting roles"],
    "topSkills": ["Practical Business Accounting & Bookkeeping","GST & Income Tax Compliance","Tally Prime & SAP FICO Hands-on","MS Excel for Financial Reporting","ESI & EPF Calculations"],
    "snapshotText": "Unlock our Business Accounting Specialist Program to start a safe and rewarding accounting career. This Business Accounting course, with its 100% placement help, is crucial in today's workplace because it gives students the tools they need for their future careers. The course emphasizes hands-on training, giving students practical experience in business law, SAP FICO, Tally Prime, GST, income tax, MS Excel, ESI & PF, and accounting.\n\nThis business accounting online course also emphasizes developing well-rounded people by including specialized sessions led by professionals to improve soft skills. Candidates from various backgrounds, including students, working professionals, and those wishing to return to the workforce, are encouraged to apply to this Business Accounting course. After completing this program, candidates can easily land well-paying jobs in the corporate sector, opening up a world of endless prospects.",
    "slug": "business-accounting-specialist-program-basp",
    "title": "Business Accounting Specialist Program (BASP)",
    "category": "Finance",
    "programType": "Executive",
    "badge": "Executive",
    "badgeCls": "bg-gold/15 text-navy",
    "duration": "7 Weeks",
    "mode": "Online & Offline",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build a solid foundation in business accounting with the BASP Course.",
    "heroDesc": "Build a solid foundation in business accounting with the BASP Course. Completing this business accounting course is the first step toward a successful accounting profession with five relevant certificates. Get in touch with us right now to find out how you can set yourself apart from other candidates and build a reliable and safe accounting career.",
    "onlineFees": "Starts at Rs. 77290",
    "offlineFees": null,
    "highlights": ["100% Placement Assistance","5 Relevant Certifications","Practical Hands-on Simulation","Expert CA Mentorship","Flexible Learning Options"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "Big 4 Partner Firms"
    ],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "Online: Starts at Rs. 77290",
    "image": "/assets/course-images/business-accounting-specialist-program-basp.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","PPC Specialist Program​"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Finprov offers the PPC Specialist Course, a two-month course covering the overall concepts of PPC advertising. Our Program also covers Inbound marketing, Influencer marketing, Google Ads, and social media advertisements, allowing you to understand how to implement PPC strategies thoroughly. Our PPC Specialist Program helps you get certified in Google Adwords and PPC advertising. We provide PPC training for both graduates and professionals. Our online and offline methods are designed to give flexible learning to learners. With the best faculties and live training, the PPC Course allows learners to become experts in the field.",
    "canonicalUrl": "https://finprov.com/courses/ppc-specialist-program-uae/",
    "metaDescription": "Start your career with PPC specialist program in the UAE. Learn Google Ads, keyword research, different strategies, and more with practical training. Join now!",
    "seoTitle": "Professional PPC Specialist Program with Placement Support",
    "slug": "ppc-specialist-program",
    "aliases": [
      "ppc-specialist-program-uae"
    ],
    "title": "PPC Specialist Program",
    "category": "Marketing",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-destructive/10 text-destructive",
    "duration": "2 Months",
    "mode": "Online & Offline",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Master the art of paid advertising with our PPC course.",
    "heroDesc": "Master the art of paid advertising with our PPC course. Learn how to create high-performing ad campaigns, manage budgets effectively, and analyze key metrics for better results. Finprov’s PPC Specialist Program is for anyone who wants to excel at pay-per-click advertising. It provides you with skills such as Social media advertising on platforms such as Facebook, Instagram, Twitter, and LinkedIn, along with the best strategies to increase your social media presence. Our experienced faculty members provide valuable insights and guidance throughout the program, ensuring you become a PPC expert.",
    "onlineFees": "Starts at Rs. 20000",
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "Big 4 Partner Firms"
    ],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "Online: Starts at Rs. 20000",
    "image": "/assets/course-images/ppc-specialist-program.webp"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","SEO Specialist Program"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "Finprov’s SEO Course is a two-month course that covers all the necessary aspects of search engine optimization, including digital marketing. It provides knowledge about on-page and off-page SEO, technical SEO, local SEO, and SEO for e-commerce. You'll gain hands-on experience. Additionally, you'll learn to perform keyword research, build quality backlinks, and apply advanced SEO techniques to improve website visibility. Our SEO training in Kochi covers all SEO topics. The valuable certification given at the end of the course helps learners get better career opportunities in the job market. Join us for hands-on projects and mentorship that can help you achieve a rewarding career as an SEO Specialist and help you excel in digital marketing.",
    "canonicalUrl": "https://finprov.com/courses/seo-specialist-course-uae/",
    "metaDescription": "Kickstart your career with our SEO Specialist course with practical training. Learn on-page, off-page, technical SEO and more with placement support. Join now.",
    "seoTitle": "Job-Oriented SEO Specialist Course with Placement Support",
    "slug": "seo-specialist-course",
    "aliases": [
      "seo-specialist-course-uae"
    ],
    "title": "SEO Specialist Course",
    "category": "Marketing",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-destructive/10 text-destructive",
    "duration": "1-3 Months",
    "mode": "Online & Offline",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Build your expertise in SEO Specialist Course with Finprov's industry-aligned practical curriculum.",
    "heroDesc": "Enhance your skills with our SEO Specialist Program. Learn to optimize websites, analyze search engine performance, and implement effective SEO strategies to increase online visibility and grow your career in digital marketing. Finprov’s SEO Course gives you adequate knowledge in the digital marketing sector. Our online and offline class methods enable students to study at their convenience. Become an SEO expert by joining our team!",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "Big 4 Partner Firms"
    ],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/seo-specialist-course.gif"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","Advanced Tally and Gulf VAT Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "If you want to improve your accounting skills and get a better job, the Advanced Tally Prime and Gulf VAT training is a great option. You’ll learn about advanced Tally features such as GST, payroll, and inventory, plus how VAT works in Gulf countries. The course includes hands-on practice and real examples, so you can develop expertise that employers are looking for. Whether you want to work in India or the Middle East, this advanced tally prime and gulf VAT training will give you the confidence and skills to start your accounting job without any problems.",
    "slug": "advanced-tally-prime-and-gulf-vat-courses-finprov-learning",
    "aliases": [
      "advanced-tally-prime-and-gulf-vat"
    ],
    "title": "Advanced Tally Prime And Gulf VAT Courses - Finprov Learning",
    "category": "Gulf",
    "programType": "Certification",
    "badge": "Certification",
    "badgeCls": "bg-navy/10 text-navy",
    "duration": "1-3 Months",
    "mode": "Online - Self Paced",
    "tool": "Tally Prime + MS Excel",
    "shortDesc": "Accounting and digital marketing courses equip you with essential skills that employers are seeking today.",
    "heroDesc": "Taking Advanced Tally Prime and Gulf VAT training courses is a good move if you're looking to improve your accounting skills and want to find a job in India or the Gulf region. The Tally Prime course shows you the ropes for using Tally for GST, payroll, and better account handling. And the Gulf VAT course gets you up to speed on how VAT works in places like the UAE and Saudi Arabia. You'll come away with skills you can actually use, which should help you land a job quicker.",
    "onlineFees": null,
    "offlineFees": null,
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Zoho Books"
    ],
    "hiringPartners": [
      "TCS",
      "Accenture",
      "EXL",
      "Big 4 Partner Firms"
    ],
    "curriculum": [
      {
        "title": "Module 1 ΓÇö Foundational Concepts & Principles",
        "topics": [
          "Comprehensive practical overview",
          "Regulatory standards & workflows"
        ]
      },
      {
        "title": "Module 2 ΓÇö Practical Software & Exercises",
        "topics": [
          "Hands-on entry practice & case studies",
          "Live database calculations"
        ]
      },
      {
        "title": "Module 3 ΓÇö Returns, Statutory Compliance & Finalization",
        "topics": [
          "E-filing portal compliance",
          "Report generation & interview readiness"
        ]
      }
    ],
    "fee": "EMI Available",
    "image": "/assets/course-images/advanced-tally-prime-and-gulf-vat-courses-finprov-learning.jpg"
  },
  {
    "jobOpportunities": ["Placement Support","Sign in","Apply Scholarship","International Business Accounting Professional (IBAP) Course"],
    "whoIsThisFor": ["Placement Support","Sign in","Apply Scholarship","Tips Events"],
    "topSkills": ["Support","Support","Support","Support","Tips Events"],
    "snapshotText": "This professional business accountant course is a comprehensive online curriculum designed to serve as a foundation for anyone looking to begin a successful career in accounting and finance. The course focuses on corporate finance, financial statement analysis, and investment strategies, preparing individuals to manage complicated financial operations and giving expert advice services. This professional business accountant course is designed for people who want to excel in finance and tax to stand out in a competitive market. This course will give you the skills needed to succeed in accounting and taxation, helping you advance your career.",
    "canonicalUrl": "https://finprov.com/courses/business-accounting-professional-bap/",
    "metaDescription": "Boost your career in accounting with the Professional Accounting Certification Course, build real-world skills, and get certified for better job prospects.",
    "seoTitle": "Professional Accounting Certification Course(IBAP) | Finprov",
    "slug": "business-accounting-professional-bap",
    "aliases": [
      "bap",
      "bap-course",
      "business-accounting-professional"
    ],
    "title": "Business Accounting Professional (BAP)",
    "category": "Finance",
    "programType": "Certification",
    "badge": "BAP",
    "badgeCls": "bg-teal/15 text-teal border-teal/30",
    "duration": "3 Months",
    "mode": "Online / Offline",
    "tool": "Tally Prime, MS Excel, GST",
    "shortDesc": "Comprehensive training covering fundamental accounting concepts, taxation, Tally Prime, and financial reporting skills.",
    "heroDesc": "Discover your full potential with the IBAP course! Gain expert-level business accounting and taxation expertise, and propel your career to new heights. Equip yourself with the necessary abilities to succeed in the fast-paced world of banking and taxes. Invest in this professional accounting course now!",
    "onlineFees": "Γé╣18,000",
    "offlineFees": "Γé╣24,000",
    "highlights": ["Tips Events","Placement Support","Apply Scholarship","Tips Events","Placement Support","Apply Scholarship"],
    "tools": [
      "Tally Prime",
      "MS Excel",
      "GST Portal",
      "Income Tax Portal"
    ],
    "hiringPartners": [
      "KPMG",
      "PwC",
      "EY",
      "Deloitte",
      "BDO",
      "Grant Thornton"
    ],
    "curriculum": [
      {
        "title": "Module 1: Fundamentals of Accounting",
        "topics": [
          "Journal Entries",
          "Ledger Postings",
          "Trial Balance Preparation",
          "Final Accounts"
        ]
      },
      {
        "title": "Module 2: Tally Prime Mastery",
        "topics": [
          "Company Creation",
          "Voucher Entry",
          "Inventory Management",
          "Financial Reports in Tally"
        ]
      },
      {
        "title": "Module 3: Taxation & Compliance",
        "topics": [
          "GST Overview & Invoicing",
          "GSTR Filing Basics",
          "TDS Fundamentals",
          "E-Way Bills"
        ]
      }
    ],
    "fee": "Γé╣18,000 (Online) / Γé╣24,000 (Offline)",
    "image": "/assets/course-images/business-accounting-professional-bap.webp"
  }
];

export const categories: Category[] = ["Finance", "Taxation", "Analytics", "Marketing", "Gulf"];
export const programTypes: ProgramType[] = ["Job Assured", "Certification", "Executive"];

export const categoryLabels: Record<Category, string> = {
  Finance: "Finance & Accounting",
  Taxation: "Taxation",
  Analytics: "Data Analytics",
  Marketing: "Digital Marketing",
  Gulf: "Gulf Careers",
};

export function getCourseBySlug(slug: string) {
  if (!slug) return undefined;
  const s = slug.toLowerCase();
  return courses.find((c) => 
    c.slug === s || 
    (c.aliases && c.aliases.includes(s)) ||
    c.slug.includes(s) || 
    s.includes(c.slug)
  );
}

export function getRelatedCourses(course: Course, count = 3) {
  const sameCategory = courses.filter((c) => c.slug !== course.slug && c.category === course.category).slice(0, count);
  return sameCategory.length > 0 ? sameCategory : courses.filter((c) => c.slug !== course.slug).slice(0, count);
}
