const assert = require("node:assert/strict");
const test = require("node:test");

const { chunkText } = require("../services/chunkGenerator");

test("preserves a short standalone note", () => {
  const note = "The support desk can reset a password during weekday office hours.";
  assert.deepEqual(chunkText(note).map((chunk) => chunk.text), [note]);
});

test("preserves a short final section after splitting a longer note", () => {
  const lead = "This handbook explains how to request workplace equipment. ".repeat(16).trim();
  const tail = "Orders must be approved by the office manager before the form is sent.";
  const chunks = chunkText(lead + " " + tail);
  assert.deepEqual(chunks.map((chunk) => chunk.text), [lead, tail]);
  assert.deepEqual(chunks.map((chunk) => chunk.chunk_index), [0, 1]);
});

test("preserves a short buffer before an oversized sentence without emitting an empty chunk", () => {
  const note = "An approved request is needed.";
  const long = "instruction ".repeat(100).trim() + ".";
  assert.deepEqual(chunkText(note + " " + long).map((chunk) => chunk.text), [note, long]);
});

test("whitespace alone does not produce a chunk", () => {
  assert.deepEqual(chunkText("  \n\r\t  "), []);
});
