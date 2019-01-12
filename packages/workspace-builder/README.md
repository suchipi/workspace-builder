# workspace-builder

CLI tool that run builds for every yarn workspace in your monorepo

## Overview

When run, this tool will:

- Read your monorepo's package.json
- Use the 'workspaces' key to find all the yarn workspaces in your repo
- For each workspace...
- Read the package.json in the workspace dir
- Load the module or file that the `"workspace-builder"` key in the workspace's package.json refers to
- Run the function exported from that file with an object with the following shape:
  ```ts
  interface Workspace {
    name: string;
    path: string; // absolute path to the workspace directory
    packageJson: Object; // The package.json for the workspace
    srcDir: string | null; // absolute path to the workspace's src directory, if it exists
  }
  ```

It also has a watch mode where it does the same thing, but watches each workspace directory's `src` dir for changes and re-runs the build when a change occurs.

## Usage

- Create a monorepo using yarn workspaces
- Add a `"workspace-builder"` key to the package.json of each workspace that needs to be built. The value of this key should be the path to/name of a "builder module" or an array of paths to/names of "builder modules".
- Put all your source code for each workspace in its `src` dir. The build output will be written to its `dist` dir.

## Examples

### Using a builder module from npm

The following example uses the `@workspace-builder/babel` module to build each workspace.
That module requires a `babel.config.js` at the top level.

Directory structure:

```
my-project
├── babel.config.js
├── package.json
└── packages
    ├── my-module
    │   ├── package.json
    │   └── src
    │       └── index.js
    └── my-second-module
        ├── package.json
        └── src
            └── index.js
```

`package.json`:

```json
{
  "private": true,
  "workspaces": ["packages/my-module", "packages/my-second-module"],
  "devDependencies": {
    "workspace-builder": "^0.1.0",
    "@workspace-builder/babel": "^0.1.0"
  },
  "scripts": {
    "build": "workspace-builder",
    "build:watch": "workspace-builder watch"
  }
}
```

`packages/my-module/package.json`:

```json
{
  "name": "@my-project/my-module",
  "workspace-builder": "@workspace-builder/babel"
}
```

`packages/my-second-module/package.json`:

```json
{
  "name": "@my-project/my-second-module",
  "workspace-builder": "@workspace-builder/babel"
}
```

### Using a builder module from a local file

The following example uses a local file to build each workspace.
For the sake of demonstration, this local file relies on an imaginary build tool called "magic-builder".

Directory structure:

```
my-project
├── magic-builder.config.js
├── magic-builder.workspace-builder.js
├── package.json
└── packages
    ├── my-module
    │   ├── package.json
    │   └── src
    │       └── index.js
    └── my-second-module
        ├── package.json
        └── src
            └── index.js
```

`package.json`:

```json
{
  "private": true,
  "workspaces": ["packages/my-module", "packages/my-second-module"],
  "devDependencies": {
    "workspace-builder": "^0.1.0",
    "@workspace-builder/tools": "^0.1.0"
  },
  "scripts": {
    "build": "workspace-builder",
    "build:watch": "workspace-builder watch"
  }
}
```

`magic-builder.workspace-builder.js`:

```js
const { exec, root, bin } = require("@workspace-builder/tools");

module.exports = function build(workspace) {
  // process.cwd() is set to the workspace dir while this runs.
  const configPath = root("magic-builder.config.js"); // get the absolute path to a file, relative to the monorepo root
  const magicBuilderBinPath = bin("magic-builder"); // get the path to a bin from node_modules/.bin
  exec(`${magicBuilderBinPath} --config-file ${configPath} src --out-dir dist`); // Run a CLI application
};
```

`packages/my-module/package.json`:

```json
{
  "name": "@my-project/my-module",
  "workspace-builder": "magic-builder.workspace-builder.js"
}
```

`packages/my-second-module/package.json`:

```json
{
  "name": "@my-project/my-second-module",
  "workspace-builder": "magic-builder.workspace-builder.js"
}
```

### Using multiple builder modules

You can use an array to run multiple builder modules in sequence:

`packages/my-module/package.json`:

```json
{
  "name": "@my-project/my-module",
  "workspace-builder": [
    "@workspace-builder/babel",
    "@workspace-builder/copy-ts"
  ]
}
```

## Official builder modules

Here is a list of all the official builder modules available on npm:

### `@workspace-builder/babel`

Runs babel in the workspace such that each file in `src` is compiled to a file in `dist`.
Uses your `babel.config.js` or `.babelrc` from your monorepo root, or a default config if you don't have one.

### `@workspace-builder/copy-ts`

Copies all `*.ts` files from `src` to `dist`. This way, the type definitions are available when other people install your package from npm.

### `@workspace-builder/rollup-cjs`

Runs rollup in the workspace using `src/index.js` as the entrypoint, outputting a CommonJS module to `dist/index.js`.
If you have a `rollup.config.js` in the monorepo root, it will use it. If not, it will use a default config.

### `@workspace-builder/rollup-umd`

Runs rollup in the workspace using `src/index.js` as the entrypoint, outputting a UMD bundle to `dist/index.js`.
You must specify the name for the global (when in a browser) via the `"umdBundleName"` key in your workspace's package.json.
If you have a `rollup.config.js` in the monorepo root, it will use it. If not, it will use a default config.

## License

MIT

```

```
