'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _perm = require('./perm');

var _perm2 = _interopRequireDefault(_perm);

var _orie = require('./orie');

var _orie2 = _interopRequireDefault(_orie);

var _puz = require('./puz');

var _puz2 = _interopRequireDefault(_puz);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var cornerPerm = new _perm2.default({
  size: 8,
  moveEffects: {
    "U": [0, 6, 2, 1, 4, 5, 3, 7],
    "U'": "U U",
    "R": [0, 4, 2, 3, 6, 5, 1, 7],
    "R'": "R R",
    "L": [0, 1, 2, 6, 3, 5, 4, 7],
    "L'": "L L",
    "B": [0, 1, 5, 3, 4, 7, 6, 2],
    "B'": "B B"
  }
});

var cornerOrie = new _orie2.default({
  kind: _orie2.default.kinds.arbitrary_sum,
  size: 8,
  order: 3,
  backingPerm: cornerPerm,
  moveEffects: {
    "U": [0, 2, 1, 2, 0, 0, 2, 0],
    "U'": "U U",
    "R": [0, 2, 0, 0, 2, 1, 2, 0],
    "R'": "R R",
    "L": [0, 0, 0, 2, 2, 0, 2, 1],
    "L'": "L L",
    "B": [0, 0, 2, 0, 0, 2, 1, 2],
    "B'": "B B"
  }
});

var centers = new _perm2.default({
  size: 6,
  moveEffects: {
    "U": [4, 1, 2, 3, 5, 0],
    "U'": "U U",
    "R": [0, 1, 3, 4, 2, 5],
    "R'": "R R",
    "L": [0, 5, 2, 1, 4, 3],
    "L'": "L L",
    "B": [0, 1, 2, 5, 3, 4],
    "B'": "B B"
  }
});

var puz = new _puz2.default({
  components: {
    cornerPerm: cornerPerm,
    cornerOrie: cornerOrie,
    centers: centers
  },
  axes: [["U", "U'"], ["R", "R'"], ["L", "L'"], ["B", "B'"]],
  // TODO: this is wrong
  validateState: function validateState() {
    return true;
  }
});

exports.default = puz;