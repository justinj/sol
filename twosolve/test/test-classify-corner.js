import assert from 'assert';
import classifyCorner from '../src/classify-corner';
import { COMPLETE_PIECE, PARTIALLY_DEFINED } from '../src/piece-types';

describe('classifyCorner', function() {
  describe('complete pieces', function() {
    let state = [
              0,  3,
              0,  3,
      1,  1,  2,  0,  2,  5,
      1,  1,  2,  2,  3,  3,
              4,  4,
              4,  4,
              5,  5,
              5,  0
    ];

    it('identifies that a piece is completely defined', function() {
      assert.deepEqual(classifyCorner(0, state).type, COMPLETE_PIECE);
    });

    it('identifies the orientation of a piece', function() {
      assert.deepEqual(classifyCorner(0, state).orientation, 0);
      assert.deepEqual(classifyCorner(1, state).orientation, 1);
      assert.deepEqual(classifyCorner(2, state).orientation, 2);
    });

    it('considers complete pieces to have type 0 (U/D) orientation', function() {
      assert.deepEqual(classifyCorner(0, state).orientationType, 0);
    });

    it('gives a piece only one place to go', function() {
      [0, 1, 2, 3, 4, 5, 6].forEach(i => {
        assert.deepEqual(classifyCorner(i, state).which, [i]);
      });
    });
  });

  describe('partially defined pieces', function() {
    let state = [
              0,  3,
              0,  3,
      6,  6,  6,  6,  6,  6,
      1,  1,  2,  2,  3,  3,
              4,  4,
              4,  4,
              5,  5,
              6,  6
    ];

    it('identifies that a piece is partially defined', function() {
      assert.deepEqual(classifyCorner(0, state).type, PARTIALLY_DEFINED);
      assert.deepEqual(classifyCorner(1, state).type, PARTIALLY_DEFINED);
      assert.deepEqual(classifyCorner(2, state).type, PARTIALLY_DEFINED);
      assert.deepEqual(classifyCorner(3, state).type, PARTIALLY_DEFINED);
    });

    it('identifies the orientation of a piece', function() {
      assert.deepEqual(classifyCorner(0, state).orientation, 0);
      assert.deepEqual(classifyCorner(1, state).orientation, 1);
      assert.deepEqual(classifyCorner(2, state).orientation, 2);
      assert.deepEqual(classifyCorner(3, state).orientation, 0);
    });

    it('gives pieces the appropriate orientation type', function() {
      assert.deepEqual(classifyCorner(0, state).orientationType, 0);
      assert.deepEqual(classifyCorner(1, state).orientationType, 2);
      assert.deepEqual(classifyCorner(2, state).orientationType, 2);
      assert.deepEqual(classifyCorner(3, state).orientationType, 0);
    });

    it('lets pieces go anywhere on their side', function() {
      assert.deepEqual(classifyCorner(0, state).which, [0, 1, 2, 3]);
      assert.deepEqual(classifyCorner(1, state).which, [1, 2, 4, 5]);
      assert.deepEqual(classifyCorner(2, state).which, [1, 2, 4, 5]);
      assert.deepEqual(classifyCorner(3, state).which, [0, 1, 2, 3]);
    });
  });
});
