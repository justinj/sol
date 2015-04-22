var claim = require("claim");
var indexing = require("../lib/indexing.js");

describe("permutations", function() {
  it("indexes permutations lexicographically", function() {
    claim.same(indexing.index_of_perm([0, 1, 2]), 0);
    claim.same(indexing.index_of_perm([0, 2, 1]), 1);
    claim.same(indexing.index_of_perm([1, 0, 2]), 2);
    claim.same(indexing.index_of_perm([1, 2, 0]), 3);
    claim.same(indexing.index_of_perm([2, 0, 1]), 4);
    claim.same(indexing.index_of_perm([2, 1, 0]), 5);
  });

  it("unindexes permutations lexicographically", function() {
    claim.same(indexing.perm_of_index(0, 3), [0, 1, 2]);
    claim.same(indexing.perm_of_index(1, 3), [0, 2, 1]);
    claim.same(indexing.perm_of_index(2, 3), [1, 0, 2]);
    claim.same(indexing.perm_of_index(3, 3), [1, 2, 0]);
    claim.same(indexing.perm_of_index(4, 3), [2, 0, 1]);
    claim.same(indexing.perm_of_index(5, 3), [2, 1, 0]);
  });
});

describe("orientations", function() {
  it("interprets an orientation with k rotations as a base-k number", function() {
    claim.same(indexing.index_of_orientation([0, 0, 0, 0], 3), 0);
    claim.same(indexing.index_of_orientation([0, 0, 0, 1], 3), 1);
    claim.same(indexing.index_of_orientation([0, 0, 1, 1], 3), 4);
    claim.same(indexing.index_of_orientation([0, 0, 2, 1], 3), 7);
  });

  it("creates an orientation from an index", function() {
    // signature is index -> length -> number of orientations of a piece -> orientation
    claim.same(indexing.orientation_of_index(0, 4, 3), [0, 0, 0, 0]);
    claim.same(indexing.orientation_of_index(1, 4, 3), [0, 0, 0, 1]);
    claim.same(indexing.orientation_of_index(4, 4, 3), [0, 0, 1, 1]);
    claim.same(indexing.orientation_of_index(7, 4, 3), [0, 0, 2, 1]);
  });
});
