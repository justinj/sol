'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.permToIndex = permToIndex;
exports.indexToPerm = indexToPerm;
exports.distinctElemsWithCounts = distinctElemsWithCounts;
exports.combToIndex = combToIndex;
exports.orientationToIndex = orientationToIndex;
exports.indexToOrientation = indexToOrientation;
exports.zeroSumOrientationToIndex = zeroSumOrientationToIndex;
exports.indexToZeroSumOrientation = indexToZeroSumOrientation;

var _fact = require('./fact');

var _fact2 = _interopRequireDefault(_fact);

var _choose = require('./choose');

var _choose2 = _interopRequireDefault(_choose);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function permToIndex(p) {
  var p = p.slice();
  var i;
  var j;
  var sum = 0;
  for (i = 0; i < p.length; i++) {
    sum += p[i] * (0, _fact2.default)(p.length - 1 - i);
    for (j = i + 1; j < p.length; j++) {
      if (p[j] > p[i]) {
        p[j] -= 1;
      }
    }
  }
  return sum;
};

function indexToPerm(index, n) {
  var result = [];
  var initial_nums = [];
  var i;
  for (i = 0; i < n; i++) {
    initial_nums.push(i);
  }
  for (i = 0; i < n; i++) {
    var fact = (0, _fact2.default)(n - i - 1);
    var val = Math.floor(index / fact);
    index %= fact;
    result.push(initial_nums.splice(val, 1)[0]);
  }
  return result;
};

function distinctElemsWithCounts(arr) {
  arr = arr.slice();
  arr.sort(function (a, b) {
    return a - b;
  });
  var result = {};
  var last = -1;
  for (var i = 0; i < arr.length; i++) {
    if (last !== arr[i]) {
      result[arr[i]] = 0;
    }
    result[arr[i]] += 1;
    last = arr[i];
  }
  return result;
};

// ty based jaap
// http://www.jaapsch.net/puzzles/compindx.htm

function combToIndex(comb) {
  if (comb.length === 0) {
    return 0;
  }
  var elemCounts = distinctElemsWithCounts(comb);
  var elems = Object.keys(elemCounts);
  var currentElem = elems[0];

  // transcribing Jaap's example...
  var m = elemCounts[currentElem];
  var t = 0;
  var r = m;
  var nextComb = [];
  for (var i = comb.length - 1; i >= 0; i--) {
    if (comb[i] == currentElem) {
      t += (0, _choose2.default)(i, r);
      r -= 1;
    } else {
      nextComb.push(comb[i]);
    }
  }
  nextComb.reverse();

  return t + combToIndex(nextComb);
};

function orientationToIndex(orientation, k) {
  var sum = 0;
  var i;
  for (i = 0; i < orientation.length; i++) {
    sum *= k;
    sum += orientation[i];
  }
  return sum;
};

function indexToOrientation(index, n, k) {
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

function zeroSumOrientationToIndex(orientation, k) {
  return orientationToIndex(orientation.slice(0, orientation.length - 1), k);
};

function indexToZeroSumOrientation(index, n, k) {
  var result = indexToOrientation(index, n - 1, k);
  var sum = 0;
  var i;
  for (i = 0; i < result.length; i++) {
    sum += result[i];
  }
  // TODO: There must be a less silly way to write this... figure it out when less tired
  result.push((k - sum % k) % k);
  return result;
};