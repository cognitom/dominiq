import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'
import inject from 'rollup-plugin-inject'
import babel from 'rollup-plugin-babel'
import uglify from 'rollup-plugin-uglify'

export default {
  input: 'demo/main.js',
  plugins: [
    resolve(),
    commonjs(),
    inject({
      include: 'demo/**',
      modules: {Observable: 'zen-observable'}
    }),
    babel({
      babelrc: false,
      presets: [
        ['env', {modules: false}]
      ],
      plugins: [
        'transform-async-generator-functions',
        'external-helpers'
      ]
    }),
    uglify()
  ],
  output: {
    file: 'demo/bundle.js',
    format: 'iife',
    sourcemap: true
  }
}
