import merge from 'lodash.merge'
import {getProp, createPartialData} from './util.js'

/**
 * Extract data from specified DOM element
 * @param {HTMLElement} root
 * @returns {Object}
 */
export function extract (root) {
  const namedElements = root.querySelectorAll('[name]')
  const partials = Array.from(namedElements).map(element => {
    const name = getProp(element, 'name')
    const value = getProp(element, 'value')
    return createPartialData(name, value)
  })
  return merge({}, ...partials)
}

/**
 * Convert event to data
 * @param {Event} e
 * @param {HTMLElement} e.target
 * @returns {Object}
 */
export function toData ({target}) {
  const name = getProp(target, 'name')
  if (!name) return null
  const value = getProp(target, 'value')
  return createPartialData(name, value)
}

/**
 * Convert event to name
 * @param {Event} e
 * @param {HTMLElement} e.target
 * @returns {string}
 */
export function toName ({target}) {
  return getProp(target, 'name')
}
