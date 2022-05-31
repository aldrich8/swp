import glob from "glob";
import commonjs from "rollup-plugin-commonjs";
import typescript from "@rollup/plugin-typescript";
import nodeResolve, { DEFAULTS } from "@rollup/plugin-node-resolve";
import styles from "rollup-plugin-styles";
import autoprefixer from "autoprefixer";
import sourcemaps from "rollup-plugin-sourcemaps";
import dts from "rollup-plugin-dts";

function createMultipleEntry(patternEntryString, options = {}) {
  // Solution 1
  // ---------------------------------------------------------------------------------
  // ref: https://github.com/rollup/rollup/issues/4065#issuecomment-833546767
  // 利用rollup-plugin-multi-entry 在rollup options时判断缓存config, load时候matched的资源
  // 可以支持多个路径的input, 但是暂时未支持output对input的结构保留(多个目录无法保留)
  // ...
  // Solution 2
  // ---------------------------------------------------------------------------------
  // ref: https://github.com/rollup/rollup/issues/4065#issuecomment-905342790
  // glob.sync 生成多个input路径, 可保留结构
  const entries = glob.sync(patternEntryString).reduce((iterator, entry) => {
    const splitEntryKeywords = entry.split("/");
    try {
      const entryDirname = splitEntryKeywords[splitEntryKeywords.length - 2];
      const entryKey = !!options.dirnameLowerCase
        ? entryDirname.toLowerCase()
        : entryDirname;
      iterator[entryKey] = entry;
    } catch (error) {
      console.log(error);
    }
    return iterator;
  }, {});
  return entries;
}

const entries = createMultipleEntry("widgets/**/index.ts", {
  dirnameLowerCase: true,
});
export default [
  {
    input: entries,
    output: {
      dir: "dist/widgets",
      format: "es",
      entryFileNames: "[name]/index.js",
      sourcemap: true,
    },
    plugins: [
      commonjs(),
      typescript(),
      styles({
        plugins: [autoprefixer()],
        minimize: true,
      }),
      nodeResolve({
        extensions: [...DEFAULTS.extensions, ".ts"],
        moduleDirectories: ["node_modules"],
      }),
      sourcemaps(),
    ],
  },
  {
    input: entries,
    output: {
      dir: "dist/widgets",
      entryFileNames: "[name]/index.d.ts",
      format: "es",
    },
    external: [/\.(le|sc|c|sa)ss$/, /\.stylus/],
    plugins: [dts()],
  },
];
