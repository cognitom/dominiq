# Advanced usages

In our real world, we need more extra steps:

- [Computed properties](#computed-properties): the values calculated from other values in the state. For an example, `full` name depends on `last` and `first`.
- [Async requests](#async-requests): retrieve values from databases, and so on.
- [Sanitizers](#sanitizers): removes spaces, capitarizes the first letter, ...etc.
- [Validation](#validations): check them!
- [Actions](#actions): side efects and ad hoc state manipulations.
- [Code separations](#code-separations): one big file is almost unreadable. Keep each small.

With such steps, the code could be like this:

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

## Computed properties

Some properties could be automatically calculated from others. We don't have to store such values. Instead of that, use getters of the object: 

```javascript
const state = {
  first: '',
  last: '',
  get full () { return `${this.first} ${this.last}` }
}
```

## Async requests

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

## Sanitizers

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

## Input validations

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

## Actions

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
  async save ({id}) {
    await save(user)
    return {message: 'Saved.'}
  },
  // async generator
  async *beterSave ({user}) {
    yield {waiting: true} // this may deactivate its UI
    await save(user)
    yield {waiting: false} // this may reactivate its UI
  }
}
```

With an async genrator, we can send data twice or more!

## Code separations

We already separated our view to `view.js` file. If `main.js` becomes bigger, we may separate `state`, `sanitizers` and `actions`, too.

```javascript
// main.js
import view from './view.js'
import {load, sanitizers} from './person-model.js'
import * as actions from './actions.js'

main()
async function main () {
  const state = await load()
  const dom = document.body
  const update = async data => {
    ...
    render(view(state), dom)
  }
  const {observable, emit} = register(actions, state)
  listen(dom, 'change').map(toData).subscribe(update)
  listen(dom, 'click').map(toName).subscribe(emit)
  observable.subscribe(update)
  update(state)
}
```

Sanitizers could be a part of the model:

```javascript
// person-model.js
export const load = async () => {...}
export const sanitizers = {
  first: val => val.toUpperCase(),
  last: val => val.toUpperCase()
}
```

Then, export each action one by one:

```javascript
export function doSomethingSoon (state) {...}
export async function doSomethingAsync (state) {...}
export async function* doSomethingMultipleTimes (state) {...}
```
