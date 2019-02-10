const chalk = require("chalk");
const getWorkspaces = require("../lib/getWorkspaces");
const { clean, getBuilders } = require("../lib/build");

const isBuilt = {};

function doBuild(workspace) {
  if (isBuilt[workspace.name]) {
    return;
  } else {
    workspace.dependsOn.forEach((depWorkspace) => {
      doBuild(depWorkspace);
    });

    const builders = getBuilders(workspace);
    if (builders.length === 0) {
      console.log(
        chalk`{yellow Skipping ${
          workspace.name
        } because it has no 'workspace-builder' key in its package.json}`
      );
    } else {
      console.log(chalk`{grey Cleaning ${workspace.name}}`);
      clean(workspace);

      console.log(chalk`{blue Building ${workspace.name}}`);
      builders.forEach((builder) => {
        console.log(chalk`{cyan ${workspace.name}: ${builder.name}}`);
        builder.run(workspace, { watch: false });
      });
    }

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
