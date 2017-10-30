function speak (line) {
  console.log('The', this.type, 'rabbit says ' + line)
}
const whiteRabbit = {type: 'white', speak: speak}
const fatRabbit = {type: 'fat', speak: speak}

whiteRabbit.speak('I am white as cloud')
fatRabbit.speak('I am fat as pumpkin')

speak.call(whiteRabbit, 'I am white as cloud')
speak.call(fatRabbit, 'I am fat as pumpkin')

speak.apply(whiteRabbit, ['I am white as cloud'])
speak.apply(fatRabbit, ['I am fat as pumpkin'])

// --------------------
function Human (firstName, lastName) {
  this.firstName = firstName
  this.lastName = lastName
  this.friends = ['Jadeja', 'Vijay']
}
Human.prototype.sayName = () => this.firstName + this.lastName

const person1 = new Human('Manish', 'Chandra')

const person2 = new Human('Abhishek', 'Singh')

// Lets check if person1 and person2 have points to the same instance of the sayName function
console.log(person1.sayName === person2.sayName) // true

// Let's modify friends property and check
person1.friends.push('Amit')

console.log(person1.friends)// Output: 'Jadeja, Vijay, Amit'
console.log(person2.friends)// Output: 'Jadeja, Vijay'
// Both above functions will have there own copy of Human Objects

Object.defineProperty(Object.prototype, 'nonSense', {enumerable: false, value: 'Hello'})
const map = {}
function storePhi (event, phi) {
  map[event] = phi
}

storePhi('pizza', 0.069)
storePhi('touched tree', -0.081)

Object.defineProperty(Object.prototype, 'hiddenNonSense', {enumerable: false, value: 'Hi'})

for (let name in map) console.log(name)
console.log('toString' in map)
console.log('nonSense' in map)
console.log('hiddenNonSense' in map)
