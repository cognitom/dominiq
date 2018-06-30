
# State

In Dominiq, a state of application is just a pure object. For example:

```javascript
const state = {
  first: "John",
  last: "Doe"
}
```

Typically, we can update our DOM via a rendering function with this state:

```javascript
import { render } from "lit-html"
import view from "./view.js"

const state = { first: "John", last: "Doe" }
render(view(state), dom)
```

But it's not enough. The state could be changed via user inputs, or server communications. How can we do? Let's check the next section.

> **Note**: `render()` function is not the part of `dominiq` but provided from [lit-html](https://github.com/Polymer/lit-html) or other view libraries.

## Supported types

As a state, we can use these types (Date + types available in JSON):

- `String`
- `Number`
- `Boolean`
- `Date`
- `null`

## Set and get

Domniq provides the simple way to commit or retrieve a new state. The first step is make an App instance with `initialState`:

```javascript
const initialState = { first: "John", last: "Doe" }
const app = new App({ initialState })
```

How can I change the state? The instance has a `.commit()` method:

```javascript
app.commit({ first: "Mike" })
// the state has been changed to { first: "Mike", last: "Doe" }
```

The argument is a partial data which we want to get. Internally, the given partial will be merged into the current state. We don't have to give whole the state.

Then, how can we get the current state? There're two different scenarios:

- Rendering
- Inside actions

For rendering, listen and subscribe `app` instance on "render". The subscriber will get the current state as an argument:

```javascript
listen(app, "render")
  .subscribe(state => render(view(state), dom))
```

> **Note**: we can listen `app` in the same way on `dom`.

Inside actions, we need to access the current state, too. The actions take an argument which references to the state:

```javascript
const actions = {
  swap (state) { return { last: state.first, first: state.last } }
}
```

> **Note**: In both cases (renderling / actions), the state is provided as immutable. (Internally, wrapped by [a proxy object](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Proxy))

## Flat or nested

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

Then, how can we commit a nested value in deep? A typical nested partial looks like this:

```json
{"person": {"first": "John"}}
```

If you merge this partial into the state above, you will get this one:

```json
{
  "person": {
    "first": "John",
    "last": ""
  },
  "city": ""
}
```

## Computed properties

Some properties could be automatically calculated from others. We don't have to store such values. Instead of that, use getters of the object: 

```javascript
const initialState = {
  first: '',
  last: '',
  get full () { return `${this.first} ${this.last}` }
}
```

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

## Sanitization

Before merging data into the state, the data will be sanitized automatically, if `sanitizers` are given. You can define a sanitizer for each properties:

```javascript
const sanitizers = {
  first: val => val.toUpperCase(),
  last: val => val.toUpperCase()
}
const app = new App({initialState, sanitizers})
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

**Note**: for simplicity, a sanitizer can't be an async function. If you need an async one inside a sanitization, you may need an async [action](action.md).
