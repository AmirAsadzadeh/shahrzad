import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import architectureRules from "./eslint-rules/architecture.mjs";
import fileNameConvention from "./eslint-rules/file-name-convention.mjs";

const eslintConfig = [
  {
    ignores: ["tmp/**", "node_modules/**", ".next/**", "public/mockServiceWorker.js"]
  },
  ...nextVitals,
  ...nextTs,
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: {
      project: {
        rules: {
          architecture: architectureRules,
          "file-name-convention": fileNameConvention
        }
      }
    },
    rules: {
      "@typescript-eslint/no-explicit-any": "error",
      "project/architecture": "error",
      "project/file-name-convention": "error"
    }
  },
  {
    files: ["src/mocks/**/*.{ts,tsx}", "src/app/MSWProvider.tsx", "src/instrumentation.node.ts"],
    rules: {
      // These files are copied from the interview's reference mock backend.
      "project/file-name-convention": "off",
      "react-hooks/set-state-in-effect": "off"
    }
  }
];

export default eslintConfig;
