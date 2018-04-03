import 'any-observable/register/zen'
import merge from 'lodash.merge'
import {render} from 'lit-html'
import {listen, toData, toName, sanitize, emptize} from '../lib/'
import view from './view.js'

const state = {
  person: {
    first: '',
    last: '',
    get full () { return `${this.first} ${this.last}` }
  },
  city: '',
  get ok () { return !!this.person.first && !!this.city }
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
const actions = name => {
  switch (name) {
    case 'submit': return alert(`Thanks ${state.person.first}!`)
  }
}
listen(dom, 'change').map(toData).subscribe(update)
listen(dom, 'click').map(toName).subscribe(actions)
update()
