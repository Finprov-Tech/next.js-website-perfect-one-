const sitemaps = [
  "https://finprov.com/page-sitemap1.xml",
  "https://finprov.com/page-sitemap2.xml",
  "https://finprov.com/courses-sitemap.xml",
  "https://finprov.com/post-sitemap1.xml",
  "https://finprov.com/post-sitemap2.xml",
  "https://finprov.com/post-sitemap3.xml",
  "https://finprov.com/post-sitemap4.xml",
  "https://finprov.com/post-sitemap5.xml",
];

const locRe = /<loc>([^<]+)<\/loc>/g;

function categorize(url) {
  const u = new URL(url);
  const path = u.pathname.replace(/\/$/, "") || "/";
  if (path === "/") return "home";
  const seg = path.split("/").filter(Boolean);
  if (seg[0] === "courses" && seg.length === 2) return "course";
  if (seg[0] === "blog" && seg.length === 2) return "blog";
  if (seg[0] === "career" && seg.length === 2) return "career";
  if (seg[0] === "business" && seg.length === 2) return "business";
  const staticSlugs = new Set([
    "about","admission","blog","business","career","contact","all-courses","events","faq","placement",
    "privacy-policy","team","terms-and-conditions","testimonials","verify-student-certificate","courses"
  ]);
  if (seg.length === 1 && staticSlugs.has(seg[0])) return "static";
  if (seg.length === 1) return "cms-landing";
  return "other";
}

const all = [];
for (const sm of sitemaps) {
  const res = await fetch(sm);
  const xml = await res.text();
  let m;
  while ((m = locRe.exec(xml))) all.push(m[1]);
}

const byType = {};
for (const url of all) {
  const type = categorize(url);
  (byType[type] ||= []).push(url);
}

const slugFrom = (url, prefix) => {
  const p = new URL(url).pathname.replace(/\/$/, "");
  return prefix ? p.replace(prefix, "").replace(/^\//, "") : p.replace(/^\//, "") || "(home)";
};

const report = {
  total: all.length,
  counts: Object.fromEntries(Object.entries(byType).map(([k, v]) => [k, v.length])),
  static: byType.static?.map((u) => slugFrom(u)).sort() || [],
  home: byType.home || [],
  courses: byType.course?.map((u) => slugFrom(u, "/courses")).sort() || [],
  blogs: byType.blog?.map((u) => slugFrom(u, "/blog")).sort() || [],
  careers: byType.career?.map((u) => slugFrom(u, "/career")).sort() || [],
  business: byType.business?.map((u) => slugFrom(u, "/business")).sort() || [],
  cmsLanding: byType["cms-landing"]?.map((u) => slugFrom(u)).sort() || [],
  other: byType.other?.map((u) => new URL(u).pathname).sort() || [],
};

console.log(JSON.stringify(report.counts, null, 2));
console.log("CMS landing sample:", report.cmsLanding.slice(0, 5));
import fs from "fs";
fs.writeFileSync("scratch/live_sitemap_pages.json", JSON.stringify(report, null, 2));
