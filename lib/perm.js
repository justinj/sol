var buildList = require("./build_list");
var applyPerm = require("./apply_perm");
var indexing = require("./indexing");
var schema = require("js-schema");

var PermSchema = schema({
  size: Number,
  moveEffects: Object
});

var validate = function(spec) {
  var errors = PermSchema.errors(spec);
  if (errors) {
    throw new Error(JSON.stringify(errors));
  }
};

var Permutation = function(spec) {
  validate(spec);
  var solved = buildList(spec.size, buildList.id);

  this.solved = solved;
  this.moveEffects = spec.moveEffects;
  this.index = indexing.index_of_perm;
  this.apply = applyPerm;

  return this
};

module.exports = Permutation;
