var puz = require("./skewb");
var solve = module.exports = require("./solve");

// console.log(solve(puz, {
//   perm: [0, 2, 1, 3, 4, 5, 6],
//   orie: {
//     orie: [0, 2, 1, 0, 0, 0, 0],
//     perm: [0, 1, 2, 3, 4, 5, 6]
//   }
// }));

console.log(solve(puz, {
  cornerPerm: [0, 1, 2, 3, 4, 5, 6, 7],
  cornerOrie: {
    orie: [0, 0, 0, 0, 0, 0, 0, 0],
    perm: [0, 1, 2, 3, 4, 5, 6, 7]
  },
  centers: [0, 1, 5, 3, 2, 4]
}));

// console.log(solve(puz, puz.generateRandomState()));
