import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
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
          "file-name-convention": fileNameConvention
        }
      }
    },
    rules: {
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
