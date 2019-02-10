#!/usr/bin/env node

const usage = `Usage:

Build all workspaces:
  workspace-builder

Clean all workspaces:
  workspace-builder clean

Watch all workspaces and rebuild when they change:
  workspace-builder watch
`;

switch (process.argv[2]) {
  case "watch": {
    require("./watch");
    break;
  }
  case "clean": {
    require("./clean");
    break;
  }
  case "build":
  case undefined: {
    require("./build");
    break;
  }
  default: {
    console.log(usage);
    process.exit(1);
  }
}
