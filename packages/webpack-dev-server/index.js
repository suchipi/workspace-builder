const fs = require("fs");
const {
  bin,
  rootDir,
  workspaceDir,
  exec,
} = require("@workspace-builder/tools");

module.exports = function build(workspace, options) {
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

  exec(
    `env NODE_ENV="${env}" ${
      options.watch ? bin("webpack-dev-server") : bin("webpack")
    } ${hasModeSet ? "" : `--mode ${env}`} ${
      webpackConfigPath ? `--config ${webpackConfigPath}` : ""
    }`
  );
};
