const assert = require("node:assert/strict");
const { getActiveIndex, normalizeFragment } = require("./hash-navigation");

assert.equal(
    normalizeFragment("1️⃣ Creación del esquema"),
    "1creacindelesquema",
);

assert.equal(getActiveIndex([-420, -12, 160], 64), 1);
assert.equal(getActiveIndex([160, 420], 64), 0);
