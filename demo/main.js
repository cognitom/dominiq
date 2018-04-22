import 'any-observable/register/zen'
import merge from 'lodash.merge'
import {render} from 'lit-html'
import {listen, toData, sanitize, emptize, register} from '../lib/'
import view from './view.js'

const state = {
  person: {
    first: '',
    last: '',
    get full () { return `${this.first} ${this.last}` }
  },
  city: '',
  get ok () { return !!this.person.first && !!this.city },
  
  count: 0,
  waiting: false
}
const sanitizers = {
  person: {
    first: val => val.toUpperCase(),
    last: val => val.toUpperCase()
  },
  city: val => val.toLowerCase()
}
const dom = document.body
const update = data => {
  sanitize(data, sanitizers) // Sanitize with sanitizers above
  emptize(data) // Convert null or undefined to empty
  merge(state, data) // merge data into state
  render(view(state), dom)
}
const actions = {
  countUp ({count}) {
    return {count: count + 1}
  },
  async countUp2 ({count}) {
    await wait(2000)
    return {count: count + 1}
  },
  async *countUp3 ({count}) {
    yield {waiting: true, count: ++count}
    await wait(2000)
    yield {waiting: false, count: ++count}
  }
}

const toAction = register(actions, state)
listen(dom, 'change').map(toData).subscribe(update)
listen(dom, 'click').flatMap(toAction).subscribe(update)
update()

function wait (msec) {
  return new Promise(resolve => setTimeout(() => resolve(), msec))
}
