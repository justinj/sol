'use strict';

var _indexState = require('./index-state');

var _indexState2 = _interopRequireDefault(_indexState);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// TODO: this guy doesn't currently make use of `followups`
module.exports = function (puz) {
  var result = {};
  var tables = puz.getTransitionTables();
  var numMoves = tables[0][0].length;
  var sizes = tables.map(function (t) {
    return t.length;
  });
  var queue = [tables.map(function (_) {
    return 0;
  })];
  result[(0, _indexState2.default)(queue[0], sizes)] = 0;

  var godsTable = [];
  var nextQueue = [];
  var newState;
  var depth = 1;
  while (queue.length > 0) {
    for (var i = 0; i < queue.length; i++) {
      for (var move = 0; move < numMoves; move++) {
        newState = [];
        for (var table = 0; table < tables.length; table++) {
          newState[table] = tables[table][queue[i][table]][move];
        }
        var index = (0, _indexState2.default)(newState, sizes);
        if (!result.hasOwnProperty(index)) {
          nextQueue.push(newState);
          result[index] = depth;
        }
      }
    }
    godsTable.push(nextQueue.length);
    depth += 1;
    queue = nextQueue;
    nextQueue = [];
  }

  return godsTable;
};