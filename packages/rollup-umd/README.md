# `@workspace-builder/rollup-umd`

This is a workspace builder module for [`workspace-builder`](http://npm.im/workspace-builder).

It runs rollup in the workspace using `src/index.js` as the entrypoint, outputting a UMD bundle to `dist/index.js`. You can change the entrypoint and output filepath using the `rollupUmdEntry` and `rollupUmdOutput` keys in your `package.json`.

You must specify the name for the global (when in a browser) via the `rollupUmdBundleName` key in your workspace's package.json.

If you have a `rollup.config.js` in the workspace or monorepo root, it will use it. If not, it will use a default config.

## License

MIT
