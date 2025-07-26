import { Config } from "prettier";

const config: Config = {
  plugins: ["prettier-plugin-tailwindcss"],
  tabWidth: 4,
  useTabs: true,
  trailingComma: "es5",
  printWidth: 120,
  bracketSpacing: true,
};

export default config;
