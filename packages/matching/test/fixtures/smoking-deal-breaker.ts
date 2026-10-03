import { batch, double, EARLY, LATE, student } from "./build.ts";

/** ivy and jo match on every habit but smoking, which ivy marks as a deal-breaker. */
export const input = batch(
  [
    student("ivy", "female", EARLY, {
      dealBreakers: ["smoking"],
      requested: ["jo"],
    }),
    student(
      "jo",
      "female",
      { ...EARLY, smoking: "yes" },
      { requested: ["ivy"] },
    ),
    student("kai", "female", LATE),
    student("lu", "female", { ...LATE, smoking: "yes" }),
  ],
  [double("room-1", "any"), double("room-2", "any")],
);
