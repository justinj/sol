// the below is *substantially* faster than the prettier (imo)
// return perm.map(function(i) { return to[i] }); (about 5 times as fast)
var applyPerm = function(to, perm) {
  var result = [];
  for (var i = 0; i < perm.length; i++) {
    result.push(to[perm[i]]);
  }
  return result;
};

module.exports = applyPerm;
