const EOF   = '',
      INPUT = Symbol('INPUT'),
      POS   = Symbol('POS')

const WHITESPACE_REGEXP = /\s/

class Reader {
  constructor(input) {
    this[INPUT] = input
    this[POS] = 0
  }

  * read() {
    let next
    while (next = this.next()) {
      yield next
    }
    yield EOF
  }

  next() {
    return this[INPUT][this[POS]++]
  }

  unread() {
    this[POS]--
  }

  peek() {
    let next = this.next()
    this[POS]--
    return next
  }

  isWhiteSpace(r) {
    return r !== EOF && WHITESPACE_REGEXP.test(r)
  }

  readWhiteSpace() {
    for (let r of this.read()) {
      if (!this.isWhiteSpace(r)) {
        this.unread()
        break
      }
    }
  }

  accept(fn) {
    let out = ''
    for (let r of this.read()) {
      if (r === EOF) {
        return r
      }
      if (!fn(r)) {
        this.unread()
        break
      }
      out += r
    }
    return out
  }

  ignore(fn) {
    for (let r of this.read()) {
      if (!fn(r)) {
        this.unread()
        break
      }
    }
  }

  get position() {
    return this[POS]
  }

}

module.exports = {
  Reader, EOF
}
