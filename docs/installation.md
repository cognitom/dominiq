# Installation

Install via

```bash
$ npm install dominiq
```

## Polyfills

### Observable

There's nothing you have to do manually. At this point, there's [no Observable support in browsers](https://kangax.github.io/compat-table/esnext/#test-Observable) yet. So we use [zen-observable](https://github.com/zenparsing/zen-observable) as a polyfill *internally*. In the future, we will probably drop this dependency.

**Note**: we use `.map()` `.filter()` `.flatMap()` in examples. But be aware that they're extentions by `zen-observable` and [still not appeared in the proposal](https://github.com/tc39/proposal-observable#example-observing-keyboard-events).

### Async iteration

Async iteration will probably be a part of ES2018, and Chrome and Firefox has [already supported natively](http://kangax.github.io/compat-table/es2016plus/#test-Asynchronous_Iterators). At this point you may need a pre-compilation with babel and this plugin:

- [transform-async-generator-functions](https://babeljs.io/docs/plugins/transform-async-generator-functions/)

Here's an example setup for [Rollup](https://rollupjs.org). Install `babel` and `rollup` with some plugins:

```bash
npm install --save-dev \
  babel-core \
  babel-preset-env \
  babel-polyfill \
  babel-plugin-external-helpers \
  babel-plugin-transform-async-generator-functions \
  rollup \
  rollup-plugin-babel \
  rollup-plugin-commonjs \
  rollup-plugin-node-resolve
```

Rollup with babel:

```javascript
// rollup.config.js
import resolve from "rollup-plugin-node-resolve"
import commonjs from "rollup-plugin-commonjs"
import babel from "rollup-plugin-babel"

export default {
  input: "main.js",
  plugins: [
    resolve(),
    commonjs(),
    babel({
      babelrc: false,
      presets: [["env", { modules: false }]],
      plugins: [
        "transform-async-generator-functions",
        "external-helpers"
      ]
    })
  ],
  output: {
    file: "bundle.js",
    format: "iife"
  }
}
```

You may also need `regenerator` in some way:

```html
<script src="https://cdn.jsdelivr.net/npm/babel-regenerator-runtime@6.5.0/runtime.min.js"></script>
```
<!--stackedit_data:
eyJoaXN0b3J5IjpbMTQ0MTkyODM4MF19
-->