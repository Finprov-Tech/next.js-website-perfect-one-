const cp = require("child_process");
const fs = require("fs");

const courses = [];

for (let page = 1; page <= 12; page += 1) {
  const url =
    page === 1
      ? "https://finprov.com/all-courses/"
      : `https://finprov.com/all-courses/${page}/`;
  const html = cp.execFileSync("curl.exe", ["-L", "-s", url], {
    encoding: "utf8",
    maxBuffer: 20 * 1024 * 1024,
  });
  const pattern =
    /elementor-element-1933cc8[\s\S]*?<h2[^>]*>\s*<a\s+href="(https:\/\/finprov\.com\/courses\/[^"]+\/)">([\s\S]*?)<\/a>/g;
  const pageCourses = [...html.matchAll(pattern)].map((match) => ({
    title: match[2]
      .replace(/<[^>]+>/g, "")
      .replace(/&amp;/g, "&")
      .replace(/&#8211;|&ndash;/g, "–")
      .replace(/&#038;/g, "&")
      .trim(),
    url: match[1],
    slug: match[1].split("/").filter(Boolean).at(-1),
    page,
  }));
  console.log(`Page ${page}: ${pageCourses.length}`);
  courses.push(...pageCourses);
}

const unique = [...new Map(courses.map((course) => [course.url, course])).values()];
fs.writeFileSync(
  "scratch/live_catalogue_inventory.json",
  JSON.stringify({ rows: courses, unique }, null, 2),
  "utf8",
);
console.log(`Rows: ${courses.length}`);
console.log(`Distinct URLs: ${unique.length}`);
