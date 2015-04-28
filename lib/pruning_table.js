var transitionTable = require("./transition_table");
module.exports = function(component) {
  if (component.pruningTable) {
    return component.pruningTable;
  }
  var transitions = component.transitionTable;
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
