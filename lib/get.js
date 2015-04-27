module.exports = function(obj, prop, nameOfObj) {
  if (obj.hasOwnProperty(prop)) {
    return obj[prop];
  } else {
    throw new Error(nameOfObj + " did not have required property '" + prop + "'");
  }
};

