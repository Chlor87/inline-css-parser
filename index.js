const Parser = require('./lib/Parser')

let parser = new Parser(`background: url('http://test.test/test.jpg') no-repeat center ;color: red; margin: 2rem;`)

parser.parse()
console.log(parser.stringify())
