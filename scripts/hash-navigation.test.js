const assert = require("node:assert/strict");
const { normalizeFragment } = require("./hash-navigation");

assert.equal(
    normalizeFragment("1️⃣ Creación del esquema"),
    "1creacindelesquema",
);
