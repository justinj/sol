import assert from 'assert';

// TODO: this is almost certainly provided by assert, but I don't have internet to check :<
export default function(msg, block) {
  var threw = false;
  try {
    block();
  } catch (e) {
    threw = true;
    assert.equal(e.message, msg);
  }
  if (!threw) {
    assert(false, "Block\n" + block.toString() + "\ndid not throw.");
  }
};

