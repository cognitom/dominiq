import { render } from "lit-html"
import { listen, App } from "../../lib/"
import "../../tags/index.js"
import view from "./view.js"

const initialState = {
  num: "one"
}

const app = new App({ initialState })
const dom = document.body
listen(dom, "change").subscribe(app.commit)
listen(app, "render").subscribe(state => render(view(state), dom))
app.start()

mdc.tabs.MDCTabBar.attachTo(dom.querySelector(".mdc-tab-bar"))
mdc.topAppBar.MDCTopAppBar.attachTo(dom.querySelector(".mdc-top-app-bar"))
