import { listen } from "../lib/"
import DOMMock from "./lib/dom-mock.js"

beforeEach(() => {
  document.body.innerHTML = ""
})

test("listens events", done => {
  const dom = document.body
  dom.innerHTML = `
    <form>
      <input name="first" value="John">
      <input name="last" value="Doe">
    </form>`
  const input = dom.querySelector("input[name=first]")
  const mock = new DOMMock()
  listen(mock, "change").subscribe(e => {
    expect(e.target.name).toBe("first")
    expect(e.target.value).toBe("Mike")
    done()
  })
  input.value = "Mike"
  mock.dispatch("change", input)
})
