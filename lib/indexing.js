import factorial from './fact';
import choose from './choose';

export function permToIndex(p) {
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

export function indexToPerm(index, n) {
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

export function distinctElemsWithCounts(arr) {
  arr = arr.slice();
  arr.sort((a, b) => a - b);
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

export function combToIndex(comb) {
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
  var nextComb = []
  for (var i = comb.length - 1; i >= 0; i--) {
    if (comb[i] == currentElem) {
      t += choose(i, r);
      r -= 1;
    } else {
      nextComb.push(comb[i]);
    }
  }
  nextComb.reverse();

  return t + combToIndex(nextComb);
};

export function orientationToIndex(orientation, k) {
  var sum = 0;
  var i;
  for (i = 0; i < orientation.length; i++) {
    sum *= k;
    sum += orientation[i];
  }
  return sum;
};

export function indexToOrientation(index, n, k) {
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

export function zeroSumOrientationToIndex(orientation, k) {
  return orientationToIndex(orientation.slice(0, orientation.length - 1), k);
};

export function indexToZeroSumOrientation(index, n, k) {
  var result = indexToOrientation(index, n - 1, k);
  var sum = 0;
  var i;
  for (i = 0; i < result.length; i++) {
    sum += result[i];
  }
  // TODO: There must be a less silly way to write this... figure it out when less tired
  result.push((k - (sum % k)) % k);
  return result;
};
