const findDate = (string) => {
  const pattern = /(\d{1,2})-(\d{1,2})-(\d{4})/
  const match = pattern.exec(string)
  console.log('match = ', match)
  return new Date(
    Number(match[3]),
    Number(match[2]) - 1,
    Number(match[1]))
}
console.log(findDate('30-01-2017'))

let nameList = 'Hopper, Grace\nMcCarthy, John\nRitchie, Dennis'
let pattern = /(\w+), (\w+)/g
console.log(nameList.match(pattern))
console.log(nameList.replace(pattern, '$2 $1'))

let s = 'this cia and the fbi'
console.log(s.replace(/\b(cia|fbi)\b/g, str => str.toUpperCase()))

let stock = '1 lemon, 2 cabbages, and 101 eggs'
const minusOne = (match, amount, unit) => {
  console.log('match = ', match, ' amount = ', amount, ' unit = ', unit)
  amount = Number(amount) - 1
  if (amount === 1) {
    unit = unit.slice(0, unit.length - 1)
  } else if (amount === 0) {
    amount = 'no'
  }
  return amount + ' ' + unit
}
console.log(stock.replace(/(\d+) (\w+)/g, minusOne))

let name = 'death+hl[]rd'
let text = 'This death+hl[]rd guy is super annoying.'
let escaped = name.replace(/[^\w\s]/g, '\\$&')
let regexp = new RegExp('\\b(' + escaped + ')\\b', 'gi')
console.log(text.replace(regexp, '_$1_'))
