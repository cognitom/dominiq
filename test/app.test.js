import { listen, App } from "../lib/"
import DOMMock from "./lib/dom-mock.js"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("creates app with initialState", done => {
  const initialState = { first: "John", last: "Doe" }
  const app = new App({ initialState })
  listen(app, "render").subscribe(state => {
    expect(state).toEqual({ first: "John", last: "Doe" })
    done()
  })
  app.start()
})

test("doesn't trigger a render event before starting", done => {
  let count = 0
  const initialState = { first: "John" }
  const app = new App({ initialState })
  app.commit({ last: "Doe" })
  listen(app, "render").subscribe(state => {
    count++
  })
  app.start()
  expect(count).toEqual(1)
  done()
})

test("extends states", done => {
  const initialState = { first: "John" }
  const app = new App({ initialState })
  app.extend({ initialState: { last: "Doe" } })
  listen(app, "render").subscribe(state => {
    expect(state).toEqual({ first: "John", last: "Doe" })
    done()
  })
  app.start()
})

test("creates app with initialState and sanitizers", done => {
  const initialState = { first: "John", last: "Doe" }
  const sanitizers = {
    first: val => val.toLowerCase(),
    last: val => val.toUpperCase()
  }
  const app = new App({ initialState, sanitizers })
  listen(app, "render").subscribe(state => {
    expect(state).toEqual({ first: "john", last: "DOE" })
    done()
  })
  app.start()
})
