// TODO: cute would be to sort these in ascending order somehow...
// Take an array of indices, and the max value for each, and calculate a new index.
export default function(state, sizes) {
  var result = state[0];
  for (var i = 1; i < state.length; i++) {
    result = result * sizes[i] + state[i];
  }
  return result;
};

