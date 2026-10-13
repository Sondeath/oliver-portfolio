import test from "node:test";
import assert from "node:assert/strict";
import {
  readInquiry,
  validateInquiry,
  formatInquiry,
  draftUrl,
} from "../inquiry.js";
const data = (overrides) => {
  const form = new FormData();
  for (const [key, value] of Object.entries({
    name: "  Firma Test  ",
    email: "klient@example.com",
    description: "50 tričiek s logom na podujatie",
    ...overrides,
  }))
    form.set(key, value);
  return form;
};
test("combined request preserves detail and correctly encodes email", () => {
  const form = data({
    quantity: "50",
    deadline: "2026-11-30",
    company: "A&B",
    budget: "do 500 €",
  });
  form.append("services", "website");
  form.append("services", "textile");
  form.append("services", "textile");
  const value = readInquiry(form);
  assert.equal(value.name, "Firma Test");
  assert.deepEqual(value.services, ["website", "textile"]);
  assert.deepEqual(validateInquiry(value), {});
  const url = new URL(draftUrl(value));
  assert.equal(url.protocol, "mailto:");
  assert.equal(url.pathname, "libic.oliver@gmail.com");
  assert.equal(url.searchParams.get("body"), formatInquiry(value));
  assert.match(url.searchParams.get("body"), /30.11.2026/);
  assert.match(url.searchParams.get("body"), /A&B/);
});
test("switching away from products excludes stale quantity and date", () => {
  const form = data({ quantity: "999", deadline: "2026-11-30" });
  form.append("services", "website");
  const value = readInquiry(form);
  assert.equal(value.quantity, "");
  assert.equal(value.deadline, "");
  assert.doesNotMatch(formatInquiry(value), /999|30.11.2026/);
});
test("general request defaults to advice and rejects malformed contact fields", () => {
  const value = readInquiry(
    data({
      name: " ",
      email: "a@example.com\r\nBcc:attack@example.com",
      description: " ",
    }),
  );
  assert.deepEqual(value.services, ["advice"]);
  assert.deepEqual(Object.keys(validateInquiry(value)), [
    "name",
    "email",
    "description",
  ]);
});
test("invalid amounts, impossible dates and overlong content are rejected", () => {
  const form = data({
    quantity: "1.5",
    deadline: "2026-02-31",
    description: "x".repeat(5001),
  });
  form.append("services", "textile");
  assert.deepEqual(Object.keys(validateInquiry(readInquiry(form))), [
    "description",
    "quantity",
    "deadline",
  ]);
});
