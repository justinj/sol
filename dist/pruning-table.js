"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (_ref) {
  var // TODO: don't have this guy just grab the ttable.
  // either do something with the new interface or pass in the ttable (probably preferable)
  transitions = _ref.transitions;
  var index = _ref.index;
  var solved = _ref.solved;

  var solvedIndex = index(solved);

  var table = [];
  table[solvedIndex] = 0;

  var queue = [solvedIndex];
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

  return table;
};

;