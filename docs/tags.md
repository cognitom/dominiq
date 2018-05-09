# Helper tags

Before using helper tag(s), import `dominiq/tags`:

```javascript
import 'dominiq/tags'
```

## Input Proxy

Some third party custom elements has no events like `change` or `input`. For such a unstandard element, `<input-proxy>` can proxy events and values.

HTML:

```html
<input-proxy name="animal" selector="[aria-selected]" listen="click">
  <paper-dropdown-menu>
    <paper-listbox>
      <paper-item value="dog" aria-selected>Dog</paper-item>
      <paper-item value="cat">Cat</paper-item>
    </paper-listbox>
  </paper-dropdown-menu>
</input-proxy>
```

Data:

```json
{
  "animal": "dog"
}
```
