import { readonly, merge, getNestedItem } from "../lib/util.js"

describe("readonly", () => {
  test("makes readonly", () => {
    const raw = { first: "John", last: "Doe" }
    const state = readonly(raw)
    expect(() => {
      state.first = "Mike"
    }).toThrow()
    expect(state).toEqual({ first: "John", last: "Doe" })
  })
  test("makes readonly but editable throw the raw reference", () => {
    const raw = { first: "John", last: "Doe" }
    const state = readonly(raw)
    raw.first = "Mike"
    expect(state).toEqual({ first: "Mike", last: "Doe" })
  })
})

describe("merge", () => {
  test("merges an object into a shallow object", () => {
    const target = { first: "John", last: "Doe" }
    const source = { first: "Mike" }
    merge(target, source)
    expect(target).toEqual({ first: "Mike", last: "Doe" })
  })
  test("merges an object into a nested object", () => {
    const target = { person: { first: "John", last: "Doe" } }
    const source = { person: { first: "Mike" } }
    merge(target, source)
    expect(target).toEqual({ person: { first: "Mike", last: "Doe" } })
  })
  test("returns the first object's refence", () => {
    const target = { first: "John", last: "Doe" }
    const source = { first: "Mike" }
    const ref = merge(target, source)
    expect(ref).toBe(target)
  })
})

describe("misc", () => {
  test("gets a nested item", () => {
    const state = { person: { first: "John", last: "Doe" } }
    const item = getNestedItem("person.first", state)
    expect(item).toBe("John")
  })
})
