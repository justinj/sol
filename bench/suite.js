"use strict";

import Benchmark from 'benchmark';
import transitionTable from '../lib/transition-table';
import pruningTable from '../lib/pruning-table';

import puz from '../lib/two';
import solve from '../lib/solve';

let suite = new Benchmark.Suite;

let solved = 0;
let moveEffects = {
  "UP": 1,
  "DOWN": -1,
  "UP2": 2,
  "DOWN2": -2,
};

const apply = function(n, m) {
  return (n + m) % 1000;
};

const index = n => n;

const args = { solved, moveEffects, apply, index };

suite.add("construct transition table", function() {
  transitionTable(args);
});

let transitions = transitionTable(args);

suite.add("construct pruning table", function() {
  pruningTable({...args, transitions});
});


const solveArgs = {
  puz, 
  state: {
    perm: [0, 2, 1, 3, 4, 5, 6],
    orie: {
      orie: [0, 2, 1, 0, 0, 0, 0],
      perm: [0, 1, 2, 3, 4, 5, 6]
    }
  }
};

suite.add("solve a 2x2", function() {
  solve(solveArgs);
})
.on('cycle', function(event) {
    console.log(String(event.target));
})
.run();
