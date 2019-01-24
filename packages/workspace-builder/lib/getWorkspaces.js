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
    };
  });

  return workspaces;
};
