const getWorkspaces = require("../lib/getWorkspaces");
const build = require("../lib/build");

getWorkspaces().forEach((workspace) => {
  try {
    build(workspace);
  } catch (err) {
    console.error(err);
    process.exitCode = 1;
  }
});
