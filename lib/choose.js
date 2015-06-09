var fact = require("./fact");

// TODO: this could be probs be optimized somehow
module.exports = function(n, k) {
  if (n < k) {
    return 0;
  } else {
    return fact(n)/(fact(k)*fact(n-k));
  }
}
