function ArraySeq (array) {
  this.pos = -1
  this.array = array
}

function RangeSeq (start, end) {
  this.start = start
  this.end = end
}

function logFive (seq) {
  for (let i = 0; i < 5 && seq.next() !== null; i++) {
    console.log(seq.current())
  }
}

ArraySeq.prototype.current = function () {
  return this.array[this.pos]
}

ArraySeq.prototype.next = function () {
  if (this.pos >= this.array.length - 1) return null
  return this.array[++this.pos]
}

RangeSeq.prototype.next = function () {
  return this.start >= this.end ? null : (this.start++)
}

RangeSeq.prototype.current = function () {
  return this.start
}

logFive(new ArraySeq([4, 10]))
logFive(new RangeSeq(100, 1000))
// --------
