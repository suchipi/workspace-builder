const fs = require("fs");
const {
  bin,
  rootDir,
  workspaceDir,
  exec,
  spawn,
} = require("@workspace-builder/tools");

function build(workspace, options) {
  let webpackConfigPath = null;
  if (fs.existsSync(rootDir("webpack.config.js"))) {
    webpackConfigPath = rootDir("webpack.config.js");
  }
  if (fs.existsSync(workspaceDir("webpack.config.js"))) {
    webpackConfigPath = workspaceDir("webpack.config.js");
  }

  const env =
    process.env.NODE_ENV || options.watch ? "development" : "production";

  let hasModeSet = true;
  if (webpackConfigPath) {
    try {
      let webpackConfig = require(webpackConfigPath);
      if (typeof webpackConfig === "function") {
        webpackConfig = webpackConfig(env);
      }
      if (!Array.isArray(webpackConfig)) {
        const mode = webpackConfig.mode;
        hasModeSet = Boolean(mode);
      }
    } catch (err) {}
  }

  (options.watch ? spawn : exec)(
    `env NODE_ENV="${env}" ${bin("webpack")} ${
      hasModeSet ? "" : `--mode ${env}`
    } ${options.watch ? "--watch" : ""} ${
      webpackConfigPath ? `--config ${webpackConfigPath}` : ""
    }`
  );
}

build.managesOwnWatcher = true;

module.exports = build;
