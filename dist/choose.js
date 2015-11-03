'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (n, k) {
  if (n < k) {
    return 0;
  } else {
    return (0, _fact2.default)(n) / ((0, _fact2.default)(k) * (0, _fact2.default)(n - k));
  }
};

var _fact = require('./fact');

var _fact2 = _interopRequireDefault(_fact);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }