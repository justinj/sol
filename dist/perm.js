'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _buildList = require('./build-list');

var _buildList2 = _interopRequireDefault(_buildList);

var _applyPerm = require('./apply-perm');

var _applyPerm2 = _interopRequireDefault(_applyPerm);

var _indexing = require('./indexing');

var indexing = _interopRequireWildcard(_indexing);

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _jsSchema = require('js-schema');

var _jsSchema2 = _interopRequireDefault(_jsSchema);

var _transitionTable = require('./transition-table');

var _transitionTable2 = _interopRequireDefault(_transitionTable);

var _pruningTable = require('./pruning-table');

var _pruningTable2 = _interopRequireDefault(_pruningTable);

var _validatePerm = require('./validate-perm');

var _validatePerm2 = _interopRequireDefault(_validatePerm);

var _fact = require('./fact');

var _fact2 = _interopRequireDefault(_fact);

var _normalizeMoveEffects = require('./normalize-move-effects');

var _normalizeMoveEffects2 = _interopRequireDefault(_normalizeMoveEffects);

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var PermSchema = (0, _jsSchema2.default)({
  size: Number,
  moveEffects: Object
});

var validateMoveEffects = function validateMoveEffects(size, moveEffects) {
  var keys = Object.keys(moveEffects);

  for (var i = 0; i < keys.length; i++) {
    var move = moveEffects[keys[i]];
    if ((typeof move === 'undefined' ? 'undefined' : _typeof(move)) === "object") {
      (0, _validatePerm2.default)(move, size, keys[i]);
    }
  }
};

var Permutation = (function () {
  function Permutation(spec) {
    _classCallCheck(this, Permutation);

    (0, _validate2.default)(spec, PermSchema);

    validateMoveEffects(spec.size, spec.moveEffects);
    var solved = (0, _buildList2.default)(spec.size, _buildList2.default.id);

    this.solved = solved;
    this.index = indexing.permToIndex;
    this.apply = _applyPerm2.default;

    this.moveEffects = (0, _normalizeMoveEffects2.default)({
      moveEffects: spec.moveEffects,
      solved: this.solved,
      apply: this.apply
    });

    this.transitionTable = (0, _transitionTable2.default)({
      solved: this.solved,
      moveEffects: this.moveEffects,
      apply: this.apply,
      index: this.index
    });

    this.pruningTable = (0, _pruningTable2.default)({
      transitions: this.transitionTable,
      index: this.index,
      solved: this.solved
    });
  }

  _createClass(Permutation, [{
    key: 'getTransitionTables',
    value: function getTransitionTables() {
      return [this.transitionTable];
    }
  }, {
    key: 'getPruningTables',
    value: function getPruningTables() {
      return [this.pruningTable];
    }
  }, {
    key: 'generateRandomState',
    value: function generateRandomState() {
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
  }]);

  return Permutation;
})();

exports.default = Permutation;