const fs = require("fs");
const path = require("path");
const {
  bin,
  rootDir,
  workspaceDir,
  exec,
  spawn,
} = require("@workspace-builder/tools");

function build(workspace, options) {
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

  (options.watch ? spawn : exec)(
    `${bin("cross-env")} NODE_ENV="${
      process.env.NODE_ENV || options.watch ? "development" : "production"
    }" ${bin("babel")} ${
      options.watch ? "--watch" : ""
    } --config-file ${babelConfig} --extensions ".ts,.tsx,.js,.jsx" src -d dist --ignore *.test.js`
  );
}
build.managesOwnWatcher = true;

module.exports = build;
