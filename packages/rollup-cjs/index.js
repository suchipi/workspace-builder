const fs = require("fs");
const path = require("path");
const {
  bin,
  rootDir,
  workspaceDir,
  exec,
} = require("@workspace-builder/tools");

module.exports = function build(workspace) {
  let rollupConfig = path.resolve(__dirname, "default-rollup.config.js");
  if (fs.existsSync(rootDir("rollup.config.js"))) {
    rollupConfig = rootDir("rollup.config.js");
  }
  if (fs.existsSync(workspaceDir("rollup.config.js"))) {
    rollupConfig = workspaceDir("rollup.config.js");
  }

  const entry = workspace.packageJson.rollupCjsEntry || "src/index.js";
  const output = workspace.packageJson.rollupCjsOutput || "dist/index.js";

  exec(
    `${bin("rollup")} -c ${rollupConfig} ${entry} --file ${output} --format cjs`
  );
};
