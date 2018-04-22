import Observable from 'any-observable'
import {getProp, getNestedItem} from './util.js'

export function register (actions, state) {
  return ({target}) => new Observable(async observer => {
    try {
      const name = getProp(target, 'name')
      const action = getNestedItem(name, actions)
      if (!action) return observer.complete()
      const result = action(state)
      const isAsyncIterable = typeof result[Symbol.asyncIterator] === 'function'
      if (isAsyncIterable) {
        for await (const data of result) {
          if (data) observer.next(data)
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
