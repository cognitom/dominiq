import Observable from 'any-observable'

class ActionEmitter {
  constructor (actions, state) {
    this.actions = actions
    this.state = state
    this.handler = null
  }
  /** 
   * Emit an action specified by the name
   * After or during the action, it execute handler once (function or promise)
   * or multiple times (async iterator)
   */
  async emit (name) {
    // Todo: support nested actions
    const action = this.actions[name]
    if (!action) return
    const result = action(this.state)
    const isAsyncIterable = typeof result[Symbol.asyncIterator] === 'function'
    if (isAsyncIterable) {
      for await (const data of result) {
        if (data) await this.handler(data)
      }
    }
    const data = result.then ? await result : result
    if (data) await this.handler(data)
  }
  /**
   * Convert this emitter into Observable
   * @returns {Observable}
   */
  toObservable () {
    return new Observable(observer => {
      this.handler = data => observer.next(data)
    })
  }
}

/**
 * Factory method for ActionEmitter
 */
export function register (actions, state) {
  const emitter = new ActionEmitter(actions, state)
  const observable = emitter.toObservable()
  const emit = emitter.emit.bind(emitter)
  
  // Expose observable and emit
  return {observable, emit}
}
