import merge from 'lodash.merge'
import {getProp, getReversedDomPath, createNestedObject} from './util.js'

/**
 * Extract data from specified DOM element
 * @param {HTMLElement} root
 * @returns {Object}
 */
export function extract (root) {
  const namedElements = root.querySelectorAll('[name]')
  const partials = Array.from(namedElements).map(element => {
    const reversedPath = getReversedDomPath(element, root)
    const value = getProp(element, 'value')
    return createNestedObject(reversedPath, value)
  })
  return merge({}, ...partials)
}

/**
 * Convert event to data
 * @param {Event}
 * @returns {Object}
 */
export function toData ({detail, target, _root}) {
  if (detail && detail.data) return detail.data

  const reversedPath = getReversedDomPath(target, _root)
  if (!reversedPath) return null
  const value = getProp(target, 'value')
  return createNestedObject(reversedPath, value)
}

/**
 * Convert event to name
 * @param {Event}
 * @returns {string}
 */
export function toName ({target}) {
  return getProp(target, 'name')
}

/**
 * Convert event to nested name
 * @param {Event}
 * @returns {string}
 */
export function toNestedName ({target, _root}) {
  const reversedPath = getReversedDomPath(target, _root)
  if (!reversedPath) return null
  return reversedPath.reverse().join('.')
}
