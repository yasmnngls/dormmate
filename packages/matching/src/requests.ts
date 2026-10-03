import { fitsRoom, isEligiblePair } from "./eligibility";
import { RoomPool } from "./rooms";
import type { Applicant, Drop, DropReason, Room, Settings } from "./types";

export type LockedGroup = { members: readonly Applicant[]; room: Room };

function mutualComponents(applicants: readonly Applicant[]): Applicant[][] {
  const index = new Map(applicants.map((a, i) => [a.id, i]));
  const parent = applicants.map((_, i) => i);
  const find = (i: number): number => {
    let root = i;
    while (parent[root] !== root) root = parent[root];
    return root;
  };

  for (const [i, a] of applicants.entries()) {
    for (const id of a.requested) {
      const j = index.get(id);
      if (j === undefined || j === i) continue;
      if (!applicants[j].requested.includes(a.id)) continue;
      const [ri, rj] = [find(i), find(j)];
      parent[Math.max(ri, rj)] = Math.min(ri, rj);
    }
  }

  const components = new Map<number, Applicant[]>();
  for (const [i, a] of applicants.entries()) {
    const root = find(i);
    const members = components.get(root);
    if (members) members.push(a);
    else components.set(root, [a]);
  }
  return [...components.values()].filter((members) => members.length > 1);
}

function everyPairEligible(
  members: readonly Applicant[],
  settings: Settings,
): boolean {
  return members.every((a, i) =>
    members.slice(i + 1).every((b) => isEligiblePair(a, b, settings)),
  );
}

export function requestGroups(
  applicants: readonly Applicant[],
  rooms: readonly Room[],
  settings: Settings,
): { locked: LockedGroup[]; dropped: Drop[] } {
  const pool = new RoomPool(rooms);
  const locked: LockedGroup[] = [];
  const dropped: Drop[] = [];

  for (const members of mutualComponents(applicants)) {
    const bigEnough = rooms.filter((r) => r.capacity >= members.length);
    let reason: DropReason | null = null;
    if (bigEnough.length === 0) reason = "too_large";
    else if (!everyPairEligible(members, settings)) reason = "deal_breaker";
    else if (!bigEnough.some((r) => members.every((m) => fitsRoom(m, r))))
      reason = "gender_policy";

    const room = reason === null ? pool.take(members) : undefined;
    if (room !== undefined) locked.push({ members, room });
    else
      dropped.push({
        group: members.map((m) => m.id),
        reason: reason ?? "no_room_of_size",
      });
  }
  return { locked, dropped };
}
