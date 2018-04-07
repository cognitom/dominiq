# Dominiq

[WIP] JavaScript utilities for extracting the data from DOM:

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

## Details

- Typical usages (see below)
- [Basics in Dominiq](docs/basics.md)
- [Advanced usages](docs/advanced.md)
- [APIs](docs/api.md)
- [Motivation](docs/motivation.md)

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

Check also [Actions](docs/advanced.md#actions) section for more details and `register(actions)` method.

## License

MIT
