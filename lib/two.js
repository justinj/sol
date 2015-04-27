var indexing = require("./indexing");
var Perm = require("./perm");
var applyPerm = require("./apply_perm");

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

var orie = {
  kind: "orientation",
  size: 7,
  order: 3,
  // TODO: should be automatically computed
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
  },
  solved: {
    // we just have the permutation here so we have that the moves are the same type as the states
    orie: [0, 0, 0, 0, 0, 0, 0],
    perm: [0, 1, 2, 3, 4, 5, 6]
  },
  index: function(orie) {
    // ...this part means we effectively ignore the perm part, so it doesn't matter
    return indexing.index_of_orientation(orie.orie, 3);
  },
  apply: function(to, orie) {
    var or = applyPerm(to.orie, orie.perm);
    var pe = applyPerm(to.perm, orie.perm);
    for (var i = 0; i < orie.orie.length; i++) {
      or[i] = (orie.orie[i] + or[i]) % 3;
    }
    return {
      orie: or,
      perm: pe
    };
  }
};

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
