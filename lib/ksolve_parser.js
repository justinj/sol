// this guy pretty much just exists as a proof of concept.
// it is in no way clean or robust.

var buildList = require("./build_list");
var fs = require("fs");

var f = fs.readFileSync("./data/ksolve_3x3.def");

var readTo = function(regexp, lines) {
  var l = lines.shift();
  while (!l.match(regexp)) {
    l = lines.shift();
  }
};

var parseList = function(lst) {
  return lst.split(" ").map(function(s) { return parseInt(s); });
};

var parsePerm = function(p) {
  return parseList(p).map(function(x) { return x - 1; });
};

var parseMove = function(name, result, lines) {
  var l;
  var name;
  var permEffect;
  var orieEffect;
  var nextLine;
  while (l !== "End") {
    var component = l;

    name = lines.shift();
    permEffect = parsePerm(lines.shift());
    nextLine = lines.shift();

    if (nextLine.match(/^[A-Za-z]+/)) {
      lines.unshift(nextLine);
      orieEffect = buildList(result.components[name].size, buildList.constantly(0));
    } else {
      orieEffect = parseList(nextLine);
    }
    console.log(JSON.stringify(result));
    console.log(name);

    result.components[name].moves.push({
      perm: permEffect,
      orie: orieEffect
    });

    l = lines[0];
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
        size: parseInt(match[2]),
        order: parseInt(match[3]),
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

