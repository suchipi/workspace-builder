const fs = require("fs");
const path = require("path");
const {
  bin,
  rootDir,
  workspaceDir,
  exec,
} = require("@workspace-builder/tools");

module.exports = function build(workspace, options) {
  let babelConfig = path.resolve(__dirname, "defaultbabelrc");
  if (fs.existsSync(rootDir(".babelrc"))) {
    babelConfig = rootDir(".babelrc");
  }
  if (fs.existsSync(rootDir("babel.config.js"))) {
    babelConfig = rootDir("babel.config.js");
  }
  if (fs.existsSync(workspaceDir(".babelrc"))) {
    babelConfig = workspaceDir(".babelrc");
  }
  if (fs.existsSync(workspaceDir("babel.config.js"))) {
    babelConfig = workspaceDir("babel.config.js");
  }

  exec(
    `env NODE_ENV="${
      process.env.NODE_ENV || options.watch ? "development" : "production"
    }" ${bin(
      "babel"
    )} --config-file ${babelConfig} --extensions ".ts,.js" src -d dist --ignore *.test.js`
  );
};
