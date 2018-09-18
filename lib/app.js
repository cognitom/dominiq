import toObservable from "fafgag/lib/index.js"
import { merge, getNestedItem, readonly, changed } from "./util.js"
import { sanitize } from "./sanitize.js"
import { toData, toName } from "./extract.js"

const changedRe = /^changed:/

const statePool = new WeakMap()
const listenerPool = new WeakMap()
const runningFlags = new WeakMap()
const wrapperPool = new WeakMap()

function emit(target, type, ...args) {
  const listeners = listenerPool.get(target)
  if (!listeners[type]) return
  for (const listener of listeners[type]) listener(...args)
}

export class App {
  constructor({ initialState = {}, sanitizers = {}, actions = {} }) {
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
  extend({ initialState = {}, sanitizers = {}, actions = {} }) {
    Object.assign(this.sanitizers, sanitizers)
    Object.assign(this.actions, actions)
    this.commit(initialState)
  }
  commit(partial) {
    if (!partial) return
    if (partial instanceof Event) partial = toData(partial)
    const state = statePool.get(this)
    sanitize(partial, this.sanitizers)
    merge(state, partial)
    const running = runningFlags.get(this)
    if (running) {
      emit(this, "render", readonly(state))
      emit(this, "rendered", readonly(state))
    }
  }
  dispatch(name) {
    if (name instanceof Event) name = toName(name)
    if (!name) return
    const action = getNestedItem(name, this.actions)
    if (!action) return
    setTimeout(() => {
      const state = readonly(statePool.get(this))
      toObservable(action, state).subscribe(this.commit)
    }, 0)
  }
  start() {
    const running = runningFlags.get(this)
    if (running) return
    const state = statePool.get(this)
    emit(this, "render", readonly(state))
    runningFlags.set(this, true)
    emit(this, "rendered", readonly(state))
    emit(this, "started", readonly(state))
  }
  stop() {
    const listeners = listenerPool.get(this)
    for (const key in listeners) delete listeners[key]
    runningFlags.set(this, false)
    emit(this, "stopped")
  }
  addEventListener(type, listener) {
    if (changedRe.test(type)) {
      /** handles "changed" events */
      const state = statePool.get(this)
      const name = type.replace(changedRe, "")
      const initialValue = getNestedItem(name, state)
      const detector = changed(name, initialValue)
      const original = listener
      const wrapper = state => {
        if (detector(state)) original(state)
      }
      wrapperPool.set(listener, wrapper)
      listener = wrapper
      type = "rendered"
    }
    const listeners = listenerPool.get(this)
    if (!listeners[type]) listeners[type] = []
    listeners[type].push(listener)
  }
  removeEventListener(type, listener) {
    if (changedRe.test(type)) {
      /** handles "changed" events */
      type = "rendered"
      listener = wrapperPool.get(listener)
    }
    const listeners = listenerPool.get(this)
    if (!listeners[type]) return
    const idx = listeners[type].indexOf(listener)
    if (idx >= 0) listeners[type].splice(idx)
  }
}
