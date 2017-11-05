const fs = require('fs')
fs.readFile('test.ini', (err, content) => {
  if (err) throw new Error(err)
  console.log('content = ', content.toString())
  let res = parseINI(content.toString())
  console.log('res = ', JSON.stringify(res))
})

const parseINI = content => {
  let currentSection = {name: 'GlobalSetting', fields: []}
  const currentCategories = [currentSection]
  let match = null
  content.split(/\r?\n/).forEach(line => {
    console.log('line = ', line)
    if (/^\s*(;.*)?$/.test(line)) {
      console.log('empty or with semicolon = ', line)
      return
    }
    if (match = line.match(/^\[(.*)\]$/)) {
      currentSection = {name: match[1], fields: []}
      currentCategories.push(currentSection)
      return
    }
    if (match = line.match(/^(\w+)=(.*)$/)) {
      currentSection.fields.push({name: match[1], value: match[2]})
    } else {
      throw new Error('Line ' + line + ' is invalid')
    }
  })
  return currentCategories
}
