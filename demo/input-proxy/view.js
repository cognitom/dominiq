import { html } from "lit-html/lib/lit-extended"

export default state => html`
  <header class="mdc-top-app-bar mdc-elevation--z4">
    <div class="mdc-top-app-bar__row">
      <section class="mdc-top-app-bar__section">
        <a href="#" class="material-icons mdc-top-app-bar__navigation-icon">menu</a>
        <span class="mdc-top-app-bar__title">InputProxy</span>
      </section>
    </div>
    <input-proxy name="num" selector=".mdc-tab--active" listen="click">
      <nav class="mdc-tab-bar">
        ${ ["one", "two", "three"].map(option => {
          const className = state.num == option ? "mdc-tab mdc-tab--active" : "mdc-tab"
          return html`<a className="${ className }" value="${ option }">Item ${ option }</a>`
        }) }
        <span class="mdc-tab-bar__indicator"></span>
      </nav>
    </input-proxy>
  </header>
  <div class="demo-contents">
    ${ state.num }
  </div>
`
