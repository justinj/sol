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

var perm = new _perm2.default({
  size: 7,
  moveEffects: {
    "F": [0, 1, 3, 6, 4, 2, 5],
    "F2": "F F",
    "F'": "F F F",
    "R": [0, 2, 5, 3, 1, 4, 6],
    "R2": "R R",
    "R'": "R R R",
    "U": [3, 0, 1, 2, 4, 5, 6],
    "U2": "U U",
    "U'": "U U U"
  }
});

var orie = new _orie2.default({
  kind: _orie2.default.kinds.zero_sum,
  size: 7,
  order: 3,
  backingPerm: perm,
  moveEffects: {
    "F": [0, 0, 1, 2, 0, 2, 1],
    "F2": "F F",
    "F'": "F F F",
    "R": [0, 1, 2, 0, 2, 1, 0],
    "R2": "R R",
    "R'": "R R R",
    "U": [0, 0, 0, 0, 0, 0, 0],
    "U2": "U U",
    "U'": "U U U"
  }
});

var puz = new _puz2.default({
  components: {
    orie: orie,
    perm: perm
  },
  axes: [["F", "F2", "F'"], ["R", "R2", "R'"], ["U", "U2", "U'"]],
  // every combination of permutation and orientation for a 2x2 is valid, but
  // for some puzzles this is not true, so this is needed to confirm that a
  // generated state is ok.
  validateState: function validateState() {
    return true;
  }
});

exports.default = puz;