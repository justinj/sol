// This guy builds a table for all the solutions to scrambles shorter than a certain distance.
// My initial tests showed that this slowed stuff down, but it's conceivable
// that it could be improved.
// This file isn't really used right now, but could be helpful later.


import indexState from './index_state';

// TODO: this and godTable could be generalized somehow, there was some copy pasting going on here :(
export default function(puz, upto) {
  var result = {};
  var tables = puz.getTransitionTables();
  var numMoves = tables[0][0].length;
  var sizes = tables.map(t => t.length);
  var queue = [tables.map(_ => 0)];
  result[indexState(queue[0], sizes)] = 0;

  var states = {};
  var visited = {}
  var nextQueue = [];
  var newState;
  for (var depth = 0; depth < upto; depth++) {
    for (var i = 0; i < queue.length; i++) {

      if (!states.hasOwnProperty(index)) {
        states[index] = depth;
      }

      for (var move = 0; move < numMoves; move++) {
        newState = [];
        for (var table = 0; table < tables.length; table++) {
          newState[table] = tables[table][queue[i][table]][move];
        }
        var index = indexState(newState, sizes);
        if (!visited.hasOwnProperty(index)) {
          nextQueue.push(newState);
          visited[index] = depth;
        }
      }
    }
    queue = nextQueue;
    nextQueue = [];
  }

  return states;
};
