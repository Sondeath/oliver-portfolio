import test from "node:test";
import assert from "node:assert/strict";
import { scrollProgress, approach } from "../motion.js";

test("sticky timeline clamps before entry, reaches both endpoints and reverses", () => {
  assert.equal(scrollProgress(0, 100, 1800, 1000), 0);
  assert.equal(scrollProgress(100, 100, 1800, 1000), 0);
  assert.equal(scrollProgress(500, 100, 1800, 1000), 0.5);
  assert.equal(scrollProgress(900, 100, 1800, 1000), 1);
  assert.equal(scrollProgress(1600, 100, 1800, 1000), 1);
  assert.equal(scrollProgress(300, 100, 1800, 1000), 0.25);
  assert.equal(scrollProgress(300, 100, 800, 1000), 0);
});

test("motion damping has equivalent timing across refresh rates and settles", () => {
  let sixty = 0,
    hundredTwenty = 0;
  for (let i = 0; i < 30; i++) sixty = approach(sixty, 1, 1000 / 60);
  for (let i = 0; i < 60; i++)
    hundredTwenty = approach(hundredTwenty, 1, 1000 / 120);
  assert.ok(Math.abs(sixty - hundredTwenty) < 1e-9);
  for (let i = 0; i < 100; i++) sixty = approach(sixty, 1, 1000 / 60);
  assert.equal(sixty, 1);
  assert.equal(approach(0.5, 0, 0), 0.5);
});
