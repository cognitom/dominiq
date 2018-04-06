import resolve from 'rollup-plugin-node-resolve'
import commonjs from 'rollup-plugin-commonjs'

const production = !process.env.ROLLUP_WATCH

export default {
  plugins: [
    resolve(),
    commonjs()
  ],
  output: {
    format: 'umd',
    sourcemap: !production
  }
}
