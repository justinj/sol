module.exports = function(name, f) {
  var t;
  var timeSum = 0;
  var count = 0;
  while (timeSum < 300) {
    t = new Date();
    f();
    timeSum += (new Date() - t);
    count += 1;
  }
  console.log(name + " completed " + count + " runs");
};
