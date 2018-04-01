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
 * Get named path in reversed order
 * ex. ['child', 'parent'] from the DOM below:
 *     <input-group name="parent"><input name="child"></input-group>
 * @param {HTMLElement} to - starting element
 * @param {HTMLElement} from - ending element
 * @returns {string[]}
 */
export function getReversedDomPath (to, from) {
  if (!from) from = document.body
  
  const path = []
  _getDomPath(to)
  return path.length ? path : null
  
  function _getDomPath (element) {
    if (element === from) return
    const name = getProp(element, 'name')
    if (name) path.push(name)
    return _getDomPath(element.parentElement)
  }
}

/**
 * Create vector-like object
 * ex. {name: {last: 'Tom'}} from ['last', 'name'] and 'Tom'
 * @param {string[]} reversedPath - named path in reversed order
 * @param {*} value - the value to store
 * @returns {Object}
 */
export function createNestedObject (reversedPath, value) {
  let cur = value
  for (const name of reversedPath) cur = {[name]: cur}
  return cur
}
