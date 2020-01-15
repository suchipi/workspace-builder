const fs = require("fs");
const path = require("path");
const shelljs = require("shelljs");
const chalk = require("chalk");
const child_process = require("child_process");

// This changes during a build so we need to get it now.
// NOTE: This assumes workspace-builder is run from the build rootDir.
const start = process.cwd();

const rootDir = (...parts) => path.resolve(start, ...parts);
// During a build, process.cwd() changes to the workspace path
const workspaceDir = (...parts) => path.resolve(process.cwd(), ...parts);

const bin = (name) => {
  const workspacePath = workspaceDir("node_modules", ".bin", name);
  if (fs.existsSync(workspacePath)) {
    return workspacePath;
  } else {
    return rootDir("node_modules", ".bin", name);
  }
};
const exec = (cmd) => {
  const result = shelljs.exec(cmd);
  if (result.code != 0) {
    throw new Error(
      chalk`{red '${cmd}' exited with a nonzero exit code: ${result.code}}`
    );
  }
  return result;
};
const spawn = (cmd) => {
  const child = child_process.exec(cmd, {
    cwd: process.cwd(),
  });
  child.stdout.pipe(process.stdout);
  child.stderr.pipe(process.stderr);
  return child;
};

module.exports = {
  rootDir,
  workspaceDir,
  bin,
  exec,
  spawn,
};
