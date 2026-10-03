import { batch, double, EARLY, LATE, student } from "./build";

/** mia and noa request each other despite opposite habits. ola's request for pia is one-way. */
export const input = batch(
  [
    student("mia", "female", EARLY, { requested: ["noa"] }),
    student("noa", "female", LATE, { requested: ["mia"] }),
    student("ola", "female", EARLY, { requested: ["pia"] }),
    student("pia", "female", LATE),
    student("quin", "female", EARLY),
    student("rae", "female", LATE),
  ],
  [double("room-1", "any"), double("room-2", "any"), double("room-3", "any")],
);
