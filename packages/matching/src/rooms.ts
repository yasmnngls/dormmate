import type { Applicant, GenderPolicy, Room } from "./types.ts";

const FEMALE_FIRST: readonly GenderPolicy[] = ["female", "any"];
const MALE_FIRST: readonly GenderPolicy[] = ["male", "any"];
const ANY_ONLY: readonly GenderPolicy[] = ["any"];

/** Gendered rooms come first so `any` rooms stay open for mixed and undisclosed groups. */
function policiesFor(members: readonly Applicant[]): readonly GenderPolicy[] {
  const gender = members[0]?.gender;
  if (!members.every((m) => m.gender === gender)) return ANY_ONLY;
  if (gender === "female") return FEMALE_FIRST;
  if (gender === "male") return MALE_FIRST;
  return ANY_ONLY;
}

export class RoomPool {
  readonly #free: Record<GenderPolicy, Room[]> = {
    female: [],
    male: [],
    any: [],
  };

  constructor(rooms: readonly Room[]) {
    for (const room of rooms) this.#free[room.genderPolicy].push(room);
  }

  take(members: readonly Applicant[]): Room | undefined {
    for (const policy of policiesFor(members)) {
      const rooms = this.#free[policy];
      const index = rooms.findIndex((r) => r.capacity >= members.length);
      if (index !== -1) return rooms.splice(index, 1)[0];
    }
    return undefined;
  }

  canHouse(members: readonly Applicant[]): boolean {
    return policiesFor(members).some((policy) =>
      this.#free[policy].some((r) => r.capacity >= members.length),
    );
  }
}
