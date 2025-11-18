import { build, type BuildConfig } from "@repo/build-config";

const entries = [
  { input: "src/index.ts", name: "index" },
  { input: "src/bridge/index.ts", name: "bridge" },
  { input: "src/intent/index.ts", name: "intent" },
  { input: "src/lp/index.ts", name: "lp" },
  { input: "src/mtoken/index.ts", name: "mtoken" },
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
