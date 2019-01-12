import commonjs from "rollup-plugin-commonjs";
import nodeResolve from "rollup-plugin-node-resolve";
import json from "rollup-plugin-json";

export default {
  plugins: [
    nodeResolve({
      // Only use node resolution algorithm on relative paths, so that
      // stuff from node_modules ends up external
      only: [/^\.{0,2}\//],
    }),
    commonjs(),
    json(),
  ],
};
