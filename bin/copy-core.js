/*
Copies code from old HAR Viewer to new.
 */
const fs = require("fs-extra");
const path = require("path");
const mkdirp = require("mkdirp");
const glob = require("glob");

const args = process.argv.slice(2);
const hvDir = args[0] || "../harviewer/";

const copyConfig = {
  scripts: {
    from: path.resolve(hvDir, "webapp", "scripts"),
    to: path.resolve(__dirname, "../webapp", "modules"),
    patterns: [
      "core/**",
      "nls/**",
      "tabs/*.html",
      "tabs/ObjectSearch.js",
      "preview/**",
      "json-query/JSONQuery.js",
    ],
  },
  css: {
    from: path.resolve(hvDir, "webapp", "css"),
    to: path.resolve(__dirname, "../webapp", "css"),
    patterns: [
      "*.css",
    ],
  },
};

Object.keys(copyConfig).forEach((configKey) => {
  console.log(`Copying files for "${configKey}"`);
  const config = copyConfig[configKey];

  if (!fs.pathExistsSync(config.from)) {
    throw new Error(`from path "${config.from}" does not exist`);
  }
  if (!fs.pathExistsSync(config.to)) {
    throw new Error(`to path "${config.to}" does not exist`);
  }

  config.patterns.forEach((pattern) => {
    const files = glob.sync(pattern, {
      cwd: config.from,
    });
    files.forEach((file) => {
      const src = path.resolve(config.from, file);
      const dest = path.resolve(config.to, file);
      if (fs.statSync(src).isFile()) {
        mkdirp.sync(path.dirname(dest));
        fs.copySync(src, dest);
        console.log(`Copied ${src} to ${dest}`);
      }
    });
  });
});
