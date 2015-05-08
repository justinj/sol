// TODO: cute would be to sort these in ascending order somehow...
var indexState = function(state, sizes) {
  var result = state[0];
  for (var i = 1; i < state.length; i++) {
    result = result * sizes[i] + state[i];
  }
  return result;
};

// TODO: this guy doesn't currently make use of `followups`
module.exports = function(puz) {
  var result = {};
  var tables = puz.getTransitionTables();
  var numMoves = tables[0][0].length;
  var sizes = tables.map(t => t.length);
  var queue = [tables.map(_ => 0)];
  result[indexState(queue[0], sizes)] = 0;

  var godsTable = [];
  var nextQueue = [];
  var newState;
  var depth = 1;
  while (queue.length > 0) {
    for (var i = 0; i < queue.length; i++) {
      for (var move = 0; move < numMoves; move++) {
        newState = [];
        for (var table = 0; table < tables.length; table++) {
          newState[table] = tables[table][queue[i][table]][move];
        }
        var index = indexState(newState, sizes);
        if (!result.hasOwnProperty(index)) {
          nextQueue.push(newState);
          result[index] = depth;
        }
      }
    }
    godsTable.push(nextQueue.length);
    depth += 1;
    queue = nextQueue;
    nextQueue = [];
  }

  return godsTable;
};
