/**
 * Get property (or attribute)
 * @param {HTMLElement} element - target DOM element
 * @param {string} property - the key of propery to get
 * @returns {*}
 */
export function getProp(element, property) {
  return (
    element[property] ||
    (element.hasAttribute(property)
      ? element.getAttribute(property)
      : undefined)
  )
}

/**
 * Create vector-like object
 * ex. {person: {first: 'Tom'}} from 'person.first' and 'Tom'
 * @param {string} name - dot concatenated name
 * @param {*} value - the value to store
 * @returns {Object}
 */
export function createPartialData(name, value) {
  const path = name.split(".")
  let cur = value
  for (const name of path.reverse()) cur = { [name]: cur }
  return cur
}

/**
 * Get nested item by name
 * ex. 'Tom' from 'person.first' and {person: {first: 'Tom'}}
 * @param {string} name - dot concatenated name
 * @param {object} tree - the tree
 * @returns {*}
 */
export function getNestedItem(name, tree) {
  if (!name) return undefined
  const path = name.split(".")
  let cur = tree
  for (const key of path) {
    cur = cur[key]
    if (cur === undefined) return undefined
  }
  return cur
}

const protector = {
  get(target, key) {
    const isObject = typeof target[key] === "object" && target[key] !== null
    return isObject ? new Proxy(target[key], protector) : target[key]
  },
  set(target, key, value) {
    return false
  }
}

/**
 * Return readonly object
 * @param {object} target - the object which you want make readonly
 * @returns {object} proxied object
 */
export function readonly(target) {
  return new Proxy(target, protector)
}

function isPlainObject(obj) {
  if (!obj || obj.toString() !== "[object Object]") return false
  if (obj.constructor) {
    const hasOwnConstructor = obj.hasOwnProperty("constructor")
    const proto = obj.constructor.prototype
    const hasIsPrototypeOf = proto && proto.hasOwnProperty("isPrototypeOf")
    if (!hasOwnConstructor && !hasIsPrototypeOf) return false
  }
  // a hack to check that all properties are own
  let key
  for (key in obj) {
    /**/
  }
  return typeof key === "undefined" || obj.hasOwnProperty(key)
}

/**
 * Merge one or multiple objects to the first object
 * @param {object} target - the object to extend
 * @param {array} sources - array of source objects
 * @returns {object} same reference to target
 */
export function merge(target = {}, ...sources) {
  for (const source of sources) {
    if (source == null) continue
    for (const name in source) {
      const prop = target[name]
      const data = source[name]
      if (target === data) continue
      if (data && (isPlainObject(data) || Array.isArray(data))) {
        const clone = Array.isArray(data)
          ? prop && Array.isArray(prop)
            ? prop
            : []
          : prop && isPlainObject(prop)
            ? prop
            : {}
        target[name] = merge(clone, data)
      } else if (typeof data !== "undefined") target[name] = data
    }
  }
  return target
}
