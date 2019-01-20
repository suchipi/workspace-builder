const { cd, rm, mkdir } = require("shelljs");
const chalk = require("chalk");
const { rootDir, workspaceDir } = require("@workspace-builder/tools");

module.exports = function build(workspace) {
  let { "workspace-builder": workspaceBuilder } = workspace.packageJson;
  if (!workspaceBuilder) {
    console.log(
      chalk`{yellow Skipping ${
        workspace.name
      } because it has no "workspace-builder" key in its package.json.}`
    );
    return;
  }

  cd(workspace.path);
  mkdir("-p", "dist");
  rm("-rf", "dist/*");

  console.log(chalk`{blue Building ${workspace.name}}`);

  workspaceBuilder = Array.isArray(workspaceBuilder)
    ? workspaceBuilder
    : [workspaceBuilder];
  workspaceBuilder.forEach((buildMethod) => {
    console.log(chalk`{cyan ${workspace.name}: ${buildMethod}}`);

    let builder;
    try {
      // Try path relative to monorepo root
      builder = require(rootDir(buildMethod));
    } catch (err) {
      // Try path relative to workspace root
      try {
        builder = require(workspaceDir(buildMethod));
      } catch (err) {
        // Otherwise, try bare require (for node_modules lookup)
        // This is the one whose error message should be user-facing because its error message is clearer imo
        builder = require(buildMethod);
      }
    }

    builder(workspace);
  });
};
