import { fitsRoom, isEligiblePair } from "./eligibility";
import { explain } from "./explain";
import { seededRandom } from "./random";
import type { LockedGroup } from "./requests";
import { RoomPool } from "./rooms";
import { pairScore, roomScore } from "./score";
import type {
  Applicant,
  EnrollmentId,
  Placement,
  Room,
  Settings,
} from "./types";

const SWAP_SEED = 0x5eed;
const SWAP_ATTEMPTS_PER_ROOM = 1000;
const MAX_SWAP_ATTEMPTS = 2_000_000;
const IMPROVEMENT_EPSILON = 1e-9;

type Double = { room: Room; a: Applicant; b: Applicant; score: number };

function fitsBoth(a: Applicant, b: Applicant, room: Room): boolean {
  return fitsRoom(a, room) && fitsRoom(b, room);
}

/**
 * Best pairs first within each urgency. `any` rooms are the only rooms an
 * undisclosed member can take, so pairs with more undisclosed members go
 * first. The swap search wins back score afterwards without unseating anyone.
 */
function greedyDoubles(
  applicants: readonly Applicant[],
  pool: RoomPool,
  settings: Settings,
): Double[] {
  const candidates: {
    a: Applicant;
    b: Applicant;
    score: number;
    rank: number;
  }[] = [];
  for (let i = 0; i < applicants.length; i++) {
    const a = applicants[i];
    for (let j = i + 1; j < applicants.length; j++) {
      const b = applicants[j];
      if (!pool.canHouse([a, b]) || !isEligiblePair(a, b, settings)) continue;
      const score = pairScore(a, b, settings);
      const urgency =
        Number(a.gender === "undisclosed") + Number(b.gender === "undisclosed");
      candidates.push({ a, b, score, rank: urgency * 1000 + score });
    }
  }
  candidates.sort((x, y) => y.rank - x.rank);

  const placed = new Set<EnrollmentId>();
  const doubles: Double[] = [];
  for (const { a, b, score } of candidates) {
    if (placed.has(a.id) || placed.has(b.id)) continue;
    const room = pool.take([a, b]);
    if (room === undefined) continue;
    placed.add(a.id).add(b.id);
    doubles.push({ room, a, b, score });
  }
  return doubles;
}

function splitInto(
  d: Double,
  u: Applicant,
  v: Applicant,
  pool: RoomPool,
  settings: Settings,
): Double | undefined {
  for (const [p, q, r, s] of [
    [d.a, u, d.b, v],
    [d.a, v, d.b, u],
    [d.b, u, d.a, v],
    [d.b, v, d.a, u],
  ] as const) {
    if (!fitsBoth(p, q, d.room)) continue;
    if (!isEligiblePair(p, q, settings) || !isEligiblePair(r, s, settings))
      continue;
    const room = pool.take([r, s]);
    if (room === undefined) continue;
    Object.assign(d, { a: p, b: q, score: pairScore(p, q, settings) });
    return { room, a: r, b: s, score: pairScore(r, s, settings) };
  }
  return undefined;
}

/** Splits a placed pair to seat two unmatched applicants, because housing them beats a higher score. */
function seatStranded(
  doubles: Double[],
  unmatched: Applicant[],
  pool: RoomPool,
  settings: Settings,
): void {
  for (let i = 0; i < unmatched.length; i++) {
    for (let j = i + 1; j < unmatched.length; j++) {
      const [u, v] = [unmatched[i], unmatched[j]];
      if (!pool.canHouse([u]) && !pool.canHouse([v])) continue;
      let moved: Double | undefined;
      for (const d of doubles) {
        moved = splitInto(d, u, v, pool, settings);
        if (moved !== undefined) break;
      }
      if (moved === undefined) continue;
      doubles.push(moved);
      unmatched.splice(j, 1);
      unmatched.splice(i, 1);
      i--;
      break;
    }
  }
}

function trySwap(
  x: Double,
  y: Double,
  p: Applicant,
  q: Applicant,
  r: Applicant,
  s: Applicant,
  settings: Settings,
): boolean {
  let [roomPQ, roomRS] = [x.room, y.room];
  if (!fitsBoth(p, q, roomPQ) || !fitsBoth(r, s, roomRS)) {
    [roomPQ, roomRS] = [y.room, x.room];
    if (!fitsBoth(p, q, roomPQ) || !fitsBoth(r, s, roomRS)) return false;
  }
  if (!isEligiblePair(p, q, settings) || !isEligiblePair(r, s, settings))
    return false;
  const pq = pairScore(p, q, settings);
  const rs = pairScore(r, s, settings);
  if (pq + rs <= x.score + y.score + IMPROVEMENT_EPSILON) return false;
  Object.assign(x, { room: roomPQ, a: p, b: q, score: pq });
  Object.assign(y, { room: roomRS, a: r, b: s, score: rs });
  return true;
}

function improveBySwaps(doubles: Double[], settings: Settings): void {
  if (doubles.length < 2) return;
  const random = seededRandom(SWAP_SEED);
  const attempts = Math.min(
    MAX_SWAP_ATTEMPTS,
    SWAP_ATTEMPTS_PER_ROOM * doubles.length,
  );
  for (let n = 0; n < attempts; n++) {
    const x = doubles[Math.floor(random() * doubles.length)];
    const y = doubles[Math.floor(random() * doubles.length)];
    if (x === y) continue;
    const { a, b } = x;
    const { a: c, b: d } = y;
    if (!trySwap(x, y, a, c, b, d, settings))
      trySwap(x, y, a, d, b, c, settings);
  }
}

export function assign(
  applicants: readonly Applicant[],
  rooms: readonly Room[],
  locked: readonly LockedGroup[],
  settings: Settings,
): { placements: Placement[]; unmatched: EnrollmentId[] } {
  const applicantOrder = new Map(applicants.map((a, i) => [a.id, i]));
  const roomOrder = new Map(rooms.map((r, i) => [r.id, i]));
  const lockedRooms = new Set(locked.map((g) => g.room.id));
  const lockedMembers = new Set(
    locked.flatMap((g) => g.members.map((m) => m.id)),
  );
  const pool = new RoomPool(rooms.filter((r) => !lockedRooms.has(r.id)));
  const free = applicants.filter((a) => !lockedMembers.has(a.id));

  const doubles = greedyDoubles(free, pool, settings);
  const paired = new Set(doubles.flatMap((d) => [d.a.id, d.b.id]));
  seatStranded(
    doubles,
    free.filter((a) => !paired.has(a.id)),
    pool,
    settings,
  );
  improveBySwaps(doubles, settings);

  const filled: LockedGroup[] = [
    ...locked,
    ...doubles.map((d) => ({ room: d.room, members: [d.a, d.b] })),
  ];
  const placements = filled
    .sort(
      (x, y) =>
        (roomOrder.get(x.room.id) ?? 0) - (roomOrder.get(y.room.id) ?? 0),
    )
    .map(({ room, members }) => {
      const sorted = [...members].sort(
        (x, y) =>
          (applicantOrder.get(x.id) ?? 0) - (applicantOrder.get(y.id) ?? 0),
      );
      return {
        roomId: room.id,
        members: sorted.map((m) => m.id),
        score: Math.round(roomScore(sorted, settings)),
        ...explain(sorted, settings),
      };
    });

  const placed = new Set(filled.flatMap((g) => g.members.map((m) => m.id)));
  const unmatched = applicants
    .filter((a) => !placed.has(a.id))
    .map((a) => a.id);
  return { placements, unmatched };
}
