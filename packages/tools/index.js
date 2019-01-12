const path = require("path");
const shelljs = require("shelljs");
const chalk = require("chalk");

// This changes during a build so we need to get it now.
// NOTE: This assumes workspace-builder is run from the build root.
const start = process.cwd();

const root = (...parts) => path.resolve(start, ...parts);
const bin = (name) => root("node_modules", ".bin", name);
const exec = (cmd) => {
  const result = shelljs.exec(cmd);
  if (result.code != 0) {
    throw new Error(
      chalk`{red '${cmd}' exited with a nonzero exit code: ${result.code}}`
    );
  }
};

module.exports = {
  root,
  bin,
  exec,
};
