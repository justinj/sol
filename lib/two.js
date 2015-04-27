var indexing = require("./indexing");
var Perm = require("./perm");
var Orie = require("./orie");

var perm = Perm.define({
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

var orie = Orie.define({
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

var puz = {
  components: {
    orie: orie,
    perm: perm
  },
  moves: [
    "F", "F2", "F'",
    "R", "R2", "R'",
    "U", "U2", "U'"
  ],
  axes: [
    ["F", "F2", "F'"],
    ["R", "R2", "R'"],
    ["U", "U2", "U'"]
  ],
  // TODO: this should be computed automatically
  followups: {
    "-1": [0, 1, 2, 3, 4, 5, 6, 7, 8],
    "0" : [3, 4, 5, 6, 7, 8],
    "1" : [3, 4, 5, 6, 7, 8],
    "2" : [3, 4, 5, 6, 7, 8],
    "3" : [0, 1, 2, 6, 7, 8],
    "4" : [0, 1, 2, 6, 7, 8],
    "5" : [0, 1, 2, 6, 7, 8],
    "6" : [0, 1, 2, 3, 4, 5],
    "7" : [0, 1, 2, 3, 4, 5],
    "8" : [0, 1, 2, 3, 4, 5]
  }
};

module.exports = puz;
