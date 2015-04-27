module.exports = function(n, f) {
  var result = [];
  for (var i = 0; i < n; i++) {
    result.push(f(i));
  }
  return result;
};
