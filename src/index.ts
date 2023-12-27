import jsTokens, { type JSXToken, type Token } from 'js-tokens'

const reservedWords = {
  keyword: [
    'break',
    'case',
    'catch',
    'continue',
    'debugger',
    'default',
    'do',
    'else',
    'finally',
    'for',
    'function',
    'if',
    'return',
    'switch',
    'throw',
    'try',
    'var',
    'const',
    'while',
    'with',
    'new',
    'this',
    'super',
    'class',
    'extends',
    'export',
    'import',
    'null',
    'true',
    'false',
    'in',
    'instanceof',
    'typeof',
    'void',
    'delete',
  ],
  strict: [
    'implements',
    'interface',
    'let',
    'package',
    'private',
    'protected',
    'public',
    'static',
    'yield',
  ],
}
const keywords = new Set(reservedWords.keyword)
const reservedWordsStrictSet = new Set(reservedWords.strict)
const sometimesKeywords = new Set(['as', 'async', 'from', 'get', 'of', 'set'])

function isReservedWord(word: string) {
  return word === 'await' || word === 'enum'
}
function isStrictReservedWord(word: string) {
  return isReservedWord(word) || reservedWordsStrictSet.has(word)
}
function isKeyword(word: string) {
  return keywords.has(word)
}

const BRACKET = /^[()[\]{}]$/

type TokenType =
  | Token['type']
  | JSXToken['type']
  | 'Keyword'
  | 'Bracket'
  | 'IdentifierCapitalized'
  | 'IdentifierMethodName'
  | 'PrivateIdentifierMethodName'

export type TokenColors = Partial<Record<TokenType, (text: string) => string>>

interface HighlightOptions {
  jsx?: boolean
  colors: TokenColors
}

const getTokenType = function (
  index: number,
  tokens: (Token | JSXToken)[]
): TokenType {
  const token = tokens[index]!
  if (token.type === 'IdentifierName') {
    if (
      isKeyword(token.value) ||
      isStrictReservedWord(token.value) ||
      sometimesKeywords.has(token.value)
    )
      return 'Keyword'

    if (token.value[0] && token.value[0] !== token.value[0].toLowerCase())
      return 'IdentifierCapitalized'

    if (isPropertyFunction(index, tokens)) return 'IdentifierMethodName'
  }

  if (token.type === 'PrivateIdentifier' && isPropertyFunction(index, tokens))
    return 'PrivateIdentifierMethodName'

  if (token.type === 'Punctuator' && BRACKET.test(token.value)) return 'Bracket'

  if (token.type === 'Invalid' && (token.value === '@' || token.value === '#'))
    return 'Punctuator'

  return token.type
}

function isPropertyFunction(index: number, tokens: Array<Token | JSXToken>) {
  let token = tokens[++index]
  while (
    token &&
    (token.type === 'WhiteSpace' ||
      token.type === 'LineTerminatorSequence' ||
      // test?.() test!()
      token.type === 'Punctuator' && (token.value === '(' || token.value === '?.' || token.value === '!'))
  ) {
    if (token.type === 'Punctuator' && token.value === '(') return true
    token = tokens[++index]
  }
  return false
}

const tokenize = function* (text: string, jsx = false) {
  const tokens = Array.from(jsTokens(text, { jsx }))
  let index = -1
  for (const token of tokens) {
    index++
    yield {
      type: getTokenType(index, tokens),
      value: token.value as string,
    }
  }
}

function highlightTokens(defs: TokenColors, text: string, jsx?: boolean) {
  let highlighted = ''
  for (const { type, value } of tokenize(text, jsx)) {
    const colorize = defs[type]
    if (colorize) highlighted += colorize(value)
    else highlighted += value
  }
  return highlighted
}

export function highlight(
  code: string,
  options: HighlightOptions = { jsx: false, colors: {} }
) {
  if (code) {
    return highlightTokens(options.colors, code, options.jsx)
  }
  return code
}
