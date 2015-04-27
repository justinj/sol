var buildList = require("./build_list");
var applyPerm = require("./apply_perm");
var indexing = require("./indexing");
// spec:
//   size
//   (required, integer)
//
//
var id = function(x) { return x; };

var genericGet = function(obj, prop, nameOfObj) {
  if (obj.hasOwnProperty(prop)) {
    return obj[prop];
  } else {
    throw new Error(nameOfObj + " did not have required property '" + prop + "'");
  }
};

get = function(obj, prop) { return genericGet(obj, prop, "Argument to Perm.define"); }

var define = function(spec) {
  var solved = buildList(get(spec, "size"), id);

  return {
    solved: solved,
    moveEffects: spec.moveEffects,
    index: indexing.index_of_perm,
    apply: applyPerm
  };
};

module.exports = {
  define: define
};
