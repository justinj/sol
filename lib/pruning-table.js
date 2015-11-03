// TODO: don't have this guy just grab the ttable.
// either do something with the new interface or pass in the ttable (probably preferable)
// TODO: `solved` here might be more meaningfully `starting`
// TODO: This guy doesn't currently respect `followups`. Not essential to fix, but potentially an optimization
let notSolved = () => false;
export default function({ transitions, index, solved, isSolved }) {
  // TODO: clean me up
  isSolved = isSolved || notSolved; // ?
  var solvedIndex = index(solved);

  var table = [];
  table[solvedIndex] = 0;
  
  var queue = [solvedIndex]
  var nextStates;
  var curState;
  var curDist;

  while (queue.length > 0) {
    curState = queue.shift();
    curDist = table[curState];
    nextStates = transitions[curState];
    for (var i = 0; i < nextStates.length; i++) {
      let dist = curDist + 1;
      if (isSolved(nextStates[i])) {
        dist = 0;
      }
      if (table[nextStates[i]] === undefined || dist < table[nextStates[i]]) {
        table[nextStates[i]] = dist;
        queue.push(nextStates[i]);
      }
    }
  }

  return table;
};
