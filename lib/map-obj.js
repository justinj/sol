// mapObj({a: 1, b: 2}, (propertyName, x) => x * x);
// -> {a: 1, b: 4}
export default function(obj, f) {
  var result = {};
  Object.keys(obj).forEach(function(k) {
    result[k] = f(k, obj[k]);
  });
  return result;
};
