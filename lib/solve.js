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
var solveAtDepth = function(state, depth, puz, lastMove, ttable, ptable, justOne) {
  // `state`
  // An array of numbers each corresponding to the state of a component of the puzzle
  // `depth`
  // The maximum depth to search up to. All solutions we find are `depth` long.
  // `puz`
  // The puzzle we're solving.
  // `lastMove`
  // The last move performed. Because the followups includes a list of every
  // move at the end, if no moves have been performed yet, we can pass in the
  // index of the last element.
  // `ttable`
  // A list of transition tables corresponding to the components of the puzzle.
  // We could grab it off the puzzle, but passing it around saves calling the method.
  // `ptable`
  // A list of pruning tables.
  let spaces = "";
  for (var i = 0; i < depth; i++) {
    spaces += ' ';
  }
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


    // `newState` is an array which represents the next state we're visiting.
    // Conceptually it would make more sense to allocate this inside the `for`,
    // but by reusing it we can get a slight speed boost.
    // A potential optimization here might be just representing the entire state with an integer.
    let newState = [];

    // `followups` gives the moves which can follow a move. For example, when
    // solving a 2x2, after doing a "U" move, you wouldn't want to do another
    // "U" move.
    let followups = puz.followups[lastMove];

    let solutions = [];
    let numberOfFollowups = followups.length;
    for (var i = 0; i < numberOfFollowups; i++) {
      var move = followups[i];
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
        solutions.push([followups[i]].concat(result[j]));
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
  var ttable = puz.getTransitionTables();
  var ptable = puz.getPruningTables();
  var curState = puz.createIndexArray(state);

  var solutions = [];
  while (solutions.length === 0) {
    solutions = solveAtDepth(curState, depth, puz, puz.followups.length - 1, ttable, ptable, justOne);
    depth += 1;
  }

  var solutionStrings = solutions.map(solution => solution.map(i => puz.moves[i]).join(" "));
  if (justOne) {
    return [solutionStrings[0]];
  } else {
    return solutionStrings;
  }
};

export default solve;
