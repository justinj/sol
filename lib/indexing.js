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

// t = 0
// r = m
// for i = n - 1 to 0
//   if cm[i+1] = p then
//     t = t + comb(i, r)
//     r = r - 1
//   endif
// next
// return t

function trueCount(l) {
  return l.filter(x => x).length;
}

export function combToIndex(comb) {
  let trues = trueCount(comb);
  if (trues === 0 || trues === comb.length) {
    return 0;
  } else {
    let [h, ...t] = comb;
    let cameBefore = 0;
    if (!h) {
      cameBefore = choose(comb.length - 1, trues - 1);
    }
    return cameBefore + combToIndex(t);
  }
};

function multinomial(xs) {
  let sum = xs.reduce((a, b) => a + b, 0);
  return xs.reduce((prod, f) => prod / factorial(f), factorial(sum));
}

export function repeatedPermToIndex(perm) {
  if (perm.length === 0) {
    return 0;
  }
  // apply?
  let lowest = perm.reduce((a, b) => Math.min(a, b));
  let comb = perm.map(x => x === lowest);
  let withoutComb = perm.filter(x => x !== lowest);

  let typesRemaining = {};
  withoutComb.forEach(x => {
    if (!typesRemaining.hasOwnProperty(x)) {
      typesRemaining[x] = 0;
    }
    typesRemaining[x] += 1;
  });
  let counts = Object.keys(typesRemaining).map(k => typesRemaining[k]);

  let withoutCombCounts = multinomial(counts);
  let combIndex = combToIndex(comb);

  return combIndex * withoutCombCounts + repeatedPermToIndex(withoutComb);
}

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
