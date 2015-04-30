var applyMoveTo = function(perm, move, to, applyFunc) {
  var m = perm.moveEffects[move];
  var moves;
  if (typeof m === "string") {
    // TODO: should be more robust
    moves = m.split(" "); 
    for (var i = 0; i < moves.length; i++) {
      to = applyFunc(to, perm.moveEffects[moves[i]]);
    }
    return to;
  } else {
    return applyFunc(to, m);
  }
};

var moveTable = function(component) {
  var moves = [];
  var i = 0;
  Object.keys(component.moveEffects).forEach(function(move) {
    var effect = applyMoveTo(component, move, component.solved, component.apply);
    moves.push({
      effect: effect,
      move: move
    });
  });
  return moves;
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
