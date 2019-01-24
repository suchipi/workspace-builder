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
    dependsOn: Array<Workspace>; // array of workspace packages that this workspace has in its package.json dependencies
  }
  ```

It also has a watch mode where it does the same thing, but watches each workspace directory's `src` dir for changes and re-runs the build when a change occurs.

## Usage

- Create a monorepo using yarn workspaces
- Add a `"workspace-builder"` key to the package.json of each workspace that needs to be built. The value of this key should be the path to/name of a "builder module" or an array of paths to/names of "builder modules".
- Put all your source code for each workspace in its `src` dir. The build output will be written to its `dist` dir.

## Official builder modules

Here is a list of all the official builder modules available on npm:

- [`@workspace-builder/babel`](https://npm.im/@workspace-builder/babel)
- [`@workspace-builder/copy-ts`](https://npm.im/@workspace-builder/copy-ts)
- [`@workspace-builder/rollup`](https://npm.im/@workspace-builder/rollup)
- [`@workspace-builder/rollup-cjs`](https://npm.im/@workspace-builder/rollup-cjs)
- [`@workspace-builder/rollup-umd`](https://npm.im/@workspace-builder/rollup-umd)

## License

MIT
