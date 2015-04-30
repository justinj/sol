module.exports = function(obj, f) {
  var result = {};
  Object.keys(obj).forEach(function(k) {
    result[k] = f(k, obj[k]);
  });
  return result;
};

