const esbuild = require("esbuild");

const production = process.argv.includes("--production");
const watch = process.argv.includes("--watch");

/** @type {import('esbuild').BuildOptions} */
const baseOptions = {
  bundle: true,
  external: ["vscode"],
  format: "cjs",
  platform: "node",
  sourcemap: !production,
  minify: production,
  logLevel: "info",
};

async function main() {
  // Extension host bundle
  const extCtx = await esbuild.context({
    ...baseOptions,
    entryPoints: ["src/extension.ts"],
    outfile: "dist/extension.js",
  });

  if (watch) {
    await extCtx.watch();
    console.log("[esbuild] Watching…");
  } else {
    await extCtx.rebuild();
    await extCtx.dispose();
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
