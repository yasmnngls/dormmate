import { batch, double, EARLY, student } from "./build";

/** ren is undisclosed and most like ann, but only room-2 accepts any gender. */
export const input = batch(
  [
    student("ann", "female", EARLY),
    student("ren", "undisclosed", EARLY),
    student("sue", "female"),
    student("tia", "female"),
  ],
  [double("room-1", "female"), double("room-2", "any")],
);
