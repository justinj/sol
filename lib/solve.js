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
// this guy is the inner loop, so should be as fast as possible
var solveAtDepth = function(state, depth, puz, lastMove, ttable, ptable, componentNames) {
  var followups = puz.followups;
  if (depth === 0 && stateIndexSolved(state)) {
    return [];
  } else if (depth === 0) {
    return false;
  } else {
    for (var i = 0; i < state.length; i++) {
      if (ptable[i][state[i]] > depth) {
        return false;
      }
    }
    for (var i = 0; i < followups[lastMove].length; i++) {
      var move = followups[lastMove][i];
      // TODO: potential optimization is not allocating a new object every time here
      var newState = [];
      for (var j = 0; j < state.length; j++) {
        newState[j] = ttable[j][state[j]][move];
      }
      // TODO: it might be possible to manually do this recursion with arrays
      // or something for some speedup... sounds messy and difficult, and the
      // js engine probably already optimizes this heavily
      var result = solveAtDepth(newState, depth - 1, puz, move, ttable, ptable, componentNames);
      if (result !== false) {
        return [move].concat(result);
      }
    }
    return false;
  }
};

var solve = function(puz, state) {
  var depth = 0;
  var componentNames = Object.keys(puz.components);
  var ttable = [];
  var ptable = [];
  var curState = [];

  for (var i = 0; i < componentNames.length; i++) {
    ttable.push(puz.components[componentNames[i]].transitionTable);
    ptable.push(puz.components[componentNames[i]].pruningTable);
    curState.push(puz.components[componentNames[i]].index(state[componentNames[i]]));
  }

  var result;
  while (!result && depth <= 11) {
    result = solveAtDepth(curState, depth, puz, -1, ttable, ptable, componentNames);
    depth += 1;
  }

  return result.map(function(i) { return puz.moves[i] }).join(" ");
};

module.exports = solve;
