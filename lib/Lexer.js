const {Reader} = require('./Reader.js'),
      {initialState} = require('./states'),
      LexerError = require('./LexerError'),
      Token = require('./Token')

class Lexer extends Reader {

  constructor(input) {
    super(input)
  }

  * tokenize() {
    let fn = initialState,
        token
    while ([token, fn] = fn(this)) {
      if (token instanceof LexerError) {
        throw token
      }
      if (token instanceof Token) {
        yield token
      }
      if (!fn) {
        break
      }
    }

  }

}

module.exports = Lexer
