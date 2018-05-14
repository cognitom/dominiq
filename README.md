
# Dominiq

[![Travis CI](https://img.shields.io/travis/cognitom/dominiq/master.svg)](https://travis-ci.org/cognitom/dominiq) [![Codecov](https://img.shields.io/codecov/c/github/cognitom/dominiq/master.svg)](https://codecov.io/gh/cognitom/dominiq) [![npm](https://img.shields.io/npm/v/dominiq.svg)](https://www.npmjs.org/package/dominiq)

A minimalistic approach to create frontend applications:

- `listen()` DOM events and extract data from them in Observable way.
- `App` class provides an easy way to handle states and actions:
  - `app.commit()` to mutate its state
  - `app.dispatch()` to call an action

Dominiq found a natural way to build an application with modern methods. We fully respect these native JavaScript features and just combined them:

- [Proxy (ES2015)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy): for immutable states
- [Getter (ES2015)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/get): for computed properties
- [Async Function (ES2017)](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function) / [Async Iteration (Stage 4)](https://github.com/tc39/proposal-async-iteration): for action handlers
- [Observable (Stage 1)](https://github.com/tc39/proposal-observable): for DOM events, app events and actions
- [Event Delegation (old-world)](https://developer.mozilla.org/en-US/docs/Web/API/Event/target): for view / logic separation

## Contents

- [Core concept](#core-concept) (see below)
- [Basic usages](#basic-usages) (see below)
- [Installation](docs/installation.md)
- [Extraction](docs/extraction.md)
	- Nested names / From events / Via Observables / Full or partial data / Event delegation
- [State](docs/state.md)
	- Set and get / Flat or nested / Computed properties / Input validations / Sanitization
- [Action](docs/action.md)
	- Dispatch / Mutation / Async operation / Separated code
- [APIs](docs/api.md)

## Core concept

From such a DOM tree:

```html
<body>
  <input name="first" value="John">
  <input name="last" value="Doe">
</body>
```

Extract the data:

```javascript
const data = extract(document.body) // { first: "John", last: "Doe" }
```

Or, merge them into the `state` continuously in Observable way:

```javascript
const state = { first: "", last: "" }
listen(document.body, "change") // Create event observable
  .map(toData) // Extract the data
  .subscribe(data => merge(state, data))
```

## Basic usages

Prepare such a view file:

```javascript
// view.js
import { html } from "lit-html/lib/lit-extended"
export default state => html`
  <h1>Hello ${ state.first }!</h1>
  <input name="first" value="${ state.first }">
  <input name="last" value="${ state.last }">
  <button name="submit">Click me!</button>
`
```

**Note**: In the example, we use [lit-html](https://github.com/Polymer/lit-html) as a HTML renderer, but you can choose any library/framework for it.

```javascript
import { render } from "lit-html"
import { listen, toData, toName, App } from "dominiq"
import view from "./view.js"

const initialState = { first: "", last: "" }
const actions = {
  submit (state) { console.log(`Hello ${ state.first }!`) }
}
const dom = document.body
const app = new App({ initialState, actions })

// Listen <input> and commit changes into the state
listen(dom, "change").subscribe(app.commit)
// Listen <button> and dispatch actions
listen(dom, "click").subscribe(app.dispatch)
// Listen app and render the view
listen(app, "render").subscribe(state => render(view(state), dom))
app.start()
```

**Note**: `listen()` is just a thin helper and equivalent to [RxJS's fromEvent()](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-fromEvent)

## License

MIT
