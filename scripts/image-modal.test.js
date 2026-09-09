const assert = require("node:assert/strict");
const { getAdjacentIndex } = require("./image-modal");

assert.equal(getAdjacentIndex(0, 3, -1), -1);
assert.equal(getAdjacentIndex(1, 3, -1), 0);
assert.equal(getAdjacentIndex(1, 3, 1), 2);
assert.equal(getAdjacentIndex(2, 3, 1), -1);
