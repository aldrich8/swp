import merge from "deepmerge";

// ref: https://www.npmjs.com/package/@open-wc/building-rollup
// ref: https://npm.io/package/@open-wc/rollup-plugin-html
import { createBasicConfig } from "@open-wc/building-rollup";
import html from "@open-wc/rollup-plugin-html";

// ref: https://www.npmjs.com/package/@rollup/plugin-node-resolve
import nodeResolve, { DEFAULTS } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import serve from "rollup-plugin-serve";
import commonjs from "rollup-plugin-commonjs";
import styles from "rollup-plugin-styles";
import autoprefixer from "autoprefixer";

const isDev = process.env.R_ENV === "development";
const isProd = process.env.R_ENV === "production";

const rollupBasicConfig = createBasicConfig();
export default merge(rollupBasicConfig, {
  input: "src/index.ts",
  output: [
    {
      dir: "dist",
      format: "es",
      entryFileNames: "[name].js",
      // chunkFileNames: "[name]-[hash].js",
    },
  ],
  plugins: [
    commonjs(),
    isDev && html({ files: "./src/index.html", inject: false }),
    typescript(),
    styles({
      autoModules: true,
      plugins: [autoprefixer()],
    }),
    nodeResolve({
      extensions: [...DEFAULTS.extensions, ".ts"],
      moduleDirectories: ["node_modules"],
    }),
    // ref: https://github.com/thgh/rollup-plugin-serve
    isDev &&
      serve({
        open: true,
        contentBase: "dist",
        host: "127.0.0.1",
        port: 5200,

        historyApiFallback: false,
        // https: {
        //   key: fs.readFileSync("./.workspace/certificates/server.key"),
        //   cert: fs.readFileSync("./.workspace/certificates/server.crt"),
        // },
      }),
  ],
});
