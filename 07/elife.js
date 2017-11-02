const plan = [
  '############################',
  '#      #    #      o      ##',
  '#                          #',
  '#          #####           #',
  '##         #   #    ##     #',
  '###           ##     #     #',
  '#           ###      #     #',
  '#   ####                   #',
  '#   ##       o             #',
  '# o  #         o       ### #',
  '#    #                     #',
  '############################']

  var directions = {
    'n':  new Vector( 0, -1),
    'ne': new Vector( 1, -1),
    'e':  new Vector( 1,  0),
    'se': new Vector( 1,  1),
    's':  new Vector( 0,  1),
    'sw': new Vector(-1,  1),
    'w':  new Vector(-1,  0),
    'nw': new Vector(-1, -1)
  }

// Vector Setup
function Vector (x, y) {
  this.x = x
  this.y = y
}

Vector.prototype.plus = function (vector) {
  return new Vector(vector.x + this.x, vector.y + this.y)
}

Vector.prototype.minus = function (vector) {
  return new Vector(vector.x - this.x, vector.y - this.y)
}
// Grid Setup
function Grid (width, height) {
  this.space = new Array(width * height)
  this.width = width
  this.height = height
}

Grid.prototype.isInside = function (vector) {
  return vector.x >= 0 && vector.width <= this.width &&
   vector.y >= 0 && vector.height <= this.height
}

Grid.prototype.get = function (vector) {
  return this.space[vector.x + this.width * vector.y]
}

Grid.prototype.set = function (vector, value) {
  this.space[vector.x + this.width * vector.y] = value
}

function Wall () {
  console.log('this = ', this)
}

function randomElement (array) {
  return array[Math.floor(Math.random() * array.length)]
}

const directionNames = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']

function BouncingCritter () {
  console.log('this = ', this)
  this.direction = randomElement(directionNames)
  console.log('<BouncingCritter> this.direction = ', this.direction)
}

BouncingCritter.prototype.act = function (view) {
  if (view.look(this.direction) !== ' ') {
    this.direction = view.find(' ') || 's' // gets the direction with empty space
    console.log('this.direction = ', this.direction)
    // critter just request for an action and world will decide weather to allow it or not
    return {type: 'move', direction: this.direction}
  }
}

function elementFromChar (legend, sym) {
  if (!legend[sym]) return null
  const element = new legend[sym]()
  element.originChar = sym
  return element
}

function charFromElement (elm) {
  return elm === null ? ' ' : elm.originChar
}

// <-- World Object -->
function World (plan, legend) {
  const grid = new Grid(plan[0].length, plan.length)
  this.grid = grid
  this.legend = legend
  plan.forEach((col, y) => { // y is row index
    Array.prototype.slice.call(col).forEach(
      (sym, x) => grid.set(new Vector(x, y), elementFromChar(legend, sym))) // maps each symbol from plan to either Wall or BouncingCritter
  })
}

World.prototype.turn = function () {
  const acted = []
  for (let y = 0; y < this.grid.height; y++) {
    for (let x = 0; x < this.grid.width; x++) {
      let value = this.grid.space[x + y * this.grid.width]
      console.log('value = ', value)
      if (value !== null && value.act && acted.indexOf(value) === -1) {
        // <-- Run below lines only when value is not Wall -->
        acted.push(value)
        // console.log('<turn> this = ', this)
        this.letAct(value, new Vector(x, y))
      }
    }
  }
}

World.prototype.letAct = function (critter, vector) {
  const action = critter.act(new View(this, vector))
  if (action && action.type === 'move') {
    let destination = this.checkDestination(action, vector)
    if (destination && this.grid.get(destination) === null) { // checks if destination is empty
      this.grid.set(vector, null) // sets older location of critter to null / empty
      this.grid.set(destination, critter) // moves/sets destination with critter object
    }
  }
}

World.prototype.checkDestination = function (action, vector) {
  if (directions.hasOwnProperty(action.direction)) {
    // adds new distance recived as value from direction key of directions obj to set destination location
    let dest = vector.plus(directions[action.direction])
    if (this.grid.isInside(dest)) return dest
  }
}

World.prototype.toString = function () {
  let output = ''
  console.log('height = ', this.grid.height, ' width = ', this.grid.width)
  for (let y = 0; y < this.grid.height; y++) {
    for (let x = 0; x < this.grid.width; x++) {
      let element = this.grid.get(new Vector(x, y))
      output += charFromElement(element)
    }
    output += '\n'
  }
  return output
}

const legend = {
  '#': Wall,
  'o': BouncingCritter
}
const world = new World(plan, legend)
world.turn()
console.log(world.toString())
