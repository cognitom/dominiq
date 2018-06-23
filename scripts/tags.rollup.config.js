import { uglify } from "./uglify.js"

const production = !process.env.ROLLUP_WATCH

export default {
  input: "lib/tags.js",
  plugins: [production && uglify()],
  output: {
    file: "tags.js",
    format: "umd",
    name: "dominiqTags",
    sourcemap: !production
  }
}
