const fs = require("fs");
const ts = require("typescript");
const vm = require("vm");

function loadCourses() {
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
  return context.__courses;
}

const sources = [
  "perfect_live_texts.json",
  "exact_extracted_hero_and_snapshot.json",
  "exact_hero_snapshot_data.json",
  "100_percent_exact_course_texts.json",
].map((name) => ({
  name,
  data: JSON.parse(fs.readFileSync(`scratch/${name}`, "utf8")),
}));

const courses = loadCourses();
for (const course of courses) {
  const keys = [
    course.slug,
    ...(course.aliases || []),
    course.canonicalUrl?.split("/").filter(Boolean).at(-1),
  ].filter(Boolean);
  const matches = sources.flatMap((source) =>
    keys
      .filter((key) => source.data[key]?.snapshotText)
      .map((key) => ({
        source: source.name,
        key,
        text: source.data[key].snapshotText,
      })),
  );
  console.log(`\n### ${course.title} | ${course.slug}`);
  if (!matches.length) {
    console.log("NO_SOURCE");
    continue;
  }
  for (const match of matches) {
    console.log(
      `${match.source} | ${match.key} | ${match.text.length} | ${match.text.slice(0, 180)}`,
    );
  }
}
