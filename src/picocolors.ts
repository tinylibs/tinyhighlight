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
    TemplateHead: c.cyan,
    TemplateTail: c.cyan,
    IdentifierMethodName: c.blue,
    PrivateIdentifierMethodName: (text) => `#${c.blue(`${text}`.slice(1))}`,
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
