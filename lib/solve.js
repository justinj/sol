// FYI: this module does a number of probably less than ideal things in the interest of performance.
import indexState from './index-state';

var stateIndexSolved = function(state, ptable) {
  for (var i = 0; i < state.length; i++) {
    if (ptable[i][state[i]] !== 0) {
      return false;
    }
  }
  return true;
};

// searches for solutions of a particular length, for use with iterative deepening
// this guy is the inner loop, so should be as fast as possible

// Sort of unintuitive - this guy returns `false` if it can't find a solution of the requested depth,
// otherwise it returns an array of moves of the solution.
var solveAtDepth = function(state, depth, puz, lastMove, ttable, ptable, justOne) {
  // TODO: there is some bug here:
  // by removing the depth === 0 check we can find solutions for the skewb def
  if (depth === 0 && stateIndexSolved(state, ptable)) {
    return [[]];
  } else if (depth === 0) {
    return [];
  } else {
    for (var i = 0; i < state.length; i++) {
      if (ptable[i][state[i]] > depth) {
        return [];
      }
    }
    // reusing newState across recursions gives a modest speed improvement.
    // TODO: potential optimization is not allocating a new array at all, and just using an index
    var newState = [];
    var followups = puz.followups;
    var followupLengths = puz.followupLengths;
    var solutions = [];
    for (var i = 0; i < followupLengths[lastMove]; i++) {
      var move = followups[lastMove][i];
      // We use an array here instead of an object keyed by the component names
      // because it's quite a bit faster.
      for (var j = 0; j < state.length; j++) {
        newState[j] = ttable[j][state[j]][move];
      }
      // TODO: it might be possible to manually do this recursion with arrays
      // or something for some speedup... sounds messy and difficult, and the
      // js engine probably already optimizes this heavily
      var result = solveAtDepth(newState, depth - 1, puz, move, ttable, ptable, justOne);
      for (var j = 0; j < result.length; j++) {
        solutions.push([followups[lastMove][i]].concat(result[j]));
      }
      if (solutions.length > 0 && justOne) {
        return [solutions[0]];
      }
    }
    return solutions;
  }
};

var DEFAULTS = {
  minDepth: 0,
  maxDepth: -1,
  justOne: true
};

/**
 * Options are:
 * - puz - The puzzle we're solving for
 * - state - the state we are solving
 * - minDepth - the minimum depth to search from
 * - justOne - only find one solution - this being `true` can improve performance
 *   as we can stop searching once we've found a solution
 */

var solve = function(opts) {
  opts = {
    ...DEFAULTS,
    ...opts
  };
  var { puz, state, minDepth, justOne } = opts;
  var depth = minDepth;
  var componentNames = Object.keys(puz.components);
  var ttable = puz.getTransitionTables();
  var ptable = puz.getPruningTables();
  var curState = componentNames.map(name => puz.components[name].index(state[name]));

  var solutions = [];
  while (solutions.length === 0) {
    solutions = solveAtDepth(curState, depth, puz, puz.followups.length - 1, ttable, ptable, justOne);
    depth += 1;
  }

  var strs = solutions.map(solution => solution.map(i => puz.moves[i] ).join(" "));
  if (justOne) {
    return [strs[0]];
  } else {
    return strs;
  }
};

export default solve;
