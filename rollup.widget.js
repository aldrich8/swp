import commonjs from "rollup-plugin-commonjs";
// import serve from "rollup-plugin-serve";
import nodeResolve, { DEFAULTS } from "@rollup/plugin-node-resolve";
import merge from "deepmerge";
import { createBasicConfig } from "@open-wc/building-rollup";
// import multipleEntry from "rollup-plugin-multi-entry";
// import multipleOutput from "./scripts/rollup-plugins/rollup-plugin-multiple-output";

// import { isDev, isProd } from "./rollup.config";
import typescript from "@rollup/plugin-typescript";

const widgetRollupBasicConfig = createBasicConfig();
export default merge(widgetRollupBasicConfig, {
  // Solution 1:
  // ---------------------------------------------------------------------------------
  // 利用rollup-plugin-multi-entry 在rollup options时判断缓存config, load时候matched的资源
  // 可以支持多个路径的input, 但是暂时未支持output对input的结构保留(多个目录无法保留)
  // ... ref: https://github.com/rollup/rollup/issues/4065#issuecomment-833546767

  input: "lib/**/index.ts",

  // Solution 2:
  // ---------------------------------------------------------------------------------
  // ref: https://github.com/rollup/rollup/issues/4065#issuecomment-905342790
  // glob.sync 生成多个input路径, 可保留结构

  output: [
    {
      dir: "widgets",
      format: "es",
      // Solution 3: custom placeholder [DOING...]
      entryFileNames: "[folder]/index.js",
    },
  ],
  plugins: [
    // multipleEntry(),
    typescript(),
    nodeResolve({
      extensions: [...DEFAULTS.extensions, ".ts"],
      moduleDirectories: ["node_modules", "web_modules"],
    }),
    commonjs(),
  ],
});
