class LexerError extends Error {
  constructor(token, pos) {
    super(`Lexer error: Unexpected token ${token} at position ${pos}.`)
  }
}

module.exports = LexerError
