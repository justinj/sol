import twoByTwo from '../lib/two';
import skewb from '../lib/skewb';
import solve from '../lib/solve';
import assert from 'assert';
import stateOfAlg from '../lib/state-of-alg';
import Perm from '../lib/perm';
import Puz from '../lib/puz';

// ideal would probably just check that this solves it, but for now we can just
// check the exact solution

describe("solving", function() {
  it("solves a 2x2 state", function() {
    assert.deepEqual(
      ["F U F' R F2 U R' U' R' F2 R'"],
      solve({
        puz: twoByTwo,
        state: {
          perm: [0, 2, 1, 3, 4, 5, 6],
          orie: {
            orie: [0, 2, 1, 0, 0, 0, 0],
            perm: [0, 1, 2, 3, 4, 5, 6]
          }
        },
      })
    );
  });

  it("solves a skewb state", function() {
    assert.deepEqual(
      ["L' B' R' U'"],
      solve({
        puz: skewb,
        state: stateOfAlg(skewb, "U R B L"),
      }));
  });

  it("solves a state in multiple ways", function() {
    assert.deepEqual(["R2 U2 R2", "U2 R2 U2"],
                 solve({
                   puz: twoByTwo,
                   state: stateOfAlg(twoByTwo, "R2 U2 R2"),
                   justOne: false,
                 }));
  });

  it.skip("can stop searching at a certain depth, and returns []", function() {
    assert.deepEqual([],
                 solve({
                   puz: twoByTwo,
                   state: stateOfAlg(twoByTwo, "R2 U2 R2"),
                   justOne: false,
                   maxDepth: 2,
                 }));
  });
});

describe("solving with multiple solved states", function() {
  it('solves a state that has multiple solved states defined', function() {
    let perm = new Perm({
      size: 3,
      moveEffects: {
        "A": [2, 0, 1],
        "A'": "A A",
      },
      isSolved: function(state) {
        return state[0] === 1 || state[0] === 0;
      }
    });

    let puz = new Puz({
      components: {
        a: perm,
      },
      axes: [
        ["A", "A'"],
      ],
    });

    assert.deepEqual(
      ["A", "A'"],
      solve({
        puz: puz,
        state: stateOfAlg(puz, "A"),
        justOne: false,
      })
    );
  });
});

