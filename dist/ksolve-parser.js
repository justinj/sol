'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _perm = require('./perm');

var _perm2 = _interopRequireDefault(_perm);

var _orie = require('./orie');

var _orie2 = _interopRequireDefault(_orie);

var _puz = require('./puz');

var _puz2 = _interopRequireDefault(_puz);

var _solve = require('./solve');

var _solve2 = _interopRequireDefault(_solve);

var _buildList = require('./build-list');

var _buildList2 = _interopRequireDefault(_buildList);

var _fs = require('fs');

var _fs2 = _interopRequireDefault(_fs);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

// this guy pretty much just exists as a proof of concept.
// it is in no way clean or robust.

var f = _fs2.default.readFileSync("./data/skewb.def");

var readTo = function readTo(regexp, lines) {
  var l = lines.shift();
  while (!l.match(regexp)) {
    l = lines.shift();
  }
};

var parseList = function parseList(lst) {
  return lst.split(" ").map(function (s) {
    return parseInt(s);
  });
};

var parsePerm = function parsePerm(p) {
  return parseList(p).map(function (x) {
    return x - 1;
  });
};

var parseMove = function parseMove(name, result, lines) {
  var l;
  var name;
  var permEffect;
  var orieEffect;
  var nextLine;
  var componentName;
  while (l !== "End") {
    var component = l;

    componentName = lines.shift();
    permEffect = parsePerm(lines.shift());
    nextLine = lines.shift();

    if (nextLine.match(/^[A-Za-z]+/)) {
      lines.unshift(nextLine);
      orieEffect = (0, _buildList2.default)(result.components[componentName].size, _buildList2.default.constantly(0));
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

var parse = function parse(lines) {
  var curLine;
  var result = {
    components: {}
  };

  while (lines.length > 0) {
    curLine = lines.shift();
    var match;
    if (match = curLine.match(/^Name (.*)/)) {
      result.name = match[1];
    } else if (match = curLine.match(/^#/)) {
      // no-op
    } else if (match = curLine.match(/^Set (\w+) (\d+) (\d+)/)) {
        result.components[match[1]] = {
          size: parseInt(match[2]),
          order: parseInt(match[3]),
          moves: []
        };
      } else if (match = curLine.match(/^Solved/)) {
        // ignore this for now
        readTo(/^End/, lines);
      } else if (match = curLine.match(/^Move (.*)$/)) {
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

    // newPerm = new Perm({
    //   size: newPiece.size,
    //   moveEffects: permMoveEffects
    // });
    // finalComponents[components[i] + "Perm"] = newPerm;

    orieMoveEffects = {};
    for (var j = 0; j < newPiece.moves.length; j++) {
      orieMoveEffects[newPiece.moves[j].name] = newPiece.moves[j].orie;
    }

    console.log(permMoveEffects);
    console.log(orieMoveEffects);

    // newOrie = new Orie({
    //   // TODO: erm, we might have to do some fancy garbage to detect this
    //   // kind: Orie.kinds.zero_sum,
    //   size: newPiece.size,
    //   order: newPiece.order,
    //   backingPerm: newPerm,
    //   moveEffects: orieMoveEffects
    // });
    // finalComponents[components[i] + "Orie"] = newOrie;
  }

  // var puz = new Puz({
  //   components: finalComponents,
  //   axes: [
  //     ["F"], ["R"], ["L"], ["B"]
  //   ],
  //   validateState: function() { return true; }
  // });
  // console.log(Object.keys(finalComponents));

  return puz;
};

var puz = parse(f.toString().split("\n"));

// console.log(solve(puz, {
//   CornersPerm: [0, 1, 2, 3, 4, 5, 6, 7],
//   CornersOrie: {
//     orie: [0, 0, 0, 0, 0, 0, 0, 0],
//     perm: [0, 1, 2, 3, 4, 5, 6, 7]
//   },
//   CentresPerm: [0, 1, 5, 3, 2, 4],
//   CentresOrie: {
//     orie: [0, 0, 0, 0, 0, 0],
//     perm: [0, 1, 2, 3, 4, 5]
//   }
// }));

exports.default = parse;