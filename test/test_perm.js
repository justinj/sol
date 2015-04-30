var Perm = require("../lib/perm");
var assert_throws_msg = require("./assert_throws_msg");

describe("creating normally", function() {
  it("doesn't complain creating a valid permutation", function() {
    new Perm({
      size: 7,
      moveEffects: {}
    });
  });
});


// sort of sucks that a lot of these tests are identical to those in
// Orie, but unsure how to avoid. might not be worth the trouble/abstraction

describe("creating invalid", function() {
  it("throws an error if you create a perm missing a required field", function() {
    assert_throws_msg("{\"size\":\"undefined is not Number\"}", function() {
      new Perm({
        // size: 7,
        moveEffects: {}
      });
    });
  });

  it("throws an error if it has a move whose perm is the wrong length", function() {
    assert_throws_msg("Perm move for move named 'F' had length 6, expected length 7.", function() {
      new Perm({
        size: 7,
        moveEffects: {
          "F": [0, 1, 3, 6, 4, 2]
        }
      });
    });
  });
});
