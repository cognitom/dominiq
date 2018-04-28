import uglify from "rollup-plugin-uglify"

const production = !process.env.ROLLUP_WATCH

export default {
  input: "lib/index.js",
  plugins: [production && uglify()],
  output: {
    file: "index.js",
    format: "umd",
    name: "dominiq",
    sourcemap: !production
  }
}
