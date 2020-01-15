const { spawn, exec } = require("@workspace-builder/tools");

function build(workspace, options) {
  const json = workspace.packageJson["@workspace-builder/shell-command"] || {};

  if (options.watch && json.watch) {
    spawn(json.watch);
  } else {
    exec(json.build);
  }
}

build.managesOwnWatcher = function managesOwnWatcher(workspace) {
  const json = workspace.packageJson["@workspace-builder/shell-command"] || {};

  return Boolean(json.watch);
};

module.exports = build;
