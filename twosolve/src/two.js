import classifyCorner from './classify-corner';
// TODO: would be sweet to generalize a bunch of the stuff that got ripped from cubid
var solved = [
           0,  1,
           2,  3,
   4,  5,  6,  7,  8,  9,
  10, 11, 12, 13, 14, 15,
          16, 17,
          18, 19,
          20, 21,
          22, 23];

var colours = [
           0,  0,
           0,  0,
   1,  1,  2,  2,  3,  3,
   1,  1,  2,  2,  3,  3,
           4,  4,
           4,  4,
           5,  5,
           5,  5];

var opposites = {
  0: 4, 4: 0,
  2: 5, 5: 2,
  1: 3, 3: 1
};

var moveDefs = [
  ["U", [  2,  0,
           3,  1,
   6,  7,  8,  9, 23, 22,
  10, 11, 12, 13, 14, 15,
          16, 17,
          18, 19,
          20, 21,
           5,  4]],

  ["x", [  6,  7,
          12, 13,
   5, 11, 16, 17, 14,  8,
   4, 10, 18, 19, 15,  9,
          20, 21,
          22, 23,
           0,  1,
           2,  3]],

  ["y", [  2,  0,
           3,  1,
   6,  7,  8,  9, 23, 22,
  12, 13, 14, 15, 21, 20,
          17, 19,
          16, 18,
          11, 10,
           5,  4]],
   ["z" , "x y x'"],
   ["D" , "x2 U x2"],
   ["R" , "z D z'"],
   ["L" , "y2 R y2"],
   ["F" , "y' R y"],
   ["B" , "y2 F y2"]
];

var applyMove = function(cube, move) {
  if (!moveEffects.hasOwnProperty(move)) {
    throw new Error("Unknown move '" + move + "'");
  }
  return moveEffects[move].map(function(i) { return cube[i] });
};

var moveEffects = {};

var movesInAlg = function(sequence) {
    return sequence.split(" ");
};

moveDefs.forEach(function(def) {
  var move = def[0];
  var definition = def[1];
  // Moves are defined either as a permutation (undesirable but necessary)
  // or as another algorithm (preferred).
  if (typeof definition === "object") {
    moveEffects[move] = definition;
  } else {
    var moves = movesInAlg(definition);
    moveEffects[move] = moves.reduce(applyMove, solved);
  }
  var cube = applyMove(solved, move);
  moveEffects[move] = cube;

  cube = applyMove(cube, move);
  moveEffects[move + "2"] = cube;

  cube = applyMove(cube, move);
  moveEffects[move + "'"] = cube;
});

class Two {
  constructor(state = colours) {
    this._state = state.slice();
  }

  apply(move) {
    return new Two(applyMove(this._state, move));
  }

  colourAt(i) {
    return this._state[i];
  }

  stickers() {
    return this._state.slice();
  }

  updateIndex(index, col) {
    var cols = this.stickers();
    cols[index] = col;
    return new Two(cols);
  }

  normalizedStickers() {
    var b = this._state[20];
    var f = opposites[b];
    var d = this._state[18];
    var u = opposites[d];
    var l = this._state[10];
    var r = opposites[l];
    var mapping = {
      [f]: 2, [b]: 5,
      [u]: 0, [d]: 4,
      [r]: 3, [l]: 1,
      6: 6
    };
    return this._state.map(i => mapping[i]);
  }

  getOrie() {
    return this.pieces().map(piece => piece.orientation);
  }

  getPerm() {
    return this.pieces().map(piece => piece.which);
  }

  pieces() {
    var len = 7;
    var id = [];
    for (var i = 0; i < len; i++) { id.push(i); }
    return id.map(corner => classifyCorner(corner, this.normalizedStickers()));
  }
}

Two.COMPLETE_PIECE = "complete_piece";
Two.PARTIALLY_DEFINED = "partially_defined";

export default Two;
