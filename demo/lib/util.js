const emptizer = {
  get(target, key) {
    const isObject = typeof target[key] === "object" && target[key] !== null
    return isObject ? new Proxy(target[key], emptizer) : target[key] || ''
  }
}

/**
 * Make the field empty if the value is undefined or null
 * It's convenient to suppress showing 'undefined' on rendering
 * Note: the data passed will be mutated while emptizing
 * @param {Object} data - the data to sanitize
 * @returns {Object} proxied object
 */
export function emptize(target) {
  return new Proxy(target, emptizer)
}

export function sleep (msec) {
  return new Promise(resolve => setTimeout(() => resolve(), msec))
}
