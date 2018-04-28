const listenerPool = new WeakMap()
function emit(target, type, ...args) {
  const listeners = listenerPool.get(target)
  if (!listeners[type]) return
  for (const listener of listeners[type]) listener(...args)
}

export default class DOMMock {
  constructor() {
    listenerPool.set(this, {})
  }
  dispatch(type, target) {
    emit(this, type, { target })
  }
  addEventListener(type, listener) {
    const listeners = listenerPool.get(this)
    if (!listeners[type]) listeners[type] = []
    listeners[type].push(listener)
  }
  removeEventListener(type, listener) {
    const listeners = listenerPool.get(this)
    if (!listeners[type]) return
    const idx = listeners[type].indexOf(listener)
    if (idx >= 0) listeners[type].splice(idx)
  }
}
