import Perm from './perm';
import pruningTable from './pruning-table';
import bipartiteMatching from './bipartite-matching';
// A component whose pieces are happy in a variety of positions.
// Useful for partially defined puzzles.
// `pieces` is an array of arrays, each child array containing the positions
// the corresponding piece can be in and be considered solved.
// For example,
// [[0, 1],
//  [0, 1],
//  [2]]
// means this permutation has 3 pieces, the first two of which can be in either of the
// first two positions, but the last of which must be in the last position.

function isSolved(state, pieces) {
  for (let i = 0; i < state.length; i++) {
    let piece = state[i];
    if (pieces[piece].indexOf(i) === -1) {
      return false;
    }
  }
  return true;
}

export default class FlexiblePerm {
  constructor(spec) {
    let { pieces, moveEffects } = spec;
    this._pieces = pieces;

    this._solved = bipartiteMatching(this._pieces);

    this._internalPerm = new Perm({
      size: this._pieces.length,
      moveEffects,
      initialState: this._solved,
      isSolved: (state) => isSolved(state, this._pieces),
    });

    this.index = this._internalPerm.index.bind(this._internalPerm);
    this.moveEffects = this._internalPerm.moveEffects;
  }

  getTransitionTables() {
    return this._internalPerm.getTransitionTables();
  }

  getPruningTables() {
    return this._internalPerm.getPruningTables();
  }

  createIndexArray(state) {
    return this._internalPerm.createIndexArray(state);
  }
};
