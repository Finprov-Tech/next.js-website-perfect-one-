const fs = require("fs");
const ts = require("typescript");
const vm = require("vm");

const source = fs.readFileSync("src/data/courses.ts", "utf8");
const compiled = ts.transpileModule(
  `${source}\n(globalThis).__courses = courses;`,
  {
    compilerOptions: {
      target: ts.ScriptTarget.ES2022,
      module: ts.ModuleKind.CommonJS,
    },
  },
).outputText;
const context = { exports: {} };
vm.runInNewContext(compiled, context);

const local = context.__courses;
const live = JSON.parse(
  fs.readFileSync("scratch/live_catalogue_inventory.json", "utf8"),
).unique;

const localRoutes = new Set(
  local.flatMap((course) => [
    course.slug,
    ...(course.aliases || []),
    course.canonicalUrl?.split("/").filter(Boolean).at(-1),
  ]).filter(Boolean),
);
const liveRoutes = new Set(live.map((course) => course.slug));

const missing = live.filter((course) => !localRoutes.has(course.slug));
const extra = local.filter(
  (course) =>
    !liveRoutes.has(course.slug) &&
    !(course.aliases || []).some((alias) => liveRoutes.has(alias)) &&
    !liveRoutes.has(course.canonicalUrl?.split("/").filter(Boolean).at(-1)),
);

console.log(`Local top-level courses: ${local.length}`);
console.log(`Local distinct titles: ${new Set(local.map((course) => course.title)).size}`);
console.log(`Live distinct course URLs: ${live.length}`);
console.log("\nMissing live courses:");
for (const course of missing) console.log(`- ${course.title} | ${course.slug}`);
console.log("\nLocal courses not present in the live catalogue:");
for (const course of extra) console.log(`- ${course.title} | ${course.slug}`);

console.log("\nLocal records covering more than one live card:");
for (const course of local) {
  const routes = [
    course.slug,
    ...(course.aliases || []),
    course.canonicalUrl?.split("/").filter(Boolean).at(-1),
  ].filter(Boolean);
  const matched = live.filter((entry) => routes.includes(entry.slug));
  if (matched.length > 1) {
    console.log(`- ${course.title} (${course.slug})`);
    for (const entry of matched) console.log(`  - ${entry.title} | ${entry.slug}`);
  }
}
