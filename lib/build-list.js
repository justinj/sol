// TODO: named exports

var buildList = function(n, f) {
  var result = [];
  for (var i = 0; i < n; i++) {
    result.push(f(i));
  }
  return result;
};

buildList.id = function(x) { return x; };

buildList.constantly = function(x) {
  return function() {
    return x;
  };
};

export default buildList;
