# Dominiq

[WIP] Web components and JavaScript utilities for extracting the data from DOM:

- `extract()` for basic extraction
- `listen()`, `toData()`, `toName()` for observables
- `<data-group>`, `<data-array>`, `<data-proxy>` for advanced extraction


## Core concept

If we have a DOM tree like this:

```html
<body>
  <input name="first" value="Tstuomu">
  <input name="last" value="Kawamura">
</body>
```

We can extract the data from the dom:

```javascript
import {extract} from 'dominiq'
const data = extract(document.body) // {first: 'Tsutomu', last: 'Kawamura'}
```

## Usage

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
const listener = () => merge(state, extract(dom) && update()
dom.addEventListener('change', listener)
update()
```

`extract()` gets a whole data from DOM tree, but what we need is the data has just changed. So here is a little improvement:

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

This is a observable version of the code above:

```javascript
import merge from 'lodash.merge'
import {render} from 'lit-html'
import {listen, toData, toName} from 'dominiq'
import view from './view.js'

const state = {first: '', last: ''}
const dom = document.body
const update = () => render(view(state), dom)
listen(dom, 'change').map(toData).subscribe(data => merge(state, data) && update())
update()
```

**Note**: `listen()` is just a thin helper and equivalent to [RxJS's fromEvent()](http://reactivex.io/rxjs/class/es6/Observable.js~Observable.html#static-method-fromEvent)

To catch `click` events on the button, add the lines below:

```javascript
listen(dom, 'click').map(toName).subscribe(name => {
  switch (name) {
    case 'submit': return alert(`Thanks ${state.first}!`)
  }
})
```

## Name and value attributes

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

As you see above, the `name` attribute becomes a key, and the `value` attribute becomes a value in the data object.

## Helper Elements

Before use these tags, import `dominiq/tags`:

```javascript
import 'dominiq/tags'
```

### Groups

HTML:

```html
<data-group name="name">
  <input name="first" value="Tsutomu">
  <input name="last" value="Kawamura">
</data-group>
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

### Arrays

HTML:

```html
<data-array name="people">
  <input value="Tsutomu">
  <input value="Mike">
</data-group>
```

Data:

```json
{
  "people": [
    "Domniq",
    "Greg"
  ]
}
```

### Proxy

Some third party custom elements has no events like `change` or `input`. For such a unstandard element, `<data-proxy>` can proxy events and values.

HTML:

```html
<data-proxy name="animal" selector="[aria-selected]" listen="click">
  <paper-dropdown-menu>
    <paper-listbox>
      <paper-item value="dog" aria-selected>Dog</paper-item>
      <paper-item value="cat">Cat</paper-item>
    </paper-listbox>
  </paper-dropdown-menu>
</data-proxy>
```

Data:

```json
{
  "animal": "dog"
}
```
