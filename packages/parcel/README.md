# `@workspace-builder/parcel`

This is a workspace builder module for [`workspace-builder`](http://npm.im/workspace-builder).

It runs parcel in the workspace using `src/index.html` as the entrypoint. In watch mode, it also runs the server that hosts the content (on port 1234).

To pass additional CLI options to parcel, use the `parcelArgs` key in your `package.json`.

## License

MIT
