// just a sketch
var assert = require("assert");
var Two = require("../src/two");

describe("two", function() {
  it("identifies the kinds of pieces", function() {
    var two = new Two([
              0,  0,
              0,  0,
      1,  1,  2,  2,  3,  3,
      1,  1,  2,  2,  3,  3,
              4,  4,
              4,  4,
              5,  5,
              5,  5]);
    var pieces = two.pieces();
    assert.deepEqual(pieces[0], {
      type: Two.COMPLETE_PIECE,
      which: 0,
      orientation: 0
    });
  });

//   it("identifies partially defined pieces with only one sticker", function() {
//     var two = new Two([
//               6,  0,
//               0,  0,
//       1,  1,  2,  2,  3,  3,
//       1,  1,  2,  2,  3,  3,
//               4,  4,
//               4,  4,
//               5,  5,
//               5,  5]);
//     var pieces = two.pieces();
//     assert.deepEqual(pieces[0], {
//       type: Two.PARTIALLY_DEFINED,
//       which: 0
//     });
//   });

  it("identifies partially defined pieces with two stickers", function() {
    var two = new Two([
              6,  0,
              0,  0,
      1,  1,  2,  2,  3,  3,
      1,  1,  2,  2,  3,  3,
              4,  4,
              4,  4,
              5,  5,
              5,  5]);
    var pieces = two.pieces();
    assert.deepEqual(pieces[0], {
      type: Two.COMPLETE_PIECE,
      which: 0,
      orientation: 0
    });

    var two = new Two([
              0,  0,
              0,  0,
      6,  1,  2,  2,  3,  3,
      1,  1,  2,  2,  3,  3,
              4,  4,
              4,  4,
              5,  5,
              5,  5]);
    var pieces = two.pieces();
    assert.deepEqual(pieces[0], {
      type: Two.COMPLETE_PIECE,
      which: 0,
      orientation: 0
    });

    var two = new Two([
              0,  0,
              0,  0,
      1,  1,  2,  2,  3,  3,
      1,  1,  2,  2,  3,  3,
              4,  4,
              4,  4,
              5,  5,
              6,  5]);
    var pieces = two.pieces();
    assert.deepEqual(pieces[0], {
      type: Two.COMPLETE_PIECE,
      which: 0,
      orientation: 0
    });
  });
});
