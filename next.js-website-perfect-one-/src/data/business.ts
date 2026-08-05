export const businessProgramAreas = [
  {
    title: "Digital Skills",
    description: "Our Digital Skills programs help professionals work more efficiently using easy-to-use digital tools, automation, and modern technology. We train participants to use digital platforms confidently, keep information safe, understand business data, and stay up to date in today’s digital world.",
    programs: ["Digital Marketing for Startups", "Cybersecurity Awareness & Data Privacy for Employees", "Data Analytics for Business Decision Making", "MS Office Productivity Suite", "Project Management Tools", "AI Tools for Productivity & Automation", "Generative AI for Business Leaders"],
  },
  {
    title: "Business & Finance",
    description: "Our Business and Finance programs help employees become financially smarter and more confident in their daily work. We teach employees how to use accounting tools, analyze finances, and handle both local and international taxes. With our guidance, professionals can apply financial knowledge to their roles and add real value to everyday business decisions.",
    programs: ["Accounting Software & ERP Training", "Advanced Excel and Financial Modeling", "Corporate Finance & Statutory Compliance", "Indian Accounting Standards-Ind AS", "IFRS & GAAP Compliance", "Taxation and Compliance Updates", "Valuation & Due Diligence", "International Taxation & Transfer Pricing", "Financial Modeling & Analysis", "Finance for Non-Finance Managers", "Finance for Entrepreneurs"],
  },
  {
    title: "Leadership Training",
    description: "Our Leadership Training helps professionals learn the skills and mindset needed to lead teams confidently. We primarily focus on improving strategic thinking, adapting to change, managing people well, and making smart decisions through this training so that leaders can create positive impact in their organizations.",
    programs: ["High-Performance Team Building", "Strategic Leadership & Change Management", "Emotional Resilience & Mental Well-being", "Manager to Leader: First-Time Manager Program", "Creative Problem Solving & Design Thinking", "Agile Project Management & Scrum Practices"],
  },
  {
    title: "Sales & Marketing Excellence",
    description: "Our Sales and Marketing Excellence programs help strengthen the sales force by building strong customer-focused skills. Professionals learn to communicate clearly, manage customer relationships with confidence, work effectively with teams, and follow honest, structured sales approaches that support steady and sustainable business growth. We help sales and marketing teams achieve better results and drive business success.",
    programs: ["Customer Relationship Management (CRM) Tools", "Customer Handling & Sales Psychology", "Emotional Intelligence in Customer Handling", "Compliance & Ethical Selling", "Shop-Floor Communication & Team Cohesion", "Upselling, Cross-Selling & Negotiation Skills"],
  },
  {
    title: "Management Development Programs",
    description: "Our Management Development Programs give managers the training they need to handle today’s business world. We help them think clearly, understand global business and sustainability, use data to make smart decisions, and work well with their teams while helping others grow.",
    programs: ["ESG Reporting & Framework", "Decision Making in a VUCA Environment", "Entrepreneurial Mindset in Global Scenario", "Global Business Strategy & Innovation", "Strategic Thinking, Collaboration & People Development", "Managing Organisational Changes", "People Analytics & Data-Driven HR Decisions"],
  },
] as const;

