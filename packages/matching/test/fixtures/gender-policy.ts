import { batch, double, student } from "./build.ts";

/** fay and gus request each other, but every room is female-only. */
export const input = batch(
  [
    student("fay", "female", {}, { requested: ["gus"] }),
    student("gus", "male", {}, { requested: ["fay"] }),
    student("hana", "female"),
  ],
  [double("room-1", "female"), double("room-2", "female")],
);
