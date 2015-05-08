// takes the things which are either defined moves or sequences and converts
// them all into defined moves
var moveTable = function(component) {
  return Object.keys(component.moveEffects).map(function(move) {
    return {
      effect: component.moveEffects[move],
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
