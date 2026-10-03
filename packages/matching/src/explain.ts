import { categoryTerms } from "./score.ts";
import type { Applicant, Category, Settings } from "./types.ts";

const TOP_COUNT = 3;

type Contribution = { category: Category; gained: number; lost: number };

function contributions(
  members: readonly Applicant[],
  settings: Settings,
): Contribution[] {
  const byCategory = new Map<Category, Contribution>();
  for (const [i, a] of members.entries()) {
    for (const b of members.slice(i + 1)) {
      for (const t of categoryTerms(a, b, settings)) {
        const c = byCategory.get(t.category) ?? {
          category: t.category,
          gained: 0,
          lost: 0,
        };
        c.gained += t.emphasis * t.similarity;
        c.lost += t.emphasis * (1 - t.similarity);
        byCategory.set(t.category, c);
      }
    }
  }
  return [...byCategory.values()];
}

/**
 * `top` holds up to three categories that add the most to the score, among
 * those the members at least partly share. `weakest` costs the score the most.
 */
export function explain(
  members: readonly Applicant[],
  settings: Settings,
): { top: Category[]; weakest: Category } {
  const all = contributions(members, settings);
  const top = all
    .filter((c) => c.gained > 0)
    .sort((x, y) => y.gained - x.gained)
    .slice(0, TOP_COUNT)
    .map((c) => c.category);
  const [weakest] = [...all].sort((x, y) => y.lost - x.lost);
  if (weakest === undefined) {
    throw new Error(
      "explain needs two members with a weighted, answered category",
    );
  }
  return { top, weakest: weakest.category };
}
