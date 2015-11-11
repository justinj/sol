import claim from 'claim';
import bipartiteMatching from '../lib/bipartite-matching';

describe('finding a bipartite matching', function() {
  it('solves the trivial case', function() {
    claim.same(bipartiteMatching([[0]]), [0]);
  });

  it('returns null if there is no perfect matching', function() {
    claim.same(bipartiteMatching([ [] ]), null);
    claim.same(bipartiteMatching([ [0], [0] ], null));
  });

  it('matches if every edge has only one distinct possibility', function() {
    claim.same(bipartiteMatching([[0], [1]]), [0, 1]);
  });

  it('finds a solution if one vertex has two possibilities', function() {
    claim.same(bipartiteMatching([[0, 1], [1]]), [0, 1]);
    claim.same(bipartiteMatching([[1, 0], [1]]), [0, 1]);
  });

  it('solves a case which should require two augmenting paths', function() {
    claim.same(bipartiteMatching([[1, 0], [1], [3, 2], [3]]), [0, 1, 2, 3]);
  });

  it('handles cycles', function() {
    claim.same(bipartiteMatching([[1, 0], [0, 1], [0]]), null);
  });

  it('handles a complex n = 5 case', function() {
    claim.same(
      bipartiteMatching([
        [ 3, 4 ],
        [ 0, 1, 2, 3 ],
        [ 2, 3 ],
        [ 0, 1, 4 ],
        [ 1, 3, 4 ]
      ]),
      [ 3, 0, 2, 1, 4 ]
    );
  });

  describe('self-indulgent randomized testing', function() {
    function makeVertex(n) {
      let result = [];
      for (let i = 0; i < n; i++) {
        if (Math.random() < 0.5) {
          result.push(i);
        }
      }
      return result;
    }

    function testSize(n) {
      let result = [];
      for (let i = 0; i < n; i++) {
        result.push(makeVertex(n));
      }
      return result;
    }

    it('handles n = 5', function() {
      for (let i = 0; i < 100; i++) {
        let testCase = testSize(5);
        let result = bipartiteMatching(testCase);
        if (result !== null) {
          claim.same(result.length, 5);
          result = result.sort((a, b) => a - b);
          // Just asserting each index appears exactly once
          result.forEach((a, i) => {
            claim.same(a, i);
          });
        }
      }
    });
  });
})
