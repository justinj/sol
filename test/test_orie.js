var Orie = require("../lib/orie");
var assert_throws_msg = require("./assert_throws_msg");

// TODO: it would be nice to not have the big definition of the Orie present
// for every test, maybe some kind of use of _.extend would be helpful.

describe("creating normally", function() {
  it("doesn't complain creating a valid orientation", function() {
    new Orie({
      kind: Orie.kinds.zero_sum,
      size: 7,
      order: 3,
      moveEffects: {}
    });
  });
});

describe("creating invalid", function() {
  it("throws an error if you create an orie missing a required field", function() {
    // TODO: these error messages sort of suck, should either wrap js-schema or find something better.
    assert_throws_msg("{\"size\":\"undefined is not Number\"}", function() {
      new Orie({
        kind: Orie.kinds.arbitrary_sum,
        // size: 7,
        order: 3,
        moveEffects: {}
      });
    });
  });

  it("throws an error if it has a move that doesn't have both perm and orie", function() {
    assert_throws_msg("Move 'F' missing perm.", function() {
      new Orie({
        kind: Orie.kinds.zero_sum,
        size: 7,
        order: 3,
        moveEffects: {
          "F": {
            orie: [0, 0, 1, 2, 0, 2, 1]
            // perm: [0, 1, 3, 6, 4, 2, 5]
          }
        }
      });
    });

    assert_throws_msg("Move 'F' missing orie.", function() {
      new Orie({
        kind: Orie.kinds.zero_sum,
        size: 7,
        order: 3,
        moveEffects: {
          "F": {
            // orie: [0, 0, 1, 2, 0, 2, 1]
            perm: [0, 1, 3, 6, 4, 2, 5]
          }
        }
      });
    });
  });

  it("throws an error if it has a move whose perm or orie is the wrong length", function() {
    assert_throws_msg("Orie on orientation move 'F' had length 6, expected length 7.", function() {
      new Orie({
        kind: Orie.kinds.zero_sum,
        size: 7,
        order: 3,
        moveEffects: {
          "F": {
            orie: [0, 0, 1, 2, 0, 2],
            perm: [0, 1, 3, 6, 4, 2, 5]
          }
        }
      });
    });

    assert_throws_msg("Perm move for move named 'F' had length 6, expected length 7.", function() {
      new Orie({
        kind: Orie.kinds.zero_sum,
        size: 7,
        order: 3,
        moveEffects: {
          "F": {
            orie: [0, 0, 1, 2, 0, 2, 1],
            perm: [0, 1, 3, 6, 4, 2]
          }
        }
      });
    });
  });

  it("verifies the ories and perms of a move are valid", function() {
    assert_throws_msg("[3, 0, 0, 0, 0, 0, 0] is not a valid orientation for an orientation with order 3.", function() {
      new Orie({
        kind: Orie.kinds.zero_sum,
        size: 7,
        order: 3,
        moveEffects: {
          "F": {
            orie: [3, 0, 0, 0, 0, 0, 0],
            perm: [0, 1, 3, 6, 4, 2, 5]
          }
        }
      });
    });
    assert_throws_msg("[0, 1, 2, 3, 4, 5, 5] is not a valid permutation.", function() {
      new Orie({
        kind: Orie.kinds.zero_sum,
        size: 7,
        order: 3,
        moveEffects: {
          "F": {
            orie: [0, 0, 0, 0, 0, 0, 0],
            perm: [0, 1, 2, 3, 4, 5, 5]
          }
        }
      });
    });
  });

  it.skip("verifies that moves defined in terms of other moves bottom out eventually", function() {
    // this is a pretty cute error msg, probs not needed right off the bat, but would be sweet
    assert_throws_msg("Orie move definitions create a cycle: U -> F -> U.", function() {
      new Orie({
        kind: Orie.kinds.zero_sum,
        size: 7,
        order: 3,
        moveEffects: {
          "F": "U",
          "U": "F"
        }
      });
    });
  });


  // a simpler alternative to the above - just don't allow stringed moves to be defined in terms of other stringed moves (currently done, but no nice error message):
  it.skip("does not allow moves defined as algs to be defined in terms of other moves defined as algs", function() {
    assert_throws_msg("Moves cannot be defined in terms of other moves if those moves are not explicitly defined", function() {
      new Orie({
        kind: Orie.kinds.zero_sum,
        size: 7,
        order: 3,
        moveEffects: {
          "F": "U",
          "U": "F"
        }
      });
    });
  });
});
