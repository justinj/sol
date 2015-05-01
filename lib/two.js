var indexing = require("./indexing");
var Perm = require("./perm");
var Orie = require("./orie");
var Puz = require("./puz")

var perm = new Perm({
  size: 7,
  moveEffects: {
    "F": [0, 1, 3, 6, 4, 2, 5],
    "F2": "F F",
    "F'": "F F F",
    "R": [0, 2, 5, 3, 1, 4, 6],
    "R2": "R R",
    "R'": "R R R",
    "U": [3, 0, 1, 2, 4, 5, 6],
    "U2": "U U",
    "U'": "U U U"
  }
});

var orie = new Orie({
  kind: Orie.kinds.zero_sum,
  size: 7,
  order: 3,
  moveEffects: {
    "F": {
      orie: [0, 0, 1, 2, 0, 2, 1],
      perm: [0, 1, 3, 6, 4, 2, 5]
    },
    "F2": "F F",
    "F'": "F F F",
    "R": {
      orie: [0, 1, 2, 0, 2, 1, 0],
      perm: [0, 2, 5, 3, 1, 4, 6]
    },
    "R2": "R R",
    "R'": "R R R",
    "U": {
      orie: [0, 0, 0, 0, 0, 0, 0],
      perm: [3, 0, 1, 2, 4, 5, 6]
    },
    "U2": "U U",
    "U'": "U U U"
  }
});

var puz = new Puz({
  components: {
    orie: orie,
    perm: perm
  },
  axes: [
    ["F", "F2", "F'"],
    ["R", "R2", "R'"],
    ["U", "U2", "U'"]
  ],
  // every combination of permutation and orientation for a 2x2 is valid, but
  // for some puzzles this is not true, so this is needed to confirm that a
  // generated state is ok.
  validateState: function() {
    return true;
  }
});

module.exports = puz;
