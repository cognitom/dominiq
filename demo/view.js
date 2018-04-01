import {html} from 'lit-html/lib/lit-extended'

export default state => html`
  <h1>Hello ${state.person.full}!</h1>
  <input name="person.first" value="${state.person.first}">
  <input name="person.last" value="${state.person.last}">
  <input name="city" value="${state.city}">
  <button name="submit" disabled="${!state.ok}">Click me!</button>
`
