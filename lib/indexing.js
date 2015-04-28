var factorial = require("./fact");

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
    // I also tried unshifting and then not reversing at the end (much slower)
    // and assigning to result[i] (about the same)
    result.push(index % k);
    index = Math.floor(index / k);
  }
  return result.reverse();
};

var index_of_zero_sum_orientation = function(orientation, k) {
  return index_of_orientation(orientation.slice(0, orientation.length - 1), k);
};

var zero_sum_orientation_of_index = function(index, n, k) {
  var result = orientation_of_index(index, n - 1, k);
  var sum = 0;
  var i;
  for (i = 0; i < result.length; i++) {
    sum += result[i];
  }
  // TODO: There must be a less silly way to write this... figure it out when less tired
  result.push((k - (sum % k)) % k);
  return result;
};


module.exports = {
  index_of_perm: index_of_perm,
  perm_of_index: perm_of_index,
  index_of_orientation: index_of_orientation,
  orientation_of_index: orientation_of_index,
  index_of_zero_sum_orientation: index_of_zero_sum_orientation,
  zero_sum_orientation_of_index: zero_sum_orientation_of_index
};
