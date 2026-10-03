import { assign } from "./assign";
import { requestGroups } from "./requests";
import { withFullImportance } from "./score";
import {
  type BatchInput,
  type BatchResult,
  CATEGORIES,
  type MinutesAnswer,
} from "./types";

function duplicates(ids: readonly string[]): string[] {
  const seen = new Set<string>();
  return ids.filter((id) => seen.has(id) || !seen.add(id));
}

function isMinuteOfDay(answer: MinutesAnswer | undefined): boolean {
  return (
    answer === undefined ||
    (Number.isInteger(answer.value) && answer.value >= 0 && answer.value < 1440)
  );
}

/** The loader owns eligibility and profile completeness. These checks reject input where it did not. */
function inputIssues({
  settings,
  applicants,
  rooms,
  locked,
}: BatchInput): string[] {
  const issues: string[] = [];
  const { weights, dealBreakerThreshold } = settings;
  if (!(dealBreakerThreshold >= 0 && dealBreakerThreshold <= 1))
    issues.push(
      `dealBreakerThreshold ${dealBreakerThreshold} is outside 0 to 1`,
    );
  for (const c of CATEGORIES)
    if (!(Number.isFinite(weights[c]) && weights[c] >= 0))
      issues.push(`weight for ${c} must be a finite number of at least 0`);
  const weighted = CATEGORIES.filter((c) => weights[c] > 0);
  if (weighted.length === 0) issues.push("at least one weight must be above 0");

  for (const id of duplicates(applicants.map((a) => a.id)))
    issues.push(`applicant ${id} appears twice`);
  for (const id of duplicates(rooms.map((r) => r.id)))
    issues.push(`room ${id} appears twice`);
  for (const a of applicants) {
    const missing = weighted.filter((c) => a.answers[c] === undefined);
    if (missing.length > 0)
      issues.push(`applicant ${a.id} has no answer for ${missing.join(", ")}`);
    if (!isMinuteOfDay(a.answers.sleep) || !isMinuteOfDay(a.answers.wake))
      issues.push(`applicant ${a.id} has a time outside 0 to 1439 minutes`);
  }

  for (const r of rooms) {
    if (r.capacity !== 2)
      issues.push(
        `room ${r.id} has capacity ${r.capacity}, only doubles are supported`,
      );
    if (r.occupants.length > 0)
      issues.push(`room ${r.id} has occupants, batch mode needs empty rooms`);
  }
  if (locked.length > 0) issues.push("locked placements are not supported yet");
  return issues;
}

export function match(input: BatchInput): BatchResult {
  const issues = inputIssues(input);
  if (issues.length > 0)
    throw new Error(`invalid match input: ${issues.join("; ")}`);

  const { settings, rooms } = input;
  const applicants = input.applicants.map(withFullImportance);
  const { locked, dropped } = requestGroups(applicants, rooms, settings);
  const { placements, unmatched } = assign(applicants, rooms, locked, settings);
  return { mode: "batch", placements, dropped, unmatched };
}
