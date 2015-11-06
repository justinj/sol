import FlexiblePerm from '../lib/flexible-perm';
import claim from 'claim';

describe('FlexiblePerm', function() {
  let fp = new FlexiblePerm({
    pieces: [
      [0, 1],
      [0, 1],
      [2],
    ],
    // in this little puzzle, A swaps the first two, B swaps the second two
    moveEffects: {
      "A": [1, 0, 2],
      "B": [0, 2, 1],
    }
  });

  it('generates a transition table identical to Perm', function() {
    claim.same(
      fp.getTransitionTables(),
      [[[2, 1], [4, 0], [0, 3], [5, 2], [1, 5], [3, 4]]]
    );
  });

  it('generates a pruning table', function() {
    claim.same(
      fp.getPruningTables(),
      [[0, 1, 0, 1, 2, 2]]
    );
  });

  // TODO: it would be nice to standardize the set of properties that we want
  // to test on a component.
  describe('indexing', function() {
    it('creates indexArrays', function() {
      claim.same(fp.createIndexArray([0, 1, 2]), [0]);
      claim.same(fp.createIndexArray([0, 2, 1]), [1]);
      claim.same(fp.createIndexArray([1, 0, 2]), [2]);
    });
  });
});
