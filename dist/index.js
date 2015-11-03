'use strict';

var _two = require('./two');

var _two2 = _interopRequireDefault(_two);

var _solve = require('./solve');

var _solve2 = _interopRequireDefault(_solve);

var _godTable = require('./god-table');

var _godTable2 = _interopRequireDefault(_godTable);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

console.log((0, _solve2.default)({
  puz: _two2.default,
  state: {
    perm: [0, 2, 1, 3, 4, 5, 6],
    orie: {
      orie: [0, 0, 0, 0, 0, 0, 0],
      perm: [0, 1, 2, 3, 4, 5, 6]
    }
  },
  minDepth: 1,
  justOne: false
}));

// console.log(solve({
//   puz,
//   state: {
//     cornerPerm: [0, 2, 1, 3, 4, 5, 6, 7],
//     cornerOrie: {
//       orie: [0, 0, 0, 0, 0, 0, 0, 0],
//       perm: [0, 1, 2, 3, 4, 5, 6, 7]
//     },
//     centers: [0, 1, 2, 3, 4, 5]
//   }
// }));

// console.log(godTable(puz));