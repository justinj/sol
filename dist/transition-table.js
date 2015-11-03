"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  var solved = opts.solved;
  var moveEffects = opts.moveEffects;
  var apply = opts.apply;
  var index = opts.index;

  var table = [];
  var moves = moveTable(moveEffects);
  var queue = [solved];
  var curState;
  var stateIndex;

  while (queue.length > 0) {
    curState = queue.shift();
    stateIndex = index(curState);
    var transitions = [];
    for (var i = 0; i < moves.length; i++) {
      var newState = apply(curState, moves[i].effect);
      var newIndex = index(newState);
      if (table[newIndex] === undefined) {
        table[newIndex] = null;
        queue.push(newState);
      }
      transitions.push(index(newState));
    }
    table[stateIndex] = transitions;
  }

  return table;
};

// takes the things which are either defined moves or sequences and converts
// them all into defined moves
var moveTable = function moveTable(moveEffects) {
  return Object.keys(moveEffects).map(function (move) {
    return {
      effect: moveEffects[move],
      move: move
    };
  });
};

// opts object should have:
//   solved: the solved state :: 'a
//   moveEffects: map from moves to their effects :: 'a moveEffects
//   apply: function to apply a state to another :: ('a, 'a) -> 'a
//   index: function to index a state :: 'a -> int
;