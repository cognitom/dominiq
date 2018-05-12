# APIs

## Core

- `extract(dom)`: extract full data from the element
  - *dom*: `HTMLElement`
- `listen(dom, type)`: create an `Observable`
  - *dom*: `HTMLElement`
  - *type*: 'change', 'input', 'click' ...etc.
- `toData(event)`: extract partial data from the event
- `toName(event)`: study the name of element which the event happens
- `sanitize(data, sanitizers)`: sanitize the data by `sanitizers`
  - *data*: data to sanitize
  - *sanitizers*: the object which contains sanitizer function on each key

## App

`App` handles states and actions together:

```javascript
const app = new App({initialState, sanitizers, actions})`
```

The instance `app` has just four methods:

- `app.commit(partial)`: merges `partial` data into its state
- `app.commit(event)`: converts `event` to data, and merges the data into its state
- `app.dispatch(name)`: dispatches an action by `name`
- `app.dispatch(event)`: converts `event` to name, and dispatches an action by the name
- `app.start()`: starts the app and renders the first view
- `app.stop()`: stops the app

## Tags

- `<input-proxy>`: works as a bridge between non-standard components like Polymer.
