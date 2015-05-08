var puz = require("../lib/two");
var state_of_alg = require("../lib/state_of_alg");
var assert = require("assert");

describe("creating a state from an alg", function() {
  it("allows one to describe a state by giving a setup for that state, instead of the exact spec", function() {
    assert.deepEqual(state_of_alg(puz, "F U F' R F2 U R' U' R' F2 R'"),
                 {
                   perm: [0, 2, 1, 3, 4, 5, 6],
                   orie: {
                     orie: [0, 2, 1, 0, 0, 0, 0],
                     // TODO: make this guy unnecessary
                     perm: [0, 2, 1, 3, 4, 5, 6]
                   }
                 });
  });
});
