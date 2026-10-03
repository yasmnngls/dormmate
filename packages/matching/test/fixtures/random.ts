import { seededRandom } from "../../src/random.ts";
import {
  type Applicant,
  type BatchInput,
  CATEGORIES,
  type Gender,
  type GenderPolicy,
  type Room,
} from "../../src/types.ts";
import { double, EQUAL_WEIGHTS, student } from "./build.ts";

/** Uniform synthetic applicants and an even doubles inventory. Realistic distributions are a separate generator. */
export function randomInput(n: number, seed: number): BatchInput {
  const random = seededRandom(seed);
  const pick = <T>(options: readonly T[]): T =>
    options[Math.floor(random() * options.length)];
  const scale = () => pick([1, 2, 3, 4, 5] as const);
  const clock = (fromHour: number, hours: number) => {
    const half = Math.floor(random() * hours * 2);
    const total = (fromHour * 60 + half * 30) % 1440;
    return `${Math.floor(total / 60)}:${String(total % 60).padStart(2, "0")}`;
  };
  const genders: Gender[] = [
    "female",
    "female",
    "female",
    "female",
    "male",
    "male",
    "male",
    "male",
    "undisclosed",
  ];

  const ids = Array.from(
    { length: n },
    (_, i) => `s${String(i + 1).padStart(4, "0")}`,
  );
  const requests = new Map<string, string[]>();
  for (const id of ids) {
    if (random() >= 0.1) continue;
    const other = pick(ids);
    if (other === id) continue;
    requests.set(id, [...(requests.get(id) ?? []), other]);
    if (random() < 0.5)
      requests.set(other, [...(requests.get(other) ?? []), id]);
  }

  const applicants: Applicant[] = ids.map((id) =>
    student(
      id,
      pick(genders),
      {
        sleep: clock(21, 5),
        wake: clock(5, 5),
        cleanliness: scale(),
        noise: scale(),
        guests: scale(),
        study: scale(),
        schedule: pick(["morning", "afternoon", "evening"]),
        smoking: random() < 0.15 ? "yes" : "no",
        social: scale(),
        location: pick(["quiet", "central", "garden"]),
      },
      {
        dealBreakers: CATEGORIES.filter(() => random() < 0.05),
        importance: Object.fromEntries(
          CATEGORIES.filter(() => random() < 0.3).map((c) => [
            c,
            pick([1, 2, 3] as const),
          ]),
        ),
        requested: requests.get(id) ?? [],
      },
    ),
  );

  const policies: GenderPolicy[] = [
    "female",
    "female",
    "female",
    "female",
    "male",
    "male",
    "male",
    "male",
    "any",
  ];
  const rooms: Room[] = Array.from({ length: Math.ceil(n / 2) }, (_, i) =>
    double(`r${String(i + 1).padStart(4, "0")}`, policies[i % policies.length]),
  );
  return {
    mode: "batch",
    settings: EQUAL_WEIGHTS,
    applicants,
    rooms,
    locked: [],
  };
}
