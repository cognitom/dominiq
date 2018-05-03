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

Basically, that's it. But, we hava to mention about the use case with Observable. If we have such a HTML:

```html
<button name="hello">Click me!</button>
```

We can use `app.dispatch` like this:

```javascript
listen(document.body, 'click')
  .map(toName) // extract name from `event.target`
  .subscribe(app.dispatch)
```

The argument is the name of the action you want to dispatch.

**Note**: `.dispatch()` method is bound to `app` in constructor automatically, so you don't have to write like `.subscribe(name => app.dispatch(name))`.

## Mutation

```javascript
const initialState = { counter: 0 }
const actions = {
  hello (state) { return { counter: state.counter + 1 } },
  down (state) { return { counter: state.counter - 1 } }
}
const dom = document.body
const app = new App({initialState, actions})
listen(dom, 'click').map(toName).flatMap(app.dispatch).subscribe(app.commit)
listen(app, 'render').subscribe(state => render(view(state), dom))
app.start()
```

## Async operation
