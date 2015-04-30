var indexing = require("./indexing");
var buildList = require("./build_list");
var applyPerm = require("./apply_perm");
var validate = require("./validate");
var schema = require("js-schema");
var transitionTable = require("./transition_table");
var pruningTable = require("./pruning_table");

var kinds = {
  ZERO_SUM: "zero_sum",
  ARBITRARY_SUM: "arbitrary_sum"
};

var indexing_fns = {
  "zero_sum": indexing.index_of_zero_sum_orientation,
  "arbitrary_sum": indexing.index_of_orientation
};

var makeIndexer = function(kind, order) {
  return function(orie) {
    // ...this part means we effectively ignore the perm part, so it doesn't matter
    return kind(orie.orie, order);
  };
};

var makeApply = function(size, order) {
  return function(to, orie) {
    var or = applyPerm(to.orie, orie.perm);
    var pe = applyPerm(to.perm, orie.perm);
    for (var i = 0; i < size; i++) {
      or[i] = (orie.orie[i] + or[i]) % order;
    }
    return {
      orie: or,
      perm: pe
    };
  }
};

var OrieSchema = schema({
  size: Number,
  order: Number,
  kind: Object.keys(indexing_fns),
  moveEffects: Object
});

// TODO: also make sure all the recursions bottom out
// TODO: also add this check in perm
var validateMoveEffects = function(size, order, moveEffects) {
  var keys = Object.keys(moveEffects);

  for (var i = 0; i < keys.length; i++) {
    var move = moveEffects[keys[i]];
    if (typeof move === "object") {
      if (!move.hasOwnProperty("perm")) {
        throw new Error("Move '" + keys[i] + "' missing perm.");
      }
      if (!move.hasOwnProperty("orie")) {
        throw new Error("Move '" + keys[i] + "' missing orie.");
      }
      if (move.perm.length !== size) {
        throw new Error("Perm on orientation move '" + keys[i] + "' had length " + move.perm.length + ", expected length " + size + ".");
      }
      if (move.orie.length !== size) {
        throw new Error("Orie on orientation move '" + keys[i] + "' had length " + move.orie.length + ", expected length " + size + ".");
      }
    }
  }
};

var Orientation = function(spec) {
  validate(spec, OrieSchema);
  var solved = {
    perm: buildList(spec.size, buildList.id),
    orie: buildList(spec.size, buildList.constantly(0))
  };

  var kind = indexing_fns[spec.kind];

  var index = makeIndexer(kind, spec.order);
  var apply = makeApply(spec.size, spec.order);

  validateMoveEffects(spec.size, spec.order, spec.moveEffects);

  this.size = spec.size;
  this.moveEffects = spec.moveEffects;
  this.solved = solved,
  this.index = index,
  this.apply = apply;

  this.transitionTable = transitionTable(this);
  this.pruningTable = pruningTable(this);

  return this;
};

Orientation.kinds = kinds;

module.exports = Orientation;
