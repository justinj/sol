'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })();

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _indexing = require('./indexing');

var indexing = _interopRequireWildcard(_indexing);

var _buildList = require('./build-list');

var _buildList2 = _interopRequireDefault(_buildList);

var _applyPerm = require('./apply-perm');

var _applyPerm2 = _interopRequireDefault(_applyPerm);

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

var _mapObj = require('./map-obj');

var _mapObj2 = _interopRequireDefault(_mapObj);

var _normalizeMoveEffects = require('./normalize-move-effects');

var _normalizeMoveEffects2 = _interopRequireDefault(_normalizeMoveEffects);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } else { var newObj = {}; if (obj != null) { for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) newObj[key] = obj[key]; } } newObj.default = obj; return newObj; } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _typeof(obj) { return obj && typeof Symbol !== "undefined" && obj.constructor === Symbol ? "symbol" : typeof obj; }

var kinds = {
  zero_sum: {
    index: indexing.zeroSumOrientationToIndex,
    validate: function validate(orientation, order) {
      var sum = 0;
      for (var i = 0; i < orientation.length; i++) {
        sum += orientation[i];
      }
      return sum % order === 0;
    }
  },
  arbitrary_sum: {
    index: indexing.orientationToIndex,
    validate: function validate() {
      return true;
    }
  }
};

var indexingFns = {
  "zero_sum": indexing.zeroSumOrientationToIndex,
  "arbitrary_sum": indexing.orientationToIndex
};

var makeIndexer = function makeIndexer(kind, order) {
  return function (orie) {
    // ...this part means we effectively ignore the perm part, so it doesn't matter
    return kind(orie.orie, order);
  };
};

var makeApply = function makeApply(size, order) {
  return function (to, orie) {
    var or = (0, _applyPerm2.default)(to.orie, orie.perm);
    var pe = (0, _applyPerm2.default)(to.perm, orie.perm);
    for (var i = 0; i < size; i++) {
      or[i] = (orie.orie[i] + or[i]) % order;
    }
    return {
      orie: or,
      perm: pe
    };
  };
};

var OrieSchema = (0, _jsSchema2.default)({
  size: Number,
  order: Number,
  moveEffects: Object
});

var validateOrie = function validateOrie(orie, size, order, moveName) {
  if (orie == undefined) {
    throw new Error("Move '" + moveName + "' missing orie.");
  }
  if (orie.length !== size) {
    throw new Error("Orie on orientation move '" + moveName + "' had length " + orie.length + ", expected length " + size + ".");
  }
  for (var i = 0; i < orie.length; i++) {
    if (orie[i] >= order) {
      throw new Error("[" + orie.join(", ") + "] is not a valid orientation for an orientation with order " + order + ".");
    }
  };
};

var validateMoveEffects = function validateMoveEffects(size, order, moveEffects) {
  var keys = Object.keys(moveEffects);

  for (var i = 0; i < keys.length; i++) {
    var move = moveEffects[keys[i]];
    if ((typeof move === 'undefined' ? 'undefined' : _typeof(move)) === "object") {
      (0, _validatePerm2.default)(move.perm, size, keys[i]);
      validateOrie(move.orie, size, order, keys[i]);
    }
  }
};

var buildMoveEffects = function buildMoveEffects(moveEffects, backingPerm) {
  return (0, _mapObj2.default)(moveEffects, function (move, def) {
    if (typeof def === "string") {
      return def;
    } else {
      return {
        orie: def,
        perm: backingPerm.moveEffects[move]
      };
    }
  });
};

var Orientation = (function () {
  function Orientation(spec) {
    _classCallCheck(this, Orientation);

    (0, _validate2.default)(spec, OrieSchema);
    var kind = spec.kind.index;

    var moveEffects;
    // TODO: might be better if this were standardized instead of allowing both options
    // TODO: verify the perm has the same size?
    if (spec.hasOwnProperty("backingPerm")) {
      moveEffects = buildMoveEffects(spec.moveEffects, spec.backingPerm);
    } else {
      moveEffects = spec.moveEffects;
    }

    validateMoveEffects(spec.size, spec.order, moveEffects);

    // TODO: the things that satsify the component interface and the things
    // specific to orientation should be seperated out somehow
    this.validate = spec.kind.validate;
    this.size = spec.size;
    this.order = spec.order;
    this.solved = {
      perm: (0, _buildList2.default)(spec.size, _buildList2.default.id),
      orie: (0, _buildList2.default)(spec.size, _buildList2.default.constantly(0))
    };

    // making this a method has some perf penalties, presumably because it has
    // to look up the size and order every time.  This way we just create a
    // closure and we're done with it.
    this.apply = makeApply(spec.size, spec.order);
    this.index = makeIndexer(kind, spec.order);

    this.moveEffects = (0, _normalizeMoveEffects2.default)({
      moveEffects: moveEffects,
      solved: this.solved,
      apply: this.apply
    });

    // TODO: lazily compute?
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

  _createClass(Orientation, [{
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
      var result;
      do {
        result = [];
        for (var i = 0; i < this.size; i++) {
          // TODO: this needs to be seedable
          result.push(Math.floor(Math.random() * this.order));
        }
      } while (!this.validate(result, this.order));
      // TODO: we shouldn't have to always include the perm, there should be a
      // thing that converts an orientation to the gross thing when it gets passed
      return {
        orie: result,
        perm: (0, _buildList2.default)(result.length, _buildList2.default.id)
      };
    }
  }]);

  return Orientation;
})();

Orientation.kinds = kinds;

exports.default = Orientation;