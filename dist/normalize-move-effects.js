"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (opts) {
  return (0, _mapObj2.default)(opts.moveEffects, function (moveName, effect) {
    return moveEffect(opts, moveName);
  });
};

var _mapObj = require("./map-obj");

var _mapObj2 = _interopRequireDefault(_mapObj);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: test me

var moveEffect = function moveEffect(opts, move) {
  var solved = opts.solved;
  var apply = opts.apply;
  var moveEffects = opts.moveEffects;

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
    return apply(result, m);
  }
}; // take a moveEffects that might have been defined recursively and DERECURSIFY it

;