import { html } from "lit-html/lib/lit-extended"

export default state => html`
  <h1>Hello ${state.person.full}!</h1>
  <input name="person.first" value="${state.person.first}">
  <input name="person.last" value="${state.person.last}">
  <input name="city" value="${state.city}">
  <button name="retrieve" disabled="${!state.ok}">Click me!</button>
  <p>${state.message}</p>
  <p>${state.count}</p>
  <button name="countUp">1. Count up now!</button>
  <button name="countUp2">2. Count up two sec later!</button>
  <button name="countUp3" disabled="${state.waiting}">${
  state.waiting ? "Now waiting..." : "3. Count up now and later!"
}</button>
`
