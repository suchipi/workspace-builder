# `@workspace-builder/shell-command`

This is a workspace builder module for [`workspace-builder`](http://npm.im/workspace-builder).

It runs the shell command specified via the `"@workspace-builder/shell-command"` key in your package.json:

```json
// package.json
{
  "@workspace-builder/shell-command": {
    "build": "echo hi",
    "watch": "echo watching"
  }
}
```

The `"watch"` command is optional; if omitted, workspace-builder's builtin watcher will be used, and will run your `"build"` command on change.

## License

MIT
