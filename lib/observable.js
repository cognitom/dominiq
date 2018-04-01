import Observable from 'any-observable'

/**
 * Listen the specified type of events on the DOM element
 * @param {HTMLElement} dom - where to listen
 * @param {string} type - event type
 */
export function listen (dom, type) {
  return new Observable(observer => {
    const listener = e => observer.next(e)
    dom.addEventListener(type, listener)
    return () => dom.removeEventListener(type, listener)
  })
}
