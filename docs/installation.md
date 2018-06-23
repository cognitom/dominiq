# Installation

Install via `npm` (or `yarn` or whatever):

```bash
$ npm install dominiq
```

## Polyfills

### Observable

At this point, there's [no Observable support in browsers](https://kangax.github.io/compat-table/esnext/#test-Observable) yet. The easiest way is load this polyfill into your `index.html`:

```html
<script src="https://unpkg.com/dominiq/observable-polyfill.js"></script>
```

This script introduces [Observable](https://github.com/tc39/proposal-observable/blob/master/src/Observable.js) as a global.

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
<script src="https://unpkg.com/regenerator-runtime/runtime.js"></script>
```
