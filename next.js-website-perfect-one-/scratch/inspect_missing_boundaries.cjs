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

const topLevel = new Set(context.__courses.map((course) => course.slug));
const all = [...source.matchAll(/"slug"\s*:\s*"([^"]+)"/g)].map((match) => ({
  slug: match[1],
  index: match.index,
}));

for (const item of all.filter((entry) => !topLevel.has(entry.slug))) {
  const preceding = source.slice(Math.max(0, item.index - 500), item.index);
  console.log(`\n### ${item.slug}`);
  console.log(preceding.split(/\r?\n/).slice(-10).join("\n"));
}
