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

let UD = 0;
let FB = 1;
let LR = 2;

var isUOrD = x => x === 0 || x === 4;

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

var CORNERS = {
  0: [0, 22, 4],
  1: [1, 9, 23],
  2: [3, 7, 8],
  3: [2, 5, 6],
  4: [19, 21, 15],
  5: [17, 14, 13],
  6: [16, 12, 11]
};

var getOrie = function(corner) {
  if (isUOrD(corner[0])) return 0;
  if (isUOrD(corner[1])) return 2;
  if (isUOrD(corner[2])) return 1;
  throw new Error("PANIC!!!");
};

var canonicalizeCorner = function(corner) {
  // super not-general, but simple
  if (corner[0] < corner[1] && corner[0] < corner[2]) {
    return corner;
  } else if (corner[1] < corner[0] && corner[1] < corner[2]) {
    return [corner[1], corner[2], corner[0]];
  } else if (corner[2] < corner[1] && corner[2] < corner[0]) {
    return [corner[2], corner[0], corner[1]];
  }
};

var len = 7;

var arrayEqual = function(a, b) {
  if (a.length !== b.length) return false;
  for (var i = 0; i < a.length; i++) {
    if (a[i] !== b[i]) return false;
  }
  return true;
};

var partiallyDefined = function(corner) {
  for (var i = 0; i < corner.length; i++) {
    if (corner[i] === 6) {
      return true;
    }
  }
  return false;
};

var isSameCorner = function(realCorner, candidateCorner) {
  if (partiallyDefined(candidateCorner)) {
    let amountSame = 0;
    for (var offset = 0; offset < 3; offset++) {
      for (var i = 0; i < 3; i++) {
        if (candidateCorner[(i + offset) % 3] === realCorner[i]) {
          amountSame += 1;
        }
      }
      if (amountSame >= 2) {
        return true
      }
    }
    return false;
  } else {
    return arrayEqual(canonicalizeCorner(realCorner), canonicalizeCorner(candidateCorner));
  }
};

var getIndexOfCorner = function(corner, state) {
  corner = CORNERS[corner];
  corner = corner.map(c => state[c]);
  for (var i = 0; i < 7; i++) {
    let newCorner = CORNERS[i].map(c => colours[c]);
    if (isSameCorner(newCorner, corner)) {
      return i;
    }
  }
  throw new Error("panic...?");
};

var orientationKinds = {
  0: UD,
  1: LR,
  2: FB,
  3: LR,
  4: UD,
  5: FB
};

var allPieces = [
  [0, 1, 2],
  [0, 2, 3],
  [0, 3, 5],
  [0, 5, 1],
  [4, 2, 1],
  [4, 3, 2],
  [4, 5, 3],
  [4, 1, 5]
];

// This simplifies things - we include all cyclic shifts of all the allPieces
var numPieces = allPieces.length;
for (var i = 0; i < numPieces; i++) {
  var newPiece = allPieces[i].slice();
  newPiece.push(newPiece.shift());
  allPieces.push(newPiece);
  newPiece = newPiece.slice();
  newPiece.push(newPiece.shift());
  allPieces.push(newPiece);
}

var fillInCorner = function(normalized) {
  normalized = normalized.slice();

  for (var i = 0; i < allPieces.length; i++) {
    // Dumb, but easy
    if (allPieces[i][0] === normalized[0]
      && allPieces[i][1] === normalized[1]) {
        return allPieces[i];
    }
    if (allPieces[i][1] === normalized[1]
      && allPieces[i][2] === normalized[2]) {
        return allPieces[i];
    }
    if (allPieces[i][2] === normalized[2]
      && allPieces[i][0] === normalized[0]) {
        return allPieces[i];
    }
  }

  return normalized;
};

var numberOfStickers = function(piece) {
  let count = 0;
  piece.forEach(sticker => count += sticker === 6 ? 0 : 1);
  return count;
}

let positionsForSingleStickers = {
  0: [0, 1, 2, 3],
  1: [0, 3, 6],
  2: [2, 3, 5, 6],
  3: [1, 2, 4, 5],
  4: [4, 5, 6],
  5: [0, 1, 4],
};

// We need this because listing the corners in ccw order means
// we need extra info to determine the orientation of a piece
// (this doesn't have much variation though, they make a checker pattern)
let orientationTypeOrder = {
  0: [UD, LR, FB],
  1: [UD, FB, LR],
  2: [UD, LR, FB],
  3: [UD, FB, LR],
  4: [UD, LR, FB],
  5: [UD, FB, LR],
  6: [UD, LR, FB],
};

var classifyCorner = function(corner, state) {
  var normalized = CORNERS[corner];
  normalized = normalized.map(c => state[c]);
  let stickerCount = numberOfStickers(normalized);
  if (stickerCount >= 2) {
    let index = getIndexOfCorner(corner, state);
    normalized = fillInCorner(normalized);
    return {
      type: Two.COMPLETE_PIECE,
      which: [index],
      orientation: getOrie(normalized)
    };
  } else if (stickerCount === 1) {
    let sticker;
    let stickerPosn;
    for (let i = 0; i < normalized.length; i++) {
      if (normalized[i] !== 6) {
        sticker = normalized[i];
        stickerPosn = i;
      }
    }

    // ugh, this is because we want orientation in cw, but we store stickers in ccw. fix this.
    if (stickerPosn === 2) stickerPosn = 1;
    else if (stickerPosn === 1) stickerPosn = 2;

    let relevantOrientations = orientationTypeOrder[corner];
    let orientationType = orientationKinds[sticker];
    let orientationIndex = relevantOrientations.indexOf(orientationType);
    return {
      type: Two.PARTIALLY_DEFINED,
      sticker: sticker,
      orientation: (stickerPosn - orientationIndex + 3) % 3,
      which: positionsForSingleStickers[sticker],
    };
  }
};


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
    var len = Object.keys(CORNERS).length;
    var id = [];
    for (var i = 0; i < len; i++) { id.push(i); }
    return id.map(corner => classifyCorner(corner, this.normalizedStickers()));
  }
}

Two.COMPLETE_PIECE = "complete_piece";
Two.PARTIALLY_DEFINED = "partially_defined";

export default Two;
