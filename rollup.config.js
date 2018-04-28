import {join} from "path"
import uglify from "rollup-plugin-uglify"

const production = !process.env.ROLLUP_WATCH

export default {
  input: join(__dirname, "lib", "index.js"),
  plugins: [production && uglify()],
  output: {
    file: join(__dirname, "index.js"),
    format: "umd",
    name: "dominiq",
    sourcemap: !production
  }
}
