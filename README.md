# Dominiq

[WIP] JavaScript utilities and web components for extracting the data from DOM:

- `extract()` data from DOM.
- `listen()` DOM and convert events `toData()` or `toName()` in Observable way.
- `register(actions)`, then `emit` the action to send the data to `observable`.

![Dominiq's Flow](docs/fig.png)

## Core concept

From such a DOM tree:

```html
<body>
  <input name="first" value="Tstuomu">
  <input name="last" value="Kawamura">
</body>
```

Extract the data:

```javascript
const data = extract(document.body) // {first: 'Tsutomu', last: 'Kawamura'}
```

Or, merge them into the `state` continuously:

```javascript
const state = {first: '', last: ''}
listen(document.body, 'change') // Create event observable
  .map(toData) // Extract the data
  .subscribe(data => merge(state, data))
```

## Typical usages

Prepare such a `view` file:

```javascript
import {html} from 'lit-html/lib/lit-extended'
export default state => html`
  <h1>Hello ${state.first}!</h1>
  <input name="first" value="${state.first}">
  <input name="last" value="${state.last}">
  <button name="submit">Click me!</button>
`
```

**Note**: In the examples below, we use [lit-html](https://github.com/Polymer/lit-html) as a HTML renderer, but you can choose any library/framework for it.

### Native way

We can create `state` and `render` it as usual. And then we can extract data from DOM.

```javascript
import merge from 'lodash.merge'
import {render} from 'lit-html'
import {extract} from 'dominiq'
import view from './view.js'

const state = {first: '', last: ''}
const dom = document.body
const update = () => render(view(state), dom)
const listener = () => merge(state, extract(dom)) && update()
dom.addEventListener('change', listener)
update()
```

`extract()` gets a whole data from DOM tree, but what we need is the data which has just changed. So here is a little improvement:

```javascript
import {toData} from 'dominiq'
const listener = e => merge(state, toData(e)) && update()
```

Instead of `extract()`, we can distill the partial data via `toData(e)`.

### Observable way

Install observable polyfills:

```bash
$ npm install zen-observable
```

This is an observable version of the code above:

```javascript
import merge from 'lodash.merge'
import {render} from 'lit-html'
import {listen, toData, toName} from 'dominiq'
import view from './view.js'

const state = {first: '', last: ''}
const dom = document.body
const update = data => render(view(merge(state, data)), dom)
listen(dom, 'change') // Create event observable
  .map(toData) // Extract the data
  .subscribe(update)
update()
```

**Note**: `listen()` is just a thin helper and equivalent to [RxJS's fromEvent()](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-fromEvent)

To catch `click` events on the button, add actions:

```javascript
const actions = name => {
  switch (name) {
    case 'submit': return alert(`Thanks ${state.first}!`)
  }
}
listen(dom, 'click').map(toName).subscribe(actions)
```

## Some basics in Dominiq

### Name and value attributes

If we have this DOM,

```html
<input name="first" value="Tsutomu">
<input name="last" value="Kawamura">
```

we will get this data (via `extract()`):

```json
{
  "first": "Tsutomu",
  "last": "Kawamura"
}
```

As you see above, the `name` attribute becomes a key, and the `value` attribute becomes a value in the data object. It's totally simple, isn't it?

### Dot concatenated names

Name attributes can take a dodconcatenated name like `person.first`:

```html
<input name="person.first" value="Tsutomu">
<input name="person.last" value="Kawamura">
```

we will get this data (via `extract()`):

```json
{
  "person": {
    "first": "Tsutomu",
    "last": "Kawamura"
  }
}
```

### Full or partial data

`extract()` method extracts full data from the DOM. On the other hand `toData()` extracts a partial one from the event.

| type    | method        | source |
| ------- | ------------- | ------ |
| full    | extract(dom)  | DOM    |
| partial | toData(event) | event  |

Only if you want to get entire data, use `extract()`. Otherwise, `toData()` is fast and a better way.

### Flat or nested states

A `state` could be *flat* like this:

```json
{
  "first": "",
  "last": "",
  "city": ""
}
```

Or *nested* like this:

```json
{
  "person": {
    "first": "",
    "last": ""
  },
  "city": ""
}
```

Which is better? It depends on the size of your project and the design of its model. If your page is simple enough, you may prefer *flat* one. If not, you may need it be *nested*.

Be aware that `Object.assign()` is just "shallow copy", so it doesn't care about nested deeper elements, and it could be override the nested value unexpectedly. To merge properly, another third party method is needed.

| type   | merge method      | pros          | cons                  |
| ------ | ----------------- | ------------- | --------------------- |
| flat   | `Object.assign()` | easy and fast | messy in bigger pages |
| nested | `lodash.merge()`  | manageable    | not a native method   |

A typical nested partial looks like this:

```json
{"person": {"first": "Tsutomu"}}
```

If you merge this partial into the state above, you will get this one:

```json
{
  "person": {
    "first": "Tsutomu",
    "last": ""
  },
  "city": ""
}
```


## A real world example

In our real world, we need more extra steps:

- Computed properties: the values calculated from other values in the state. For an example, `full` name depends on `last` and `first`.
- Async requests: retrieve values from databases, and so on.
- Sanitizers: removes spaces, capitarizes the first letter, ...etc.
- Validation: check them!
- Actions: side efects and ad hoc state manipulations.

```javascript
import merge from 'lodash.merge'
import {render} from 'lit-html'
import {listen, toData, toName, sanitize} from 'dominiq'
import view from './view.js'

main()
async function main () {
  const person = await fetchPerson()
  const state = {
    // Properties from databases
    first: person.first,
    last: person.last,
    zip: person.zip,
    address: person.address,

    // Computed properties
    get full () { return `${this.first} ${this.last}` }
  }
  const sanitizers = {
    first: val => val.toUpperCase(),
    last: val => val.toUpperCase()
  }
  const dom = document.body
  const update = async data => {
    if (data.zip && !data.address) {
      data.address = await zipToAddress(zip)
    }
    merge(state, sanitize(data, sanitizers))
    render(view(state), dom)
  }
  const actions = name => {
    switch (name) {
      case 'submit': return alert(`Thanks ${state.person.first}!`)
    }
  }
  listen(dom, 'change').map(toData).subscribe(update)
  listen(dom, 'click').map(toName).subscribe(actions)
  update(state)
}

// Some async requests:
async function fetchPerson () {...}
async function zipToAddress (zip) {...}
```

### Computed properties

Some properties could be automatically calculated from others. We don't have to store such values. Instead of that, use getters of the object: 

```javascript
const state = {
  first: '',
  last: '',
  get full () { return `${this.first} ${this.last}` }
}
```

### Async requests

If you need to fetch something asyncronously, feel free to use `async` anywhere you like. Everything is naked and not encapsuled under frameworks.

For an example, extend this `update()` function...

```javascript
const update = data => {
  merge(state, sanitize(data, sanitizers))
  render(view(state), dom)
}
```

into the one with `async`/`await` like below:

```javascript
const update = async data => {
  if (data.zip && !data.address) {
    data.address = await zipToAddress(zip)
  }
  merge(state, sanitize(data, sanitizers))
  render(view(state), dom)
}
```

### Sanitizers

Dominiq provides a small utility method `sanitize()`. Before merging data into the state, the data should be sanitized. You can define a sanitizer for each properties.

```javascript
import {sanitize} from 'dominiq'
const sanitizers = {
  first: val => val.toUpperCase(),
  last: val => val.toUpperCase()
}
const sanitized = sanitize(data, sanitizers)
```

Nested sanitizers are also allowed:

```javascript
const sanitizers = {
  person: {
    first: val => val.toUpperCase(),
    last: val => val.toUpperCase()
  }
}
```

Make sure that the structure of `sanitizers` matches to the `state` exactly. Unmatched sanitizers are just ignored.

### Input validations

Before sending information to the server, let's validate properties. For this purpose we can use [computed properties](#computed-properties) again.

**Point**: validate before rendering, not before actions

```javascript
const state = {
  first: '',
  last: '',
  get ok () { return !!this.first && !!this.last }
}
```

Then, check the result of validation like this:

```html
<button name="submit" disabled="${!state.ok}">Click me!</button>
```

### Actions

Think about a simple counter. The user clicks "up" or "down" button. 

```javascript
const state = {counter: 0}
const update = data => {...}
const actions = name => {
  switch (name) {
    case 'up': return update({counter: state.counter + 1})
    case 'down': return update({counter: state.counter - 1})
  }
}
listen(dom, 'change').map(toData).subscribe(update)
listen(dom, 'click').map(toName).subscribe(actions)
```

The code above is ok for small applications. For larger ones, we have an action registration method. The equivalent above is here:

```javascript
import {register} from 'dominiq'
const state = {counter: 0}
const update = data => {...}
const actions = {
  up: ({counter}) => ({counter: counter + 1}),
  down: ({counter}) => ({counter: counter - 1})
}
const {observable, emit} = register(actions, state)
listen(dom, 'change').map(toData).subscribe(update)
listen(dom, 'click').map(toName).subscribe(emit)
observable.subscribe(update)
```

Actions receives the reference to the state and supporsed to return nothing, or a *partial data* if the state should be changed.

**Note**: actions could be one of them:

- function
- async function (ES2017)
- **async generator** (ES2018)

```javascript
const actions = {
  // async function
  async load () {
    const user = await getUser()
    return {user}
  },
  // async generator
  async *save () {
    yield {waiting: true} // this may deactivate its UI
    await putUser()
    yield {waiting: false} // this may reactivate its UI
  }
}
```

With an async genrator, we can send data twice or more!

## APIs

- `extract(dom)`: extract full data from the element
  - *dom*: `HTMLElement`
- `listen(dom, type)`: create an `Observable`
  - *dom*: `HTMLElement`
  - *type*: 'change', 'input', 'click' ...etc.
- `toData(event)`: extract partial data from the event
- `toName(event)`: study the name of element which the event happens
- `register(actions[, state])`: this returns `{observable, emit}`.
  - *actions*: the object which contains actions on each key
  - *state*: a reference to the state (if you want to write actions in other file, you need to pass `state` here)
  - *observable*: the observable created by register function.
  - *emit(name)*: emit the action with `name` and the result will send to observable above.
- `sanitize(data, sanitizers)`: sanitize the data by `sanitizers`
  - *data*: data to sanitize
  - *sanitizers*: the object which contains sanitizer function on each key

### Utilities

- `emptize(data)`: convert `undefined` or `null` to `''` (empty)

### Helper tags

Before using helper tag(s), import `dominiq/tags`:

```javascript
import 'dominiq/tags'
```

#### Input Proxy (soon)

Some third party custom elements has no events like `change` or `input`. For such a unstandard element, `<input-proxy>` can proxy events and values.

HTML:

```html
<input-proxy name="animal" selector="[aria-selected]" listen="click">
  <paper-dropdown-menu>
    <paper-listbox>
      <paper-item value="dog" aria-selected>Dog</paper-item>
      <paper-item value="cat">Cat</paper-item>
    </paper-listbox>
  </paper-dropdown-menu>
</input-proxy>
```

Data:

```json
{
  "animal": "dog"
}
```

## Motivation

See [Motivation](docs/motivation.md).
