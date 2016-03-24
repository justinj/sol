// takes the things which are either defined moves or sequences and converts
// them all into defined moves
var moveTable = function(moveEffects) {
  return Object.keys(moveEffects).map(function(move) {
    return {
      effect: moveEffects[move],
      move: move
    }
  });
};

// opts object should have:
//   solved: the solved state :: 'a
//   moveEffects: map from moves to their effects :: 'a moveEffects
//   apply: function to apply a state to another :: ('a, 'a) -> 'a
//   index: function to index a state :: 'a -> int
export default function({ solved, moveEffects, apply, index }) {
  let table = [];
  let moves = moveTable(moveEffects);
  let queue = [solved];

  while (queue.length > 0) {
    let curState = queue.shift();
    let stateIndex = index(curState);
    let transitions = new Array(moves.length);;
    for (var i = 0; i < moves.length; i++) {
      let newState = apply(curState, moves[i].effect);
      let newIndex = index(newState);
      if (table[newIndex] === undefined) {
        table[newIndex] = null;
        queue.push(newState);
      }
      transitions[i] = index(newState);
    }
    table[stateIndex] = transitions;
  }

  return table;
};
