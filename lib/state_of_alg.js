// TODO: consider - this would be useful in derecursifying moveEffects, but it depends on that.
// perhaps the logic for that should be brought in here
module.exports = function(puz, alg) {
  var solved = puz.solved;
  var apply = puz.apply;
  // TODO: more robust
  var moves = alg.split(" ");
  return moves.reduce(function(state, move) {
    var effect = puz.moveEffects[move];
    return apply(state, effect);
  }, solved);
};
