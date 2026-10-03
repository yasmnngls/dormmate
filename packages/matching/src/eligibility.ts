import { answerSimilarity } from "./similarity";
import type { Applicant, Room, Settings } from "./types";

function passesDealBreakers(
  holder: Applicant,
  other: Applicant,
  settings: Settings,
): boolean {
  if (holder.dealBreakers.size === 0) return true;
  for (const category of holder.dealBreakers) {
    const s = answerSimilarity(category, holder, other);
    if (s !== null && s < settings.dealBreakerThreshold) return false;
  }
  return true;
}

export function isEligiblePair(
  a: Applicant,
  b: Applicant,
  settings: Settings,
): boolean {
  return (
    passesDealBreakers(a, b, settings) && passesDealBreakers(b, a, settings)
  );
}

/** An undisclosed gender never equals a gendered policy, so it fits only `any` rooms. */
export function fitsRoom(applicant: Applicant, room: Room): boolean {
  return room.genderPolicy === "any" || room.genderPolicy === applicant.gender;
}
