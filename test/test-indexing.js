import claim from 'claim';
import {
  permToIndex,
  indexToPerm,
  combToIndex,
  repeatedPermToIndex,
  orientationToIndex,
  indexToOrientation,
  zeroSumOrientationToIndex,
  indexToZeroSumOrientation,
} from '../lib/indexing';

describe("permutations", function() {
  it("indexes permutations lexicographically", function() {
    claim.same(permToIndex([0, 1, 2]), 0);
    claim.same(permToIndex([0, 2, 1]), 1);
    claim.same(permToIndex([1, 0, 2]), 2);
    claim.same(permToIndex([1, 2, 0]), 3);
    claim.same(permToIndex([2, 0, 1]), 4);
    claim.same(permToIndex([2, 1, 0]), 5);
  });

  it("unindexes permutations lexicographically", function() {
    claim.same(indexToPerm(0, 3), [0, 1, 2]);
    claim.same(indexToPerm(1, 3), [0, 2, 1]);
    claim.same(indexToPerm(2, 3), [1, 0, 2]);
    claim.same(indexToPerm(3, 3), [1, 2, 0]);
    claim.same(indexToPerm(4, 3), [2, 0, 1]);
    claim.same(indexToPerm(5, 3), [2, 1, 0]);
  });
});

describe('combinations', function() {
  it('indexes combinations with one element', function() {
    claim.same(combToIndex([true, false, false, false]), 0);
    claim.same(combToIndex([false, true, false, false]), 1);
    claim.same(combToIndex([false, false, true, false]), 2);
    claim.same(combToIndex([false, false, false, true]), 3);
  });

  it('indexes combinations with two elements', function() {
    claim.same(combToIndex([true, true, false, false]), 0);
    claim.same(combToIndex([true, false, true, false]), 1);
    claim.same(combToIndex([true, false, false, true]), 2);
    claim.same(combToIndex([false, true, true, false]), 3);
    claim.same(combToIndex([false, true, false, true]), 4);
    claim.same(combToIndex([false, false, true, true]), 5);
  });
});

describe("permutations with repititions", function() {
  it("indexes them lexicographically", function() {
    claim.same(repeatedPermToIndex([0, 1, 2]), 0);
    claim.same(repeatedPermToIndex([0, 2, 1]), 1);

    claim.same(repeatedPermToIndex([0, 1, 1]), 0);
    claim.same(repeatedPermToIndex([1, 0, 1]), 1);
    claim.same(repeatedPermToIndex([1, 1, 0]), 2);

    claim.same(repeatedPermToIndex([0, 1, 2, 3, 4, 5, 6]), 0);
  });

  it("maps permutations distinctly", function() {
    let seen = {};
    [[0,1,2],[0,2,1],[1,0,2],[1,2,0],[2,0,1],[2,1,0]].forEach((perm) => {
      let result = repeatedPermToIndex(perm);
      if (seen[result]) {
        claim.fail(`${seen[result]} and ${perm} map to the same thing!`);
      }
      seen[result] = perm;
    });
  });
});

describe("orientations", function() {
  it("interprets an orientation with k rotations as a base-k number", function() {
    claim.same(orientationToIndex([0, 0, 0, 0], 3), 0);
    claim.same(orientationToIndex([0, 0, 0, 1], 3), 1);
    claim.same(orientationToIndex([0, 0, 1, 1], 3), 4);
    claim.same(orientationToIndex([0, 0, 2, 1], 3), 7);
  });

  it("creates an orientation from an index", function() {
    // signature is index -> length -> number of orientations of a piece -> orientation
    claim.same(indexToOrientation(0, 4, 3), [0, 0, 0, 0]);
    claim.same(indexToOrientation(1, 4, 3), [0, 0, 0, 1]);
    claim.same(indexToOrientation(4, 4, 3), [0, 0, 1, 1]);
    claim.same(indexToOrientation(7, 4, 3), [0, 0, 2, 1]);
  });
});

describe("zero-sum orientations", function() {
  it("ignores the last digit when indexing", function() {
    claim.same(zeroSumOrientationToIndex([0, 0, 0, 0], 3), 0);
    claim.same(zeroSumOrientationToIndex([0, 2, 0, 1], 3), 6);
    claim.same(zeroSumOrientationToIndex([0, 0, 2, 1], 3), 2);
  });

  it("infers the last digit", function() {
    claim.same(indexToZeroSumOrientation(0, 4, 3), [0, 0, 0, 0]);
    claim.same(indexToZeroSumOrientation(6, 4, 3), [0, 2, 0, 1]);
    claim.same(indexToZeroSumOrientation(2, 4, 3), [0, 0, 2, 1]);
  });
});
