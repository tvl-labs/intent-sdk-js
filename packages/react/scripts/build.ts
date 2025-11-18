import { build, type BuildConfig } from "@repo/build-config";

const entries = [{ input: "src/index.ts", name: "index" }];

const config: BuildConfig = {
  entries,
  additionalExternal: ["react/jsx-runtime"],
};

build("package.json", "../../package.json", config).catch((e) => {
  console.error(e);
  process.exit(1);
});
