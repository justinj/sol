// TODO: rename this guy to Composite or something
import schema from 'js-schema';
import validate from './validate';
import buildList from './build-list';
import mapObj from './map-obj';
import axesFollowups from './axes-followups';

// TODO: deeper validation here would be good
var PuzSchema = schema({
  components: Object,
  axes: Array,
  validateState: Function
});

var validateComponents = function(moves, components) {
  var componentNames = Object.keys(components);
  var component;
  var componentMoves;
  for (var i = 0; i < componentNames.length; i++) {
    component = components[componentNames[i]];
    componentMoves = component.moveEffects;
    for (var j = 0; j < moves.length; j++) {
      if (!componentMoves.hasOwnProperty(moves[j])) {
        throw new Error("Component \"" + componentNames[i] + "\" missing move \"" + moves[j] + "\"");
      }
    }
  }
};

var flatten = ary => Array.prototype.concat.apply([], ary);
var mapcat = (f, coll) => flatten(coll.map(f));

var movesOfAxes = flatten;

var createMoveEffects = function(moves, components) {
  var result = {};
  moves.forEach(function(move) {
    result[move] = mapObj(components, (name, component) => component.moveEffects[move]);
  });
  return result;
};

class Puz {
  constructor(spec) {
    this.components = spec.components;
    this.axes = spec.axes;
    this.moves = movesOfAxes(spec.axes);
    this.followups = axesFollowups(spec.axes);
    this.followupLengths = this.followups.map(followup => followup.length);
    this.validateState = spec.validateState;

    this.solved = mapObj(this.components, (name, component) => component.solved);
    this.moveEffects = createMoveEffects(this.moves, this.components);

    this.apply = function(to, state) {
      return mapObj(to, (name, component) => spec.components[name].apply(component, state[name]));
    };

    validateComponents(this.moves, this.components)
  }

  generateRandomState() {
    return mapObj(this.components, (name, component) => component.generateRandomState());
  }

  getTransitionTables() {
    var names = Object.keys(this.components);
    return mapcat(name => this.components[name].getTransitionTables(), names);
  }

  getPruningTables() {
    var names = Object.keys(this.components);
    return mapcat(name => this.components[name].getPruningTables(), names);
  }
}

export default Puz;
