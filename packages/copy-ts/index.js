const path = require("path");
const globby = require("globby");
const { mkdir, cp } = require("shelljs");

module.exports = function build(workspace) {
  const copyPaths = globby.sync(["src/**/*.ts"]);
  copyPaths.forEach((copyPath) => {
    const targetPath = copyPath.replace(/^src\//, "dist/");
    mkdir("-p", path.dirname(targetPath));
    cp(copyPath, targetPath);
  });
  console.log(
    `Copied ${copyPaths.length} file${copyPaths.length === 1 ? "" : "s"}.`
  );
};
