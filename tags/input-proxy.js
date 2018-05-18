const { HTMLElement } = window

const listeners = new WeakMap()
const cache = new WeakMap()

export default class InputProxy extends HTMLElement {
  static get observedAttributes() {
    return ["listen"]
  }
  get name() {
    return this.getAttribute("name")
  }
  get selector() {
    return this.getAttribute("selector")
  }
  get listen() {
    return this.getAttribute("listen")
  }
  get value() {
    if (!this.selector) return null
    const cached = cache.get(this)
    if (cached !== undefined) return cached
    const value = study(this)
    cache.set(this, value)
    return value
  }
  constructor() {
    super()
  }
  connectedCallback() {
    this.attach()
  }
  disconnectedCallback() {
    this.detach()
  }
  attributeChangedCallback(attributeName, oldValue, newValue) {
    if (this.isConnected && attributeName === "listen") {
      this.detach(oldValue)
      this.attach()
    }
  }
  detach(eventToRemove) {
    const listener = listeners.get(this)
    if (listener) {
      this.removeEventListener(eventToRemove || this.listen, listener)
      listeners.delete(this)
    }
    cache.delete(this)
  }
  attach() {
    const listener = e => {
      setTimeout(() => {
        const cached = cache.get(this)
        const value = study(this)
        if (value === cached) return
        cache.set(this, value)
        this.dispatchEvent(new Event("change", { bubbles: true }))
      }, 50)
    }
    this.addEventListener(this.listen, listener)
    listeners.set(this, listener)
  }
}

function study(me) {
  const target = me.querySelector(me.selector)
  const property = "value"
  return !target
    ? null
    : target[property] !== undefined
      ? target[property]
      : target.hasAttribute(property)
        ? target.getAttribute(property)
        : undefined
}
