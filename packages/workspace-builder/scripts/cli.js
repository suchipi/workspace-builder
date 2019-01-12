#!/usr/bin/env node

const usage = `Usage:

Build all workspaces:
  workspace-builder

Watch all workspaces and rebuild when they change:
  workspace-builder watch
`;

switch (process.argv[2]) {
  case "watch": {
    require("./watch");
    break;
  }
  case undefined: {
    require("./build");
    break;
  }
  default: {
    console.log(usage);
    process.exit(1);
  }
}
