// take a moveEffects that might have been defined recursively and DERECURSIFY it
import mapObj from './map-obj';

// TODO: test me

var moveEffect = function(opts, move) {
  var { solved, apply, moveEffects } = opts;
  var m = moveEffects[move];
  var moves;
  var result = solved;
  if (typeof m === "string") {
    // TODO: should be more robust
    moves = m.split(" "); 
    for (var i = 0; i < moves.length; i++) {
      result = apply(result, moveEffects[moves[i]]);
    }
    return result;
  } else {
    return m;
  }
};

export default function(opts) {
  return mapObj(opts.moveEffects, (moveName, effect) => moveEffect(opts, moveName));
};
