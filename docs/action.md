# Action

An action is just a function. For example, a simple action could be like following:

```javascript
const initialState = { first: "John" }
const actions = {
  hello (state) { console.log(`Hello ${ state.first }! `) }
}
```

In this example, the action returns nothing, but make it return a value if you need a [mutation](#mutation) in the state.

## Dispatch

Before dispatching, create an App instance:

```javascript
const app = new App({initialState, actions})
```

Then, dispatch:

```javascript
app.dispatch('hello')
```

The argument is the name of the action you want to dispatch. Basically, that's it.

Typically, we use this in Observable streams. If we have such a HTML:

```html
<button name="hello">Click me!</button>
```

we can use `app.dispatch` like this:

```javascript
listen(document.body, 'click')
  .subscribe(e => app.dispatch(toName(e))) // extract name from `event.target`
```

Or, here's a shortcut:

```javascript
listen(document.body, 'click').subscribe(app.dispatch)
// .dispatch() handles events as much as the names of actions. 
```

**Note**: `.dispatch()` method will processed asyncronously.
**Note**: `.dispatch()` method is bound to `app` in constructor automatically, so you don't have to write like `.subscribe(name => app.dispatch(name))`.

## Mutation

If an action returns or yields some data, the data will be sent to `app.commit()` internally:

```javascript
const initialState = { counter: 0 }
const actions = {
  up (state) { return { counter: state.counter + 1 } }
}
const app = new App({initialState, actions})
app.dispatch("up") // internally the data will be passed to app.commit()
```

Ok, then, try the Observable style.

```html
<button name="up">Up!</button>
```

With the HTML above, we can listen the button, and continuously dispatch `up` action when the button is clicked:

```javascript
const initialState = { counter: 0 }
const actions = {
  up (state) { return { counter: state.counter + 1 } }
}
const app = new App({initialState, actions})
listen(document.body, "click").subscribe(app.dispatch)
```

> **Note**: Why not `Promise`? `Promise` can only return the value once. It's not enough. On the other hand, `Observable` can return the values multiple times. See also `async generator` in the next section.

## Async operation

Actions could be one of them:

- function
- async function (ES2017)
- **async generator** (ES2018)

```javascript
const actions = {
  // function
  save (state) {
    sendToServer(state.user)
    return {message: 'Saved.'}
  }
  // async function
  async betterSave (state) {
    await sendToServer(state.user)
    return {message: 'Saved.'}
  },
  // async generator
  async *bestSave (state) {
    yield {waiting: true} // this may deactivate its UI
    await sendToServer(state.user)
    yield {waiting: false} // this may reactivate its UI
  }
}
```

It's epic, isn't it? With an async genrator, we can send data twice or more!

## Separated code

You might want to write actions in a separated file. That's a good idea. Try the code like below:

```javascript
// actions.js
export function doSomethingSoon (state) {...}
export async function doSomethingAsync (state) {...}
export async function* doSomethingMultipleTimes (state) {...}
```

Then, import them:

```javascript
import * as actions from './actions.js'
```
