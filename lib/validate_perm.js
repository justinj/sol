var buildList = require("./build_list");

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

module.exports = function(perm, size, moveName) {
  if (perm == undefined) {
    throw new Error("Move '" + moveName + "' missing perm.");
  }
  if (perm.length !== size) {
    throw new Error("Perm move for move named '" + moveName + "' had length " + perm.length + ", expected length " + size + ".");
  }
  if (!isPermutation(perm)) {
    throw new Error("[" + perm.join(", ") + "] is not a valid permutation.");
  }
};

