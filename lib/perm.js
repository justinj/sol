var buildList = require("./build_list");
var applyPerm = require("./apply_perm");
var indexing = require("./indexing");
var validate = require("./validate");
var schema = require("js-schema");
var transitionTable = require("./transition_table");
var pruningTable = require("./pruning_table");
var validatePerm = require("./validate_perm");
var factorial = require("./fact");
var normalizeMoveEffects = require("./normalize_move_effects");

var PermSchema = schema({
  size: Number,
  moveEffects: Object
});

var validateMoveEffects = function(size, moveEffects) {
  var keys = Object.keys(moveEffects);

  for (var i = 0; i < keys.length; i++) {
    var move = moveEffects[keys[i]];
    if (typeof move === "object") {
      validatePerm(move, size, keys[i]);
    }
  }
};

class Permutation {
  constructor(spec) {
    validate(spec, PermSchema);

    validateMoveEffects(spec.size, spec.moveEffects)
    var solved = buildList(spec.size, buildList.id);

    this.solved = solved;
    this.index = indexing.index_of_perm;
    this.apply = applyPerm;

    this.moveEffects = normalizeMoveEffects({
      moveEffects: spec.moveEffects,
      solved: this.solved,
      apply: this.apply
    });

    this.transitionTable = transitionTable({
      solved: this.solved,
      moveEffects: this.moveEffects,
      apply: this.apply,
      index: this.index
    });

    this.pruningTable = pruningTable({
      transitions: this.transitionTable,
      index: this.index,
      solved: this.solved
    });
  }

  getTransitionTables() {
    return [this.transitionTable];
  }

  getPruningTables() {
    return [this.pruningTable];
  }

  generateRandomState() {
    var result = this.solved.slice();
    var tmp;
    var j;

    // TODO: ehh, this should probably be pulled into its own module
    // (it's fy-shuffle)
    for (var i = 0; i < result.length; i++) {
      tmp = result[i];
      j = Math.floor(Math.random() * (result.length - i));
      result[i] = result[j];
      result[j] = tmp;
    }
    return result;
  }
}


module.exports = Permutation;
