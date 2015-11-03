// this test is probably slow

import puz from '../lib/two';
import solve from '../lib/solve';
import assert from 'assert';

// ideal would probably just check that this solves it, but for now we can just
// check the exact solution

describe("solving", function() {
  it("solves a state", function() {
    assert.equal("F U F' R F2 U R' U' R' F2 R'",
                 solve({
                   puz, 
                   state: {
                     perm: [0, 2, 1, 3, 4, 5, 6],
                     orie: {
                       orie: [0, 2, 1, 0, 0, 0, 0],
                       perm: [0, 1, 2, 3, 4, 5, 6]
                     }
                   },
                   justOne: true
                 }));
  });
});
