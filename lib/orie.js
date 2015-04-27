var indexing = require("./indexing");
var buildList = require("./build_list");
var applyPerm = require("./apply_perm");
var validate = require("./validate");
var schema = require("js-schema");
var transitionTable = require("./transition_table");

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

var Orientation = function(spec) {
  validate(spec, OrieSchema);
  var solved = {
    perm: buildList(spec.size, buildList.id),
    orie: buildList(spec.size, buildList.constantly(0))
  };

  var kind = indexing_fns[spec.kind];

  var index = makeIndexer(kind, spec.order);
  var apply = makeApply(spec.size, spec.order);

  this.size = spec.size;
  this.moveEffects = spec.moveEffects;
  this.solved = solved,
  this.index = index,
  this.apply = apply;

  this.transitionTable = transitionTable(this);

  return this;
};

Orientation.kinds = kinds;

module.exports = Orientation;
