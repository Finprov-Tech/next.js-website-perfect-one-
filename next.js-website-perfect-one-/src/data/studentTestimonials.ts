export type StudentTestimonial = {
  id: string;
  name: string;
  program: string;
  role?: string;
  company?: string;
  rating: number;
  type: "text" | "video";
  quote?: string;
  photoUrl?: string;
  photoAlt?: string;
  videoUrl?: string;
  videoThumbnail?: string;
  videoThumbnailAlt?: string;
  badge?: string;
};

export const studentTestimonials: StudentTestimonial[] = [
  {
    id: "v1",
    name: "Learner Experience — SAP FICO",
    program: "SAP S/4HANA FI Course",
    rating: 5,
    type: "video",
    videoThumbnail: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    badge: "Video Testimonial",
  },
  {
    id: "t1",
    name: "Aebel Stanly Behnan K",
    program: "SAP FICO & ACCA",
    role: "Finance Executive",
    rating: 5,
    type: "text",
    photoUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=200&auto=format&fit=crop",
    quote:
      "Finprov provides quality classes for SAP FICO and is completely flexible to the student's convenience of time and dates. The SAP faculty clearly explained each and every aspect of the syllabus. The specialty of the classes is that it's very much focused on the practical aspects of SAP, which is really helpful in the actual working environment. I took SAP FICO as an add-on to my ACCA qualification, and I'm sure that the course has increased my potential to pursue a career in finance.",
  },
  {
    id: "t2",
    name: "Aswathy Krishna",
    program: "SAP FICO",
    role: "Accounts Associate",
    rating: 5,
    type: "text",
    photoUrl: "https://images.unsplash.com/photo-1573497019940-1c28c88b4f3e?q=80&w=200&auto=format&fit=crop",
    quote:
      "It has been a great learning experience at Finprov for me. I underwent training for SAP FICO over there. The training they provide is totally practical-oriented, which helped me a lot in understanding the concepts. The faculty members are so experienced and supportive that they have enough patience to clear all the doubts students raise without any negligence.",
  },
  {
    id: "v2",
    name: "Digital Marketing Student Journey",
    program: "IIT IHub Digital Marketing",
    rating: 5,
    type: "video",
    videoThumbnail: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    videoUrl: "https://www.youtube.com/embed/dQw4w9WgXcQ",
    badge: "Video Testimonial",
  },
  {
    id: "t3",
    name: "Abhishek V",
    program: "Digital Marketing Specialist",
    role: "PPC Executive",
    rating: 5,
    type: "text",
    photoUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=200&auto=format&fit=crop",
    quote:
      "I joined the digital marketing course at Calicut, and it exceeded my expectations. The trainer is genuinely passionate about teaching and was very helpful with real ad campaigns and live client setups.",
  },
  {
    id: "t4",
    name: "Anjana S",
    program: "PGDIFA",
    role: "Tax Analyst",
    company: "Big 4 Partner Firm",
    rating: 5,
    type: "text",
    photoUrl: "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=200&auto=format&fit=crop",
    quote:
      "I chose the PGDIFA course at Finprov, which was informative and practical. It helped me learn a lot about Indian and Gulf accounting and GST filing. Trainers were very helpful and friendly throughout.",
  },
];
