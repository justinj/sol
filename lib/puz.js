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

var movesOfAxes = function(axes) {
  // brilliant trick, or horrible hack? you decide! (it's flatten btw)
  return Array.prototype.concat.apply([], axes);
};

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

var Puz = function(spec) {
  this.components = spec.components;
  this.axes = spec.axes;
  this.moves = movesOfAxes(spec.axes);
  this.followups = buildFollowups(spec.axes);
  this.followupLengths = this.followups.map(function(followup) { return followup.length; });
  this.validateState = spec.validateState;

  return this;
};

Puz.prototype.generateRandomState = function() {
  return mapObj(this.components, function(name, component) {
    return component.generateRandomState();
  });
};

module.exports = Puz;
