const cp = require("child_process");
const fs = require("fs");
const ts = require("typescript");
const vm = require("vm");

const targetPath = "src/data/courses.ts";
const cleanCommit = "426efba";

function evaluateCourses(source) {
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

function findCoursesArray(source) {
  const sourceFile = ts.createSourceFile(
    targetPath,
    source,
    ts.ScriptTarget.Latest,
    true,
    ts.ScriptKind.TS,
  );

  for (const statement of sourceFile.statements) {
    if (!ts.isVariableStatement(statement)) continue;
    for (const declaration of statement.declarationList.declarations) {
      if (
        ts.isIdentifier(declaration.name) &&
        declaration.name.text === "courses" &&
        declaration.initializer &&
        ts.isArrayLiteralExpression(declaration.initializer)
      ) {
        return {
          start: declaration.initializer.getStart(sourceFile),
          end: declaration.initializer.getEnd(),
        };
      }
    }
  }

  throw new Error("Could not locate the courses array.");
}

const currentSource = fs.readFileSync(targetPath, "utf8");
const currentCourses = evaluateCourses(currentSource);
const currentCfm = currentCourses.find(
  (course) => course.slug === "certified-finance-manager",
);
if (!currentCfm) {
  throw new Error("The restored Certified Finance Manager record is missing.");
}

const cleanSource = cp.execFileSync(
  "git",
  ["show", `${cleanCommit}:${targetPath}`],
  { encoding: "utf8" },
);
const cleanCourses = evaluateCourses(cleanSource);

const repaired = cleanCourses.filter(
  (course) => course.slug !== "business-accounting-specialist-program-basp",
);
repaired.push(currentCfm);

if (repaired.length !== 70) {
  throw new Error(`Expected 70 courses, received ${repaired.length}.`);
}
if (new Set(repaired.map((course) => course.slug)).size !== 70) {
  throw new Error("Course slugs are not unique.");
}
if (new Set(repaired.map((course) => course.title)).size !== 70) {
  throw new Error("Course titles are not unique.");
}

const bounds = findCoursesArray(currentSource);
const replacement = JSON.stringify(repaired, null, 2);
const repairedSource =
  currentSource.slice(0, bounds.start) +
  replacement +
  currentSource.slice(bounds.end);

fs.writeFileSync(targetPath, repairedSource, "utf8");
console.log("Rebuilt the catalogue with 70 distinct top-level courses.");
