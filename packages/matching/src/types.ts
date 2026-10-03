export type EnrollmentId = string & { readonly __brand: "EnrollmentId" };
export type RoomId = string & { readonly __brand: "RoomId" };

export function enrollmentId(value: string): EnrollmentId {
  if (value.length === 0) throw new Error("enrollment id must not be empty");
  return value as EnrollmentId;
}

export function roomId(value: string): RoomId {
  if (value.length === 0) throw new Error("room id must not be empty");
  return value as RoomId;
}

export const CATEGORIES = [
  "sleep",
  "wake",
  "cleanliness",
  "noise",
  "guests",
  "study",
  "schedule",
  "smoking",
  "social",
  "location",
] as const;

export type Category = (typeof CATEGORIES)[number];

/** Minutes after midnight, 0 to 1439. */
export type MinutesAnswer = { kind: "minutes"; value: number };
export type ScaleAnswer = { kind: "scale"; value: 1 | 2 | 3 | 4 | 5 };
export type ChoiceAnswer = { kind: "choice"; value: string };
export type Answer = MinutesAnswer | ScaleAnswer | ChoiceAnswer;

export type CategoryAnswers = {
  sleep: MinutesAnswer;
  wake: MinutesAnswer;
  cleanliness: ScaleAnswer;
  noise: ScaleAnswer;
  guests: ScaleAnswer;
  study: ScaleAnswer;
  schedule: ChoiceAnswer;
  smoking: ChoiceAnswer;
  social: ScaleAnswer;
  location: ChoiceAnswer;
};

export type Importance = 1 | 2 | 3;
export type Gender = "female" | "male" | "undisclosed";
export type GenderPolicy = "female" | "male" | "any";

export type Applicant = {
  id: EnrollmentId;
  gender: Gender;
  answers: Partial<CategoryAnswers>;
  dealBreakers: ReadonlySet<Category>;
  importance: Partial<Record<Category, Importance>>;
  requested: readonly EnrollmentId[];
};

export type Room = {
  id: RoomId;
  capacity: 2 | 3 | 4;
  genderPolicy: GenderPolicy;
  occupants: readonly Applicant[];
};

export type Settings = {
  weights: Record<Category, number>;
  dealBreakerThreshold: number;
};

export type Placement = {
  roomId: RoomId;
  members: readonly EnrollmentId[];
  score: number;
  top: Category[];
  weakest: Category;
};

export type DropReason =
  | "too_large"
  | "gender_policy"
  | "deal_breaker"
  | "not_eligible"
  | "no_room_of_size";

export type Drop = { group: EnrollmentId[]; reason: DropReason };

export type MatchInput =
  | {
      mode: "batch";
      settings: Settings;
      applicants: readonly Applicant[];
      rooms: readonly Room[];
      locked: readonly Placement[];
    }
  | {
      mode: "openBed";
      settings: Settings;
      applicants: readonly Applicant[];
      room: Room;
    };

export type MatchResult =
  | {
      mode: "batch";
      placements: Placement[];
      dropped: Drop[];
      unmatched: EnrollmentId[];
    }
  | { mode: "openBed"; ranked: { id: EnrollmentId; score: number | null }[] };

export type BatchInput = Extract<MatchInput, { mode: "batch" }>;
export type BatchResult = Extract<MatchResult, { mode: "batch" }>;
