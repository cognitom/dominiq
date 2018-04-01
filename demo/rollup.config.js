import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

export default {
  input: 'demo/main.js',
  plugins: [
    resolve(),
    commonjs()
  ],
  output: {
    file: 'demo/bundle.js',
    format: 'iife',
    sourcemap: true
  }
}
