import puz from '../lib/two';
import solve from '../lib/solve';

for (var i = 0; i < 100; i++) {
  solve({
    puz, 
    state: {
      perm: [0, 2, 1, 3, 4, 5, 6],
      orie: {
        orie: [0, 2, 1, 0, 0, 0, 0],
        perm: [0, 1, 2, 3, 4, 5, 6]
      }
    }
  });
}
