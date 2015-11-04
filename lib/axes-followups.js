import buildList from '../lib/build-list';
import mapObj from '../lib/map-obj';

// The input to this function specifies the ordering of the moves, and the
// return value of this is a list of valid followups to each move.
// At the very end of the array is a list of all valid moves.

var reverseMap = function(obj) {
  var result = {};
  Object.keys(obj).forEach(function(k) {
    result[obj[k]] = k;
  });
  return result;
};

// brilliant trick, or horrible hack? you decide!
var flatten = ary => Array.prototype.concat.apply([], ary);

var movesOfAxes = flatten;

var axesFollowups = function(axes) {
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

export default axesFollowups;
