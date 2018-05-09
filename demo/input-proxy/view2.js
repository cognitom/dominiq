import { html } from "lit-html/lib/lit-extended"

export default state => html`
  <style>
    paper-dropdown-menu {
      width: 200px;
      margin: auto;
      display: block;
      color: black;
    }
    paper-button {
      font-family: 'Roboto', 'Noto', sans-serif;
      font-weight: normal;
      font-size: 14px;
      background-color: var(--paper-green-500);
      color: white;
    }
  </style>
  <paper-input name="os2" label="Operating System" value="${state.os}"></paper-input>
  <input-proxy name="os" selector="[aria-selected]" listen="click">
    <paper-dropdown-menu label="Operating System">
      <paper-listbox slot="dropdown-content" attr-for-selected="value" selected="${
        state.os
      }">
        <paper-item value="i">iOS</paper-item>
        <paper-item value="a">Android</paper-item>
        <paper-item value="win">Windows</paper-item>
        <paper-item value="mac">macOS</paper-item>
      </paper-listbox>
    </paper-dropdown-menu>
  </input-proxy>
  <br>
  <paper-button name="submit">Click me!</paper-button>
`
