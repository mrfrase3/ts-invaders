// const { nodeResolve } = require('@rollup/plugin-node-resolve');
// const commonjs = require('@rollup/plugin-commonjs');
// const json = require('@rollup/plugin-json');
// const nodePolyfills = require('rollup-plugin-node-polyfills');

module.exports = [{
  input: 'dist/index.js',
  output: [
    {
      file: 'dist/index.mjs',
      format: 'esm',
    },
    {
      file: 'dist/index.umd.js',
      format: 'umd',
      name: 'TSInvaders',
      // globals: {
      //   'node-fetch': 'node-fetch',
      // },
    },
  ],
  context: 'this',
  // external: ['node-fetch'],
  plugins: [
    // commonjs({
    //   ignoreGlobal: true,
    // }),
    // nodePolyfills({ include: ['buffer'] }),
    // nodeResolve({ preferBuiltins: false }),
    // json(),
  ],
}];
