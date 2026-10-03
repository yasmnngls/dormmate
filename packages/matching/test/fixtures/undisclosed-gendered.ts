import { batch, double, student } from "./build.ts";

/** ren is undisclosed and every room is gendered. */
export const input = batch(
  [
    student("ren", "undisclosed"),
    student("sue", "female"),
    student("tia", "female"),
    student("max", "male"),
    student("ned", "male"),
  ],
  [double("room-1", "female"), double("room-2", "male")],
);
