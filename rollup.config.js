import merge from "deepmerge";
import { createBasicConfig } from "@open-wc/building-rollup";
import nodeResolve, { DEFAULTS } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

const rollupBasicConfig = createBasicConfig();

export default merge(rollupBasicConfig, {
  input: "src/index.ts",
  output: [
    {
      dir: "dist",
      format: "es",
      entryFileNames: "[name].js",
      chunkFileNames: "[name]-[hash].js",
    },
  ],
  plugins: [
    typescript(),
    nodeResolve({
      extensions: [...DEFAULTS.extensions, ".ts"],
      moduleDirectories: ["node_modules", "web_modules"],
    }),
  ],
});
