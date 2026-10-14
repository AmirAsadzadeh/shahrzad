import path from "node:path";

const SOURCE_ROOT = "/src/";

function getSourcePath(filename) {
  const normalized = filename.split(path.sep).join("/");
  const sourceIndex = normalized.lastIndexOf(SOURCE_ROOT);
  return sourceIndex >= 0 ? normalized.slice(sourceIndex + SOURCE_ROOT.length) : null;
}

function resolveImportPath(filename, importSource) {
  if (importSource.startsWith("@/")) return importSource.slice(2);
  if (!importSource.startsWith(".")) return null;

  return getSourcePath(path.resolve(path.dirname(filename), importSource));
}

function getLayer(sourcePath) {
  if (!sourcePath) return null;
  const [layer, feature] = sourcePath.split("/");
  return { layer, feature };
}

function isComponentFile(sourcePath) {
  return sourcePath?.endsWith(".tsx") && (sourcePath.includes("/components/") || sourcePath.startsWith("shared/ui/"));
}

function isAllowedTailwindArbitrary(token) {
  // These exceptions represent measured production geometry or CSS features that have no theme-scale equivalent.
  return [
    /^supports-\[/,
    /:\[corner-shape:squircle\]$/,
    /^aspect-\[/,
    /^shadow-\[/,
    /^rounded-[tb]-\[/,
    /^leading-\[/,
    /^-left-\[/,
    /^w-\[calc\(/,
    /^h-\[calc\(/,
  ].some((pattern) => pattern.test(token));
}

function getStaticClassNames(attribute) {
  if (!attribute.value) return [];
  if (attribute.value.type === "Literal" && typeof attribute.value.value === "string") {
    return [attribute.value.value];
  }

  if (attribute.value.type !== "JSXExpressionContainer") return [];
  const expression = attribute.value.expression;

  if (expression.type === "Literal" && typeof expression.value === "string") {
    return [expression.value];
  }

  if (expression.type === "TemplateLiteral") {
    return expression.quasis.map((quasi) => quasi.value.raw);
  }

  return [];
}

const architectureRules = {
  meta: {
    type: "problem",
    docs: {
      description: "Enforce Shahrzad dependency ownership and browser API boundaries"
    },
    schema: []
  },
  create(context) {
    const importerPath = getSourcePath(context.getFilename());
    const importer = getLayer(importerPath);
    const componentFile = isComponentFile(importerPath);

    return {
      ImportDeclaration(node) {
        const importSource = node.source.value;

        if (componentFile && importSource === "axios") {
          context.report({
            node,
            message: "Presentational components must use a feature API module instead of importing Axios."
          });
        }

        const targetPath = resolveImportPath(context.getFilename(), importSource);
        const target = getLayer(targetPath);
        if (!importer || !target) return;

        const isCrossFeaturePrivateImport =
          importer.layer === "features" &&
          target.layer === "features" &&
          importer.feature !== target.feature &&
          targetPath !== `features/${target.feature}/public` &&
          targetPath !== `features/${target.feature}/public.ts` &&
          targetPath !== `features/${target.feature}/public.tsx`;

        const isInvalidSharedImport = importer.layer === "shared" && ["app", "features", "mocks"].includes(target.layer);
        const isInvalidMockImport = importer.layer === "mocks" && ["app", "features"].includes(target.layer);
        const isInvalidAppMockImport =
          importer.layer === "app" &&
          target.layer === "mocks" &&
          importerPath !== "app/MSWProvider.tsx";

        if (isCrossFeaturePrivateImport) {
          context.report({
            node,
            message: "Features may consume another feature only through its public.ts contract."
          });
        } else if (isInvalidSharedImport || isInvalidMockImport || isInvalidAppMockImport) {
          context.report({
            node,
            message: "This import crosses a forbidden project layer boundary."
          });
        }
      },

      CallExpression(node) {
        if (!componentFile) return;
        if (node.callee.type === "Identifier" && node.callee.name === "fetch") {
          context.report({
            node,
            message: "Presentational components must call a feature API module instead of fetch directly."
          });
        }
      },

      JSXAttribute(node) {
        if (node.name.name !== "className") return;

        for (const classNames of getStaticClassNames(node)) {
          for (const token of classNames.split(/\s+/).filter(Boolean)) {
            if (token.includes("[") && !isAllowedTailwindArbitrary(token)) {
              context.report({
                node,
                message: `Use a supported Tailwind utility or a named @theme token instead of arbitrary class value: ${token}`
              });
            }
          }
        }
      }
    };
  }
};

export default architectureRules;
