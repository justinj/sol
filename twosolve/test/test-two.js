// just a sketch
import assert from 'assert';
import Two from '../src/two';
import { COMPLETE_PIECE, PARTIALLY_DEFINED } from '../src/piece-types';

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
      which: [0],
      orientation: 0
    });
  });

  it("identifies partially defined pieces with only one sticker", function() {
    var two = new Two([
              0,  0,
              0,  0,
      6,  1,  2,  2,  3,  3,
      1,  1,  2,  2,  3,  3,
              4,  4,
              4,  4,
              5,  5,
              6,  5]);
    var pieces = two.pieces();
    assert.deepEqual(pieces[0], {
      type: Two.PARTIALLY_DEFINED,
      sticker: 0,
      orientation: 0,
      which: [0, 1, 2, 3],
    });

    var two = new Two([
              6,  0,
              0,  0,
      0,  1,  2,  2,  3,  3,
      1,  1,  2,  2,  3,  3,
              4,  4,
              4,  4,
              5,  5,
              6,  5]);
    var pieces = two.pieces();
    assert.deepEqual(pieces[0], {
      type: Two.PARTIALLY_DEFINED,
      sticker: 0,
      orientation: 1,
      which: [0, 1, 2, 3],
    });

    var two = new Two([
              6,  0,
              0,  0,
      1,  1,  2,  2,  3,  3,
      1,  1,  2,  2,  3,  3,
              4,  4,
              4,  4,
              5,  5,
              6,  5]);
    var pieces = two.pieces();
    assert.deepEqual(pieces[0], {
      type: Two.PARTIALLY_DEFINED,
      sticker: 1,
      orientation: 0,
      which: [0, 3, 6],
    });

    var two = new Two([
              1,  0,
              0,  0,
      6,  1,  2,  2,  3,  3,
      1,  1,  2,  2,  3,  3,
              4,  4,
              4,  4,
              5,  5,
              6,  5]);
    var pieces = two.pieces();
    assert.deepEqual(pieces[0], {
      type: Two.PARTIALLY_DEFINED,
      sticker: 1,
      orientation: 2,
      which: [0, 3, 6]
    });
  });

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
      which: [0],
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
      which: [0],
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
      which: [0],
      orientation: 0
    });
  });
});
