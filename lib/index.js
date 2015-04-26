var indexing = require("./indexing");
var alg = require("alg");

var applyPerm = function(to, perm) {
  return perm.map(function(i) { return to[i] });
};

var applyOrieWithBackingPermutation = function(to, perm, orie, order) {
  var permuted = applyPerm(to, perm);
  return permuted.map(function(x, i) { return (x + orie[i]) % order });
};

var solved = [0, 1, 2, 3, 4, 5, 6];

var applyMoveTo = function(perm, move, to, applyFunc) {
  var m = perm.moveEffects[move];
  var moves;
  if (typeof m === "string") {
    // TODO: should be more robust
    moves = m.split(" "); 
    for (var i = 0; i < moves.length; i++) {
      to = applyFunc(to, perm.moveEffects[moves[i]]);
    }
    return to;
  } else {
    return applyFunc(to, m);
  }
};

var perm = {
  kind: "permutation",
  size: 7,
  solved: [0, 1, 2, 3, 4, 5, 6],
  // TODO: should be automatically computed
  numElements: 5040,
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
  index: indexing.index_of_perm,
  apply: applyPerm
};

var orie = {
  kind: "orientation",
  size: 7,
  order: 3,
  solved: [0, 0, 0, 0, 0, 0, 0],
  // TODO: should be automatically computed
  numElements: 729,
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

var moveTable = function(component) {
  if (component.moveTable) {
    return component.moveTable;
  }
  var moves = [];
  var i = 0;
  Object.keys(component.moveEffects).forEach(function(move) {
    var effect = applyMoveTo(component, move, component.solved, component.apply);
    moves.push({
      effect: effect,
      move: move
    });
  });
  component.moveTable = moves;
  return moves;
};

var transitionTable = function(component) {
  if (component.transitionTable) {
    return component.transitionTable;
  }
  var table = [];
  var moves = moveTable(component);
  var queue = [component.solved];
  var curState;
  var index;

  while (queue.length > 0) {
    curState = queue.shift();
    index = component.index(curState);
    var transitions = moves.map(function(m) {
      var newState = component.apply(curState, m.effect);
      // TODO: mutation in here is sort of gross
      if (table[index] === undefined) {
        queue.push(newState);
      }
      return component.index(newState);
    });
    table[index] = transitions;
  }

  component.transitionTable = table;
  return table;
};

var pruningTable = function(component) {
  if (component.pruningTable) {
    return component.pruningTable;
  }
  var transitions = transitionTable(component);
  var solvedIndex = component.index(component.solved);

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

  component.pruningTable = table;
  return table;
};

var indexSolved = function(x) { return x === 0; };

var mapObj = function(obj, f) {
  var result = {};
  Object.keys(obj).forEach(function(k) {
    result[k] = f(k, obj[k]);
  });
  return result;
};

var stateIndexSolved = function(state) {
  var keys = Object.keys(state);
  for (var i = 0; i < keys.length; i++) {
    if (state[keys[i]] !== 0) {
      return false;
    }
  }
  return true;
};

// weird signature, don't really like
var solveAtDepth = function(state, depth, puz, lastMove) {
  var ttable = mapObj(puz.components, function(k, v) { return transitionTable(v); });
  var followups = puz.followups;
  if (depth === 0 && stateIndexSolved(state)) {
    return [];
  } else if (depth === 0) {
    return false;
  } else {
    var componentNames = Object.keys(puz.components);
    for (var i = 0; i < componentNames.length; i++) {
      var component = componentNames[i];
      if (pruningTable(puz.components[component])[state[component]] > depth) {
        return false;
      }
    }
    for (var i = 0; i < followups[lastMove].length; i++) {
      var move = followups[lastMove][i];
      var newState = mapObj(puz.components, function(name, component) {
        return ttable[name][state[name]][move];
      });
      var result = solveAtDepth(newState, depth - 1, puz, move);
      if (result !== false) {
        return [move].concat(result);
      }
    }
    return false;
  }
};

var solve = function(puz, state) {
  var curIndex = mapObj(puz.components, function(name, component) {
    return component.index(state[name]);
  });

  var depth = 0;
  var result;

  while (!result && depth <= 11) {
    console.log(depth);
    result = solveAtDepth(curIndex, depth, puz, -1);
    depth += 1;
  }

  return result.map(function(i) { return puz.moves[i] }).join(" ");
};

console.log(solve(puz, {
  perm: [0, 2, 1, 3, 4, 5, 6],
  orie: {
    orie: [0, 0, 0, 0, 0, 0, 0],
    perm: [0, 1, 2, 3, 4, 5, 6]
  }
}));
