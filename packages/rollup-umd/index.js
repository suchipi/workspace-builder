const chalk = require("chalk");
const fs = require("fs");
const path = require("path");
const { bin, root, exec } = require("@workspace-builder/tools");

let rollupConfig = path.resolve(__dirname, "default-rollup.config.js");
if (fs.existsSync(root("rollup.config.js"))) {
  rollupConfig = root("rollup.config.js");
}

module.exports = function build(workspace) {
  const { umdBundleName } = workspace.packageJson;
  if (!umdBundleName) {
    throw new Error(
      chalk`{red Cannot build ${
        workspace.name
      } because it has no 'umdBundleName' key in its package.json}`
    );
  }

  exec(
    `${bin(
      "rollup"
    )} -c ${rollupConfig} src/index.js --file dist/index.js --format umd --name ${umdBundleName}`
  );
};
