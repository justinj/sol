var schema = require("js-schema");
var validate = require("./validate");
var buildList = require("./build_list");
var mapObj = require("./map_obj");

// TODO: deeper validation here would be good
var PuzSchema = schema({
  components: Object,
  axes: Array,
  validateState: Function
});

var reverseMap = function(obj) {
  var result = {};
  Object.keys(obj).forEach(function(k) {
    result[obj[k]] = k;
  });
  return result;
};

// brilliant trick, or horrible hack? you decide!
var flatten = ary => Array.prototype.concat.apply([], ary);
var mapcat = (f, coll) => flatten(coll.map(f));

var movesOfAxes = flatten;

var buildFollowups = function(axes) {
  var moves = movesOfAxes(axes);
  var numMoves = moves.length;
  var movesToIndices = reverseMap(moves);
  var followups = [];

  // this seems... not... good...
  axes.forEach(function(axis) {
    axis.forEach(function(move) {
      followups[movesToIndices[move]] = [];
    });
    axes.forEach(function(other) {
      if (axis !== other) {
        other = other.map(function(move) { return movesToIndices[move]; });
        axis.forEach(function(move) {
          followups[movesToIndices[move]] = followups[movesToIndices[move]].concat(other);
        });
      }
    });
  });

  followups[followups.length] = buildList(numMoves, buildList.id);
  return followups
};

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

var mapCat = function(f, coll) {

};

class Puz {
  constructor(spec) {
    this.components = spec.components;
    this.axes = spec.axes;
    this.moves = movesOfAxes(spec.axes);
    this.followups = buildFollowups(spec.axes);
    this.followupLengths = this.followups.map(followup => followup.length);
    this.validateState = spec.validateState;

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

module.exports = Puz;
