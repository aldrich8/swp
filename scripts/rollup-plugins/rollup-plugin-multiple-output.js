// issue: https://github.com/rollup/rollup/issues/3333

import fs from "fs";
import path from "path";

let cacheOutput = [];

function multipleOutput(multipleOutputOptions = {}) {
  return {
    name: "multipleOutput",
    options(options) {
      if (
        multipleOutputOptions.placeholder &&
        // TODO(@branlice): types.js
        Object.prototype.toString.call(multipleOutputOptions.placeholder) ===
          "[object Object]"
      ) {
        options.output = transformCustomPlaceholder(
          multipleOutputOptions.placeholder,
          options
        );
      }

      // FIXME(@branlice): options 更改了output选项, 后面Hooks依旧使用的为原始配置
      return {
        ...options,
        output: cacheOutput,
      };
      // transformOutput(options.input,);
    },

    outputOptions() {
      // 只会进行Module的OutputOptions, 不可以返回数组
      return cacheOutput[0];
    },
  };
}

function transformCustomPlaceholder(placeholder, options) {
  const outputConfigList = Array.isArray(options.output)
    ? options.output
    : [options.output];

  formatPlaceholderAsset(placeholder);
  outputConfigList.map((outputConfig) => {
    const placeholders = getCustomPlaceholders(outputConfig.entryFileNames);
    if (placeholders.length) {
      cacheOutput = cacheOutput.concat(
        replaceCustomPlaceholder(placeholder, outputConfig, placeholders)
      );
    }
    return outputConfig;
  });
}

function replaceCustomPlaceholder(
  placeholder,
  outputConfig,
  entryFileNamePlaceholders
) {
  const configs = [];
  entryFileNamePlaceholders.forEach((entryFileNamePlaceholder) => {
    if (Reflect.has(placeholder, entryFileNamePlaceholder)) {
      (Reflect.get(placeholder, entryFileNamePlaceholder).dirs || []).forEach(
        (item) => {
          const newConfig = { ...outputConfig };
          newConfig.entryFileNames = newConfig.entryFileNames.replace(
            entryFileNamePlaceholder,
            item
          );
          configs.push(newConfig);
        }
      );
    }
  });
  return configs;
}

function formatPlaceholderAsset(placeholder) {
  Object.keys(placeholder).forEach((key) => {
    const include = placeholder[key]?.include;

    // TODO: exclude
    // const value = placeholder[key]?.exclude;

    placeholder[key].dirs = getPathDirectories(include);
  });
}

function getPathDirectories(pathString) {
  const resolvePath = path.resolve(__dirname, pathString);
  return fs.readdirSync(resolvePath).reduce((result, asset) => {
    if (fs.statSync(path.join(resolvePath, asset)).isDirectory()) {
      result.push(asset);
      return result;
    }
  }, []);
}

function getCustomPlaceholders(entryFileNames) {
  if (Array.isArray(entryFileNames)) {
    throw new Error("multiple directories are not supported at this time");
  }
  const placeholders = entryFileNames.match(/\[(.+?)\]/g);
  return placeholders;
}

export default multipleOutput;
