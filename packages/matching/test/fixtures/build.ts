import {
  type Applicant,
  type BatchInput,
  type Category,
  enrollmentId,
  type Gender,
  type GenderPolicy,
  type Importance,
  type Room,
  roomId,
  type ScaleAnswer,
  type Settings,
} from "../../src/index";

type Scale = ScaleAnswer["value"];

export type Habits = {
  sleep: string;
  wake: string;
  cleanliness: Scale;
  noise: Scale;
  guests: Scale;
  study: Scale;
  schedule: string;
  smoking: string;
  social: Scale;
  location: string;
};

const TYPICAL: Habits = {
  sleep: "23:00",
  wake: "07:00",
  cleanliness: 3,
  noise: 3,
  guests: 3,
  study: 3,
  schedule: "morning",
  smoking: "no",
  social: 3,
  location: "quiet",
};

function minutes(clock: string): number {
  const [hours, mins] = clock.split(":").map(Number);
  return hours * 60 + mins;
}

export function student(
  id: string,
  gender: Gender,
  habits: Partial<Habits> = {},
  options: {
    dealBreakers?: Category[];
    importance?: Partial<Record<Category, Importance>>;
    requested?: string[];
  } = {},
): Applicant {
  const h = { ...TYPICAL, ...habits };
  return {
    id: enrollmentId(id),
    gender,
    answers: {
      sleep: { kind: "minutes", value: minutes(h.sleep) },
      wake: { kind: "minutes", value: minutes(h.wake) },
      cleanliness: { kind: "scale", value: h.cleanliness },
      noise: { kind: "scale", value: h.noise },
      guests: { kind: "scale", value: h.guests },
      study: { kind: "scale", value: h.study },
      schedule: { kind: "choice", value: h.schedule },
      smoking: { kind: "choice", value: h.smoking },
      social: { kind: "scale", value: h.social },
      location: { kind: "choice", value: h.location },
    },
    dealBreakers: new Set(options.dealBreakers),
    importance: options.importance ?? {},
    requested: (options.requested ?? []).map(enrollmentId),
  };
}

export function double(id: string, genderPolicy: GenderPolicy): Room {
  return { id: roomId(id), capacity: 2, genderPolicy, occupants: [] };
}

export const EQUAL_WEIGHTS: Settings = {
  weights: {
    sleep: 1,
    wake: 1,
    cleanliness: 1,
    noise: 1,
    guests: 1,
    study: 1,
    schedule: 1,
    smoking: 1,
    social: 1,
    location: 1,
  },
  dealBreakerThreshold: 0.5,
};

export function batch(
  applicants: readonly Applicant[],
  rooms: readonly Room[],
): BatchInput {
  return {
    mode: "batch",
    settings: EQUAL_WEIGHTS,
    applicants,
    rooms,
    locked: [],
  };
}

export const EARLY: Partial<Habits> = {
  sleep: "22:00",
  wake: "06:00",
  cleanliness: 5,
  noise: 1,
  social: 2,
};

export const LATE: Partial<Habits> = {
  sleep: "01:00",
  wake: "10:00",
  cleanliness: 1,
  noise: 5,
  social: 5,
  schedule: "afternoon",
};
