/**
 * Make the field empty if the value is undefined or null
 * It's convenient to suppress showing 'undefined' on rendering
 * Note: the data passed will be mutated while emptizing
 * @param {Object} data - the data to sanitize
 * @returns {Object}
 */
export function emptize (data) {
  if (!data) return data
  for (const key of Object.keys(data)) {
    if (data[key] === undefined || data[key] === null) {
      data[key] = ''
    } else if (typeof data[key] === 'object') {
      emptize(data[key]) // Call it recursively
    }
  }
  return data
}
