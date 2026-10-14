import path from "node:path";

const sourceExtensions = new Set([".ts", ".tsx"]);
const nextRouteFiles = new Set([
  "default",
  "error",
  "global-error",
  "layout",
  "loading",
  "not-found",
  "page",
  "route",
  "template"
]);

const isPascalCase = (name) => /^[A-Z][A-Za-z0-9]*$/.test(name);
const isCamelCase = (name) => /^[a-z][A-Za-z0-9]*$/.test(name);
const isHookName = (name) => /^use[A-Z][A-Za-z0-9]*$/.test(name);

function getSourcePath(filename) {
  const normalized = filename.split(path.sep).join("/");
  const sourceIndex = normalized.lastIndexOf("/src/");
  return sourceIndex >= 0 ? normalized.slice(sourceIndex + "/src/".length) : null;
}

function getViolation(filename) {
  const sourcePath = getSourcePath(filename);
  if (!sourcePath) return null;

  const extension = path.extname(sourcePath);
  if (!sourceExtensions.has(extension)) return null;

  const basename = path.basename(sourcePath, extension);
  const unitName = basename.endsWith(".test") ? basename.slice(0, -5) : basename;
  const directory = path.dirname(sourcePath).split(path.sep).join("/");

  // Next route segments are URLs, so their spelling is governed by the route contract.
  if (directory === "app" || directory.startsWith("app/")) {
    return nextRouteFiles.has(unitName)
      ? null
      : "Next.js route files must use a documented framework filename such as page.tsx or route.ts.";
  }

  const directorySegments = directory.split("/");
  if (directorySegments.some((segment) => /[-_]/.test(segment))) {
    return "Source directories must use lowercase or camelCase names; URL route segments are the exception.";
  }

  if (directory.endsWith("/components") || directory === "shared/ui") {
    if (extension === ".tsx" && !isPascalCase(unitName)) {
      return "React component files must use PascalCase and match their component export.";
    }
  }

  if (directory.endsWith("/hooks") && !isHookName(unitName)) {
    return "Hook files must use the useX naming convention, for example useHomeData.ts.";
  }

  if (directory.endsWith("/api") && directory.startsWith("features/")) {
    if (!isCamelCase(unitName) || !unitName.endsWith("Api")) {
      return "Feature API files must use camelCase and end with Api, for example homeApi.ts.";
    }
  }

  if (!isCamelCase(unitName) && !isPascalCase(unitName)) {
    return "Source filenames must use camelCase or PascalCase. Do not use kebab-case or snake_case.";
  }

  return null;
}

const fileNameConventionRule = {
  meta: {
    type: "suggestion",
    docs: {
      description: "Enforce the repository filename convention"
    },
    schema: []
  },
  create(context) {
    const filename = context.getFilename();
    const message = getViolation(filename);

    return message
      ? {
          Program() {
            context.report({
              loc: { line: 1, column: 0 },
              message
            });
          }
        }
      : {};
  }
};

export default fileNameConventionRule;
