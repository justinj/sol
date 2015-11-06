import claim from 'claim';
import FlexibleOrie from '../lib/flexible-orie';

import Puzzle from '../lib/puz';
import solve from '../lib/solve';

describe('FlexibleOrie', function() {
  // This puzzle has two pieces and two moves
  //  ___________
  // |     |     |
  // |  0  |  1  |
  // |_____|_____|
  // `0` has three orientations, `1` has one.
  // move `A` swaps them and spins the piece in position `0` cw
  // move `B` spins the piece in position `0` cw

  let A = {
    perm: [1, 0],
    orientations: {
      '0': [0, 1], // if I am a 0, do this to me
      '1': [0, 0], // resp. 1
    }
  };

  let Aprime = {
    perm: [1, 0],
    orientations: {
      '0': [2, 0], // if I am a 0, do this to me
      '1': [0, 0], // resp. 1
    }
  };

  let B = {
    perm: [0, 1],
    orientations: {
      '0': [1, 0], // if I am a 0, do this to me
      '1': [0, 0], // resp. 1
    }
  };

  let Bprime = {
    perm: [0, 1],
    orientations: {
      '0': [2, 0], // if I am a 0, do this to me
      '1': [0, 0], // resp. 1
    }
  };

  let fo = new FlexibleOrie({
    pieceTypeOrders: {
      '0': 3,
      '1': 1,
    },
    pieceArrangement: [0, 1],
    moveEffects: {
      'A': A,
      "A'": Aprime,
      'B': B,
      "B'": Bprime,
    }

  });

  let solvedState = [{
    type: 0,
    orientation: 0,
    index: 0,
  }, {
    type: 1,
    orientation: 0,
    index: 1,
  }];

  it('applies moves', function() {
    let apply = fo.apply;
    let result = apply(solvedState, A);
    claim.same(
      result, [{
        type: 1,
        orientation: 0,
        index: 1,
      }, {
        type: 0,
        orientation: 1,
        index: 0,
      }],
    );
  });

  it('generates a pruning table', function() {
    claim.same(
      fo.getPruningTables(),
      [{ 0: 0, 1: 0, 3: 1, 5: 2, 6: 1, 12: 1}]
    );
  });

  let puz = new Puzzle({
    axes: [['A', "A'"], ['B', "B'"]],
    components: {
      flexibleOrie: fo
    },
  });

  it('is solvable', function() {
    let state = [{
      type: 1,
      orientation: 0,
      index: 1,
    }, {
      type: 0,
      orientation: 2,
      index: 0,
    }];
    let result = solve({
      puz,
      state: {
        flexibleOrie: state
      },
    });
    claim.same(result, ["A B"]);
  });
});
