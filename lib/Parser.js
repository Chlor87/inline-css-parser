const {IDENT, COLON, SEMICOLON, VALUE, TOK_EOF} = require('./types'),
      Lexer = require('./Lexer')

class ParserError extends Error {
  constructor(token) {
    super(`Parse error: unexpected token ${token.type} (${token.value})`)
  }
}

class Stack extends Array {
  get top() {
    let top = this[this.length - 1]
    if (top === undefined) {
      throw new RangeError('Empty stack')
    }
    return top
  }

  get bottom() {
    return this[0]
  }

  get empty() {
    return !this.length
  }

  clear() {
    this.length = 0
  }
}

class Parser extends Lexer {

  constructor(input) {
    super(input)
    this.AST = new Map()
  }

  parse() {
    let stack = new Stack()
    for (let token of this.tokenize()) {
      switch (token.type) {
        case IDENT:
          stack.push(token)
          break
        case COLON:
          if (stack.top.type !== IDENT) {
            throw new ParserError(token)
          }
          stack.push(token)
          break
        case VALUE:
          let top = stack.top
          if (top.type !== COLON) {
            throw new ParserError(token)
          }
          stack.pop()

          top = stack.top
          if (top.type !== IDENT) {
            throw new ParserError(token)
          }

          this.AST.set(top.value, token.value)
          stack.push(token)
          break
        case SEMICOLON:
          if (stack.top.type !== VALUE) {
            throw new ParserError(stack.top)
          }
          stack.clear()
          break
        case TOK_EOF:
          console.log(this.AST)
          return
      }
    }
  }

  stringify() {
    let res = ''
    for (let [k, v] of this.AST.entries()) {
      res += `${k}: ${v}; `
    }
    return res.trim()
  }

}

module.exports = Parser
