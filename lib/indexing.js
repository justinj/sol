var _fact = [1, 1, 2, 6, 24, 120, 720, 5040, 40320, 362880, 3628800, 39916800, 479001600, 6227020800, 87178291200, 1307674368000, 20922789888000, 355687428096000, 6402373705728000, 121645100408832000, 2432902008176640000, 51090942171709440000, 1124000727777607680000];
var factorial = function(n) {
  return _fact[n];
};

var index_of_perm = function(p) {
  var p = p.slice();
  var i;
  var j;
  var sum = 0;
  for (i = 0; i < p.length; i++) {
    sum += p[i] * factorial(p.length - 1 - i);
    for (j = i + 1; j < p.length; j++) {
      if (p[j] > p[i]) {
        p[j] -= 1;
      }
    }
  }
  return sum;
};

var perm_of_index = function(index, n) {
  var result = []
  var initial_nums = [];
  var i;
  for (i = 0; i < n; i++) {
    initial_nums.push(i);
  }
  for (i = 0; i < n; i++) {
    var fact = factorial(n - i - 1);
    var val = Math.floor(index / fact);
    index %= fact;
    result.push(initial_nums.splice(val, 1)[0]);
  }
  return result;
};

var index_of_orientation = function(orientation, k) {
  var sum = 0;
  var i;
  for (i = 0; i < orientation.length; i++) {
    sum *= k;
    sum += orientation[i];
  }
  return sum;
};

var orientation_of_index = function(index, n, k) {
  var result = [];
  var i;
  for (i = 0; i < n; i++) {
    result.push(index % k);
    index = Math.floor(index / k);
  }
  return result.reverse();
};

module.exports = {
  index_of_perm: index_of_perm,
  perm_of_index: perm_of_index,
  index_of_orientation: index_of_orientation,
  orientation_of_index: orientation_of_index
};
