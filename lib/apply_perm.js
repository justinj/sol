var bench = require("../bench/inactive")

// the below is *substantially* faster than the prettier (imo)
// return perm.map(function(i) { return to[i] }); (about 5 times as fast)
var applyPerm = function(to, perm) {
  var result = [];
  for (var i = 0; i < perm.length; i++) {
    result.push(to[perm[i]]);
  }
  return result;
};

bench("applyPerm", function() {
  applyPerm([0,1,2,3,4,5,6,7], [0,1,2,3,4,5,6,7]);
});

module.exports = applyPerm;
