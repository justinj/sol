import axesFollowups from '../lib/axes-followups';
import claim from 'claim';

describe("axesFollowups", function() {
  it("creates a followups object from a list of axes", function() {
    claim.same(
      axesFollowups([
        ["F", "F2", "F'"],
        ["R", "R2", "R'"],
        ["U", "U2", "U'"]
      ]),
      [ [ '3', '4', '5', '6', '7', '8' ],
        [ '3', '4', '5', '6', '7', '8' ],
        [ '3', '4', '5', '6', '7', '8' ],
        [ '0', '1', '2', '6', '7', '8' ],
        [ '0', '1', '2', '6', '7', '8' ],
        [ '0', '1', '2', '6', '7', '8' ],
        [ '0', '1', '2', '3', '4', '5' ],
        [ '0', '1', '2', '3', '4', '5' ],
        [ '0', '1', '2', '3', '4', '5' ],
        [ 0, 1, 2, 3, 4, 5, 6, 7, 8 ] ]
    );
  });
});
