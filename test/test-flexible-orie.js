import claim from 'claim';
import FlexibleOrie from '../lib/flexible-orie';

describe('FlexibleOrie', function() {
  // This puzzle has two pieces and two moves
  //  ___________
  // |     |     |
  // |  0  |  1  |
  // |_____|_____|
  // `0` has three orientations, `1` has one.
  // move `A` swaps them and spins the piece in position `0` cw
  // move `B` spins the piece in position `0` cw

  let fo = new FlexibleOrie({
    pieceTypeOrders: {
      '0': 3,
      '1': 1,
    },
    pieceArrangement: [0, 1],
    moveEffects: {
      'A': {
        perm: [1, 0],
        orientations: {
          '0': [0, 1], // if I am a 0, do this to me
          '1': [0, 0], // resp. 1
        }
      },
      'B': {
        perm: [0, 1],
        orientations: {
          '0': [1, 0], // if I am a 0, do this to me
          '1': [0, 0], // resp. 1
        }
      },
    }
  });

  it('applies moves', function() {
    let apply = fo.apply;
    let state = [{
      type: 0,
      orientation: 0,
    }, {
      type: 1,
      orientation: 0,
    }];

    let move = {
      perm: [1, 0],
      orientations: {
        '0': [0, 1], // if I am a 0, do this to me
        '1': [0, 0], // resp. 1
      },
    };

    let result = apply(state, move);
    claim.same(
      result, [{
        type: 1,
        orientation: 0,
      }, {
        type: 0,
        orientation: 1,
      }],
    );
  });

  it('generates a pruning table', function() {
    claim.same(
      fo.getPruningTables(),
      [{ 0: 0, 1: 1, 2: 2, 3: 1, 6: 2 }]
    );
  });
});
