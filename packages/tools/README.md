# `@workspace-builder/tools`

Some helper utilities for use from within a [`workspace-builder`](https://npm.im/workspace-builder) builder module.

## Usage/API

```js
const {
  rootDir,
  workspaceDir,
  bin,
  exec,
  spawn,
} = require("@workspace-builder/tools");

// rootDir: get the absolute path to the project root dir or a path relative to the project root dir.
rootDir(); // eg "/Users/suchipi/Code/my-project"
rootDir(".babelrc"); // eg "/Users/suchipi/Code/my-project/.babelrc"
rootDir(".storybook", "webpack.config.js"); // eg "/Users/suchipi/Code/my-project/.storybook/webpack.config.js"

// workspaceDir: get the absolute path to the current workspace, or a path relative to the current workspace dir.
workspaceDir(); // eg "/Users/suchipi/Code/my-project/packages/my-package"
workspaceDir(".babelrc"); // eg "/Users/suchipi/Code/my-project/packages/my-package/.babelrc"
workspaceDir(".storybook", "webpack.config.js"); // eg "/Users/suchipi/Code/my-project/packages/my-package/.storybook/webpack.config.js"

// bin: get the absolute path to a bin installed from npm. Searches <workspaceDir>/node_modules/.bin first, and goes to <rootDir>/node_modules/.bin if it doesn't exist there.
bin("babel"); // eg "/Users/suchipi/Code/my-project/node_modules/.bin/babel"

// exec: Run a command-line script from within the workspace dir and wait for it to complete. If it exits with a nonzero status code, an error will be thrown.
exec(`${bin("babel")} src --out-dir dist`); // runs eg "/Users/suchipi/Code/my-project/node_modules/.bin/babel src --out-dir dist" from within the workspace dir

// spawn: Run a command-line script from within the workspace dir and DO NOT wait for it to complete.
spawn(`${bin("babel")} --watch src --out-dir dist`); // runs eg "/Users/suchipi/Code/my-project/node_modules/.bin/babel src --out-dir dist" from within the workspace dir
```

## License

MIT
