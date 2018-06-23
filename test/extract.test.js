import { listen, extract, toData, toName } from "../lib/"
import DOMMock from "./lib/dom-mock.js"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("extracts input values", () => {
  const dom = document.body
  dom.innerHTML = `
    <form>
      <input name="first" value="John">
      <input name="last" value="Doe">
    </form>`
  const data = extract(dom)
  expect(data).toEqual({ first: "John", last: "Doe" })
})

test("extracts input values with dot concatenated names", () => {
  const dom = document.body
  dom.innerHTML = `
    <form>
      <input name="person.first" value="John">
      <input name="person.last" value="Doe">
    </form>`
  const data = extract(dom)
  expect(data).toEqual({ person: { first: "John", last: "Doe" } })
})

test("extracts checkbox values", () => {
  const dom = document.body
  dom.innerHTML = `
    <form>
      <input name="fruit" type="checkbox" value="Apple" checked>
      <input name="fruit" type="checkbox" value="Orange" checked>
      <input name="fruit" type="checkbox" value="Grape">
    </form>`
  const data = extract(dom)
  expect(data).toEqual({ fruit: ["Apple", "Orange"] })
})

test("extracts checkbox values (only one checked)", () => {
  const dom = document.body
  dom.innerHTML = `
    <form>
      <input name="fruit" type="checkbox" value="Apple" checked>
      <input name="fruit" type="checkbox" value="Orange">
      <input name="fruit" type="checkbox" value="Grape">
    </form>`
  const data = extract(dom)
  expect(data).toEqual({ fruit: ["Apple"] })
})

test("extracts radio button values", () => {
  const dom = document.body
  dom.innerHTML = `
    <form>
      <input name="fruit" type="radio" value="Apple">
      <input name="fruit" type="radio" value="Orange" checked>
      <input name="fruit" type="radio" value="Grape">
    </form>`
  const data = extract(dom)
  expect(data).toEqual({ fruit: "Orange" })
})

test("converts e to name", done => {
  const dom = document.body
  dom.innerHTML = `
    <form>
      <input name="first" value="John">
      <input name="last" value="Doe">
    </form>`
  const input = dom.querySelector("input[name=first]")
  const mock = new DOMMock()
  listen(mock, "change").subscribe(e => {
    const name = toName(e)
    expect(name).toBe("first")
    done()
  })
  input.value = "Mike"
  mock.dispatch("change", input)
})

test("converts e to data", done => {
  const dom = document.body
  dom.innerHTML = `
    <form>
      <input name="first" value="John">
      <input name="last" value="Doe">
    </form>`
  const input = dom.querySelector("input[name=first]")
  const mock = new DOMMock()
  listen(mock, "change").subscribe(e => {
    const partial = toData(e)
    expect(partial).toEqual({ first: "Mike" })
    done()
  })
  input.value = "Mike"
  mock.dispatch("change", input)
})

test("returns null when the target has no name attribute", done => {
  const dom = document.body
  dom.innerHTML = `
    <form>
      <input value="John">
    </form>`
  const input = dom.querySelector("input")
  const mock = new DOMMock()
  listen(mock, "change").subscribe(e => {
    const partial = toData(e)
    expect(partial).toBeNull()
    done()
  })
  input.value = "Mike"
  mock.dispatch("change", input)
})
