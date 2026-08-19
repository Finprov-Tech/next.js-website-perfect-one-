import fs from "fs";
import path from "path";

const root = path.resolve(".");
const coursesTs = fs.readFileSync(path.join(root, "src/data/courses.ts"), "utf8");
const blogTs = fs.readFileSync(path.join(root, "src/data/blog.ts"), "utf8");
const careersTs = fs.readFileSync(path.join(root, "src/data/careers.ts"), "utf8");
const businessTs = fs.readFileSync(path.join(root, "src/data/business.ts"), "utf8");

const slugRe = /"slug": "([^"]+)"/g;
const aliasRe = /"aliases":\s*\[([\s\S]*?)\]/g;

function extractSlugs(text) {
  const s = new Set();
  let m;
  while ((m = slugRe.exec(text))) s.add(m[1]);
  return [...s];
}

function extractAliases(text) {
  const s = new Set();
  let m;
  while ((m = aliasRe.exec(text))) {
    for (const a of m[1].match(/"([^"]+)"/g) || []) s.add(a.slice(1, -1));
  }
  return [...s];
}

const businessSlugFn = (t) =>
  t.toLowerCase().replace(/&/g, "and").replace(/[^a-z0-9]+/g, "-").replace(/(^-|-$)/g, "");

const businessPrograms = [...businessTs.matchAll(/programs:\s*\[(.*?)\]/gs)].flatMap((m) =>
  (m[1].match(/"([^"]+)"/g) || []).map((x) => x.slice(1, -1)),
);

const staticRoutes = [
  { path: "/", slug: "(home)", type: "static" },
  { path: "/about/", slug: "about", type: "static" },
  { path: "/admission/", slug: "admission", type: "static" },
  { path: "/blog/", slug: "blog", type: "static-index" },
  { path: "/business/", slug: "business", type: "static-index" },
  { path: "/career/", slug: "career", type: "static-index" },
  { path: "/contact/", slug: "contact", type: "static" },
  { path: "/all-courses/", slug: "all-courses", type: "static" },
  { path: "/events/", slug: "events", type: "static" },
  { path: "/faq/", slug: "faq", type: "static" },
  { path: "/placement/", slug: "placement", type: "static" },
  { path: "/privacy-policy/", slug: "privacy-policy", type: "static" },
  { path: "/team/", slug: "team", type: "static" },
  { path: "/terms-and-conditions/", slug: "terms-and-conditions", type: "static" },
  { path: "/testimonials/", slug: "testimonials", type: "static" },
  { path: "/verify-student-certificate/", slug: "verify-student-certificate", type: "static" },
];

const coursePrimary = extractSlugs(coursesTs);
const courseAliases = extractAliases(coursesTs);
const blog = extractSlugs(blogTs);
const career = extractSlugs(careersTs);
const business = businessPrograms.map(businessSlugFn);

const pages = [
  ...staticRoutes,
  ...coursePrimary.map((slug) => ({ path: `/courses/${slug}/`, slug, type: "course-primary" })),
  ...courseAliases.map((slug) => ({ path: `/courses/${slug}/`, slug, type: "course-alias" })),
  ...blog.map((slug) => ({ path: `/blog/${slug}/`, slug, type: "blog" })),
  ...career.map((slug) => ({ path: `/career/${slug}/`, slug, type: "career" })),
  ...business.map((slug) => ({ path: `/business/${slug}/`, slug, type: "business" })),
];

const out = {
  generatedAt: new Date().toISOString(),
  counts: {
    static: staticRoutes.length,
    coursePrimary: coursePrimary.length,
    courseAliases: courseAliases.length,
    courseTotalUnique: new Set([...coursePrimary, ...courseAliases]).size,
    blog: blog.length,
    career: career.length,
    business: business.length,
    totalListed: pages.length,
    totalUniquePaths: new Set(pages.map((p) => p.path)).size,
  },
  pages,
};

fs.writeFileSync(path.join(root, "scratch/all_frontend_pages.json"), JSON.stringify(out, null, 2));
console.log(JSON.stringify(out.counts, null, 2));
