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

test("converts e to name", done => {
  const dom = document.body
  dom.innerHTML = `
    <form>
      <input name="first" value="John">
      <input name="last" value="Doe">
    </form>`
  const input = dom.querySelector("input[name=first]")
  const mock = new DOMMock()
  listen(mock, "change")
    .map(toName)
    .subscribe(name => {
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
  listen(mock, "change")
    .map(toData)
    .subscribe(partial => {
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
  listen(mock, "change")
    .map(toData)
    .subscribe(partial => {
      expect(partial).toBeNull()
      done()
    })
  input.value = "Mike"
  mock.dispatch("change", input)
})
