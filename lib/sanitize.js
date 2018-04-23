/**
 * Sanitize data
 * Note: the data passed will be mutated while sanitizing
 * @param {Object} data - the data to sanitize
 * @param {Object} sanitizers
 * @returns {Object}
 */
export function sanitize (data, sanitizers = {}) {
  if (!data) return data
  _sanitize(data, sanitizers)
  return data
}

function _sanitize (values, sanitizers) {
  for (const key of Object.keys(values)) {
    if (typeof sanitizers[key] === 'function' && values[key] !== undefined && values[key] !== null) {
      values[key] = sanitizers[key](values[key])
    } else if (typeof sanitizers[key] === 'object' && typeof values[key] === 'object') {
      _sanitize(values[key], sanitizers[key])
    }
  }
}
