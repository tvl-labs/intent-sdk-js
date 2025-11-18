import { rollup } from "rollup";
import typescript from "@rollup/plugin-typescript";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import json from "@rollup/plugin-json";
import dts from "rollup-plugin-dts";
import fs from "fs-extra";
import * as path from "path";

export interface BuildEntry {
  input: string;
  name: string;
}

export interface BuildConfig {
  entries: BuildEntry[];
  outDir?: string;
  sourcemap?: boolean;
  treeshake?: boolean;
  additionalExternal?: string[];
  getImportPath?: (entryName: string) => string;
}

export interface PackageJson {
  name: string;
  version?: string;
  description?: string;
  keywords?: string[];
  repository?: unknown;
  license?: string;
  dependencies?: Record<string, string>;
  peerDependencies?: Record<string, string>;
}

export interface RepoPackageJson {
  version: string;
}

export async function buildJS(
  pkg: PackageJson,
  config: BuildConfig,
  cwd: string = process.cwd(),
  tsconfigPath: string = "./tsconfig.json",
) {
  const outDir = config.outDir || "dist";
  const sourcemap = config.sourcemap ?? false;
  const treeshake = config.treeshake ?? false;
  const external = [
    ...(config.additionalExternal || []),
    ...Object.keys(pkg.dependencies || {}),
    ...Object.keys(pkg.peerDependencies || {}),
  ];

  for (const entry of config.entries) {
    const bundle = await rollup({
      input: path.resolve(cwd, entry.input),
      external,
      plugins: [
        nodeResolve(),
        commonjs(),
        json(),
        typescript({ tsconfig: path.resolve(cwd, tsconfigPath), declaration: false }),
      ],
      treeshake,
    });

    await bundle.write({
      file: path.resolve(cwd, `${outDir}/${entry.name}.cjs`),
      format: "cjs",
      sourcemap,
    });

    await bundle.write({
      dir: path.resolve(cwd, outDir),
      entryFileNames: "[name].mjs",
      format: "esm",
      sourcemap,
      preserveModules: true,
      preserveModulesRoot: "src",
    });

    await bundle.close();
  }
}

export async function buildDTS(config: BuildConfig, cwd: string = process.cwd()) {
  const outDir = config.outDir || "dist";

  for (const entry of config.entries) {
    const bundle = await rollup({
      input: path.resolve(cwd, entry.input),
      plugins: [dts()],
    });

    await bundle.write({
      file: path.resolve(cwd, `${outDir}/${entry.name}.d.ts`),
      format: "es",
    });

    await bundle.close();
  }
}

export function overrideLocalDependenciesVersion(
  dependencies: Record<string, string> | undefined,
  repoVersion: string,
) {
  return Object.entries(dependencies || {}).reduce((acc, [key, value]) => {
    return {
      ...acc,
      [key]: key.startsWith("@intents-sdk/") ? repoVersion : value,
    };
  }, {});
}

export function buildPackageJson(
  pkg: PackageJson,
  repoPkg: RepoPackageJson,
  config: BuildConfig,
  cwd: string = process.cwd(),
) {
  const outDir = config.outDir || "dist";
  const getImportPath =
    config.getImportPath || ((entryName: string) => (entryName === "index" ? "./index.mjs" : `./${entryName}.mjs`));
  const exports = {} as Record<string, { import: string; require: string; types: string }>;

  for (const entry of config.entries) {
    const key = entry.name === "index" ? "." : `./${entry.name}`;
    exports[key] = {
      import: getImportPath(entry.name),
      require: `./${entry.name}.cjs`,
      types: `./${entry.name}.d.ts`,
    };
  }

  // Filter out internal dependencies from dependencies for publishing
  const filteredDependencies = Object.entries(pkg.dependencies || {}).reduce(
    (acc, [key, value]) => {
      if (!key.startsWith("@intents-sdk/")) {
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
    peerDependencies: overrideLocalDependenciesVersion(pkg.peerDependencies, repoPkg.version),
    dependencies: overrideLocalDependenciesVersion(filteredDependencies, repoPkg.version),
  };

  fs.writeJSONSync(path.resolve(cwd, outDir, "package.json"), minimalPkg, {
    spaces: 2,
  });
}

export function copyFiles(
  config: BuildConfig,
  cwd: string = process.cwd(),
  files: string[] = ["README.md", "LICENSE"],
) {
  const outDir = config.outDir || "dist";

  for (const f of files) {
    const sourcePath = path.resolve(cwd, f);
    if (fs.existsSync(sourcePath)) {
      fs.copyFileSync(sourcePath, path.resolve(cwd, outDir, f));
    }
  }
}

export async function build(pkgPath: string, repoPkgPath: string, config: BuildConfig) {
  const cwd = path.dirname(path.resolve(pkgPath));
  const pkg = fs.readJSONSync(path.resolve(pkgPath)) as PackageJson;
  const repoPkg = fs.readJSONSync(path.resolve(repoPkgPath)) as RepoPackageJson;
  const outDir = config.outDir || "dist";

  await fs.emptyDir(path.resolve(cwd, outDir));
  await buildJS(pkg, config, cwd);
  await buildDTS(config, cwd);
  buildPackageJson(pkg, repoPkg, config, cwd);
  copyFiles(config, cwd);
  console.info("Build complete!");
}
