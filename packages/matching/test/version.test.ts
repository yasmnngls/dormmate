import { expect, test } from "vitest";
import { ENGINE_VERSION } from "../src/index";

test("engine version is 0.1.0", () => {
  expect(ENGINE_VERSION).toBe("0.1.0");
});
