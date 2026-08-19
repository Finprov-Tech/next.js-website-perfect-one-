export type Post = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  gradient: string;
  author: { name: string; role: string; bio?: string; photoUrl?: string; linkedinUrl?: string };
  sections: { heading: string; body: string }[];
  coverImageUrl?: string;
  coverImageAlt?: string;
};

export type BlogPost = Post;
