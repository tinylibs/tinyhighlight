# tinyhighlight

> minimal fork of @babel/highlight 🌈

This fork of [`@babel/highlight`](https://www.npmjs.com/package/@babel/highlight) tries to be the most compact library you can use to stylize JS/TS/JSX/TSX code.

## Usage

Changes made to `@babel/highlight`:

- Updated [`js-tokens`](https://github.com/lydell/js-tokens) (which adds more code, but it is up-to-date with the latest standards)
- `chalk` is replaced with `picocolors`
- Two methods from `@babel/helper-validator-identifier` are inlined to save space
- Introduced a token type for methods (`IdentifierMethodName`/`PrivateIdentifierMethodName`)
- This package is ESM-only

API is not compatible with `@babel/highlight` because we use the latest `js-tokens` version.

This package provides two entry points:

- The default module exposes `highlight` method without any styling.

```js
import { highlight } from 'tinyhighlight'
highlight('const answer = 42', {
  jsx: false,
  colors: provideYourOwnColors(),
})
```

> [!TIP]
> You can use `colors` option to provide color methods. If you support JSX, make sure to provide JSX-named colors because they use a separate token identifier.

- The `./picocolors` entry point exposes `highlight` method that uses [`picocolors`](https://www.npmjs.com/package/picocolors) for styling:

```js
import { highlight } from 'tinyhighlight/picocolors'
highlight('const answer = 42', { jsx: false })
```

> [!WARNING]
> This package doesn't install `picocolors` automatically, you need to add it to your own dependencies if you use this option

## Token Types

You can look at [`js-tokens`](https://github.com/lydell/js-tokens) documentation to read about most of the tokens. On top of that, `tinyhighlight` also provides these tokens:

**IdentifierMethodName**

This is an `Identifier` that has a bracket (`(`) after it. `someName` is `IdentifierMethodName` in all of these examples:

```
someName()
someName ()
someName
()
property.someName()
function someName() {}
class Test {
  someName() {}
}
```

**PrivateIdentifierMethodName**

This is a `PrivateIdentifier` that has a bracket (`(`) after it. `#someName` (`#` is also part of the value) is `IdentifierMethodName` in all of these examples:

```
this.#someName()
this.#someName ()
this.#someName
()
class Test {
  #someName() {}
}
```

**IdentifierCapitalized**

This is an `Identifier` that starts with a capital letter. For example:

```
Test
class Test {}
function Test() {}
function(Test) {}
```

**Keyword**

This is a potential `Identifier` that uses a reserved name. For example (not a full list):

```
const
export
null
true
protected
public
void
this
```

**Bracket**

This is a `Punctuator` equal to one of `[`, `]`, `{`, `}`, `(`, `)`.
