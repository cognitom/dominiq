import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import babel from "rollup-plugin-babel"
import { uglify } from "../../scripts/uglify.js"

export default {
  input: "demo/basic-app/main.js",
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelrc: false,
      presets: [["@babel/env", { modules: false }]],
      plugins: ["@babel/plugin-proposal-async-generator-functions"]
    })
    //uglify()
  ],
  output: {
    file: "demo/basic-app/bundle.js",
    format: "iife",
    sourcemap: true
  }
}
