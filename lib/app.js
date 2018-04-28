/* global Observable */
import {merge, getNestedItem, readonly} from './util.js'
import {sanitize} from './sanitize.js'

const statePool = new WeakMap()
const listenerPool = new WeakMap()
const runningFlags = new WeakMap()

function emit (target, type, ...args) {
  const listeners = listenerPool.get(target)
  if (!listeners[type]) return
  for (const listener of listeners[type]) listener(...args)
}

export class App {
  constructor ({initialState = {}, sanitizers = {}, actions = {}}) {
    statePool.set(this, sanitize(initialState, sanitizers))
    listenerPool.set(this, {})
    this.sanitizers = sanitizers
    this.actions = actions

    // binds methods by itself
    this.commit = this.commit.bind(this)
    this.dispatch = this.dispatch.bind(this)
    this.start = this.start.bind(this)
    this.stop = this.stop.bind(this)
  }
  commit (partial) {
    const state = statePool.get(this)
    sanitize(partial, this.sanitizers)
    merge(state, partial)
    emit(this, 'render', state)
  }
  dispatch (name) {
    return new Observable(async observer => {
      try {
        const action = getNestedItem(name, this.actions)
        if (!action) return observer.complete()
        const state = readonly(statePool.get(this))
        const result = action(state)
        const isAsyncIterable = typeof result[Symbol.asyncIterator] === 'function'
        if (isAsyncIterable) {
          for (;;) {
            const {value, done} = await result.next()
            if (value) observer.next(value)
            if (done) break
          }
        } else {
          const data = result.then ? await result : result
          if (data) observer.next(data)
        }
      } catch (e) {
        observer.error(e)
      }
      observer.complete()
    })
  }
  start () {
    const running = runningFlags.get(this)
    if (running) return
    const state = statePool.get(this)
    emit(this, 'render', state)
    runningFlags.set(this, true)
  }
  stop () {
    const listeners = listenerPool.get(this)
    for (const key in listeners) delete listeners[key]
    runningFlags.set(this, false)
  }
  addEventListener (type, listener) {
    const listeners = listenerPool.get(this)
    if (!listeners[type]) listeners[type] = []
    listeners[type].push(listener)
  }
  removeEventListener (type, listener) {
    const listeners = listenerPool.get(this)
    if (!listeners[type]) return
    const idx = listeners[type].indexOf(listener)
    if (idx >= 0) listeners[type].splice(idx)
  }
}
