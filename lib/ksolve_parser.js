// this guy pretty much just exists as a proof of concept.
// it is in no way clean or robust.
var Perm = require("./perm");
var Orie = require("./orie");
var Puz = require("./puz");
var solve = require("./solve");

var buildList = require("./build_list");
var fs = require("fs");

var f = fs.readFileSync("./data/skewb.def");

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

    componentName = lines.shift()
    permEffect = parsePerm(lines.shift());
    nextLine = lines.shift();

    if (nextLine.match(/^[A-Za-z]+/)) {
      lines.unshift(nextLine);
      orieEffect = buildList(result.components[componentName].size, buildList.constantly(0));
    } else {
      orieEffect = parseList(nextLine);
    }

    result.components[componentName].moves.push({
      perm: permEffect,
      orie: orieEffect,
      name: name
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

  var components = Object.keys(result.components);

  var finalComponents = {};

  var newPiece;
  var newPerm;
  var newOrie;
  var permMoveEffects;
  var orieMoveEffects;

  for (var i = 0; i < components.length; i++) {
    newPiece = result.components[components[i]];
    permMoveEffects = {};
    for (var j = 0; j < newPiece.moves.length; j++) {
      permMoveEffects[newPiece.moves[j].name] = newPiece.moves[j].perm;
    }

    newPerm = new Perm({
      size: newPiece.size,
      moveEffects: permMoveEffects
    });
    finalComponents[components[i] + "Perm"] = newPerm;

    orieMoveEffects = {};
    for (var j = 0; j < newPiece.moves.length; j++) {
      orieMoveEffects[newPiece.moves[j].name] = newPiece.moves[j].orie;
    }

    newOrie = new Orie({
      // TODO: erm, we might have to do some fancy garbage to detect this
      kind: Orie.kinds.zero_sum,
      size: newPiece.size,
      order: newPiece.order,
      backingPerm: newPerm,
      moveEffects: orieMoveEffects
    });

    finalComponents[components[i] + "Orie"] = newOrie;
  }

  var puz = new Puz({
    components: finalComponents,
    axes: [
      ["F"], ["R"], ["L"], ["B"]
    ],
    validateState: function() { return true; }
  });
  console.log(Object.keys(finalComponents));

  return puz;
};

var puz = parse(f.toString().split("\n"));

console.log(solve(puz, {
  CornersPerm: [0, 1, 2, 3, 4, 5, 6, 7],
  CornersOrie: {
    orie: [0, 0, 0, 0, 0, 0, 0, 0],
    perm: [0, 1, 2, 3, 4, 5, 6, 7]
  },
  CentresPerm: [0, 1, 5, 3, 2, 4],
  CentresOrie: {
    orie: [0, 0, 0, 0, 0, 0],
    perm: [0, 1, 2, 3, 4, 5]
  }
}));

module.exports = parse;

