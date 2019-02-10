const { spawn, exec, bin } = require("@workspace-builder/tools");

function build(workspace, options) {
  const { parcelArgs = "" } = workspace.packageJson;
  if (options.watch) {
    spawn(`${bin("parcel")} ${parcelArgs} src/index.html`);
  } else {
    exec(`${bin("parcel")} ${parcelArgs} build src/index.html`);
  }
}

build.managesOwnWatcher = true;

module.exports = build;
