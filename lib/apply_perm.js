module.exports = function(to, perm) {
  return perm.map(function(i) { return to[i] });
};
