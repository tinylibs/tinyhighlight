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
  | 'IdentifierCallable'
  | 'PrivateIdentifierCallable'

export type TokenColors = Partial<Record<TokenType, (text: string) => string>>

interface HighlightOptions {
  jsx?: boolean
  colors: TokenColors
}

const getTokenType = function (token: Token | JSXToken): TokenType {
  // const token = tokens[index]!
  if (token.type === 'IdentifierName') {
    if (
      isKeyword(token.value) ||
      isStrictReservedWord(token.value) ||
      sometimesKeywords.has(token.value)
    )
      return 'Keyword'

    if (token.value[0] && token.value[0] !== token.value[0].toLowerCase())
      return 'IdentifierCapitalized'
  }

  if (token.type === 'Punctuator' && BRACKET.test(token.value)) return 'Bracket'

  if (token.type === 'Invalid' && (token.value === '@' || token.value === '#'))
    return 'Punctuator'

  return token.type
}

function getCallableType(token: Token | JSXToken) {
  if (token.type === 'IdentifierName') return 'IdentifierCallable'
  if (token.type === 'PrivateIdentifier') return 'PrivateIdentifierCallable'
  throw new Error('Not a callable token')
}

const colorize = (defs: TokenColors, type: TokenType, value: string) => {
  const colorize = defs[type]
  if (colorize) return colorize(value)
  return value
}

const highlightTokens = (defs: TokenColors, text: string, jsx?: boolean) => {
  let highlighted = ''
  let lastPotentialCallable: Token | JSXToken | null = null
  // store syntax highlighting when we check if a token is callable
  // we add this to the highlighted string when we know if it's callable or not
  let stackedHighlight = ''
  for (const token of jsTokens(text, { jsx })) {
    const type = getTokenType(token)

    if (type === 'IdentifierName' || type === 'PrivateIdentifier') {
      lastPotentialCallable = token
      continue
    }

    // still not sure if identifier is a callable or not,
    // so we store the syntax highlighting separetly for now
    if (
      lastPotentialCallable &&
      (token.type === 'WhiteSpace' ||
        token.type === 'LineTerminatorSequence' ||
        (token.type === 'Punctuator' &&
          (token.value === '?.' || token.value === '!')))
    ) {
      stackedHighlight += colorize(defs, type, token.value)
      continue
    }

    if (stackedHighlight && !lastPotentialCallable) {
      highlighted += stackedHighlight
      stackedHighlight = ''
    }

    if (lastPotentialCallable) {
      const isCallable = token.type === 'Punctuator' && token.value === '('
      const type = isCallable
        ? getCallableType(lastPotentialCallable)
        : getTokenType(lastPotentialCallable)
      highlighted +=
        colorize(defs, type, lastPotentialCallable.value) + stackedHighlight
      stackedHighlight = ''
      lastPotentialCallable = null
    }

    highlighted += colorize(defs, type, token.value)
  }
  return highlighted
}

export function highlight(
  code: string,
  options: HighlightOptions = { jsx: false, colors: {} }
) {
  if (code) {
    return highlightTokens(options.colors || {}, code, options.jsx)
  }
  return code
}
