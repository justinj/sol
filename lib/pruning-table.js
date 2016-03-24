// TODO: don't have this guy just grab the ttable.
// either do something with the new interface or pass in the ttable (probably preferable)
// TODO: `solved` here might be more meaningfully `starting`
// TODO: This guy doesn't currently respect `followups`. Not essential to fix, but potentially an optimization

const defaultIsSolved = () => false;
export default function({ transitions, index, solved, isSolved=defaultIsSolved }) {
  let solvedIndex = index(solved);

  let table = [];
  table[solvedIndex] = 0;
  
  let queue = [solvedIndex];

  while (queue.length > 0) {
    let curState = queue.shift();
    let curDist = table[curState];
    let nextStates = transitions[curState];
    for (let i = 0; i < nextStates.length; i++) {
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
