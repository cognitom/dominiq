/**
 * Get property (or attribute)
 * @param {HTMLElement} element - target DOM element
 * @param {string} property - the key of propery to get
 * @returns {*}
 */
export function getProp (element, property) {
  return element[property] || element.getAttribute(property)
}

/**
 * Create vector-like object
 * ex. {person: {first: 'Tom'}} from 'person.first' and 'Tom'
 * @param {string} name - dot concatenated name
 * @param {*} value - the value to store
 * @returns {Object}
 */
export function createPartialData (name, value) {
  const path = name.split('.')
  let cur = value
  for (const name of path.reverse()) cur = {[name]: cur}
  return cur
}

export function getNestedItem (name, tree) {
  const path = name.split('.')
  let cur = tree
  for (const key of path) {
    cur = cur[key]
    if (cur === undefined) return undefined
  }
  return cur
}
