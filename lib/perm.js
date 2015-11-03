import buildList from './build-list';
import applyPerm from './apply-perm';
import * as indexing from './indexing';
import validate from './validate';
import schema from 'js-schema';
import transitionTable from './transition-table';
import pruningTable from './pruning-table';
import validatePerm from './validate-perm';
import factorial from './fact';
import normalizeMoveEffects from './normalize-move-effects';

var PermSchema = schema({
  size: Number,
  moveEffects: Object
});

var validateMoveEffects = function(size, moveEffects) {
  var keys = Object.keys(moveEffects);

  for (var i = 0; i < keys.length; i++) {
    var move = moveEffects[keys[i]];
    if (typeof move === "object") {
      validatePerm(move, size, keys[i]);
    }
  }
};

class Permutation {
  constructor(spec) {
    validate(spec, PermSchema);

    validateMoveEffects(spec.size, spec.moveEffects)
    var solved = buildList(spec.size, buildList.id);

    this.solved = solved;
    this.index = indexing.permToIndex;
    this.apply = applyPerm;

    this.moveEffects = normalizeMoveEffects({
      moveEffects: spec.moveEffects,
      solved: this.solved,
      apply: this.apply
    });

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

  generateRandomState() {
    var result = this.solved.slice();
    var tmp;
    var j;

    // TODO: ehh, this should probably be pulled into its own module
    // (it's fy-shuffle)
    for (var i = 0; i < result.length; i++) {
      tmp = result[i];
      j = Math.floor(Math.random() * (result.length - i));
      result[i] = result[j];
      result[j] = tmp;
    }
    return result;
  }
}


export default Permutation;
