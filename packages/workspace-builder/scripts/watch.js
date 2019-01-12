const chokidar = require("chokidar");
const getWorkspaces = require("../lib/getWorkspaces");
const build = require("../lib/build");
const debounce = require("lodash/debounce");

const buildAndLogError = (workspace) => {
  try {
    build(workspace);
  } catch (err) {
    console.error(err);
  }
};

getWorkspaces()
  .map((workspace) => {
    // First, build all workspaces
    buildAndLogError(workspace);
    return workspace;
  })
  // then, for the ones with src dirs...
  .filter((workspace) => workspace.srcDir)
  .forEach((workspace) => {
    // chokidar spams a bunch of events when you first make a watcher;
    // ignore those
    let ignoringInitialEvents = true;
    setTimeout(() => {
      ignoringInitialEvents = false;
    }, 500);

    // Watch the workspace's src dir and re-build when anything happens
    chokidar.watch(workspace.srcDir).on(
      "all",
      debounce((event, path) => {
        if (ignoringInitialEvents) return;
        buildAndLogError(workspace);
      }, 100)
    );
  });
