var buildList = require("./build_list");
var applyPerm = require("./apply_perm");
var indexing = require("./indexing");
var validate = require("./validate");
var schema = require("js-schema");
var transitionTable = require("./transition_table");
var pruningTable = require("./pruning_table");
var validatePerm = require("./validate_perm");

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

var Permutation = function(spec) {
  validate(spec, PermSchema);

  validateMoveEffects(spec.size, spec.moveEffects)
  var solved = buildList(spec.size, buildList.id);

  this.solved = solved;
  this.moveEffects = spec.moveEffects;
  this.index = indexing.index_of_perm;
  this.apply = applyPerm;

  this.transitionTable = transitionTable(this);
  this.pruningTable = pruningTable(this);

  return this
};

module.exports = Permutation;
