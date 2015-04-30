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

var isPermutation = function(perm) {
  var spots = buildList(perm.length, buildList.constantly(false));
  for (var i = 0; i < perm.length; i++) {
    spots[perm[i]] = true;
  }
  for (var i = 0; i < perm.length; i++) {
    if (!spots[i]) {
      return false;
    }
  }
  return true;
};

var validatePerm = function(perm, size, moveName) {
    if (perm == undefined) {
      throw new Error("Move '" + moveName + "' missing perm.");
    }
    if (perm.length !== size) {
      throw new Error("Perm on orientation move '" + moveName + "' had length " + perm.length + ", expected length " + size + ".");
    }
    if (!isPermutation(perm)) {
      throw new Error("[" + perm.join(", ") + "] is not a valid permutation.");
    }
  };

var validateOrie = function(orie, size, order, moveName) {
  if (orie == undefined) {
    throw new Error("Move '" + moveName + "' missing orie.");
  }
  if (orie.length !== size) {
    throw new Error("Orie on orientation move '" + moveName + "' had length " + orie.length + ", expected length " + size + ".");
  }
  for (var i = 0; i < orie.length; i++) {
    if (orie[i] >= order) {
      throw new Error("[" + orie.join(", ") + "] is not a valid orientation for an orientation with order " + order + ".");
    }
  };
};

// TODO: also add this check in perm
var validateMoveEffects = function(size, order, moveEffects) {
  var keys = Object.keys(moveEffects);

  for (var i = 0; i < keys.length; i++) {
    var move = moveEffects[keys[i]];
    if (typeof move === "object") {
      validatePerm(move.perm, size, keys[i]);
      validateOrie(move.orie, size, order, keys[i]);
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
