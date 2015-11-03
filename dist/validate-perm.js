"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

exports.default = function (perm, size, moveName) {
  if (perm == undefined) {
    throw new Error("Move '" + moveName + "' missing perm.");
  }
  if (perm.length !== size) {
    throw new Error("Perm move for move named '" + moveName + "' had length " + perm.length + ", expected length " + size + ".");
  }
  if (!isPermutation(perm)) {
    throw new Error("[" + perm.join(", ") + "] is not a valid permutation.");
  }
};

var _buildList = require("./build-list");

var _buildList2 = _interopRequireDefault(_buildList);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isPermutation = function isPermutation(perm) {
  var spots = (0, _buildList2.default)(perm.length, _buildList2.default.constantly(false));
  for (var i = 0; i < perm.length; i++) {
    spots[perm[i]] = true;
  }
  for (var i = 0; i < perm.length; i++) {
    if (!spots[i]) {
      return false;
    }
  }
  return true;
};

;