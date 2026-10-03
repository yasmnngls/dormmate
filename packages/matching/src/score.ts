import { answerSimilarity } from "./similarity";
import {
  type Applicant,
  CATEGORIES,
  type Category,
  type Settings,
} from "./types";

const UNRATED_IMPORTANCE = 2;

/**
 * Rates every category, unrated ones at 2. Giving every importance object the
 * same keys in the same order keeps the scoring loop's property reads fast.
 */
export function withFullImportance(applicant: Applicant): Applicant {
  return {
    ...applicant,
    importance: Object.fromEntries(
      CATEGORIES.map((c) => [c, applicant.importance[c] ?? UNRATED_IMPORTANCE]),
    ),
  };
}

/** Weight times the pair's mean importance. */
function emphasis(
  category: Category,
  a: Applicant,
  b: Applicant,
  settings: Settings,
): number {
  const meanImportance =
    ((a.importance[category] ?? UNRATED_IMPORTANCE) +
      (b.importance[category] ?? UNRATED_IMPORTANCE)) /
    2;
  return settings.weights[category] * meanImportance;
}

export type CategoryTerm = {
  category: Category;
  similarity: number;
  emphasis: number;
};

export function categoryTerms(
  a: Applicant,
  b: Applicant,
  settings: Settings,
): CategoryTerm[] {
  const terms: CategoryTerm[] = [];
  for (const category of CATEGORIES) {
    if (settings.weights[category] === 0) continue;
    const s = answerSimilarity(category, a, b);
    if (s === null) continue;
    terms.push({
      category,
      similarity: s,
      emphasis: emphasis(category, a, b, settings),
    });
  }
  return terms;
}

/** The PRD pair score, 0 to 100. */
export function pairScore(
  a: Applicant,
  b: Applicant,
  settings: Settings,
): number {
  let weighted = 0;
  let total = 0;
  for (const category of CATEGORIES) {
    if (settings.weights[category] === 0) continue;
    const s = answerSimilarity(category, a, b);
    if (s === null) continue;
    const e = emphasis(category, a, b, settings);
    weighted += e * s;
    total += e;
  }
  return total === 0 ? 0 : (100 * weighted) / total;
}

export function roomScore(
  members: readonly Applicant[],
  settings: Settings,
): number {
  let sum = 0;
  let pairs = 0;
  for (const [i, a] of members.entries()) {
    for (const b of members.slice(i + 1)) {
      sum += pairScore(a, b, settings);
      pairs++;
    }
  }
  return pairs === 0 ? 0 : sum / pairs;
}
