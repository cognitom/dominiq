import Observable from "zen-observable"

/**
 * Listen the specified type of events on the DOM element
 * @param {HTMLElement|App} target - where to listen
 * @param {string} type - event type
 */
export function listen(target, type) {
  return new Observable(observer => {
    const listener = (...args) => observer.next(...args)
    target.addEventListener(type, listener)
    return () => target.removeEventListener(type, listener)
  })
}
