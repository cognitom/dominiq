import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import babel from 'rollup-plugin-babel'

export default {
  input: 'demo/main.js',
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelrc: false,
      presets: [
        ['env', {modules: false}]
      ],
      plugins: [
        'transform-async-generator-functions',
        'external-helpers'
      ]
    })
  ],
  output: {
    file: 'demo/bundle.js',
    format: 'iife',
    sourcemap: true
  }
}
