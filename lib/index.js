var puz = require("./two");
var solve = module.exports = require("./solve");

console.log(solve(puz, {
  perm: [0, 2, 1, 3, 4, 5, 6],
  orie: {
    orie: [0, 2, 1, 0, 0, 0, 0],
    perm: [0, 1, 2, 3, 4, 5, 6]
  }
}));
