import puz from './two';
import solve from .exports = require('./solve');
import godTable from './god-table';

console.log(solve({
  puz,
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
