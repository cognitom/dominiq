import { join } from "path"
import alias from "rollup-plugin-alias"
import resolve from "rollup-plugin-node-resolve"
import { uglify } from "./scripts/uglify.js"

const production = !process.env.ROLLUP_WATCH
const nodeModules = join(__dirname, "node_modules")

export default {
  input: "lib/index.js",
  plugins: [
    alias({
      "zen-observable": join(__dirname, "scripts", "zen-observable-adapter.js")
    }),
    resolve(),
    production && uglify()
  ],
  output: {
    file: "index.js",
    format: "umd",
    name: "dominiq",
    sourcemap: !production
  }
}
