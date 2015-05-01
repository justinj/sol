var indexing = require("./indexing");
var buildList = require("./build_list");
var applyPerm = require("./apply_perm");
var validate = require("./validate");
var schema = require("js-schema");
var transitionTable = require("./transition_table");
var pruningTable = require("./pruning_table");
var validatePerm = require("./validate_perm");
var mapObj = require("./map_obj");

var kinds = {
  zero_sum: {
    index: indexing.index_of_zero_sum_orientation,
    validate: function(orientation, order) {
      var sum = 0;
      for (var i = 0; i < orientation.length; i++) {
        sum += orientation[i];
      }
      return (sum % order) === 0;
    }
  },
  arbitrary_sum: {
    index: indexing.index_of_orientation,
    validate: function() { return true; }
  }
};

var indexingFns = {
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
  moveEffects: Object
});

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

var buildMoveEffects = function(moveEffects, backingPerm) {
  return mapObj(moveEffects, function(move, def) {
    if (typeof def === "string") {
      return def;
    } else {
      return {
        orie: def,
        perm: backingPerm.moveEffects[move]
      };
    }
  });
};

var Orientation = function(spec) {
  validate(spec, OrieSchema);
  var solved = {
    perm: buildList(spec.size, buildList.id),
    orie: buildList(spec.size, buildList.constantly(0))
  };

  var kind = spec.kind.index;

  var index = makeIndexer(kind, spec.order);
  var apply = makeApply(spec.size, spec.order);

  var moveEffects;
  if (spec.hasOwnProperty("backingPerm")) {
    moveEffects = buildMoveEffects(spec.moveEffects, spec.backingPerm);
  } else {
    moveEffects = spec.moveEffects;
  }

  validateMoveEffects(spec.size, spec.order, moveEffects);

  // TODO: the things that satsify the component interface and the things
  // specific to orientation should be seperated out somehow
  this.validate = spec.kind.validate;
  this.size = spec.size;
  this.order = spec.order;
  this.moveEffects = moveEffects;
  this.solved = solved,
  this.index = index,
  this.apply = apply;

  this.transitionTable = transitionTable(this);
  this.pruningTable = pruningTable(this);

  return this;
};

Orientation.prototype.generateRandomState = function() {
  var result;
  do {
    result = [];
    for (var i = 0; i < this.size; i++) {
      // TODO: this needs to be seedable
      result.push(Math.floor(Math.random() * this.order));
    }
  } while (!this.validate(result, this.order));
  // TODO: we shouldn't have to always include the perm, there should be a
  // thing that converts an orientation to the gross thing when it gets passed
  return {
    orie: result,
    perm: buildList(result.length, buildList.id)
  }
};

Orientation.kinds = kinds;

module.exports = Orientation;
