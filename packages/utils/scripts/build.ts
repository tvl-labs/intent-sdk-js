import { build, type BuildConfig } from "@repo/build-config";

const entries = [
  { input: "src/index.ts", name: "index" },
  { input: "src/abis/index.ts", name: "abis" },
  { input: "src/types/index.ts", name: "types" },
  { input: "src/utils/index.ts", name: "utils" },
  { input: "src/medusa/index.ts", name: "medusa" },
  { input: "src/config/index.ts", name: "config" },
];

const config: BuildConfig = {
  entries,
  treeshake: false,
  getImportPath: (entryName: string) => (entryName === "index" ? "./index.mjs" : `./${entryName}/index.mjs`),
};

build("package.json", "../../package.json", config).catch((e) => {
  console.error(e);
  process.exit(1);
});
