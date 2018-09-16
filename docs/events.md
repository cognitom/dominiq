# Events

Dominiq has several lifecycle events:

- `render`: the state changed. It's time to render!
- `rendered`: the rendering process completed. Feel free to adjust DOMs via MDC, Bootstrap or jQuery...
- `started`: the app started. The first view has been just rendered.
- `stopped`: the app stopped.
- `changed:*`: the state changed.

## render

```javascript
const app = new App({ initialState, actions })
listen(app, "render").subscribe(state => render(view(state), dom))
```

## rendered / started

```javascript
listen(app, "rendered").subscribe(() => {
  MDCButton.attachTo(document.querySelector(".mdc-button"))
})
```

`rendered` and `started` events are fired after all `render` event handlers are processed. `rendered` will be called every after `render`, but `started` will be called only at the first.

## stopped

After `app.stop()` called, `stopped` event will be fired.

## changed

`changed` is a special type of events. Use it in this syntax: `changed`:*propName*

For example, if you manage the page with `state.page`, you could listen events like this:

```javascript
const initialState = { page: "home" }
const app = new App({ initialState })
listen(app, "changed:page").subscribe(() => {
  MDCButton.attachTo(document.querySelector(".mdc-button"))
})

app.start()
// MDCButton attached
app.commit({ page: "contact" })
// MDCButton attached again
```

Compared to `rendered` which is called every after `render`, `changed:page` will be called only when the value `state.page` is changed.

## Order of events


```javascript
const initialState = { first: "John", last: "Doe" }
const app = new App({ initialState })
listen(app, "render").subscribe(state => console.log("render"))
listen(app, "rendered").subscribe(state => console.log("rendered"))
listen(app, "changed:propName").subscribe(state => console.log("changed"))
listen(app, "started").subscribe(state => console.log("started"))
listen(app, "stopped").subscribe(state => console.log("stopped"))

app.start()
// log: render -> rendered -> changed -> started
app.commit({ first: "Jane" })
// log: render -> rendered -> changed
app.stop()
// log: stopped
```
