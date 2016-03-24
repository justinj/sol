import applyPerm from './apply-perm';
import { orientationToIndex, repeatedPermToIndex, countRepeatedPerms } from './indexing';
import transitionTable from './transition-table';
import pruningTable from './pruning-table';
import Perm from './perm';
import mapObj from './map-obj';
import fact from './fact';
import normalizeMoveEffects from './normalize-move-effects';
import buildList from './build-list';

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


    let identityOrientations = {};
    let zeroes = buildList(size, () => 0);
    pieceTypes.forEach(type => identityOrientations[type] = zeroes);

    this.solved = {
      perm: buildList(size, x => x),
      orientations: identityOrientations
    };

    this.apply = function(state, move) {
      let newPerm = applyPerm(state.perm, move.perm);
      let newOrientations = mapObj(state.orientations, (type, effect) => {
        let permuted = applyPerm(effect, move.perm);
        for (let i = 0; i < permuted.length; i++) {
          permuted[i] = (permuted[i] + move.orientations[type][i]) % pieceTypeOrders[type];
        }
        return permuted;
      });
      return {
        perm: newPerm,
        orientations: newOrientations
      };
    };

    let maximumOrientation = Math.max.apply(null, pieceTypes.map(type => pieceTypeOrders[type]));
    this.index = ((state) => {
      let perms = state.perm;
      let ories = state.perm.map((solvedPos, i) => {
        let type = pieceArrangement[solvedPos];
        return state.orientations[type][i];
      });
      let types = perms.map(i => pieceArrangement[i]);
      let permIndex = repeatedPermToIndex(types);
      let orieIndex = orientationToIndex(ories, maximumOrientation);
      return orieIndex * countRepeatedPerms(types) + permIndex;
    });

    this.moveEffects = normalizeMoveEffects({
      moveEffects,
      solved: this.solved,
      apply: this.apply
    });

    this.transitionTable = transitionTable({
      solved: this.solved,
      moveEffects: this.moveEffects,
      apply: this.apply,
      index: this.index,
    });

    let isSolved = (stateIndex) => stateIndex < countRepeatedPerms(pieceArrangement);

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
