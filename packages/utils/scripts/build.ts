import { rollup } from "rollup";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";
import fs from "fs-extra";
import * as path from "path";

const pkg = fs.readJSONSync("package.json");
const repoPkg = fs.readJSONSync("../../package.json");
const outDir = "dist";

const entries = [
  { input: "src/index.ts", name: "index" },
  { input: "src/abis/index.ts", name: "abis" },
  { input: "src/types/index.ts", name: "types" },
  { input: "src/utils/index.ts", name: "utils" },
  { input: "src/medusa/index.ts", name: "medusa" },
  { input: "src/config/index.ts", name: "config" },
];

const sourcemap = false;

async function buildJS() {
  for (const entry of entries) {
    const bundle = await rollup({
      input: entry.input,
      external: [...Object.keys(pkg.dependencies || {}), ...Object.keys(pkg.peerDependencies || {})],
      plugins: [nodeResolve(), commonjs(), json(), typescript({ tsconfig: "./tsconfig.json", declaration: false })],
      treeshake: false,
    });

    await bundle.write({
      file: `${outDir}/${entry.name}.cjs`,
      format: "cjs",
      sourcemap,
    });

    await bundle.write({
      dir: outDir,
      entryFileNames: "[name].mjs",
      format: "esm",
      sourcemap,
      preserveModules: true,
      preserveModulesRoot: "src",
    });

    await bundle.close();
  }
}

async function buildDTS() {
  for (const entry of entries) {
    const bundle = await rollup({
      input: entry.input,
      plugins: [dts()],
    });

    await bundle.write({
      file: `${outDir}/${entry.name}.d.ts`,
      format: "es",
    });

    await bundle.close();
  }
}

function overrideLocalDependenciesVersion(dependencies?: Record<string, string>) {
  return Object.entries(dependencies || {}).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: key.startsWith("@arcadia-network/") ? repoPkg.version : value,
    };
  }, {});
}

function buildPackageJson() {
  const exports = {} as Record<string, { import: string; require: string; types: string }>;

  for (const entry of entries) {
    const key = entry.name === "index" ? "." : `./${entry.name}`;
    exports[key] = {
      import: entry.name === "index" ? "./index.mjs" : `./${entry.name}/index.mjs`,
      require: `./${entry.name}.cjs`,
      types: `./${entry.name}.d.ts`,
    };
  }

  const filteredDependencies = Object.entries(pkg.dependencies || {}).reduce(
    (acc, [key, value]) => {
      if (!key.startsWith("@arcadia-network/")) {
        acc[key] = value as string;
      }
      return acc;
    },
    {} as Record<string, string>,
  );

  const minimalPkg = {
    name: pkg.name,
    version: repoPkg.version,
    description: pkg.description,
    main: "index.cjs",
    module: "index.mjs",
    types: "index.d.ts",
    exports,
    keywords: pkg.keywords,
    repository: pkg.repository,
    license: pkg.license,
    peerDependencies: overrideLocalDependenciesVersion(pkg.peerDependencies),
    dependencies: overrideLocalDependenciesVersion(filteredDependencies),
  };

  fs.writeJSONSync(path.join(outDir, "package.json"), minimalPkg, {
    spaces: 2,
  });
}

function copyFiles() {
  for (const f of ["README.md", "LICENSE"]) {
    if (fs.existsSync(f)) {
      fs.copyFileSync(f, path.join(outDir, f));
    }
  }
}

async function main() {
  await fs.emptyDir(outDir);
  await buildJS();
  await buildDTS();
  buildPackageJson();
  copyFiles();
  console.info("Build complete!");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
