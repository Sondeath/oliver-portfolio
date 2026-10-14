import test from "node:test";
import assert from "node:assert/strict";
import { scrollProgress, approach, workArrival } from "../motion.js";

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

test("hero-to-work handoff stays bounded, shares viewport timing and reverses", () => {
  assert.equal(workArrival(0, 1500, 1000), 0);
  assert.equal(workArrival(620, 1500, 1000), 0);
  assert.equal(workArrival(935, 1500, 1000), 0.5);
  assert.equal(workArrival(1250, 1500, 1000), 1);
  assert.equal(workArrival(2000, 1500, 1000), 1);
  assert.equal(workArrival(935, 1500, 1000), 0.5);
  assert.equal(workArrival(467.5, 750, 500), 0.5);
  assert.equal(workArrival(0, 0, 0), 1);
});
