import { uglify } from "./uglify.js"

const production = !process.env.ROLLUP_WATCH

export default {
  input: "lib/zen-observable-polyfill.js",
  plugins: [production && uglify()],
  output: {
    file: "zen-observable-polyfill.js",
    format: "iife",
    name: "zenObservablePolyfill",
    sourcemap: !production
  }
}
