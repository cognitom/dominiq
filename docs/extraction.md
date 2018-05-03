# Extraction

What does *extraction* means? To explain it, let's start with *state* and *DOM*:

```
state --(render)--> DOM
```

The state turns into the DOM via a *rendering* function. Then how about the oposite direction? That is *extraction*!

```
state <--(extraction)-- DOM
```

For example, from such a DOM tree:

```html
<body>
  <input name="first" value="John">
  <input name="last" value="Doe">
</body>
```

we could *extract* the data like this:

```javascript
const data = extract(document.body)
// { first: "John", last: "Doe" }
```

> **Note**: `render()` function is not the part of `dominiq` but provided from [lit-html](https://github.com/Polymer/lit-html) or other view libraries.

## Nested names

If the form has a dot-concatenated name like `person.first`, the extracted data from it will be a nested object:

```html
<body>
  <fieldset>
    <input name="person.first" value="Tstuomu">
    <input name="person.last" value="Kawamura">
  </fieldset>
  <input name="agreement" type="checkbox" value="ok" checked>
</body>
```

```javascript
const data = extract(document.body)
// {
//   person: { first: "John", last: "Doe" },
//   agreement: "ok"
// }
```


## From events

Ok, let's go back to the simple one:

```html
<body>
  <input name="first" value="John">
  <input name="last" value="Doe">
</body>
```

If an user change the value of `<input>` from "John" to "Mike", you may catch a new data:

```javascript
import { extract } from "dominiq"
const dom = document.body
const listener = () => {
  const data = extract(dom)
  console.log(data) // { first: "Mike", last: "Doe" }
}
dom.addEventListener("change", listener)
```

But, in this case, you may only need the one changed. Let's use `toData()` instead of `extract()`:

```javascript
import { toData } from "dominiq"
const dom = document.body
const listener = event => {
  const data = toData(event)
  console.log(data) // { first: "Mike" }
}
dom.addEventListener("change", listener)
```

Dominiq has two methods for extraction from events:

- `toData(event)`: extract the partial data from `event.target`
- `toName(event)`: extract the name from `event.target`

See also [Full or partial data](#full-or-partial-data).

## Via Observables

`Observable` is a new way to get values continuously like a stream. Instead of `addEventListener()`, use `listen()` to hear DOM events:

```javascript
import { listen, toData } from "dominiq"
listen(document.body, "change") // Create event observable
  .map(toData) // Extract the data from event.target
  .subscribe(console.log) // { first: "Mike" }
```

It's a much prefered way in Dominiq. Let's use this as a new standard! Observable simplifies the flow and process of event and data. In the example above, `listen()` returns an Observable object. Observable has a few methods:

- `observable.subscribe()`: subscribes the observable and catches the data.
- `observable.map()`: modifies the data like `Array.prototype.map()`.
- `observable.filter()`: filters the data like `Array.prototype.filter()`.
- `observable.flatMap()`: another version of `.map()`. It can handle async operations inside.

See [zen-observable](https://github.com/zenparsing/zen-observable) for more details.

> **Note**: Observable proposal is [at Stage 1](https://github.com/tc39/proposals#stage-1) and ready to go to Stage 2.

## Full or partial data

`extract()` method extracts full data from the DOM. On the other hand `toData()` extracts a partial one from the event. Compare these:

| type    | method          | source | example                          |
| ------- | --------------- | ------ | -------------------------------- |
| full    | `extract(dom)`  | DOM    | `{ first: "Mike", last: "Doe" }` |
| partial | `toData(event)` | event  | `{ first: "Mike" }`              |

Only if you want to get entire data, use `extract()`. Otherwise, `toData()` is fast and a better way.


## Event delegation

You may write an event handler on each element's `onchange`:

```html
// Example A
<body>
  <form>
    <input name="first" onchange="...">
    <input name="second" onchange="...">
    <input name="third" onchange="...">
  </form>
</body>
```

But, you don't have to. Let them delegate the event to their parent element:

```html
// Example B
<body>
  <form onchange="...">
    <input name="first">
    <input name="second">
    <input name="third">
  </form>
</body>
```

Should we write a handler in HTML? No. We can keep HTML clean:

```html
// Example C
<body>
  <form>
    <input name="first">
    <input name="second">
    <input name="third">
  </form>
</body>
```

And `listen()` from outside the view:

```javascript
const dom = document.body // or document.forms[0]
listen(dom, "change").map(toData).subscribe(...)
```
