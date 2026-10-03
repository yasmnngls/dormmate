import type {
  Applicant,
  Category,
  CategoryAnswers,
  ChoiceAnswer,
  MinutesAnswer,
  ScaleAnswer,
} from "./types";

const DAY_MINUTES = 1440;
const MINUTES_HORIZON = 360;

function minutes(a: MinutesAnswer, b: MinutesAnswer): number {
  const gap = Math.abs(a.value - b.value);
  const circularGap = Math.min(gap, DAY_MINUTES - gap);
  return Math.max(0, 1 - circularGap / MINUTES_HORIZON);
}

function scale(a: ScaleAnswer, b: ScaleAnswer): number {
  return 1 - Math.abs(a.value - b.value) / 4;
}

function choice(a: ChoiceAnswer, b: ChoiceAnswer): number {
  return a.value === b.value ? 1 : 0;
}

const COMPARE: {
  [C in Category]: (a: CategoryAnswers[C], b: CategoryAnswers[C]) => number;
} = {
  sleep: minutes,
  wake: minutes,
  cleanliness: scale,
  noise: scale,
  guests: scale,
  study: scale,
  schedule: choice,
  smoking: choice,
  social: scale,
  location: choice,
};

export function similarity<C extends Category>(
  category: C,
  a: CategoryAnswers[C],
  b: CategoryAnswers[C],
): number {
  return COMPARE[category](a, b);
}

/** Similarity in `category`, or null when either applicant skipped it. */
export function answerSimilarity<C extends Category>(
  category: C,
  a: Applicant,
  b: Applicant,
): number | null {
  const left = a.answers[category];
  const right = b.answers[category];
  if (left === undefined || right === undefined) return null;
  return similarity(category, left, right);
}
