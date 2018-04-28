import {sanitize} from '../lib/'

beforeEach(() => {
  document.body.innerHTML = ''
})

test('sanitizes state', () => {
  const state = {first: 'John', last: 'Doe'}
  const sanitizers = {
    first: val => val.toLowerCase(),
    last: val => val.toUpperCase()
  }
  sanitize(state, sanitizers)
  expect(state).toEqual({first: 'john', last: 'DOE'})
})

test('sanitizes nested state', () => {
  const state = {person: {first: 'John', last: 'Doe'}}
  const sanitizers = {
    person: {
      first: val => val.toLowerCase(),
      last: val => val.toUpperCase()
    }
  }
  sanitize(state, sanitizers)
  expect(state).toEqual({person: {first: 'john', last: 'DOE'}})
})
