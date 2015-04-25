var indexing = require("./indexing");
var alg = require("alg");

var applyPerm = function(to, perm) {
  return perm.map(function(i) { return to[i] });
};

var solved = [0, 1, 2, 3, 4, 5, 6];

var applyMoveTo = function(perm, move, to) {
  var m = perm.moveEffects[move];
  var moves;
  if (typeof m === "string") {
    // TODO: should be more robust
    moves = m.split(" "); 
    for (var i = 0; i < moves.length; i++) {
      to = applyPerm(to, perm.moveEffects[moves[i]]);
    }
    return to;
  } else {
    return applyPerm(to, m);
  }
};

var perm = {
  kind: "permutation",
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
  },
  axes: [
    ["F", "F2", "F'"],
    ["R", "R2", "R'"],
    ["U", "U2", "U'"]
  ]
};

var moveTable = function(perm) {
  if (perm.moveTable) {
    return perm.moveTable;
  }
  var moves = [];
  var i = 0;
  Object.keys(perm.moveEffects).forEach(function(move) {
    var effect = applyMoveTo(perm, move, solved);
    moves.push({
      effect: effect,
      move: move
    });
  });
  perm.moveTable = moves;
  return moves;
};

var transitionTable = function(perm) {
  if (perm.transitionTable) {
    return perm.transitionTable;
  }
  var table = [];
  var moves = moveTable(perm);
  var queue = [solved];
  var curState;
  var index;

  while (queue.length > 0) {
    curState = queue.shift();
    index = indexing.index_of_perm(curState);
    var transitions = moves.map(function(m) {
      var newState = applyPerm(curState, m.effect);
      // TODO: mutation in here is sort of gross
      if (table[index] === undefined) {
        queue.push(newState);
      }
      return indexing.index_of_perm(newState);
    });
    table[index] = transitions;
  }

  perm.transitionTable = table;
  return table;
};

var pruningTable = function(perm) {
  if (perm.pruningTable) {
    return perm.pruningTable;
  }
  var transitions = transitionTable(perm);
  var solvedIndex = indexing.index_of_perm(solved);

  var table = [];
  table[solvedIndex] = 0;
  
  var queue = [solvedIndex]
  var nextStates;
  var curState;
  var curDist;

  while (queue.length > 0) {
    curState = queue.shift();
    curDist = table[curState];
    nextStates = transitions[curState];
    for (var i = 0; i < nextStates.length; i++) {
      if (table[nextStates[i]] === undefined || curDist + 1 < table[nextStates[i]]) {
        table[nextStates[i]] = curDist + 1;
        queue.push(nextStates[i]);
      }
    }
  }

  perm.pruningTable = table;
  return table;
};

var indexSolved = function(x) { return x === 0; };

// weird signature, don't really like
var solveAtDepth = function(state, depth, ttable, lastMove) {
  if (depth === 0 && indexSolved(state)) {
    return [];
  } else if (depth === 0) {
    return false;
  } else {
    for (var i = 0; i < ttable[state].length; i++) {
      var result = solveAtDepth(ttable[state][i], depth - 1, ttable);
      if (result !== false) {
        return [i].concat(result);
      }
    }
    return false;
  }
};

var solve = function(perm, state) {
  var curIndex = indexing.index_of_perm(state);

  var depth = 0;

  for (var i = 0; i < 11; i++) {
    console.log(solveAtDepth(curIndex, i, transitionTable(perm)));
  }

  return curIndex;
};

console.log(solve(perm, [0, 2, 1, 3, 4, 5, 6]));
