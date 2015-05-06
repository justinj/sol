// takes the things which are either defined moves or sequences and converts
// them all into defined moves
var moveEffect = function(puz, move) {
  var m = puz.moveEffects[move];
  var moves;
  var result = puz.solved;
  if (typeof m === "string") {
    // TODO: should be more robust
    moves = m.split(" "); 
    for (var i = 0; i < moves.length; i++) {
      result = puz.apply(result, puz.moveEffects[moves[i]]);
    }
    return result;
  } else {
    return puz.apply(result, m);
  }
};

var moveTable = function(component) {
  return Object.keys(component.moveEffects).map(function(move) {
    var effect = moveEffect(component, move, component.solved);
    return {
      effect: effect,
      move: move
    }
  });
};

module.exports = function(component) {
  var table = [];
  var moves = moveTable(component);
  var queue = [component.solved];
  var curState;
  var index;

  while (queue.length > 0) {
    curState = queue.shift();
    index = component.index(curState);
    var transitions = [];
    for (var i = 0; i < moves.length; i++) {
      var newState = component.apply(curState, moves[i].effect);
      var newIndex = component.index(newState);
      if (table[newIndex] === undefined) {
        table[newIndex] = null;
        queue.push(newState);
      }
      transitions.push(component.index(newState));
    }
    table[index] = transitions;
  }

  return table;
};
