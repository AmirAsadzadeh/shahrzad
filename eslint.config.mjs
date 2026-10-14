import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import fileNameConvention from "./eslint-rules/file-name-convention.mjs";

const eslintConfig = [
  {
    ignores: ["tmp/**", "node_modules/**", ".next/**"]
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
  }
];

export default eslintConfig;
