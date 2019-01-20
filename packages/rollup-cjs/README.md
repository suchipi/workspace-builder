# `@workspace-builder/rollup-cjs`

This is a workspace builder module for [`workspace-builder`](http://npm.im/workspace-builder).

It runs rollup in the workspace using `src/index.js` as the entrypoint, outputting a CommonJS module to `dist/index.js`. You can change the entrypoint and output path by using the `rollupCjsEntry` and `rollupCjsOutput` keys in your `package.json`.

If you have a `rollup.config.js` in the workspace or monorepo root, it will use it. If not, it will use a default config.

## License

MIT
