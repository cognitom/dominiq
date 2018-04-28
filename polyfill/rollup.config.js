import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import uglify from "rollup-plugin-uglify"

export default {
  input: "polyfill/observable.js",
  plugins: [resolve(), commonjs(), uglify()],
  output: {
    file: "observable-polyfill.js",
    format: "iife",
    name: "Observable",
    sourcemap: false
  }
}