const programDurations: Record<string, string> = {
  "Digital Marketing for Startups": "8 hours", "Cybersecurity Awareness & Data Privacy for Employees": "6 hours", "Data Analytics for Business Decision Making": "6 hours", "MS Office Productivity Suite": "6 hours", "Project Management Tools": "6 hours", "AI Tools for Productivity & Automation": "8 hours", "Generative AI for Business Leaders": "8 hours",
  "Accounting Software & ERP Training": "6 hours", "Advanced Excel and Financial Modeling": "6 hours", "Corporate Finance & Statutory Compliance": "7 hours", "Indian Accounting Standards-Ind AS": "7 hours", "IFRS & GAAP Compliance": "6 hours", "Taxation and Compliance Updates": "6 hours", "Valuation & Due Diligence": "6 hours", "International Taxation & Transfer Pricing": "6 hours", "Financial Modeling & Analysis": "8 hours", "Finance for Non-Finance Managers": "6 hours", "Finance for Entrepreneurs": "6 hours",
  "High-Performance Team Building": "6 hours", "Strategic Leadership & Change Management": "6 hours", "Emotional Resilience & Mental Well-being": "6 hours", "Manager to Leader: First-Time Manager Program": "6 hours", "Creative Problem Solving & Design Thinking": "7 hours", "Agile Project Management & Scrum Practices": "6 hours",
  "Customer Relationship Management (CRM) Tools": "6 hours", "Customer Handling & Sales Psychology": "6 hours", "Emotional Intelligence in Customer Handling": "6 hours", "Compliance & Ethical Selling": "6 hours", "Shop-Floor Communication & Team Cohesion": "6 hours", "Upselling, Cross-Selling & Negotiation Skills": "6 hours",
  "ESG Reporting & Framework": "6 hours", "Decision Making in a VUCA Environment": "6 hours", "Entrepreneurial Mindset in Global Scenario": "6 hours", "Global Business Strategy & Innovation": "6 hours", "Strategic Thinking, Collaboration & People Development": "6 hours", "Managing Organisational Changes": "6 hours", "People Analytics & Data-Driven HR Decisions": "6 hours",
};

const programsWithOriginalDetailPages = new Set([
  "Digital Marketing for Startups",
  "Cybersecurity Awareness & Data Privacy for Employees",
  "Data Analytics for Business Decision Making",
  "Accounting Software & ERP Training",
  "Advanced Excel and Financial Modeling",
  "Corporate Finance & Statutory Compliance",
  "High-Performance Team Building",
  "Customer Relationship Management (CRM) Tools",
]);

export type BusinessProgramDetail = {
  pageTitle: string;
  expertIntro: string;
  overview: string;
  skills: readonly string[];
  acquiredSkills: readonly string[];
  audience: readonly string[];
  snapshot: string;
  faqs: readonly (readonly [string, string])[];
};

