var Perm = require("./perm");
var Orie = require("./orie");
var Puz = require("./puz")

var cornerPerm = new Perm({
  size: 8,
  moveEffects: {
    "F": [ 0, 3, 2, 4, 1, 5, 6, 7 ],
    "F'": "F F",
    "R": [ 5, 1, 0, 3, 4, 2, 6, 7 ],
    "R'": "R R",
    "L": [ 2, 1, 7, 3, 4, 5, 6, 0 ],
    "L'": "L L",
    "B": [ 0, 6, 2, 1, 4, 5, 3, 7 ],
    "B'": "B B"
  }
});

var cornerOrie = new Orie({
  kind: Orie.kinds.zero_sum,
  size: 8,
  order: 3,
  backingPerm: cornerPerm,
  moveEffects: {
    "F": [ 1, 2, 0, 2, 2, 0, 0, 0 ],
    "F'": "F F",
    "R": [ 2, 1, 2, 0, 0, 2, 0, 0 ],
    "R'": "R R",
    "L": [ 2, 0, 2, 1, 0, 0, 0, 2 ],
    "L'": "L L",
    "B": [ 0, 2, 1, 2, 0, 0, 2, 0 ],
    "B'": "B B"
  }
});

var centers = new Perm({
  size: 6,
  moveEffects: {
    "F": [ 1, 2, 0, 3, 4, 5 ],
    "F'": "F F",
    "R": [ 2, 1, 4, 3, 0, 5 ],
    "R'": "R R",
    "L": [ 5, 0, 2, 3, 4, 1 ],
    "L'": "L L",
    "B": [ 4, 1, 2, 3, 5, 0 ],
    "B'": "B B"
  }
});

var puz = new Puz({
  components: {
    cornerPerm: cornerPerm,
    cornerOrie: cornerOrie,
    centers: centers
  },
  axes: [
    ["F", "F'"],
    ["R", "R'"],
    ["L", "L'"],
    ["B", "B'"]
  ],
  // TODO: this is wrong
  validateState: function() {
    return true;
  }
});

module.exports = puz;
