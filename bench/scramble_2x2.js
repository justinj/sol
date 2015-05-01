var puz = require("../lib/two");
var solve = module.exports = require("../lib/solve");

for (var i = 0; i < 1000; i++) {
  solve(puz, puz.generateRandomState());
}
