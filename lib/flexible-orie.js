import applyPerm from './apply-perm';
import { orientationToIndex, permToIndex } from './indexing';
import transitionTable from './transition-table';
import pruningTable from './pruning-table';
import Perm from './perm';
import mapObj from './map-obj';
import fact from './fact';
import normalizeMoveEffects from './normalize-move-effects';

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
    let size = pieceArrangement.length;


    this.solved = pieceArrangement.map((type, i) => {
      return {
        type,
        orientation: 0,
        index: i
      };
    });

    this.apply = function(state, move) {
      let permuted = applyPerm(state, move.perm).map(shallowClone);
      permuted = permuted.map(({type, orientation, index}, i) => {
        let order = pieceTypeOrders[type];
        orientation = (orientation + move.orientations[type][i]) % order;
        return {
          type,
          orientation,
          index,
        };
      });
      return permuted;
    };

    this.moveEffects = moveEffects;

    // some inefficiencies here, since we always use the maximum. would be
    // interesting to try to optimize the use of numbers here.
    // TODO: also, we can optimize this when we have an indexer for permutations with repetitions
    let maximumOrientation = Math.max.apply(null, pieceTypes.map(type => pieceTypeOrders[type]));
    this.index = ((state) => {
      let ories = state.map(piece => piece.orientation);
      let perms = state.map(piece => piece.index);
      let permIndex = permToIndex(perms);
      let orieIndex = orientationToIndex(ories, maximumOrientation);
      let result = orieIndex * fact(size) + permIndex;
      return result;
    });

    // TODO: normalize these moveeffects, maybe do it *in* transitionTable
    this.transitionTable = transitionTable({
      solved: this.solved,
      moveEffects: this.moveEffects,
      apply: this.apply,
      index: this.index,
    });

    // this is sort of cool but also sort of confusing - if we're < the number
    // of perms, it means the orientation is 0, basically.
    let isSolved = (stateIndex) => stateIndex < fact(size);

    this.pruningTable = pruningTable({
      transitions: this.transitionTable,
      index: this.index,
      solved: this.solved,
      isSolved,
    });

    this._internalPerm = new Perm({
      size,
      moveEffects: mapObj(this.moveEffects, (_, ef) => ef.perm),
    });
  }

  getTransitionTables() {
    return [this.transitionTable];
  }

  getPruningTables() {
    return [this.pruningTable];
  }

  createIndexArray(state) {
    return [this.index(state)];
  }
}
