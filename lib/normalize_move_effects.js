// take a moveEffects that might have been defined recursively and DERECURSIFY it
var mapObj = require("./map_obj");

var moveEffect = function(puz, moveEffects, move) {
  var m = moveEffects[move];
  var moves;
  var result = puz.solved;
  if (typeof m === "string") {
    // TODO: should be more robust
    moves = m.split(" "); 
    for (var i = 0; i < moves.length; i++) {
      result = puz.apply(result, moveEffects[moves[i]]);
    }
    return result;
  } else {
    return puz.apply(result, m);
  }
};

module.exports = function(puz, moveEffects) {
  return mapObj(moveEffects, (moveName, effect) => moveEffect(puz, moveEffects, moveName));
};
