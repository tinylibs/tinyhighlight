import { type TokenColors, highlight as baseHighlight } from './index.js'
import c from 'picocolors'
import type { Colors } from 'picocolors/types.js'

interface ColoredOptions {
  jsx?: boolean
}

function getDefs(c: Colors): TokenColors {
  const Invalid = (text: string) => c.white(c.bgRed(c.bold(text)))
  return {
    Keyword: c.magenta,
    IdentifierCapitalized: c.yellow,
    Punctuator: c.yellow,
    StringLiteral: c.green,
    NoSubstitutionTemplate: c.green,
    MultiLineComment: c.gray,
    SingleLineComment: c.gray,
    RegularExpressionLiteral: c.cyan,
    NumericLiteral: c.blue,
    TemplateHead: (text) => c.green(text.slice(0, text.length - 2)) + c.cyan(text.slice(-2)),
    TemplateTail: (text) => c.cyan(text.slice(0, 1)) + c.green(text.slice(1)),
    TemplateMiddle: (text) => c.cyan(text.slice(0, 1)) + c.green(text.slice(1, text.length - 2)) + c.cyan(text.slice(-2)),
    IdentifierCallable: c.blue,
    PrivateIdentifierCallable: (text) => `#${c.blue(`${text}`.slice(1))}`,
    Invalid,

    JSXString: c.green,
    JSXIdentifier: c.yellow,
    JSXInvalid: Invalid,
    JSXPunctuator: c.yellow,
  }
}

export function highlight(
  code: string,
  options: ColoredOptions = { jsx: false }
) {
  if (code) {
    return baseHighlight(code, {
      jsx: options.jsx,
      colors: getDefs(c),
    })
  }
  return ''
}
