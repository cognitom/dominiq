export function sanitize (values, sanitizers = {}) {
  if (!values) return values
  _sanitize(values, sanitizers)
  return values
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

export function emptize (values) {
  if (!values) return values
  for (const key of Object.keys(values)) {
    if (values[key] === undefined || values[key] === null) {
      values[key] = ''
    } else if (typeof values[key] === 'object') {
      emptize(values[key])
    }
  }
  return values
}
