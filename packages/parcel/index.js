const { spawn, exec, bin } = require("@workspace-builder/tools");

function build(workspace, options) {
  if (options.watch) {
    spawn(`${bin("parcel")} src/index.html`);
  } else {
    exec(`${bin("parcel")} build src/index.html`);
  }
}

build.managesOwnWatcher = true;

module.exports = build;
