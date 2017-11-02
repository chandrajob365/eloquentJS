const plan =
  ['############################',
    '#####                 ######',
    '##   ***                **##',
    '#   *##**         **  O  *##',
    '#    ***     O    ##**    *#',
    '#       O         ##***    #',
    '#                 ##**     #',
    '#   O       #*             #',
    '#*          #**       O    #',
    '#***        ##**    O    **#',
    '##****     ###***       *###',
    '############################']

const directions = {
  'n': new Vector(0, -1),
  'ne': new Vector(1, -1),
  'e': new Vector(1, 0),
  'se': new Vector(1, 1),
  's': new Vector(0, 1),
  'sw': new Vector(-1, 1),
  'w': new Vector(-1, 0),
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

// Grid Setup
function Grid (width, height) {
  // console.log('<Grid > width = ', width, ' height = ', height)
  this.space = new Array(width * height)
  this.width = width
  this.height = height
}

Grid.prototype.isInside = function (vector) {
  // console.log('<GRID, isInside> vector.x = ', vector.x, ' this.x = ', this.width)
  // console.log('<GRID, isInside> vector.y = ', vector.y, ' this.y = ', this.height)
  return vector.x >= 0 && vector.x <= this.width &&
   vector.y >= 0 && vector.y <= this.height
}

Grid.prototype.get = function (vector) {
  return this.space[vector.x + this.width * vector.y]
}

Grid.prototype.set = function (vector, value) {
  this.space[vector.x + this.width * vector.y] = value
}

function Wall () {
  // // console.log('this = ', this)
}

function randomElement (array) {
  return array[Math.floor(Math.random() * array.length)]
}

const directionNames = ['n', 'ne', 'e', 'se', 's', 'sw', 'w', 'nw']

function BouncingCritter () {
  // // console.log('this = ', this)
  this.direction = randomElement(directionNames)
  // // console.log('<BouncingCritter> this.direction = ', this.direction)
}

BouncingCritter.prototype.act = function (view) {
  if (view.look(this.direction) !== ' ') {
    this.direction = view.find(' ') || 's' // gets the direction with empty space
    // console.log('<BouncingCritter, act> this.direction = ', this.direction)
    // critter just request for an action and world will decide weather to allow it or not
  }
  return {type: 'move', direction: this.direction}
}

function elementFromChar (legend, sym) {
  if (!legend[sym]) return null
  const element = new legend[sym]()
  element.originChar = sym
  return element
}

function charFromElement (elm) {
  // console.log('<charFromElement> elm = ', elm)
  return elm === null ? ' ' : elm.originChar
}

// <-- World Object -->
function World (plan, legend) {
  const grid = new Grid(plan[0].length, plan.length)
  this.grid = grid
  this.legend = legend
  plan.forEach((row, y) => { // y is row index
    Array.prototype.slice.call(row).forEach(
      (sym, x) => grid.set(new Vector(x, y), elementFromChar(legend, sym))) // maps each symbol from plan to either Wall or BouncingCritter
  })
  // console.log('<World > this.grid.width = ', this.grid.width, ' this.grid.height = ', this.grid.height)
}

World.prototype.turn = function () {
  const acted = []
  for (let y = 0; y < this.grid.height; y++) {
    for (let x = 0; x < this.grid.width; x++) {
      let value = this.grid.space[x + y * this.grid.width]
      // // console.log('value = ', value)
      if (value !== null && value.act && acted.indexOf(value) === -1) {
        // <-- Run below lines only when value is not Wall -->
        acted.push(value)
        // // // console.log('<turn> this = ', this)
        this.letAct(value, new Vector(x, y))
      }
    }
  }
}

World.prototype.letAct = function (critter, vector) {
  const action = critter.act(new View(this, vector))
  // console.log('<letAct> action = ', action)
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
  // // console.log('height = ', this.grid.height, ' width = ', this.grid.width)
  for (let y = 0; y < this.grid.height; y++) {
    for (let x = 0; x < this.grid.width; x++) {
      let element = this.grid.get(new Vector(x, y))
      output += charFromElement(element)
    }
    output += '\n'
  }
  return output
}

// <-- View Object -->
function View (world, vector) { // View points to current World state and current location of a critter / world Object inform of Vector
  this.world = world
  this.vector = vector
  // console.log('<View > this.world.grid.width = ', this.world.grid.width, ' this.world.grid.height = ', this.world.grid.height)
  // // console.log('world = ', world, '  vector = ', vector)
}

// <-- Looks for char(wall/critter) at provided direction -->
View.prototype.look = function (dir) {
  let target = this.vector.plus(directions[dir])
  // console.log('<View, look> dir = ', dir, ' target = ', target) // gets the new location at given direction
  // console.log('<VIEW, look> this.world.grid.isInside(target) = ', this.world.grid.isInside(target))
  if (this.world.grid.isInside(target)) {
    let elm = charFromElement(this.world.grid.get(target))
    // console.log('<VIEW look> elm = ', elm)
    return elm // returns Char at the given target
  }
  return '#'
}

// <-- Gets all the direction having matching input character-->
View.prototype.findAll = function (ch) {
  const found = []
  for (let dir in directions) {
    if (this.look(dir) === ch) { // looks for adjacent locations with provided char/symbol
      found.push(dir)
    }
    // console.log('found = ', found)
    return found
  }
}

// <-- Returns a random direction(for empty space) from all the matched directions-->
View.prototype.find = function (ch) {
  let founds = this.findAll(ch) // founds is an array of directions
  // console.log('founds = ', founds)
  return founds.length === 0 ? null : randomElement(founds)
}

function LifeLikeWorld (map, world) {
  World.call(this, map, world)
}

LifeLikeWorld.prototype = Object.create(World.prototype)
const actionTypes = Object.create(null)

LifeLikeWorld.prototype.letAct = function (critter, vector) {
  let action = critter.act(new View(this, vector))
  let handled = action && action.type in actionTypes &&
    actionTypes[action.type].call(this, critter, vector, action)
  if (!handled) {
    critter.energy -= 0.2
    if (critter.energy <= 0) this.grid.set(vector, null)
  }
}

// <-- Action Handlers -->
actionTypes.move = function (critter, vector, action) {
  let dest = this.checkDestination(action, vector)
  if (dest == null ||
      critter.energy <= 1 ||
      this.grid.get(dest) != null) {
    return false
  }
  critter.energy -= 1
  this.grid.set(vector, null)
  this.grid.set(dest, critter)
  return true
}

actionTypes.eat = function (critter, vector, action) {
  let dest = this.checkDestination(action, vector)
  let atDest = dest != null && this.grid.get(dest)
  if (!atDest || atDest.energy == null) {
    return false
  }
  critter.energy += atDest.energy
  this.grid.set(dest, null)
  return true
}

function Plant () {
  this.energy = 3 + Math.random() * 4
}
Plant.prototype.act = function (view) {
  if (this.energy < 20) return {type: 'grow'}
}

function PlantEater () {
  this.energy = 20
}
PlantEater.prototype.act = function (view) {
  let space = view.find(' ')
  let plant = view.find('*')
  if (plant) return {type: 'eat', direction: plant}
  if (space) return {type: 'move', direction: space}
}

const legend = {
  '#': Wall,
  'O': PlantEater,
  '*': Plant
}
// const world = new World(plan, legend)
// console.log('<Before Turn >world.grid.width = ', world.grid.width, ' world.grid.width = ', world.grid.height)
// world.turn()
const valley = new LifeLikeWorld(plan, legend)
for (let i = 0; i < 10; i++) {
  valley.turn()
  console.log(valley.toString())
}
