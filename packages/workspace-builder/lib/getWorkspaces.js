const path = require("path");
const fs = require("fs");
const chalk = require("chalk");
const { rootDir } = require("@workspace-builder/tools");
const pkgJson = require(rootDir("package.json"));

module.exports = function getWorkspaces() {
  const workspaces = pkgJson.workspaces.map((shortPath) => {
    const fullPath = rootDir(shortPath);

    if (!fs.existsSync(fullPath)) {
      throw new Error(
        chalk`{red Workspace is present in monorepo's package.json but its path doesn't exist: ${shortPath}}`
      );
    }

    const workspacePkgJson = require(path.resolve(fullPath, "package.json"));
    const srcDirLocation = path.join(fullPath, "src");

    return {
      name: shortPath,
      path: fullPath,
      packageJson: workspacePkgJson,
      srcDir: fs.existsSync(srcDirLocation) ? srcDirLocation : null,
      dependsOn: [],
    };
  });

  workspaces.forEach((workspace) => {
    const deps = workspace.packageJson.dependencies || {};
    const devDeps = workspace.packageJson.devDependencies || {};
    const keys = Object.keys(deps).concat(Object.keys(devDeps));

    keys.forEach((dep) => {
      const otherWorkspace = workspaces.find(
        (otherWorkspace) => otherWorkspace.packageJson.name === dep
      );
      if (otherWorkspace) {
        workspace.dependsOn.push(otherWorkspace);
      }
    });
  });

  return workspaces;
};
