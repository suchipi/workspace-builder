const getWorkspaces = require("../lib/getWorkspaces");
const build = require("../lib/build");

const isBuilt = {};

function doBuild(workspace) {
  if (isBuilt[workspace.name]) {
    return;
  } else {
    workspace.dependsOn.forEach((depWorkspace) => {
      doBuild(depWorkspace);
    });
    build(workspace);
    isBuilt[workspace.name] = true;
  }
}

getWorkspaces().forEach((workspace) => {
  try {
    doBuild(workspace);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
});
