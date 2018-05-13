import { render } from "lit-html"
import { listen, App } from "../../lib/"
import "../../tags/index.js"
import view from "./view2.js"

const initialState = {
  os: "i"
}
const actions = {
  submit(state) {
    console.log(extract(document.body))
  }
}

const app = new App({ initialState, actions })
const dom = document.body
listen(dom, "change").subscribe(app.commit)
listen(dom, "click").subscribe(app.dispatch)
listen(app, "render").subscribe(state => render(view(state), dom))
app.start()
