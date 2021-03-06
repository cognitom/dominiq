import { uglify } from "./uglify.js"

const production = !process.env.ROLLUP_WATCH

export default {
  input: "lib/observable-polyfill.js",
  plugins: [production && uglify()],
  output: {
    file: "observable-polyfill.js",
    format: "iife",
    name: "observablePolyfill",
    sourcemap: !production
  }
}
