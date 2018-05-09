import { html } from "lit-html/lib/lit-extended"

export default state => html`
  <input-proxy name="fruit" selector=".selected" listen="click">
    <span value="apple" className="${
      state.fruit === "apple" ? "selected" : ""
    }">Apple</span>
    <span value="orange" className="${
      state.fruit === "orange" ? "selected" : ""
    }">Orange</span>
  </input-proxy>
  <button name="submit">Click me!</button>
  <button name="change">Change</button>
`
