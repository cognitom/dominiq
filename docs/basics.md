# Basics in Dominiq

## Name and value attributes

If we have this DOM,

```html
<input name="first" value="Tsutomu">
<input name="last" value="Kawamura">
```

we will get this data (via `extract()`):

```json
{
  "first": "Tsutomu",
  "last": "Kawamura"
}
```

As you see above, the `name` attribute becomes a key, and the `value` attribute becomes a value in the data object. It's totally simple, isn't it?

## Dot concatenated names

Name attributes can take a dodconcatenated name like `person.first`:

```html
<input name="person.first" value="Tsutomu">
<input name="person.last" value="Kawamura">
```

we will get this data (via `extract()`):

```json
{
  "person": {
    "first": "Tsutomu",
    "last": "Kawamura"
  }
}
```

## Full or partial data

`extract()` method extracts full data from the DOM. On the other hand `toData()` extracts a partial one from the event.

| type    | method        | source |
| ------- | ------------- | ------ |
| full    | extract(dom)  | DOM    |
| partial | toData(event) | event  |

Only if you want to get entire data, use `extract()`. Otherwise, `toData()` is fast and a better way.

## Flat or nested states

A `state` could be *flat* like this:

```json
{
  "first": "",
  "last": "",
  "city": ""
}
```

Or *nested* like this:

```json
{
  "person": {
    "first": "",
    "last": ""
  },
  "city": ""
}
```

Which is better? It depends on the size of your project and the design of its model. If your page is simple enough, you may prefer *flat* one. If not, you may need it be *nested*.

Be aware that `Object.assign()` is just "shallow copy", so it doesn't care about nested deeper elements, and it could be override the nested value unexpectedly. To merge properly, another third party method is needed.

| type   | merge method      | pros          | cons                  |
| ------ | ----------------- | ------------- | --------------------- |
| flat   | `Object.assign()` | easy and fast | messy in bigger pages |
| nested | `lodash.merge()`  | manageable    | not a native method   |

A typical nested partial looks like this:

```json
{"person": {"first": "Tsutomu"}}
```

If you merge this partial into the state above, you will get this one:

```json
{
  "person": {
    "first": "Tsutomu",
    "last": ""
  },
  "city": ""
}
```
