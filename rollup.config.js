// import json from '@rollup/plugin-json';
import { nodeResolve } from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import typescript from '@rollup/plugin-typescript';
import progress from 'rollup-plugin-progress';
import glob from 'glob';
import path from 'path';

const entryFiles = glob.sync('**/*.ts', {
  cwd: path.resolve('src')
});
console.log('entry', entryFiles);

const plugins = [
  // json(), // Convert JSON files to ES Modules.
  nodeResolve(),  // Use the Node resolution algorithm
  commonjs(), // convert CommonJS modules to ES6, so they can be included in a Rollup bundle
  typescript(), //  plugin for seamless integration between Rollup and Typescript
  progress(),// Show current module being transpiled by the rollup bundler.
]

export default entryFiles.map(entryFile => {
  console.log('entryfile', path.resolve('src', entryFile));
  return {
    input: path.resolve('src', entryFile),
    output: {
      format: 'cjs',
      file: `output/${entryFile.replace(/.ts$/, '.js')}`
    },
    plugins
  }
})