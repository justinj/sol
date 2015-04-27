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
  if (component.moveTable) {
    return component.moveTable;
  }
  var moves = [];
  var i = 0;
  Object.keys(component.moveEffects).forEach(function(move) {
    var effect = applyMoveTo(component, move, component.solved, component.apply);
    moves.push({
      effect: effect,
      move: move
    });
  });
  component.moveTable = moves;
  return moves;
};

module.exports = function(component) {
  if (component.transitionTable) {
    return component.transitionTable;
  }
  var table = [];
  var moves = moveTable(component);
  var queue = [component.solved];
  var curState;
  var index;

  while (queue.length > 0) {
    curState = queue.shift();
    index = component.index(curState);
    var transitions = moves.map(function(m) {
      var newState = component.apply(curState, m.effect);
      // TODO: mutation in here is sort of gross
      if (table[index] === undefined) {
        queue.push(newState);
      }
      return component.index(newState);
    });
    table[index] = transitions;
  }

  component.transitionTable = table;
  return table;
};
