import { batch, double, EARLY, LATE, student } from "./build";

export const input = batch(
  [
    student("ada", "male", EARLY),
    student("bo", "male", LATE),
    student("cy", "male", EARLY),
    student("dan", "male", LATE),
    student("eli", "male", { sleep: "03:00", wake: "12:00", social: 1 }),
  ],
  [double("room-1", "male"), double("room-2", "male")],
);
