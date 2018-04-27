import uglify from 'rollup-plugin-uglify'

const production = !process.env.ROLLUP_WATCH

export default {
  input: 'tags/index.js',
  plugins: [
    production && uglify()
  ],
  output: {
    file: 'tags.js',
    format: 'umd',
    name: 'dominiqTags',
    sourcemap: !production
  }
}
