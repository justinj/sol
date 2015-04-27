var puz = require("./two");

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

// I don't really like all this stuff that just tacks on a property as a form
// of caching, I think we should have an explicit step where we go through and
// compute this stuff.

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
