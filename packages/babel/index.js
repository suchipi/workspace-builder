const fs = require("fs");
const path = require("path");
const { bin, root, exec } = require("@workspace-builder/tools");

let babelConfig = path.resolve(__dirname, "defaultbabelrc");
if (fs.existsSync(root(".babelrc"))) {
  babelConfig = root(".babelrc");
}
if (fs.existsSync(root("babel.config.js"))) {
  babelConfig = root("babel.config.js");
}

module.exports = function build(workspace) {
  exec(
    `env NODE_ENV=production ${bin(
      "babel"
    )} --config-file ${babelConfig} --extensions ".ts,.js" src -d dist --ignore *.test.js`
  );
};
