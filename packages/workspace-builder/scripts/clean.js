const chalk = require("chalk");
const getWorkspaces = require("../lib/getWorkspaces");
const { clean } = require("../lib/build");

getWorkspaces().forEach((workspace) => {
  try {
    console.log(chalk`{grey Cleaning ${workspace.name}}`);
    clean(workspace);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
});
