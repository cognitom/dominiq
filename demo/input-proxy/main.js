import { render } from "lit-html"
import { listen, extract, toData, toName, App } from "../../lib/"
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
listen(dom, "change")
  .map(toData)
  .subscribe(app.commit)
listen(dom, "click")
  .map(toName)
  .subscribe(app.dispatch)
listen(app, "render").subscribe(state => render(view(state), dom))
app.start()
