# Dominiq

[WIP] Web components and JavaScript utilities for extracting the data from DOM:

- `extract()` for basic extraction
- `listen()`, `toData()`, `toName()` for observables
- `<input-group>`, `<input-array>`, `<input-proxy>` for advanced extraction

## Core concept

If we have a DOM tree like this:

```html
<body>
  <input name="first" value="Tstuomu">
  <input name="last" value="Kawamura">
</body>
```

Extract the data from it:

```javascript
import {extract} from 'dominiq'
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
import {html} from 'lit-html'
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

To catch `click` events on the button, add the lines below:

```javascript
listen(dom, 'click') // Create event observable
  .map(toName) // Convert to `name`
  .filter(name => name == 'submit')
  .subscribe(() => alert(`Thanks ${state.first}!`))
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

### Full or partial data

`extract()` method extracts full data from the DOM. On the other hand `toData()` extracts a partial one from the event.

| type    | method        | source |
| ------- | ------------- | ------ |
| full    | extract(dom)  | DOM    |
| partial | toData(event) | event  |

Only if you want to get entire data, use `extract()`. Otherwise, `toData()` is fast and better way.

### Flat or nested

A `state` could be *flat* like this:

```json
{
  "first": "",
  "last": "",
  "address": ""
}
```

Or *nested* like this:

```json
{
  "name": {
    "first": "",
    "last": ""
  },
  "city": ""
}
```

Which is better? It depends on the size of API and the design of its model. If your page is simple enough, you may prefer *flat* one. If not, you may need it be *nested*.

Be aware that `Object.assign()` is just "shallow copy", so it doesn't care about nested deeper elements, and it could be override the nested value unexpectedly. To merge properly, another third party method is needed.

| type   | merge method      | pros          | cons                  |
| ------ | ----------------- | ------------- | --------------------- |
| flat   | `Object.assign()` | easy and fast | messy in bigger pages |
| nested | `lodash.merge()`  | manageable    | not a native method   |

A typical nested partial looks like this:

```json
{"name": {"first": "Tsutomu"}}
```

If you merge this partial into the state above, you will get this one:

```json
{
  "name": {
    "first": "Tsutomu",
    "last": ""
  },
  "city": ""
}
```


## Helper elements

Before using these tags, import `dominiq/tags`:

```javascript
import 'dominiq/tags'
```

### Groups

HTML:

```html
<input-group name="name">
  <input name="first" value="Tsutomu">
  <input name="last" value="Kawamura">
</input-group>
```

Data:

```json
{
  "name": {
    "first": "Tsutomu",
    "last": "Kawamura"
  }
}
```

**Note**: not like Bootstrap's `<div class="input-group">`, this is just an abstracted data element. There's no default effects on its appearance.

### Arrays

HTML:

```html
<input-array name="people">
  <input value="Dom">
  <input value="Greg">
</input-array>
```

Data:

```json
{
  "people": [
    "Dom",
    "Greg"
  ]
}
```

### Proxy

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

## APIs

### Observable

### Sanitizers

### Custom tags

See [Helper elements](#helper-elements) section avobe.

## Real world example

In our real world, we need more extra steps:

- Computed properties: the values calculated from other values in the state. For an example, `full` name depends on `last` and `first`.
- Async requests: retrieve values from databases, and so on.
- Sanitizers: removes spaces, capitarizes the first letter, ...etc.

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
  listen(dom, 'change').map(toData).subscribe(update)
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

### Input validations

Before submit, we have to validate properties. For this purpose we can use [computed properties](#computed-properties).

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

## Motivation

See [Motivation](motivation.md).
