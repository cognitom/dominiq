import resolve from "rollup-plugin-node-resolve"
import { uglify } from "./uglify.js"

const production = !process.env.ROLLUP_WATCH

export default {
  input: "lib/observable-polyfill.js",
  plugins: [resolve(), production && uglify()],
  output: {
    file: "observable-polyfill.js",
    format: "iife",
    name: "observablePolyfill",
    sourcemap: !production
  }
}
