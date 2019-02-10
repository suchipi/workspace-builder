const path = require("path");
const { cd, rm, mkdir } = require("shelljs");
const chalk = require("chalk");
const { rootDir } = require("@workspace-builder/tools");

function getBuilders(workspace) {
  let { "workspace-builder": workspaceBuilder } = workspace.packageJson;
  if (!workspaceBuilder) {
    return [];
  }

  const workspaceDir = (...parts) => path.resolve(workspace.path, ...parts);

  const workspaceBuilders = Array.isArray(workspaceBuilder)
    ? workspaceBuilder
    : [workspaceBuilder];

  return workspaceBuilders.map((buildMethod) => {
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
        try {
          builder = require(buildMethod);
        } catch (err) {
          const message = [
            chalk`{red Failed to load the builder specified by the 'workspace-builder' key in ${
              workspace.name
            }'s package.json.}`,
            "Tried to require:",
            "  " + rootDir(buildMethod),
            "  " + workspaceDir(buildMethod),
            "  " + buildMethod,
          ].join("\n");

          throw new Error(message);
        }
      }
    }

    return {
      name: buildMethod,
      run: (...args) => {
        cd(workspace.path);
        return builder(...args);
      },
      managesOwnWatcher: builder.managesOwnWatcher,
    };
  });
}

function clean(workspace) {
  cd(workspace.path);
  mkdir("-p", "dist");
  rm("-rf", "dist/*");
}

module.exports = {
  clean,
  getBuilders,
};
