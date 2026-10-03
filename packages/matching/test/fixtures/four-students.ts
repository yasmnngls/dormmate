import { batch, double, EARLY, LATE, student } from "./build";

export const input = batch(
  [
    student("ana", "female", EARLY),
    student("cat", "female", LATE),
    student("bea", "female", { ...EARLY, sleep: "22:30", noise: 2 }),
    student("dee", "female", { ...LATE, sleep: "00:30", social: 4 }),
  ],
  [double("room-101", "female"), double("room-102", "female")],
);
