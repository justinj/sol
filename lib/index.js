var puz = require("./two");
var transitionTable = require("./transition_table");
var pruningTable = require("./pruning_table");

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
var solveAtDepth = function(state, depth, puz, lastMove, ttable, ptable) {
  var followups = puz.followups;
  if (depth === 0 && stateIndexSolved(state)) {
    return [];
  } else if (depth === 0) {
    return false;
  } else {
    var componentNames = Object.keys(puz.components);
    for (var i = 0; i < componentNames.length; i++) {
      var component = componentNames[i];
      if (ptable[component][state[component]] > depth) {
        return false;
      }
    }
    for (var i = 0; i < followups[lastMove].length; i++) {
      var move = followups[lastMove][i];
      var newState = mapObj(puz.components, function(name, component) {
        return ttable[name][state[name]][move];
      });
      var result = solveAtDepth(newState, depth - 1, puz, move, ttable, ptable);
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
  var ttable = mapObj(puz.components, function(k, v) {
    return transitionTable(v);
  });
  var ptable = mapObj(puz.components, function(k, v) {
    return pruningTable(v);
  });

  while (!result && depth <= 11) {
    result = solveAtDepth(curIndex, depth, puz, -1, ttable, ptable);
    depth += 1;
  }

  return result.map(function(i) { return puz.moves[i] }).join(" ");
};

console.log(solve(puz, {
  perm: [0, 2, 1, 3, 4, 5, 6],
  orie: {
    orie: [0, 2, 1, 0, 0, 0, 0],
    perm: [0, 1, 2, 3, 4, 5, 6]
  }
}));
