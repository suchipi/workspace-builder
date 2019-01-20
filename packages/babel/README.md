# `@workspace-builder/babel`

This is a workspace builder module for [`workspace-builder`](http://npm.im/workspace-builder).

It runs babel in the workspace such that each file in `src` is compiled to a file in `dist`.
It uses either your `babel.config.js` or `.babelrc` from your workspace dir, your `babel.config.js` or `.babelrc` from your monorepo root, or a default config if you don't have either.

## License

MIT
