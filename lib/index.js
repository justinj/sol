var indexing = require("./indexing");
var alg = require("alg");

var apply_perm = function(to, perm) {
  return perm.map(function(i) { return to[i] });
};

var perm = {
  kind: "permutation",
  size: 7,
  moveEffects: {
    "F": [0, 1, 3, 6, 4, 2, 5],
    "R": [0, 2, 5, 3, 1, 4, 6],
    "U": [3, 0, 2, 1, 4, 5, 6]
  }
};

var solved = [0, 1, 2, 3, 4, 5, 6];

var move_table = function(perm) {
  var moves_to_indices = {};
  var indices_to_moves = {};
  var i = 0;
  Object.keys(perm.moveEffects).forEach(function(move) {

  });
};



console.log(indexing);
