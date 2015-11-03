'use strict';

var _createClass = (function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; })(); // TODO: rename this guy to Composite or something

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _jsSchema = require('js-schema');

var _jsSchema2 = _interopRequireDefault(_jsSchema);

var _validate = require('./validate');

var _validate2 = _interopRequireDefault(_validate);

var _buildList = require('./build-list');

var _buildList2 = _interopRequireDefault(_buildList);

var _mapObj = require('./map-obj');

var _mapObj2 = _interopRequireDefault(_mapObj);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

// TODO: deeper validation here would be good
var PuzSchema = (0, _jsSchema2.default)({
  components: Object,
  axes: Array,
  validateState: Function
});

var reverseMap = function reverseMap(obj) {
  var result = {};
  Object.keys(obj).forEach(function (k) {
    result[obj[k]] = k;
  });
  return result;
};

// brilliant trick, or horrible hack? you decide!
var flatten = function flatten(ary) {
  return Array.prototype.concat.apply([], ary);
};
var mapcat = function mapcat(f, coll) {
  return flatten(coll.map(f));
};

var movesOfAxes = flatten;

var buildFollowups = function buildFollowups(axes) {
  var moves = movesOfAxes(axes);
  var numMoves = moves.length;
  var movesToIndices = reverseMap(moves);
  var followups = [];

  // this seems... not... good...
  axes.forEach(function (axis) {
    axis.forEach(function (move) {
      followups[movesToIndices[move]] = [];
    });
    axes.forEach(function (other) {
      if (axis !== other) {
        other = other.map(function (move) {
          return movesToIndices[move];
        });
        axis.forEach(function (move) {
          followups[movesToIndices[move]] = followups[movesToIndices[move]].concat(other);
        });
      }
    });
  });

  followups[followups.length] = (0, _buildList2.default)(numMoves, _buildList2.default.id);
  return followups;
};

var validateComponents = function validateComponents(moves, components) {
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

var createMoveEffects = function createMoveEffects(moves, components) {
  var result = {};
  moves.forEach(function (move) {
    result[move] = (0, _mapObj2.default)(components, function (name, component) {
      return component.moveEffects[move];
    });
  });
  return result;
};

var Puz = (function () {
  function Puz(spec) {
    _classCallCheck(this, Puz);

    this.components = spec.components;
    this.axes = spec.axes;
    this.moves = movesOfAxes(spec.axes);
    this.followups = buildFollowups(spec.axes);
    this.followupLengths = this.followups.map(function (followup) {
      return followup.length;
    });
    this.validateState = spec.validateState;

    this.solved = (0, _mapObj2.default)(this.components, function (name, component) {
      return component.solved;
    });
    this.moveEffects = createMoveEffects(this.moves, this.components);

    this.apply = function (to, state) {
      return (0, _mapObj2.default)(to, function (name, component) {
        return spec.components[name].apply(component, state[name]);
      });
    };

    validateComponents(this.moves, this.components);
  }

  _createClass(Puz, [{
    key: 'generateRandomState',
    value: function generateRandomState() {
      return (0, _mapObj2.default)(this.components, function (name, component) {
        return component.generateRandomState();
      });
    }
  }, {
    key: 'getTransitionTables',
    value: function getTransitionTables() {
      var _this = this;

      var names = Object.keys(this.components);
      return mapcat(function (name) {
        return _this.components[name].getTransitionTables();
      }, names);
    }
  }, {
    key: 'getPruningTables',
    value: function getPruningTables() {
      var _this2 = this;

      var names = Object.keys(this.components);
      return mapcat(function (name) {
        return _this2.components[name].getPruningTables();
      }, names);
    }
  }]);

  return Puz;
})();

exports.default = Puz;