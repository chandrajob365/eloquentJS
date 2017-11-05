let fs = require('fs')
let pattern = /\/\/.*|(\/\*[^]*\*\/)/g
fs.readFile('test.js', (err, content) => {
  if (err) throw new Error(err)
  console.log(content.toString())
  console.log(String.prototype.replace.call(content).replace(pattern, ''))
})
