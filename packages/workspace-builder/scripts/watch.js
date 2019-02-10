const chokidar = require("chokidar");
const chalk = require("chalk");
const getWorkspaces = require("../lib/getWorkspaces");
const { getBuilders } = require("../lib/build");
const debounce = require("lodash/debounce");

const workspaces = getWorkspaces();

function build(workspace, builder, options) {
  console.log(
    chalk`{cyan ${workspace.name}: ${builder.name}} {gray ${
      builder.managesOwnWatcher
        ? "(using own watcher)"
        : "(using built-in watcher)"
    }}`
  );

  try {
    builder.run(workspace, options);
  } catch (err) {
    console.log(err);
  }
}

// First, build all workspaces
const initialBuildDone = {};
workspaces.forEach(initialBuild);
function initialBuild(workspace) {
  if (initialBuildDone[workspace.name]) {
    return;
  }

  const builders = getBuilders(workspace);

  if (builders.length === 0) {
    console.log(
      chalk`{yellow Skipping ${
        workspace.name
      } because it has no 'workspace-builder' key in its package.json}`
    );
    return;
  }

  console.log(chalk`{blue Building ${workspace.name}}`);

  builders.forEach((builder) => {
    build(workspace, builder, { watch: true });
  });

  initialBuildDone[workspace.name] = true;
  // Build anything that could need to be rebuilt as a
  // result of us changing
  workspaces.forEach((otherWorkspace) => {
    if (otherWorkspace.dependsOn.includes(workspace)) {
      initialBuild(otherWorkspace);
    }
  });
}

// Then, start watchers for any workspaces that have builders, which haven't started their own watchers
workspaces
  .filter((workspace) => {
    const builders = getBuilders(workspace);
    return (
      builders.length > 0 &&
      !builders.every((builder) => builder.managesOwnWatcher)
    );
  })
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

        watchBuild(workspace, {});
      }, 100)
    );
  });
function watchBuild(workspace, isBuiltForThisEvent) {
  if (isBuiltForThisEvent[workspace.name]) {
    return;
  }

  const builders = getBuilders(workspace).filter(
    (builder) => !builder.managesOwnWatcher
  );

  if (builders.length === 0) {
    return;
  }

  builders.forEach((builder) => {
    build(
      workspace,
      builder,
      { watch: true, initialRun: false },
      { watch: true, initialRun: false }
    );
  });

  isBuiltForThisEvent[workspace.name] = true;
  // Build anything that could need to be rebuilt as a
  // result of us changing
  workspaces.forEach((otherWorkspace) => {
    if (otherWorkspace.dependsOn.includes(workspace)) {
      watchBuild(otherWorkspace, isBuiltForThisEvent);
    }
  });
}
