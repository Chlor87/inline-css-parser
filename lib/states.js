const {EOF} = require('./Reader'),
      Token      = require('./Token'),
      LexerError = require('./LexerError'),
      {IDENT, COLON, SEMICOLON, VALUE, TOK_EOF} = require('./types')


const IDENT_REGEXP = /[\w-]/,
      VALUE_REGEX  = /[^;]/

const acceptIdent = r => IDENT_REGEXP.test(r)

const initialState = (lexer) => {
  lexer.readWhiteSpace()
  let next = lexer.peek()
  if (next === EOF || next === undefined) {
    return [new Token(TOK_EOF, EOF), null]
  }
  return [new Token(IDENT, lexer.accept(acceptIdent)), colonState]
}

const acceptColon = r => r === ':'

const colonState = lexer => {
  lexer.readWhiteSpace()
  return [new Token(COLON, lexer.accept(acceptColon)), valueState]
}

const valueState = lexer => {
  lexer.readWhiteSpace()
  let res  = [],
      curr = ''
  loop: for (let r of lexer.read()) {

    switch (true) {
      case lexer.isWhiteSpace(r):
        lexer.readWhiteSpace()
        res.push(curr)
        curr = ''
        break
      case r === EOF:
        if (curr !== '') {
          res.push(curr)
        }
        break
      case r === ':':
        let next = lexer.peek()
        if (next !== '/') {
          return [new LexerError(next, lexer.position), null]
        }
      case VALUE_REGEX.test(r):
        curr += r
        break
      default:
        if (curr !== '') {
          res.push(curr)
        }
        lexer.unread()
        break loop
    }
  }
  res = res.join(' ')
  return [
    !res.length ? new LexerError('""', lexer.position) : new Token(VALUE, res),
    endState
  ]
}

const endState = lexer => {
  lexer.readWhiteSpace()
  let next = lexer.read().next().value
  switch (next) {
    case ';':
      return [new Token(SEMICOLON, next), initialState]
    case EOF:
      return [new Token(TOK_EOF, EOF), null]
    default:
      return [new LexerError(next, lexer.position), null]

  }
}

module.exports = {initialState}
