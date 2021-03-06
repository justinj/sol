import Perm from '../lib/perm';
import assertThrowsMsg from './assert-throws-msg';
import claim from 'claim';

describe("creating normally", function() {
  it("doesn't complain creating a valid permutation", function() {
    new Perm({
      size: 7,
      moveEffects: {}
    });
  });

  it("creates a transition table", function() {
    let p = new Perm({
      size: 3,
      moveEffects: {
        "A": [1, 0, 2],
        "B": [0, 2, 1],
      }
    });

    claim.same(
      p.getTransitionTables(),
      [[[2, 1], [4, 0], [0, 3], [5, 2], [1, 5], [3, 4]]]
    );
  });
});


// sort of sucks that a lot of these tests are identical to those in
// Orie, but unsure how to avoid. might not be worth the trouble/abstraction

describe("creating invalid", function() {
  it("throws an error if you create a perm missing a required field", function() {
    assertThrowsMsg("{\"size\":\"undefined is not Number\"}", function() {
      new Perm({
        // size: 7,
        moveEffects: {}
      });
    });
  });

  it("throws an error if it has a move whose perm is the wrong length", function() {
    assertThrowsMsg("Perm move for move named 'F' had length 6, expected length 7.", function() {
      new Perm({
        size: 7,
        moveEffects: {
          "F": [0, 1, 3, 6, 4, 2]
        }
      });
    });
  });

  it("throws an error on invalid permutations", function() {
    assertThrowsMsg("[0, 1, 2, 3, 4, 5, 5] is not a valid permutation.", function() {
      new Perm({
        size: 7,
        moveEffects: {
          "F": [0, 1, 2, 3, 4, 5, 5]
        }
      });
    });
  });
});
