var indexing = require("./indexing");
var buildList = require("./build_list");
var applyPerm = require("./apply_perm");

var makeIndexer = function(order) {
  return function(orie) {
    // ...this part means we effectively ignore the perm part, so it doesn't matter
    return indexing.index_of_orientation(orie.orie, order);
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

var define = function(spec) {
    // we just have the permutation here so we have that the moves are the same type as the states
  var solved = {
    perm: buildList(spec.size, buildList.id),
    orie: buildList(spec.size, buildList.constantly(0))
  };

  var index = makeIndexer(spec.order);
  var apply = makeApply(spec.size, spec.order);

  return {
    size: spec.size,
    moveEffects: spec.moveEffects,
    solved: solved,
    index: index,
    apply: apply
  };
};

module.exports = {
  define: define
};
