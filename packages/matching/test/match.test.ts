import { describe, expect, test } from "vitest";
import { match } from "../src/index";
import { pairScore } from "../src/score";
import { batch, double, EQUAL_WEIGHTS, student } from "./fixtures/build";
import { input as fiveApplicants } from "./fixtures/five-applicants";
import { input as fourStudents } from "./fixtures/four-students";
import { input as genderPolicy } from "./fixtures/gender-policy";
import { input as mutualPair } from "./fixtures/mutual-pair";
import { randomInput } from "./fixtures/random";
import { input as smokingDealBreaker } from "./fixtures/smoking-deal-breaker";
import { input as threeMutual } from "./fixtures/three-mutual";
import { input as undisclosed } from "./fixtures/undisclosed";
import { input as undisclosedGendered } from "./fixtures/undisclosed-gendered";

const rooms = (result: ReturnType<typeof match>) =>
  result.placements.map((p) => [p.roomId, ...p.members]);

test("four students fill two doubles by habit", () => {
  expect(match(fourStudents)).toEqual({
    mode: "batch",
    placements: [
      {
        roomId: "room-101",
        members: ["ana", "bea"],
        score: 97,
        top: ["wake", "cleanliness", "guests"],
        weakest: "noise",
      },
      {
        roomId: "room-102",
        members: ["cat", "dee"],
        score: 97,
        top: ["wake", "cleanliness", "noise"],
        weakest: "social",
      },
    ],
    dropped: [],
    unmatched: [],
  });
});

describe("roommate requests", () => {
  test("a mutual pair shares a room and a one-way request is ignored", () => {
    const result = match(mutualPair);
    expect(rooms(result)).toEqual([
      ["room-1", "mia", "noa"],
      ["room-2", "ola", "quin"],
      ["room-3", "pia", "rae"],
    ]);
    expect(result.dropped).toEqual([]);
  });

  test("a three-person mutual group with only doubles drops as too_large", () => {
    const result = match(threeMutual);
    expect(result.dropped).toEqual([
      { group: ["sam", "tom", "uri"], reason: "too_large" },
    ]);
    expect(rooms(result)).toEqual([
      ["room-1", "sam", "uri"],
      ["room-2", "tom", "vic"],
    ]);
  });

  test("a mixed pair facing female-only rooms drops as gender_policy", () => {
    const result = match(genderPolicy);
    expect(result.dropped).toEqual([
      { group: ["fay", "gus"], reason: "gender_policy" },
    ]);
    expect(rooms(result)).toEqual([["room-1", "fay", "hana"]]);
    expect(result.unmatched).toEqual(["gus"]);
  });

  test("a pair split by a smoking deal-breaker drops and never shares a room", () => {
    const result = match(smokingDealBreaker);
    expect(result.dropped).toEqual([
      { group: ["ivy", "jo"], reason: "deal_breaker" },
    ]);
    expect(rooms(result)).toEqual([
      ["room-1", "ivy", "kai"],
      ["room-2", "jo", "lu"],
    ]);
    expect(result.unmatched).toEqual([]);
  });
});

describe("rooms", () => {
  test("an undisclosed applicant takes the any room", () => {
    expect(rooms(match(undisclosed))).toEqual([
      ["room-1", "sue", "tia"],
      ["room-2", "ann", "ren"],
    ]);
  });

  test("an undisclosed applicant stays unmatched when every room is gendered", () => {
    const result = match(undisclosedGendered);
    expect(rooms(result)).toEqual([
      ["room-1", "sue", "tia"],
      ["room-2", "max", "ned"],
    ]);
    expect(result.unmatched).toEqual(["ren"]);
  });

  test("five applicants and two doubles leave one unmatched", () => {
    expect(match(fiveApplicants).unmatched).toEqual(["eli"]);
  });

  test("rooms larger than a double are rejected", () => {
    const triple = { ...double("room-3", "any"), capacity: 3 as const };
    expect(() => match(batch([student("a", "female")], [triple]))).toThrow(
      "invalid match input: room room-3 has capacity 3, only doubles are supported",
    );
  });
});

test("rating the conflicting category 3 lowers the pair score", () => {
  const early = student("a", "female", { sleep: "22:00" });
  const late = student("b", "female", { sleep: "01:00" });
  const caring = (s: typeof early) => ({
    ...s,
    importance: { sleep: 3 as const },
  });

  expect(pairScore(early, late, EQUAL_WEIGHTS)).toBe(95);
  expect(pairScore(caring(early), caring(late), EQUAL_WEIGHTS)).toBeCloseTo(
    92.857,
    3,
  );
});

test("the same input returns the same result", () => {
  const first = match(randomInput(200, 1));
  const second = match(randomInput(200, 1));
  expect(second).toEqual(first);
  expect([first.placements.length, first.unmatched.length]).toEqual([99, 2]);
});
