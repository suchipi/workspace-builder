const chokidar = require("chokidar");
const getWorkspaces = require("../lib/getWorkspaces");
const build = require("../lib/build");
const debounce = require("lodash/debounce");

const workspaces = getWorkspaces();

function buildAndLogError(workspace, isBuilt = {}) {
  if (isBuilt[workspace.name]) {
    return;
  }
  try {
    build(workspace);
    isBuilt[workspace.name] = true;
  } catch (err) {
    console.error(err);
  }

  // Build anything that could need to be rebuilt as a
  // result of us changing
  workspaces.forEach((otherWorkspace) => {
    if (otherWorkspace.dependsOn.includes(workspace)) {
      buildAndLogError(otherWorkspace, isBuilt);
    }
  });
}

// First, build all workspaces
require("./build");

workspaces
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
