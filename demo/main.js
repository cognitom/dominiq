import 'any-observable/register/zen'
import {render} from 'lit-html'
import {listen, toData, toName, App} from '../lib/'
import {emptize} from './lib.js'
import view from './view.js'

const initialState = {
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
const actions = {
  countUp ({count}) {
    return {count: count + 1}
  },
  async countUp2 (state) { // don't use destructuring here because the state would change
    await wait(2000)
    return {count: state.count + 1}
  },
  async *countUp3 (state) {
    yield {waiting: true, count: state.count + 1}
    await wait(2000)
    yield {waiting: false, count: state.count + 1}
  }
}

const app = new App({initialState, sanitizers, actions})
const dom = document.body
listen(dom, 'change').map(toData).subscribe(app.commit)
listen(dom, 'click').map(toName).flatMap(app.dispatch).subscribe(app.commit)
listen(app, 'render').map(emptize).subscribe(state => render(view(state), dom))
app.start()

function wait (msec) {
  return new Promise(resolve => setTimeout(() => resolve(), msec))
}
