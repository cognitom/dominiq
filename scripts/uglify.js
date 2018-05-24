// from https://github.com/ezekielchentnik/rollup-plugin-uglify-es/blob/master/index.js
import { minify } from "uglify-es"

export function uglify(options = {}) {
  return {
    name: "uglify",
    transformBundle(code) {
      const result = minify(
        code,
        Object.assign({ sourceMap: { url: "out.js.map" } }, options) // force sourcemap creation
      )
      if (result.map) {
        const commentPos = result.code.lastIndexOf("//#")
        if (commentPos !== -1) {
          result.code = result.code.slice(0, commentPos).trim()
        }
      }
      return result
    }
  }
}
