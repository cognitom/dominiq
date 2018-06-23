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

function getNamed(target, depth = 0) {
  if (!target || depth > 2) return null
  if (target.hasAttribute("name")) return target
  return getNamed(target.parentElement, depth + 1)
}

/**
 * Convert event to data
 * @param {Event} e
 * @param {HTMLElement} e.target
 * @returns {Object}
 */
export function toData({ target }) {
  const named = getNamed(target)
  if (!named) return null
  const name = getProp(named, "name")
  const value = getProp(named, "value")
  return createPartialData(name, value)
}

/**
 * Convert event to name
 * @param {Event} e
 * @param {HTMLElement} e.target
 * @returns {string}
 */
export function toName({ target }) {
  const named = getNamed(target)
  return named ? getProp(named, "name") : null
}
