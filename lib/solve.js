// FYI: this module does a number of probably less than ideal things in the interest of performance.
var mapObj = function(obj, f) {
  var result = {};
  Object.keys(obj).forEach(function(k) {
    result[k] = f(k, obj[k]);
  });
  return result;
};

var stateIndexSolved = function(state) {
  for (var i = 0; i < state.length; i++) {
    if (state[i] !== 0) {
      return false;
    }
  }
  return true;
};

// searches for solutions of a particular length, for use with iterative deepening
// this guy is the inner loop, so should be as fast as possible

// Sort of unintuitive - this guy returns `false` if it can't find a solution of the requested depth,
// otherwise it returns an array of moves of the solution.
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
    // reusing newState across recursions gives a modest speed improvement.
    var newState = [];
    for (var i = 0; i < followups[lastMove].length; i++) {
      var move = followups[lastMove][i];
      // TODO: potential optimization is not allocating a new array every time here
      // We use an array here instead of an object keyed by the component names
      // because it's quite a bit faster.
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
