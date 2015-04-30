var fs = require("fs");

var f = fs.readFileSync("./data/ksolve_3x3.def");

var readTo = function(regexp, lines) {
  var l = lines.shift();
  while (!l.match(regexp)) {
    l = lines.shift();
  }
};

var parseMove = function(name, result, lines) {
  var l = lines.shift();
  while (l !== "End") {
    var component = l;

    l = lines.shift();
  }
};

var parse = function(lines) {
  var curLine;
  var result = {
    components: {}
  };

  while (lines.length > 0) {
    curLine = lines.shift();
    var match;
    if ((match = curLine.match(/^Name (.*)/))) {
      result.name = match[1];
    } else if ((match = curLine.match(/^#/))) {
      // no-op
    } else if ((match = curLine.match(/^Set (\w+) (\d+) (\d+)/))) {
      result.components[match[1]] = {
        size: match[2],
        order: match[3],
        moves: []
      };
    } else if ((match = curLine.match(/^Solved/))) {
      // ignore this for now
      readTo(/^End/, lines);
    } else if ((match = curLine.match(/^Move (.*)$/))) {
      parseMove(match[1], result, lines);
    }
  }

  return result;
};

console.log(parse(f.toString().split("\n")));

module.exports = parse;

