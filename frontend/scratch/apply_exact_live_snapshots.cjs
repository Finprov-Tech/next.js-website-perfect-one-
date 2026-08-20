const fs = require("fs");
const ts = require("typescript");
const vm = require("vm");

const targetPath = "src/data/courses.ts";
const source = fs.readFileSync(targetPath, "utf8");
const snapshots = JSON.parse(
  fs.readFileSync("scratch/exact_live_snapshots_70.json", "utf8"),
);

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
const courses = context.__courses;

if (courses.length !== 70 || Object.keys(snapshots).length !== 70) {
  throw new Error("Expected exactly 70 courses and 70 snapshot sources.");
}

snapshots["zoho-books"].snapshotText =
  "Finprov’s Zoho Books course offers in-depth training on one of the leading accounting platforms in the industry. With its powerful cloud-based functionality, Zoho Books enables seamless accounting access from anywhere worldwide. While alternatives like QuickBooks Online are available, Zoho Books stands out for its ability to transform accounting practices and improve efficiency. This course will guide you through all aspects of the software, from basic features to advanced functions, helping you tackle real-world job challenges and enhancing your overall accounting proficiency.";

for (const course of courses) {
  const exact = snapshots[course.slug];
  if (!exact?.snapshotText?.trim()) {
    throw new Error(`Missing exact snapshot for ${course.slug}`);
  }
  course.snapshotText = exact.snapshotText.trim();
}

const sourceFile = ts.createSourceFile(
  targetPath,
  source,
  ts.ScriptTarget.Latest,
  true,
  ts.ScriptKind.TS,
);
let bounds;
for (const statement of sourceFile.statements) {
  if (!ts.isVariableStatement(statement)) continue;
  for (const declaration of statement.declarationList.declarations) {
    if (
      ts.isIdentifier(declaration.name) &&
      declaration.name.text === "courses" &&
      declaration.initializer &&
      ts.isArrayLiteralExpression(declaration.initializer)
    ) {
      bounds = {
        start: declaration.initializer.getStart(sourceFile),
        end: declaration.initializer.getEnd(),
      };
    }
  }
}
if (!bounds) throw new Error("Could not locate courses array.");

const updated =
  source.slice(0, bounds.start) +
  JSON.stringify(courses, null, 2) +
  source.slice(bounds.end);
fs.writeFileSync(targetPath, updated, "utf8");
console.log("Applied 70 exact live Course Snapshot paragraphs.");