const originalProgramDetails: Record<string, BusinessProgramDetail> = {
  "Digital Marketing for Startups": {
    pageTitle: "Digital Marketing for Startups Program",
    expertIntro: "Learn with guidance from experienced industry professionals who share real insights, offer ongoing support, and help you move confidently toward your career goals.",
    overview: "Ready to understand how startups actually grow using digital marketing? This Digital Marketing for Startups corporate training program helps you build practical, job-ready skills in SEO, social media, paid ads, content marketing, and campaign tracking. Instead of theory, you learn how real startups attract customers, generate leads, and scale faster using digital channels. The program is designed for employees who want to contribute better to marketing and growth decisions, work confidently with digital teams, and add measurable value to the business. If you are looking to upskill in a way that directly impacts startup growth, this corporate training program is built for you!",
    skills: ["Digital Marketing Fundamentals", "Organic Search Strategies", "Inbound-Led Growth", "Influencer and Community Marketing", "Social Media Strategy", "Paid Search and Performance Marketing"],
    acquiredSkills: ["Startup Marketing Basics", "Digital Channel Awareness", "SEO Fundamentals Understanding", "Social Media Execution", "Paid Campaign Awareness", "Content Planning Skills", "Marketing Data Basics", "Campaign Coordination Skills"],
    audience: ["Early-Stage Startups", "Scaling Startup Teams", "Product-Based Companies", "Technology-Driven Firms", "Digital Marketing Organisations", "Small and Medium Enterprises", "Innovation and Growth-Focused Companies"],
    snapshot: "Step into the fast-growing world of digital marketing with skills that today’s companies truly value! Finprov’s Digital Marketing for Startups Corporate training program is created for employees who want to stay relevant and confident in a fast-changing business environment. The program offers practical insights into how digital marketing operates within startups, along with exposure to commonly used tools, workflows, and real workplace scenarios. Led by experienced professionals, the sessions are interactive and designed to deliver clear takeaways that can be applied immediately at work. Don’t miss this opportunity to strengthen your impact and grow with the business!",
    faqs: [
      ["What does this corporate training program cover?", "The program covers key digital marketing areas such as digital marketing basics, SEO awareness, social media marketing, paid advertising concepts, content planning, and campaign understanding, all explained using startup-focused examples."],
      ["Who is this training meant for?", "This program is designed for employees across departments, especially those working with marketing, sales, growth, or business teams in startup or fast-growing organisations."],
      ["Why should companies invest in this training?", "The training helps teams build digital awareness, align better with marketing efforts, and contribute more effectively to growth-focused initiatives within the organisation."],
      ["What will employees actually gain after attending the program?", "Employees gain a clear understanding of how digital marketing works in startup environments and how different tools and activities support business growth."],
      ["Is this program practical or theory-based?", "The program is practical in nature and focuses on real startup scenarios, helping participants understand how digital marketing decisions are made and applied at work."],
    ],
  },
  "Cybersecurity Awareness & Data Privacy for Employees": {
    pageTitle: "CyberSecurity Awareness & Data Privacy Program",
    expertIntro: "Learn from professionals who understand real workplace cyber risks! Gain guidance from experienced experts who share practical insights and clear security practices relevant to everyday work situations.",
    overview: "Learn how to stay safe at work before cyber risks cause real problems! This Cybersecurity Awareness & Data Privacy corporate training program helps employees understand how everyday actions like emails, passwords, file sharing, and online access can impact company and customer data. Instead of technical language, the program focuses on real work situations and simple safety practices. Designed for employees across departments, it builds awareness, responsibility, and safer digital habits at work!",
    skills: ["Cyber Risk Awareness", "Data Privacy Understanding", "Email and Phishing Safety", "Password Protection Practices", "Safe Internet Behaviour", "Workplace Data Handling", "Incident Reporting & Response", "Safe Cloud and File Sharing Practices"],
    acquiredSkills: ["Secure Digital Behaviour", "Threat Recognition Awareness", "Data Protection Responsibility", "Risk Prevention Practices", "Privacy Compliance Awareness", "Incident Response Awareness"],
    audience: ["Corporate Organisations", "Technology-Driven Firms", "Startups and Scaling Companies", "Product-Based Companies", "Financial and Service Firms", "Small and Medium Enterprises"],
    snapshot: "Build confidence at work by understanding cybersecurity and data privacy! Finprov’s Cybersecurity Awareness & Data Privacy program helps employees understand common cyber threats and data protection responsibilities in a clear and simple way. The sessions focus on real office scenarios like phishing emails, unsafe links, weak passwords, and careless data sharing. Learn how to spot unusual activity, avoid common mistakes, and support your team’s security every day. By the end, employees gain confidence and become active protectors of digital safety. Make your workplace cyber-smart with Finprov!",
    faqs: [
      ["What does this corporate training program cover?", "The program covers basic cybersecurity awareness, data privacy concepts, common threats, safe digital practices, and employee responsibilities."],
      ["Who should attend this training?", "Employees across departments, including operations, finance, sales, administration, and management teams!"],
      ["Why should organisations invest in this program?", "Organisations should invest in this program because it helps reduce cyber risks, increase data protection awareness, and build a strong security culture within teams."],
      ["What will employees gain from this training?", "Employees could gain a clear understanding of cyber risks, develop safer work habits, and build confidence in handling digital information responsibly."],
      ["Is this program technical?", "No. The program is non-technical and focuses on awareness, behaviour, and real workplace scenarios!"],
    ],
  },
  "Data Analytics for Business Decision Making": {
    pageTitle: "Data Analytics for Decision Making",
    expertIntro: "Learn more about the experts who will be supporting your learning journey and helping you achieve your career goals.",
    overview: "Take your decision-making skills to the next level with our Data Analytics for Decision Making program. In this program, you will learn how to study data in a simple way. You will understand how to look at information, find useful insights, and use them to make smarter business decisions. You will learn practical methods to notice trends, find new opportunities, and solve problems faster. The program focuses on practical exercises. You will use data in real workplace situations. This helps you understand how analytics works and lets you see the results clearly and quickly. By the end of the program, you will feel more confident. You will be able to make decisions using data. This will help you perform better and create good results for your team and your organization.",
    skills: ["Data Collection & Management", "Data Visualization", "Insight Interpretation", "Trend Analysis", "Process Improvement", "Strategic Decision Making", "Performance Measurement", "Reporting & Dashboards", "Task & Workflow Optimization"],
    acquiredSkills: ["Insight-Driven Decision Making", "Data Interpretation & Analysis", "Reporting and Dashboarding Skills", "Process and Workflow Optimization", "Customer Behavior Insights", "Business Performance Innovation", "Strategic Planning Using Data"],
    audience: ["Technology-driven firms", "Data-focused companies", "Consulting organizations", "Finance and accounting firms", "Marketing and digital agencies", "Operations-led enterprises"],
    snapshot: "Make smarter decisions and achieve more at work with Finprov’s Data Analytics for Decision Making program! This program helps you understand information quickly and choose the right option with confidence. You will learn how to use simple data from daily work and turn it into useful ideas. These ideas will help you take the right actions, support your team, and get better results. You will practice with real work examples. This helps you see how the right data can make work easier, clear your doubts, and help you know what choice to make. By the end, you will feel ready to take the next step. You will make smarter decisions, do your work better, and stand out at your workplace.",
    faqs: [
      ["Who should take this program?", "This program is ideal for employees, team leads, managers, and professionals who want to use data effectively to make smarter decisions and improve outcomes for their team and organization."],
      ["Do I need prior experience in data analytics?", "No prior experience is required. The program is beginner-friendly and designed to help participants gradually build practical skills in analyzing and interpreting data."],
      ["How will this program help me at work?", "You’ll learn how to use data to make informed decisions, streamline processes, and prioritize tasks more effectively. The program also helps you contribute more confidently to team projects and business goals."],
      ["What skills will I gain from this program?", "Participants will gain hands-on skills in data analysis, insight interpretation, reporting, process optimization, and using data to make clear, actionable decisions."],
      ["Can my team benefit from this program?", "Yes. Teams will learn to collaborate more efficiently, base decisions on reliable data, and address real business challenges more effectively, creating stronger results together."],
    ],
  },
  "Accounting Software & ERP Training": {
    pageTitle: "Accounting Software and ERP Training",
    expertIntro: "Acquire practical insights from our leading industry experts, who will support you on your journey to achieve your career goal.",
    overview: "Learn to master Accounting Software and ERP systems with our corporate training program! This program helps employees like you handle real accounting tasks like managing invoices, tracking payments, and generating reports easily and accurately. You will get hands-on practice with software and ERP tools just like in your workplace, so every skill you learn is ready to use immediately. By the end, you will feel confident navigating accounting systems, making smarter decisions, and supporting your team better. You will leave ready to work faster, save time, and make a real impact at your company!",
    skills: ["ERP System Management", "Accounting Software Basics", "Data Analysis and Insights", "Process Automation", "Generating Reports", "Workflow Optimization", "Decision-Making Support", "Customer and Vendor Handling"],
    acquiredSkills: ["Data Management Skills", "Financial Reporting Skills", "Process Automation Skills", "Decision-Making Skills", "Team Collaboration Skills", "System Navigation Skills", "Task Organization Skills", "Accuracy Enhancement Skills"],
    audience: ["Accounting Firms", "Corporate Companies", "Consulting Firms", "Business Enterprises", "Professional Service Firms", "Manufacturing Firms", "IT Service Firms"],
    snapshot: "See how Accounting Software and ERP systems support you in your daily work! This training helps you understand how organized systems guide your work and keep tasks clear and easy to follow. You will feel more confident using system-based processes and working with shared information. As your understanding improves, your work becomes smoother and more dependable. You will also become more careful and aware while handling work data. This confidence helps you manage work better and adjust easily to daily job needs. It gives you the clarity needed to do your role well and grow at work!",
    faqs: [
      ["What is Accounting Software and ERP Training?", "This corporate training program teaches employees how to use accounting software and ERP tools effectively to manage daily tasks, improve accuracy, and support team workflows."],
      ["Who should attend this program?", "It is designed for employees in accounting, finance, and business operations who want to work smarter, handle data efficiently, and contribute confidently to their team."],
      ["What skills will I gain from this training?", "You will learn skills like financial reporting, task organization, process automation, and system navigation to excel in your role."],
      ["How will this training benefit my career?", "Completing the program builds confidence, improves efficiency, and equips you to make better decisions, helping you stand out and grow in your organization."],
      ["Does the program include practical exercises?", "Yes! The training focuses on hands-on practice with real software and ERP systems, allowing you to apply what you learn immediately in the workplace."],
    ],
  },
  "Advanced Excel and Financial Modeling": {
    pageTitle: "Advanced Excel and Financial Modeling",
    expertIntro: "Learn from experienced industry experts who will guide you step by step and help you build the skills needed to reach your career goals.",
    overview: "Level up your work skills with our Advanced Excel & Financial Modeling program! You’ll learn how to manage data smartly, create accurate financial models, and make better decisions with confidence. With hands-on exercises, you’ll practice using Excel on real work scenarios, make meaningful reports, and spot trends that really matter. By the end, you’ll feel more confident, get your work done faster, and make a real difference for your team! Get ready to shine and take charge of your work like never before!",
    skills: ["Data Analysis", "Report Generation", "Workflow Optimization", "Decision Making", "Forecasting & Planning", "Task Automation", "Insight Interpretation", "Financial Modeling"],
    acquiredSkills: ["Report Creation Skills", "Decision-Making Skills", "Trend Analysis Skills", "Forecast Planning Skills", "Spreadsheet Management Skills", "Workflow Improvement Skills", "Problem-Solving Skills"],
    audience: ["Accounting and Finance Firms", "Consulting and Advisory Firms", "Corporate Companies", "Data-Driven Enterprises", "Investment and Banking Firms", "Marketing and Digital Agencies", "Technology and IT Services"],
    snapshot: "Discover how Advanced Excel & Financial Modeling can make your daily tasks easier and more organized! In this program, you will learn simple ways to understand data, keep track of numbers, and make clear reports that your team can trust. This program teaches you how to work smart, finish your work on time, and show your managers neat and correct information. You will learn skills that help you do better than others in your team. You will also handle every project with confidence and do your best work. By the end, you’ll be ready to take on challenges and excel in every project you handle!",
    faqs: [
      ["How will this corporate training program help me at work?", "You’ll learn to handle data efficiently, build financial models, and make decisions that improve team performance and results."],
      ["Will I get practical experience?", "Yes! You’ll work on real data, create reports, and build models you can use in your daily tasks."],
      ["Can I apply these skills immediately?", "Absolutely. Everything you learn is designed to help you work smarter, save time, and support your team effectively."],
      ["Who will benefit the most from this corporate training program?", "Any employee or team member who wants to work smarter, handle data confidently, and make a bigger impact in their role."],
      ["What outcomes can I expect?", "You’ll gain confidence with data, make accurate decisions, create meaningful reports, and become a trusted contributor in your team."],
    ],
  },
  "Corporate Finance & Statutory Compliance": {
    pageTitle: "Corporate Finance, Taxation and Compliance",
    expertIntro: "Learn directly from experienced industry experts who will guide you every step of the way toward achieving your career goals!",
    overview: "Learn the key skills in finance, taxes, and compliance with our Corporate Finance, Taxation & Compliance program. This program explains everything in simple words so you can see how finance, taxes, and rules affect a business. You will get hands-on practice with real work tasks like preparing financial reports, managing taxes, and following company rules. Everything is taught step by step, so you can use it easily at your job. By the end of the program, you will feel confident handling finance and compliance tasks, make better decisions, and become a valuable part of your team.",
    skills: ["Corporate Finance Fundamentals", "Statutory Compliance", "Financial Reporting", "Governance Awareness", "Risk Management", "Working Capital Management", "Compliance Reporting", "Business Decision Support"],
    acquiredSkills: ["Budgeting & Forecasting", "Cash Flow Management", "Expense Control", "Regulatory Filing", "Payroll Handling", "Audit Preparation", "Financial Analysis"],
    audience: ["Corporate Finance Teams", "Accounting Firms", "Finance Professionals", "Business Enterprises", "Compliance Teams", "Managers and Business Leaders"],
    snapshot: "Transform the way you handle finance and compliance with Finprov’s Corporate Finance, Taxation & Compliance program! This program shows you how to handle financial tasks and company rules in a simple, practical way. You’ll learn how to spot problems early, make processes easier, and take smart decisions that help your team and company. With real examples and hands-on practice, you’ll gain skills you can use right away and become a trusted, proactive employee. Take charge of your work, boost your confidence, and make a real difference at your workplace!",
    faqs: [
      ["How will this program boost my confidence at work?", "You can learn to handle finance, taxation, and compliance tasks with clarity so you can make decisions confidently and independently!"],
      ["Can this program help me grow in my career?", "Yes! By mastering practical finance and compliance skills, you become a more valuable and trusted team member."],
      ["Will I be able to apply what I learn immediately?", "Absolutely! The program focuses on real workplace scenarios, so you can use your skills from day one."],
      ["How does this program benefit my team or organization?", "Teams work more efficiently, reduce errors, and support business goals better when members understand finance and compliance well."],
      ["What sets this program apart from other finance programs?", "It’s practical, hands-on, and designed to make everyday finance and compliance tasks easier, not just theoretical knowledge."],
    ],
  },
  "High-Performance Team Building": {
    pageTitle: "High Performance Team Building",
    expertIntro: "Gain insights from leading industry experts who will mentor you and help you succeed in achieving your career aspirations.",
    overview: "Elevate your teamwork and leadership with our High Performance Team Building Program! This program shows you how to help teams to work better together and learn from real-life situations. You will also learn to clearly communicate to the team and gain trust of your team. You will easily be able to face challenges with a positive attitude. By the end, you’ll be able to inspire your team, take initiative, and make every project a success!",
    skills: ["Effective Communication", "Collaboration & Teamwork", "Leadership & Influence", "Problem Solving & Decision Making", "Conflict Resolution", "Goal Setting & Prioritization", "Motivating and Engaging Teams"],
    acquiredSkills: ["Building Team Trust", "Effective Group Communication", "Creative Problem Solving", "Inspiring Team Motivation", "Conflict Resolution Strategies", "Adaptive Leadership Skills", "Collaborative Decision Making", "Driving Team Performance", "Recognizing Individual Strengths"],
    audience: ["IT and Software Companies", "E-commerce and Retail Firms", "Healthcare and Pharma Companies", "Manufacturing and Engineering Firms", "Media and Creative Agencies", "Finance and Accounting Firm", "Marketing and Digital Agencies"],
    snapshot: "This High Performance Team Building Program is a structured corporate training initiative designed for today’s workplace. This program helps people work better together at the workplace. Participants will learn how to speak clearly, share their ideas without fear, and work politely with team members from different teams. The program also teaches how to handle work pressure, avoid arguments, and keep a positive and friendly work environment. These skills make daily work smoother and help everyone feel comfortable at work. These skills empower employees to work smarter, strengthen teamwork, and make a real impact at work!",
    faqs: [
      ["What is the High Performance Team Building Program?", "It’s a professional development program designed to help employees improve teamwork, collaboration, communication, and problem-solving skills."],
      ["Who can attend this program?", "The program is open to employees across roles, including team members, supervisors, and managers, who want to enhance team performance and productivity."],
      ["How will this program benefit me?", "You’ll learn practical ways to work more effectively with your team, handle challenges confidently, and contribute to achieving team and organizational goals."],
      ["What makes this program different?", "The program focuses on real-world scenarios and hands-on activities, helping you apply what you learn immediately in your day-to-day work."],
      ["Will this program help me grow professionally?", "Yes! By building stronger teamwork, communication, and leadership skills, you’ll be better prepared for bigger responsibilities and career growth opportunities."],
    ],
  },
  "Customer Relationship Management (CRM) Tools": {
    pageTitle: "Customer Relationship Management (CRM) Tools",
    expertIntro: "Get expert guidance from top industry pros and fast-track your way to achieving your career goals!",
    overview: "Take charge of your customer work with our Customer Relationship Management (CRM) Tools Program. You’ll learn how to keep all customer information in one place, track interactions, and follow up without missing anything. We’ll show you simple ways to focus on what matters, notice trends, and respond to customer needs quickly. By using CRM tools, your daily work becomes easier, more organized, and less stressful. Start using CRM confidently, improve customer experience, and get better results every day!",
    skills: ["Customer Data Management", "Interaction Tracking", "Lead Management", "Task and Workflow Organization", "Team Collaboration", "Reporting and Analytics", "Customer Communication"],
    acquiredSkills: ["Customer Insights Analysis", "Priority Setting Skills", "CRM System Navigation", "Data Accuracy Management", "Performance Trend Monitoring", "Customer Experience Improvement", "Business Planning Support"],
    audience: ["IT and Technology Firms", "Data Analytics and Business Intelligence Firms", "Consulting and Advisory Firms", "Financial Services and Accounting Firms", "Marketing and Digital Agencies", "Customer Experience and Support Firms"],
    snapshot: "Build better customer experiences with Finprov’s CRM Tools Program. Learn how CRM systems help you understand customer needs, manage multiple requests at the same time, and stay in control of your work. See how clear records and timely updates improve teamwork and reduce back-and-forth. With practical exposure, you’ll feel more confident handling customer responsibilities and supporting smooth day-to-day operations. Create stronger customer relationships and work with clarity every day!",
    faqs: [
      ["What is the CRM Tools corporate training program?", "This corporate training program teaches you to manage customer information, track tasks, and enhance teamwork using CRM tools."],
      ["Who should join this program?", "Employees, team leaders, and professionals in sales, marketing, customer support, and operations who want to work smarter with CRM tools."],
      ["What skills will I learn?", "You will learn to organize customer data, follow up with clients, manage leads, track tasks, and communicate better with your team."],
      ["How will this program help me at work?", "It shows easy ways to prioritize tasks, stay organized, and use CRM tools to make your daily work faster and smoother."],
      ["Why is this program useful for my team?", "Using CRM tools helps your team work together better, improves customer service, and makes business processes more efficient."],
    ],
  },
} as const;

export const businessProgramSlug = (title: string) => title.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

export const getBusinessProgramDuration = (title: string) => programDurations[title] ?? "6 hours";
export const hasOriginalBusinessProgramDetail = (title: string) => programsWithOriginalDetailPages.has(title);

export function getBusinessProgram(slug: string) {
  for (const area of businessProgramAreas) {
    const title = area.programs.find((program) => businessProgramSlug(program) === slug);
    if (title && hasOriginalBusinessProgramDetail(title)) {
      const detail = originalProgramDetails[title];
      return { title: detail.pageTitle, area: area.title, description: area.description, duration: getBusinessProgramDuration(title), detail };
    }
  }
  return undefined;
}

export type BusinessProgram = NonNullable<ReturnType<typeof getBusinessProgram>>;
