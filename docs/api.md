# APIs

## Core
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

## Utilities

- `emptize(data)`: convert `undefined` or `null` to `''` (empty)
- `<input-proxy>`: a custom element adapter for
