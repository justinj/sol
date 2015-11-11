// Overview and restrictions
// =========================
//
// This module exports a function which finds a perfect matching for a
// bipartite graph if one exists.  While the code could easily be modified to
// produce a maximum matching, for the purposes in Sol, we only care about a
// maximum matching.
//
// An additional restriction is that we require each side of the bipartition to
// have the same size. This is also an easy restriction to relax - we can pad
// the smaller side with lone vertices that will not affect any matchings.
//
// Input
// =====
//
// The representation for a graph is asymmetric - we number the vertices of
// each bipartition from 0...n, and then the representation of a graph is an
// array of arrays, where the array at index i contains all the indices vertex
// i is adjacent to.
//
// For example,
// [
//   [0, 1, 2],
//   [0, 2],
//   [1]
// ]
// 0   1   2
//
// 0   1   2
//
// Where the 0 vertex on the bottom is adjacent to 0, 1, and 2 on the top,
//       the 1 vertex on the bottom is adjacent to 0 and 2 on the top,
//       the 2 vertex on the bottom is adjacent to 1 on the top,
//
// Output
// ======
//
// The output is an array a of length n, where the i-th entry means that the
// vertex i on the main bipartition gets connected to a[i].
//
// Algorithm
// =========
//
// First, some terminology:
//
// a _path_ is a sequence of vertices a_1, ... a_n such that each pair of
// vertices a_i, a_{i+1} are adjacent, and no vertices are repeated.
//
// A _matching_ is a set of edges for some graph G, such that no pair of edges
// in the matching are adjacent to the same vertex.
//
// An _alternating path_ with respect to some matching M is a path such that
// the edges in the path alternate between being and not being in the matching.
//
// An _augmenting path_ with respect to some matching M is a maximal
// alternating path with the property that the first and last edges in the path
// are not in M.
//
// Given an augmenting path, call the set of edges which are not in M A, and
// those which are in M B.  Then say M' = (M - B) + A.  Since there are
// strictly more edges in A than in B (because the first and last edges are in
// A), M' is bigger than M, so by finding an augmenting path we can increase
// the size of our matching.
//
// We can find an augmenting path by performing a search. Breadth first or
// depth first are both fine, we do depth first here.
//
// It's also true that if M is not a maximum matching, we can find an
// augmenting path.
//
// We continue finding augmenting paths and extending our matching by one edge
// until we can no longer find an augmenting path and our matching is maximal.


function findInitialMatching(vertices) {
  let saturated = {};
  let result = [];
  vertices.forEach((neighbours, i) => {
    for (let j = 0; j < neighbours.length; j++) {
      if (!saturated[neighbours[j]]) {
        result.push([i, neighbours[j]]);
        saturated[neighbours[j]] = true;
        break;
      }
    }
  });
  return result;
}

// "Invert" our perspective on the graph. Switches the roles of the
// bipartitions so that the primary one is now the secondary and vice-versa.
// > invertGraph([[0, 1], [1]])
// [[0], [0, 1]]
function invertGraph(vertices) {
  let result = vertices.map(() => []);
  for (let i = 0; i < vertices.length; i++) {
    for (let j = 0; j < vertices[i].length; j++) {
      result[vertices[i][j]].push(i);
    }
  }
  return result;
}

// Invert our perspective on a matching. This just means we flip each edge.
function invertMatching(matching) {
  return matching.map(([a, b]) => [b, a]);
}

function findAugmentingPath(vertices, matching, startingVertices, visiteds = [{}, {}], useTakenEdge = false) {
  let [visited, secondaryVisited] = visiteds;
  for (let i = 0; i < startingVertices.length; i++) {
    let vertex = startingVertices[i];
    if (visited[vertex]) {
      continue;
    }
    let neighbours = vertices[vertex];
    let existingEdge = edgeForVertex(vertex, matching);
    let potentialNextEdges = neighbours.filter(neighbour => {
      let isTaken = existingEdge !== null && existingEdge[1] === neighbour;
      if (useTakenEdge) {
        return isTaken;
      } else {
        return !isTaken;
      }
    });
    if (useTakenEdge && potentialNextEdges.length === 0) {
      return [vertex];
    }
    let invertedGraph = invertGraph(vertices);
    let invertedMatching = invertMatching(matching);
    let newVisited = {
      ...visited,
      [vertex]: true
    };
    let result = findAugmentingPath(
      invertedGraph,
      invertedMatching,
      potentialNextEdges,
      [secondaryVisited, newVisited],
      !useTakenEdge
    );
    if (result) {
      return [vertex, ...result];
    }
  }
  return null;
}

function edgeForVertex(vertex, matching) {
  for (let i = 0; i < matching.length; i++) {
    if (matching[i][0] === vertex) {
      return matching[i];
    }
  }
  return null;
}

function edgesInPath(path) {
  let result = [];
  for (let i = 0; i < path.length - 1; i += 1) {
    result.push([path[i], path[i+1]]);
  }
  return result;
}

function everyOther(l, startingFrom) {
  let result = [];
  for (let i = startingFrom; i < l.length; i += 2) {
    result.push(l[i]);
  }
  return result;
}

function evens(l) {
  return everyOther(l, 1);
}

function odds(l) {
  return everyOther(l, 0);
}

function matchingToAssignments(matching) {
  let result = [];
  matching.forEach(([a, b]) => result[a] = b);
  return result;
}

function edgeIn(set, [a, b]) {
  for (let [c, d] of set) {
    if (a === c && b === d) return true;
  }
  return false;
}

export default function bipartiteMatching(vertices) {
  let matching = findInitialMatching(vertices);

  while (matching.length < vertices.length) {
    let indices = vertices.map((_, i) => i);
    let unsaturatedVertices = indices.filter(i => edgeForVertex(i, matching) === null)

    let path = findAugmentingPath(vertices, matching, unsaturatedVertices);
    // No augmenting path -> no perfect matching
    if (path === null) {
      return null;
    }

    path = edgesInPath(path);
    let toRemove = evens(path).map(([a, b]) => [b, a]);
    let toAdd = odds(path);

    matching = matching.filter(edge => !edgeIn(toRemove, edge));
    matching = matching.concat(toAdd);
  }
  return matchingToAssignments(matching);
};
