# rollup-plugin-multiple-output

## Install

```bash
yarn add rollup-plugin-multiple-output -D -E
```

## Usage

```javascript
import multipleOutput from "rollup-plugin-multiple-output";

export default {
  input: "",
  output: {
      dir: "dist,
      entryFileNames: "[folder]/index.js"
  },

  plugins: [
      multipleOutput({
          placeholder: {
              // 使用配置式, 插件内不部解析include和exclude
              "[folder]": {
                  include: "lib"
              }

              // custom
              "[test]": function (outputOptions, initOptions) {
                  // do something
                  return outputOptions;
              }
          }
      })
  ]
};
```
