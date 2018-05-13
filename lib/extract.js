import { merge, getProp, createPartialData } from "./util.js"

/**
 * Extract data from specified DOM element
 * @param {HTMLElement} root
 * @returns {Object}
 */
export function extract(root) {
  const partials = [].concat(_normals(root), _radios(root), _checkboxes(root))
  return merge(...partials)
}

function _normals(root) {
  const namedElements = root.querySelectorAll(
    "[name]:not([type=radio]):not([type=checkbox])"
  )
  return Array.from(namedElements)
    .map(element => [getProp(element, "name"), getProp(element, "value")])
    .filter(([name, value, type]) => value !== undefined)
    .map(([name, value]) => createPartialData(name, value))
}

function _radios(root) {
  return _base(root, "radio").map(([name, value]) =>
    createPartialData(name, value)
  )
}

function _checkboxes(root) {
  const data = _base(root, "checkbox").reduce((acc, [name, value]) => {
    acc[name] || (acc[name] = [])
    acc[name].push(value)
    return acc
  }, {})
  return Object.keys(data).map(name => createPartialData(name, data[name]))
}

function _base(root, type) {
  const namedElements = root.querySelectorAll(`[name][type=${type}]`)
  return Array.from(namedElements)
    .map(element => [
      getProp(element, "name"),
      getProp(element, "value"),
      getProp(element, "checked")
    ])
    .filter(([name, value, checked]) => value !== undefined && checked)
}

/**
 * Convert event to data
 * @param {Event} e
 * @param {HTMLElement} e.target
 * @returns {Object}
 */
export function toData({ target }) {
  const name = getProp(target, "name")
  if (!name) return null
  const value = getProp(target, "value")
  return createPartialData(name, value)
}

/**
 * Convert event to name
 * @param {Event} e
 * @param {HTMLElement} e.target
 * @returns {string}
 */
export function toName({ target }) {
  return getProp(target, "name")
}
