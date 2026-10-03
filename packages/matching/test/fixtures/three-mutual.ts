import { batch, double, EARLY, LATE, student } from "./build";

/** Three students who all request each other, with doubles only. */
export const input = batch(
  [
    student("sam", "male", EARLY, { requested: ["tom", "uri"] }),
    student("tom", "male", LATE, { requested: ["sam", "uri"] }),
    student("uri", "male", EARLY, { requested: ["sam", "tom"] }),
    student("vic", "male", LATE),
  ],
  [double("room-1", "male"), double("room-2", "male")],
);
