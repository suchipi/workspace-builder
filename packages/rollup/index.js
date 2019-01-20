const fs = require("fs");
const chalk = require("chalk");
const {
  bin,
  rootDir,
  workspaceDir,
  exec,
} = require("@workspace-builder/tools");

module.exports = function build(workspace) {
  let rollupConfig;
  if (fs.existsSync(rootDir("rollup.config.js"))) {
    rollupConfig = rootDir("rollup.config.js");
  }
  if (fs.existsSync(workspaceDir("rollup.config.js"))) {
    rollupConfig = workspaceDir("rollup.config.js");
  }
  if (rollupConfig == null) {
    throw new Error(
      chalk`{red No rollup.config.js present in either workspace dir or project dir}`
    );
  }

  exec(`${bin("rollup")} -c ${rollupConfig}`);
};
