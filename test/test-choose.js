import choose from '../lib/choose';
import claim from 'claim';

describe('choose', function() {
  it('returns 0 for n < k', function() {
    claim.same(choose(1, 2), 0);
  });

  it('returns 1 for k = 0', function() {
    claim.same(choose(1, 0), 1);
    claim.same(choose(2, 0), 1);
    claim.same(choose(3, 0), 1);
    claim.same(choose(4, 0), 1);
  });
});
