var Orie = require("../lib/orie");
var assert = require("assert");


// TODO: this is almost certainly provided by assert, but I don't have internet to check :<

var assert_throws_msg = function(msg, block) {
  var threw = false;
  try {
    block();
  } catch (e) {
    threw = true;
    assert.equal(e.message, msg);
  }
  if (!threw) {
    assert(false, "Block\n" + block.toString + "\ndid not throw.");
  }
};

describe("creating normally", function() {
  it("doesn't complain creating a valid orientation", function() {
    new Orie({
      kind: Orie.kinds.ZERO_SUM,
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
        kind: Orie.kinds.ARBITRARY_SUM,
        // size: 7,
        order: 3,
        moveEffects: {}
      });
    });
  });

  it("throws an error if it has a move that doesn't have both perm and orie", function() {
    // TODO: when have internet check how to verify the message
    assert_throws_msg("Move 'F' missing perm.", function() {
      new Orie({
        kind: Orie.kinds.ZERO_SUM,
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
        kind: Orie.kinds.ZERO_SUM,
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
        kind: Orie.kinds.ZERO_SUM,
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

    assert_throws_msg("Perm on orientation move 'F' had length 6, expected length 7.", function() {
      new Orie({
        kind: Orie.kinds.ZERO_SUM,
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
});
