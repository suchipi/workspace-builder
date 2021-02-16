const fs = require("fs");
const {
  bin,
  rootDir,
  workspaceDir,
  exec,
  spawn,
} = require("@workspace-builder/tools");

function build(workspace, options) {
  if (!options.watch) return;

  if (!fs.existsSync(workspaceDir("./dist/index.js"))) {
    try {
      fs.mkdirSync(workspaceDir("./dist"));
    } catch (err) {
      /* ignored */
    }
    fs.writeFileSync(workspaceDir("./dist/index.js"), "");
  }

  spawn(
    `${bin("cross-env")} NODE_ENV=development ${bin(
      "nodemon"
    )} -w './dist/**/*' ./dist/index.js `
  );
}

build.managesOwnWatcher = true;

module.exports = build;
