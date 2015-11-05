import applyPerm from './apply-perm';
import { orientationToIndex } from './indexing';
import transitionTable from './transition-table';
import pruningTable from './pruning-table';

function makeApply(orientationOrders) {
  return function apply(state, move) {
    return state;
  }
}

function shallowClone(obj) {
  return {...obj};
}

export default class FlexibleOrie {
  constructor(spec) {
    let {
      pieceTypeOrders,
      pieceArrangement,
      moveEffects,
    } = spec;

    let moves = Object.keys(moveEffects);
    let pieceTypes = Object.keys(pieceTypeOrders);

    this.moveEffects = moveEffects;

    this.solved = pieceArrangement.map(type => {
      return {
        type,
        orientation: 0,
      };
    });

    this.apply = function(state, move) {
      let permuted = applyPerm(state, move.perm).map(shallowClone);
      permuted = permuted.map(({type, orientation}, i) => {
        let order = pieceTypeOrders[type];
        orientation = (orientation + move.orientations[type][i]) % order;
        return {
          type,
          orientation,
        };
      });
      return permuted;
    };

    // some inefficiencies here, since we always use the maximum. would be
    // interesting to try to optimize the use of numbers here.
    let maximumOrientation = Math.max.apply(null, pieceTypes.map(type => pieceTypeOrders[type]));
    this.index = function(state, move) {
      let ories = state.map(piece => piece.orientation);
      return orientationToIndex(ories, maximumOrientation);
    };

    // TODO: normalize these moveeffects, maybe do it *in* transitionTable
    this.transitionTable = transitionTable({
      solved: this.solved,
      moveEffects: this.moveEffects,
      apply: this.apply,
      index: this.index
    });

    this.pruningTable = pruningTable({
      transitions: this.transitionTable,
      index: this.index,
      solved: this.solved
    });
  }

  getTransitionTables() {
    return [this.transitionTable];
  }

  getPruningTables() {
    return [this.pruningTable];
  }
}
