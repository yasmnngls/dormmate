# DormMate v1 build plan

This plan builds DormMate from an empty repository to Gate 1, a dorm dry run end to end with every P0 requirement in the PRD.
It serves dorm owners, managers and students first, and the next engineer second, who inherits a tested engine, a row-level security model and one Next.js app.
The rule it enforces is that nothing enters the stack until its unit, live and perf evidence exists at the exact head SHA.
Phase 0 is DM-01 to DM-07. Phase 1 is DM-08 to DM-22.
The PRs land in this order. DM-01, DM-02, DM-03, DM-04, DM-05, DM-06, DM-07, DM-08, DM-09, DM-10, DM-11, DM-12, DM-13, DM-14, DM-15, DM-16, DM-17, DM-18, DM-19, DM-20, DM-21, DM-22.
Phases 2 to 4 (pilot, paid launch and P1, university pilot) get their own plan after Gate 1, because pilot feedback decides their shape.

## How to read this

One box is one unit of work. Every box names the evidence that checks it. A nested box is a sub-step of the box above it. Check a box only when its evidence exists, a file, a log line, a screenshot, a test run, or a SHA. The body is a how-to. The appendices explain and record.

The program runs `pstack/skills/poteto-mode/playbooks/autopilot-stack.md`, because the PRs are sequenced and coupled and Yhasmen Nogales lands every PR. The root appends verified PRs to one linear stack on `main`. Every PR, DM-01 to DM-22, is the operator's item and stops at STACK-READY. Yhasmen Nogales reviews and lands the stack bottom-up.

Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

Every commit, PR, `package.json` author field and license names Yhasmen Nogales (`yhasmennogales04@gmail.com`) per `.cursor/rules/authorship.mdc`, with no AI co-author trailers.

## Program checklist

### Arm the program

- [ ] State the protocol and this plan to the operator, then stop. Start execution only on the operator's explicit go.
- [ ] Bootstrap trunk. Commit `docs/` and `.cursor/rules/authorship.mdc` as Yhasmen Nogales on `main` and push to `https://github.com/yasmnngls/dormmate`. Evidence is `git log origin/main --format='%an %ae'`.
- [ ] Confirm accounts the operator owns exist. Vercel Pro, Supabase Pro (staging and production projects in `ap-southeast-1`), Resend with a verified sending domain, Sentry, PostHog. Evidence is a chat message from the operator naming each.
- [ ] On the operator's go, arm a `/goal` with this exact text. "Build docs/build-plan.md PRs DM-01 to DM-22 in order as one linear stack on main under autopilot-stack. A PR is verified only when its unit, live, and perf boxes are all checked. Yhasmen Nogales lands every PR and no agent merges. Done when DM-22 is STACK-READY with a clean verdict and the Gate 1 dry run evidence is posted in chat."
- [ ] Read these at program start. Re-read them at every tick.
  - [ ] `git show origin/main:docs/build-plan.md`
  - [ ] `git show origin/main:docs/system-architecture.md`
  - [ ] `git show origin/main:.cursor/rules/authorship.mdc`
  - [ ] The local pstack copies of `skills/poteto-mode/playbooks/autopilot-stack.md`, `skills/poteto-mode/playbooks/opening-a-pr.md`, `skills/poteto-mode/playbooks/shipping.md` and `skills/swarm/SKILL.md`
  - [ ] The `control-ui` and `control-cli` skills from `cursor-team-kit`
- [ ] Arm the 30-minute audit tick. In a local session, a real terminal `/loop`. In a cloud root, a cloud-sleeper wake chain. Never leave the cadence to memory.
- [ ] Use this tick prompt, verbatim. "Re-read the execution playbook from trunk and the armed /goal. Audit the operation against both and fix drift in this tick. Probe every active lane and judge progress by side effects only. Stand down a stuck lane and dispatch its replacement now. Then post a short status message to the operator in chat only when the audit found a tracked change that no earlier status message reported, such as a PR opened, a code-ready head, a round launched or closed, a verdict, a merge, a stuck agent and the action taken, a blocker added or cleared, or a decision only the operator can make. Name every such change and nothing else. Do not repeat a table, the merged list, or an unchanged blocker. If the audit found none, end the turn with no reply text. Either way, log this tick's row in your decision trail. The row names the items reported, or none."
- [ ] On the operator's hold or stand-down, send every owner a zero-writes order at once.

### Spawn owners

- [ ] Spawn one owner per PR with the full lifecycle the execution playbook names. Owners use `subagent_type` `poteto-agent`. DM-02, DM-03, DM-05, DM-15, DM-16 and DM-18 run on the strongest judgment model available. The rest run on the fast code model.
- [ ] Follow this dependency graph. Build in parallel where the graph allows. Base each branch on its stack parent.
  - [ ] DM-01 is first and branches from `main`.
  - [ ] DM-02 after DM-01. DM-03 after DM-02. DM-04 after DM-03.
  - [ ] DM-05 after DM-01. It builds in parallel with DM-02 to DM-04 and stacks after DM-04.
  - [ ] DM-06 after DM-05. DM-07 after DM-04 and DM-06.
  - [ ] DM-08 after DM-06. DM-09 after DM-08. DM-10 after DM-09. DM-11 after DM-10. DM-12 after DM-11. DM-13 after DM-12.
  - [ ] DM-14 after DM-09 and DM-11. DM-15 after DM-07, DM-13 and DM-14. DM-16 after DM-15. DM-17 after DM-16.
  - [ ] DM-18 after DM-16 and DM-17. DM-19 after DM-16. DM-20 after DM-18. DM-21 after DM-08. DM-22 after every other PR.
- [ ] Hold the file boundaries. DM-02 to DM-04 touch only `packages/matching/**`. DM-05 owns `supabase/migrations/*_foundation.sql`. Every later PR adds its own migration file and never edits an earlier one. The root renames migration timestamps to stack order when it appends.
- [ ] Hold the review gate. DM-06 and DM-08 to DM-22 change an interaction. They wait for the operator's review in chat with screenshots and a video before they land.

### PR mechanics, for every PR

- [ ] Resolve the forge once. Default to `gh`; if `command -v origin` succeeds and Origin can resolve the repository, use `origin pr` for every PR operation. Record any fallback to `gh`. Never require `gt`.
- [ ] Open the PR ready, never draft, with `origin pr create --status open --base <base-branch>` or `gh pr create --base <base-branch>` according to the resolved forge. A stack child targets its parent branch.
- [ ] Run `pnpm check` and `pnpm typecheck` once before the PR-facing push. Push with hooks on.
- [ ] Run `/deslop` before each commit and `/no-comments` before review.
- [ ] Triage every Bugbot and security-reviewer comment per `../references/bugbot-triage.md`.
- [ ] Rebase onto current trunk before the code-ready report and babysit. Keep that merge base in fix rounds. Rebase again only at merge prep, on a `git merge-tree` conflict with trunk, or on a CI failure that comes from a change on trunk.
- [ ] Author every commit as `Yhasmen Nogales <yhasmennogales04@gmail.com>`. Evidence is `git log --format='%an %ae %b'` with no trailer lines.

### Verdict and merge, for every PR

- [ ] At the code-ready head SHA and at each later push that changes the patch, run the swarm per `pstack/skills/swarm/SKILL.md`. One gates lane. The ten live lanes from the PR's **Verify, live** block. The perf lane from its **Verify, perf** block. Two or more audit lanes, each with its own focus, that read the diff and the receipts and distrust the PR body. The root audits the receipts in the merge-ready report before the verdict.
- [ ] Clean only when every lane is `PASS`. Findings go back to the owner, including a defect that a lane filed as a note. A new head gets a fresh swarm and a fresh verdict, except for results that stay valid under the patch-id rule in `playbooks/shipping.md`.
- [ ] On a clean verdict the root appends the PR to the linear stack on `main` and never merges. A rebase that keeps the patch-id keeps the verdict under the patch-id rule in `playbooks/shipping.md`. Any other rewrite gets a fresh swarm. Yhasmen Nogales lands the stack bottom-up.

### Boot recipe, for every live lane

Each live lane runs on its own cloud VM at the PR head. Drive through `control-ui` or `control-cli` from `cursor-team-kit`.

- [ ] `git fetch origin <head-branch> && git checkout <head SHA>`.
- [ ] Run `corepack enable && pnpm install --frozen-lockfile`. From DM-05 on, run `pnpm supabase start` and `pnpm supabase db reset`. From DM-06 on, run `pnpm --filter web build && pnpm --filter web start` and wait until `curl -sf http://localhost:3000/login` returns 200.
- [ ] Deliver input only through the control skill's commands. Read-only diagnostics are `psql` selects against the local stack, the Mailpit inbox at `http://localhost:54324`, the `next start` server log, and `pnpm supabase status`.
- [ ] Save every screenshot to `/tmp/swarm-<pr-id>/worker-<n>/<slug>.png` and return the paths with the report.

## Scaffold the workspace and CI (DM-01)

**Depends on.** None.

**Files.**

- [ ] Create `package.json`, `pnpm-workspace.yaml`, `biome.json`, `tsconfig.base.json`, `.nvmrc`, `.gitignore` and `LICENSE`.
- [ ] Create `apps/web/` with `package.json`, `next.config.ts`, `app/layout.tsx`, `app/page.tsx`, `i18n/request.ts` and `messages/en.json`.
- [ ] Create `packages/matching/package.json`, `packages/matching/src/index.ts` and `packages/matching/test/version.test.ts`.
- [ ] Create `.github/workflows/ci.yml`.

**Build.**

- [ ] Pin `packageManager` to pnpm 12 and Node 24 in root `package.json`, with scripts `check` (Biome), `typecheck` (`tsc -b`) and `test` (Vitest).
- [ ] Scaffold Next.js 16, React 19, TypeScript 6, Tailwind CSS 4, shadcn/ui and next-intl 4 in `apps/web` with one localized home page.
- [ ] Export `ENGINE_VERSION` from `packages/matching/src/index.ts` and import it in `apps/web/app/page.tsx` to prove the workspace link.
- [ ] Add the CI job in `ci.yml` that runs install, `biome ci`, typecheck and test on every pull request.

**You see.**

- [ ] `pnpm check && pnpm typecheck && pnpm test` exits 0 locally and the GitHub Actions run on the PR is green.
- [ ] `http://localhost:3000/` renders the English message from `messages/en.json` and the engine version string.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `packages/matching/test/version.test.ts` asserts `ENGINE_VERSION` equals the literal `"0.1.0"`. Run `pnpm test`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high-fast` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Run `pnpm install` at trunk and head. Trunk lacks a workspace, so record that and gate the head install plus `pnpm test`. Save `dm01-install.png`. Pass when head exits 0 and trunk is recorded as having no `package.json`.
- [ ] Lane 2. Run `pnpm --filter web dev` and open `/` through `control-ui`. Save `dm01-home.png`. Pass when the page shows the English greeting and `0.1.0`.
- [ ] Lane 3. Run `pnpm --filter web build`. Save `dm01-build.png`. Pass when the build exits 0 with no type errors.
- [ ] Lane 4. Add a misformatted scratch file and run `pnpm check`. Save `dm01-biome.png`. Pass when Biome exits non-zero and names the file.
- [ ] Lane 5. Inject a type error in `apps/web/app/page.tsx` and run `pnpm typecheck`. Save `dm01-tsc.png`. Pass when `tsc` exits non-zero and names the line.
- [ ] Lane 6. Change the expected version in the test and run `pnpm test`. Save `dm01-vitest.png`. Pass when Vitest fails on that assertion.
- [ ] Lane 7. Run `gh pr checks <pr>`. Save `dm01-ci.png`. Pass when every check is green.
- [ ] Lane 8. Run `git log --format='%an %ae %b' origin/main..HEAD`. Save `dm01-author.png`. Pass when every line names Yhasmen Nogales and no trailer appears.
- [ ] Lane 9. Clone fresh, run `corepack enable` and `pnpm --version`. Save `dm01-pnpm.png`. Pass when the version matches `packageManager`.
- [ ] Lane 10. Run `pnpm --filter web start` after build and request `/` and one `/_next/static` asset. Save `dm01-start.png`. Pass when both return 200.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Wall time of `pnpm check && pnpm typecheck && pnpm test` on a warm install, and the CI job duration. Trunk has no workspace, so both are absolute budgets for the work the diff adds.
- [ ] Probe. Run the command five times on the lane VM and read the CI duration from `gh run view`.
- [ ] Baseline. Record that trunk cannot run the command because it has no `package.json`.
- [ ] Rule. Fail when the median local run exceeds 60 seconds or the CI job exceeds 5 minutes.

**Review gate.** None. DM-01 is not review-gated.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends DM-01 to the base-branch stack and Yhasmen Nogales lands it bottom-up.

## Build the engine contract and the double-room pipeline (DM-02)

**Depends on.** DM-01.

**Files.**

- [ ] Create `packages/matching/src/types.ts`, `similarity.ts`, `eligibility.ts`, `requests.ts`, `score.ts`, `assign.ts`, `explain.ts` and `match.ts`.
- [ ] Edit `packages/matching/src/index.ts`.
- [ ] Create `packages/matching/test/fixtures/four-students.ts` and `packages/matching/test/match.test.ts`.
- [ ] Create `packages/matching/scripts/run.ts`.

**Build.**

- [ ] Copy the `MatchInput` and `MatchResult` types from `docs/system-architecture.md` into `types.ts`, with `enrollmentId()` and `roomId()` as the only brand constructors.
- [ ] Write `similarity(category, a, b)` in `similarity.ts` for minutes, scale and choice answers, each returning a value in 0 to 1.
- [ ] Write `isEligiblePair` in `eligibility.ts`. It prunes a pair when a marked deal-breaker category scores below `settings.dealBreakerThreshold`, and it fits `undisclosed` gender only to `any` rooms.
- [ ] Write `requestGroups` in `requests.ts` as connected components of mutual edges, returning locked groups and drops with a `DropReason`.
- [ ] Write `pairScore` in `score.ts` with the PRD formula, unrated importance counting as 2.
- [ ] Write greedy best-pair assignment and swap local search for capacity 2 in `assign.ts`, seeded so the same input returns the same result.
- [ ] Write `explain` in `explain.ts` returning the top shared categories and the weakest one.
- [ ] Write `scripts/run.ts` that reads a fixture name or `--random <n> --seed <s>` and prints the `MatchResult` as JSON.

**You see.**

- [ ] `pnpm --filter @dormmate/matching run fixture four-students` prints two rooms with literal members, scores, top traits and weakest trait.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `match.test.ts` asserts literal rooms for the four-student fixture. Run `pnpm --filter @dormmate/matching test`.
- [ ] `match.test.ts` asserts a mutual pair is placed together and a one-way request is ignored.
- [ ] `match.test.ts` asserts a three-person mutual group with only doubles drops with `too_large`.
- [ ] `match.test.ts` asserts literal drops for `gender_policy` and `deal_breaker`.
- [ ] `match.test.ts` asserts an `undisclosed` applicant lands only in an `any` room.
- [ ] `match.test.ts` asserts the literal score for a pair where both rate a category 3 against the same pair with no ratings.
- [ ] `match.test.ts` asserts two runs on the same input are deeply equal.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high-fast` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Run the four-student fixture at trunk and head. Trunk lacks the engine, so record that and gate the head output. Save `dm02-fixture.png`. Pass when head prints the same two rooms as the unit test.
- [ ] Lane 2. Run `--random 200 --seed 1` twice. Save `dm02-determinism.png`. Pass when the two JSON outputs are byte-identical.
- [ ] Lane 3. Run a fixture with a mutual pair and a stranger. Save `dm02-mutual.png`. Pass when the pair shares a room.
- [ ] Lane 4. Run a fixture with a three-person mutual group and doubles only. Save `dm02-too-large.png`. Pass when `dropped` lists the group with `too_large`.
- [ ] Lane 5. Run a fixture where a mutual pair crosses a female-only room policy. Save `dm02-gender.png`. Pass when the drop reason is `gender_policy`.
- [ ] Lane 6. Run a fixture where one student marks smoking as a deal-breaker against a smoker. Save `dm02-dealbreaker.png`. Pass when they never share a room.
- [ ] Lane 7. Run a fixture with five applicants and two doubles. Save `dm02-unmatched.png`. Pass when exactly one id is in `unmatched`.
- [ ] Lane 8. Run a fixture with an `undisclosed` applicant and only gendered rooms. Save `dm02-undisclosed.png`. Pass when that applicant is unmatched.
- [ ] Lane 9. Run `--random 2000 --seed 42`. Save `dm02-2000.png`. Pass when every placement has a score in 0 to 100 and a non-empty `top` list.
- [ ] Lane 10. Import `@dormmate/matching` from `apps/web` in a scratch server component and run `pnpm --filter web build`. Save `dm02-import.png`. Pass when the build succeeds.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Wall time of `run.ts --random 2000 --seed 42` for doubles. Trunk lacks the engine, so this is an absolute budget for the work the diff adds.
- [ ] Probe. Run the command five times on the lane VM and take the median.
- [ ] Baseline. Record that trunk has no engine, and cite the prototype's 2.3 seconds from Appendix A.
- [ ] Rule. Fail when the median exceeds 10 seconds.

**Review gate.** None. DM-02 is not review-gated.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends DM-02 to the base-branch stack and Yhasmen Nogales lands it bottom-up.

## Add larger rooms, locked placements and open-bed ranking (DM-03)

**Depends on.** DM-02.

**Files.**

- [ ] Edit `packages/matching/src/assign.ts` and `packages/matching/src/match.ts`.
- [ ] Create `packages/matching/src/openBed.ts`.
- [ ] Create `packages/matching/test/rooms.test.ts` and `packages/matching/test/open-bed.test.ts`.

**Build.**

- [ ] Seed rooms of 3 and 4 greedily in `assign.ts` and improve them with inter-room swaps that move locked groups as one unit.
- [ ] Honor `locked` placements in batch mode in `match.ts`, so overridden rooms never change.
- [ ] Write `rankOpenBed` in `openBed.ts`. It checks hard constraints against current occupants, scores the mean over occupants with profiles, and returns `score: null` for every applicant when no occupant has a profile.

**You see.**

- [ ] A mixed fixture of doubles, triples and quads fills every bed it can, and an open-bed fixture prints a ranked list with literal scores.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `rooms.test.ts` asserts literal rooms for a six-student, two-triple fixture and a locked group of three staying together. Run `pnpm --filter @dormmate/matching test`.
- [ ] `rooms.test.ts` asserts a locked placement from input is returned unchanged.
- [ ] `open-bed.test.ts` asserts the literal ranking against two occupants, and `null` scores when occupants have no profiles.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high-fast` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Run the four-student doubles fixture at trunk and head. Save `dm03-regression.png`. Pass when both print identical placements.
- [ ] Lane 2. Run the two-triple fixture. Save `dm03-triples.png`. Pass when both rooms hold three members.
- [ ] Lane 3. Run a quad fixture with a locked mutual group of three. Save `dm03-quad-lock.png`. Pass when the three share a room.
- [ ] Lane 4. Run batch mode with one `locked` placement. Save `dm03-locked.png`. Pass when that placement is unchanged in output.
- [ ] Lane 5. Run open-bed mode against two profiled occupants. Save `dm03-openbed.png`. Pass when the ranking is sorted by score descending.
- [ ] Lane 6. Run open-bed mode with occupants without profiles. Save `dm03-unscored.png`. Pass when every score is `null`.
- [ ] Lane 7. Run open-bed mode with an applicant who fails an occupant's deal-breaker. Save `dm03-openbed-db.png`. Pass when that applicant is absent from the ranking.
- [ ] Lane 8. Run a mixed room set where a four-person group fits no room. Save `dm03-no-room.png`. Pass when the drop reason is `no_room_of_size` or `too_large` as the fixture specifies.
- [ ] Lane 9. Run `--random 2000 --seed 42 --rooms mixed`. Save `dm03-mixed-2000.png`. Pass when no room exceeds its capacity.
- [ ] Lane 10. Run the mixed 2,000 case twice. Save `dm03-determinism.png`. Pass when the outputs are byte-identical.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Wall time of `run.ts --random 2000 --seed 42` for doubles at trunk and head, and for `--rooms mixed` at head only.
- [ ] Probe. Interleave five trunk and five head doubles runs on one VM, then five head mixed runs.
- [ ] Baseline. Record the trunk doubles median first.
- [ ] Rule. Fail when the head doubles median exceeds trunk by more than 10 percent, or the mixed median exceeds 20 seconds.

**Review gate.** None. DM-03 is not review-gated.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends DM-03 to the base-branch stack and Yhasmen Nogales lands it bottom-up.

## Ship the synthetic generator and the benchmark gate (DM-04)

**Depends on.** DM-03.

**Files.**

- [ ] Create `packages/matching/bench/generate.ts` and `packages/matching/bench/run.ts`.
- [ ] Edit `packages/matching/package.json` and `.github/workflows/ci.yml`.

**Build.**

- [ ] Write `generate(n, seed)` in `generate.ts` with realistic distributions per category, a deal-breaker rate, partial importance ratings, mutual request clusters and a mixed room inventory.
- [ ] Write `bench/run.ts` that prints `{ applicants, wallMs, rssMb, placed, dropped, unmatched, meanScore }` as one JSON line.
- [ ] Add a CI step that runs the bench at 500 applicants and fails above its budget.

**You see.**

- [ ] `pnpm --filter @dormmate/matching bench --applicants 2000` prints one JSON line with `wallMs` under 60000.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `packages/matching/test/generate.test.ts` asserts `generate(10, 7)` returns literal ids and that the request edges it creates are mutual. Run `pnpm --filter @dormmate/matching test`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high-fast` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Run `run.ts --random 2000 --seed 42` at trunk and head. Save `dm04-regression.png`. Pass when both print identical placements.
- [ ] Lane 2. Run the bench at 2,000. Save `dm04-2000.png`. Pass when `wallMs` is under 60000.
- [ ] Lane 3. Run the bench at 500. Save `dm04-500.png`. Pass when `wallMs` is under the CI budget.
- [ ] Lane 4. Run the bench at 4,000. Save `dm04-4000.png`. Pass when it completes and prints `rssMb`.
- [ ] Lane 5. Run the generator twice with seed 9. Save `dm04-seed.png`. Pass when outputs are byte-identical.
- [ ] Lane 6. Inspect generator output for request clusters. Save `dm04-clusters.png`. Pass when at least one cluster of 3 exists at 2,000.
- [ ] Lane 7. Force the CI budget to 1 ms on a scratch branch and run the CI step locally. Save `dm04-budget-fail.png`. Pass when the step exits non-zero.
- [ ] Lane 8. Read `gh pr checks <pr>`. Save `dm04-ci.png`. Pass when the bench step is green.
- [ ] Lane 9. Run the bench with `--rooms doubles`. Save `dm04-doubles.png`. Pass when every placement has two members.
- [ ] Lane 10. Run the bench inside `node --max-old-space-size=1536`. Save `dm04-memory.png`. Pass when it completes without an out-of-memory error.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. `wallMs` and `rssMb` at 2,000 applicants with the realistic generator, and `run.ts --random 2000` wall time at trunk and head.
- [ ] Probe. Interleave five trunk and five head `run.ts` runs, then five bench runs at head.
- [ ] Baseline. Record the trunk `run.ts` median first.
- [ ] Rule. Fail when head `run.ts` exceeds trunk by 10 percent, the bench median exceeds 60000 ms, or `rssMb` exceeds 1536.

**Review gate.** None. DM-04 is not review-gated.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends DM-04 to the base-branch stack and Yhasmen Nogales lands it bottom-up.

## Lay the database foundation with row-level security (DM-05)

**Depends on.** DM-01.

**Files.**

- [ ] Create `supabase/config.toml`, `supabase/migrations/<ts>_foundation.sql` and `supabase/seed.sql`.
- [ ] Create `supabase/tests/isolation.test.sql`, `supabase/tests/audit.test.sql` and `supabase/tests/student.test.sql`.
- [ ] Create `apps/web/lib/database.types.ts`.
- [ ] Edit `package.json` and `.github/workflows/ci.yml`.

**Build.**

- [ ] Create every table in the data model of `docs/system-architecture.md` in `_foundation.sql`, each with `workspace_id` where it is workspace-owned and row-level security on.
- [ ] Write staff policies through `membership` and student policies through `enrollment`, and index `membership (workspace_id, user_id)` and `enrollment (user_id, cycle_id)`.
- [ ] Grant only `insert` on `audit_event` to the server role and nothing to `authenticated`.
- [ ] Seed two workspaces, a staff member in each and a student in each in `seed.sql`.
- [ ] Generate `database.types.ts` with `supabase gen types` and add `supabase test db` to CI.

**You see.**

- [ ] `pnpm supabase test db` prints every pgTAP test as `ok` and the CI step is green.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `isolation.test.sql` asserts a staff member of workspace A reads 0 rows of workspace B for every workspace table, and fails when the policy is dropped. Run `pnpm supabase test db`.
- [ ] `audit.test.sql` asserts `update` and `delete` on `audit_event` raise for `authenticated`.
- [ ] `student.test.sql` asserts a student reads only their own `profile_version` rows.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high-fast` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Run `pnpm supabase db reset` at trunk and head. Trunk lacks a schema, so record that and gate the head reset. Save `dm05-reset.png`. Pass when head resets with seed rows and no error.
- [ ] Lane 2. As staff A in `psql` with JWT claims, select from `enrollment`. Save `dm05-staff-a.png`. Pass when only workspace A rows return.
- [ ] Lane 3. As staff A, insert a `property` with workspace B's id. Save `dm05-cross-insert.png`. Pass when the insert is rejected.
- [ ] Lane 4. As student A, select from `profile_version`. Save `dm05-student.png`. Pass when only their own rows return.
- [ ] Lane 5. As `authenticated`, delete from `audit_event`. Save `dm05-audit.png`. Pass when permission is denied.
- [ ] Lane 6. Run `select relname from pg_class where relrowsecurity = false` over public tables. Save `dm05-rls-all.png`. Pass when it returns no workspace table.
- [ ] Lane 7. Drop the staff read policy in a scratch database and run `supabase test db`. Save `dm05-policy-drop.png`. Pass when the isolation test fails.
- [ ] Lane 8. Run `supabase gen types` and `git diff --exit-code apps/web/lib/database.types.ts`. Save `dm05-types.png`. Pass when the diff is empty.
- [ ] Lane 9. Read `gh pr checks <pr>`. Save `dm05-ci.png`. Pass when the database test step is green.
- [ ] Lane 10. As an anonymous role, select from `workspace`. Save `dm05-anon.png`. Pass when it returns 0 rows.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Execution time of a staff `select` on `enrollment` with 10,000 seeded rows across 20 workspaces, and `supabase test db` wall time. Trunk lacks a schema, so both are absolute budgets.
- [ ] Probe. Run `explain analyze` five times as staff A after a bulk seed, then time `supabase test db` three times.
- [ ] Baseline. Record that trunk has no schema.
- [ ] Rule. Fail when the plan shows a sequential scan on `membership`, the median query exceeds 20 ms, or the test run exceeds 60 seconds.

**Review gate.** None. DM-05 is not review-gated.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends DM-05 to the base-branch stack and Yhasmen Nogales lands it bottom-up.

## Sign in with an email one-time code (DM-06)

**Depends on.** DM-05.

**Files.**

- [ ] Create `apps/web/proxy.ts`, `apps/web/lib/supabase/server.ts` and `apps/web/lib/supabase/client.ts`.
- [ ] Create `apps/web/app/login/page.tsx`, `apps/web/app/login/actions.ts` and `apps/web/app/auth/callback/route.ts`.
- [ ] Create `apps/web/e2e/login.spec.ts`, `apps/web/playwright.config.ts` and `apps/web/scripts/perf.ts`.
- [ ] Edit `supabase/config.toml` for Resend SMTP through environment variables.

**Build.**

- [ ] Refresh sessions in `proxy.ts` with `getClaims()` and redirect unauthenticated requests under `/app` and `/console` to `/login`.
- [ ] Send and verify the one-time code through server actions in `login/actions.ts`, validated with Zod.
- [ ] Point Supabase Auth SMTP at Resend in staging and production, and at Mailpit locally.
- [ ] Write `scripts/perf.ts` that measures TTFB and LCP medians for a route list with Playwright, so every later PR reuses one probe.

**You see.**

- [ ] Entering an email on `/login`, reading the code from Mailpit and entering it lands on `/app` with a session cookie.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `login.spec.ts` signs in through Mailpit and asserts the URL is `/app`. Run `pnpm --filter web e2e`.
- [ ] `login.spec.ts` asserts a wrong code shows the literal error message and keeps the user on `/login`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high-fast` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Open `/login` at trunk and head. Trunk lacks sign-in, so record that and gate sign-in to `/app` at head. Save `dm06-signin.png`. Pass when head lands on `/app` signed in.
- [ ] Lane 2. Open `/app` signed out. Save `dm06-redirect.png`. Pass when the browser lands on `/login`.
- [ ] Lane 3. Enter a wrong code. Save `dm06-wrong-code.png`. Pass when the error message shows and no session cookie is set.
- [ ] Lane 4. Request two codes within 60 seconds. Save `dm06-rate.png`. Pass when the second shows the wait message.
- [ ] Lane 5. Submit an invalid email. Save `dm06-invalid.png`. Pass when the Zod message shows inline.
- [ ] Lane 6. Sign in, wait past access-token expiry, reload `/app`. Save `dm06-refresh.png`. Pass when the session refreshes without a redirect.
- [ ] Lane 7. Sign out. Save `dm06-signout.png`. Pass when `/app` redirects to `/login` afterwards.
- [ ] Lane 8. Open `/login` at a 390 px wide viewport. Save `dm06-mobile.png`. Pass when no horizontal scroll appears.
- [ ] Lane 9. Inspect the Mailpit message. Save `dm06-email.png`. Pass when it shows the DormMate sender and a six-digit code.
- [ ] Lane 10. Search the client bundle for the service role key. Save `dm06-secret.png`. Pass when it is absent.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. TTFB and LCP of `/` at trunk and head, plus LCP of `/login` and the code-verify action duration at head.
- [ ] Probe. Run `scripts/perf.ts` on `/` interleaved trunk and head five times each, then on `/login` at head.
- [ ] Baseline. Record trunk `/` TTFB and LCP first.
- [ ] Rule. Fail when head `/` exceeds trunk by 10 percent, `/login` LCP exceeds 2.5 seconds under 4x CPU throttling, or verify exceeds 800 ms at p50.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 1, 3 and 8 screenshots into `../dormmate-review/dm06-review-<slug>.png`.
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `../dormmate-review/dm06-review.mp4`.
- [ ] Post the screenshots and the video in chat for the operator. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends DM-06 to the base-branch stack and Yhasmen Nogales lands it bottom-up.

## Prove the matching workflow in Singapore (DM-07)

**Depends on.** DM-04 and DM-06.

**Files.**

- [ ] Create `apps/web/workflows/match.ts` and `apps/web/app/api/jobs/match/route.ts`.
- [ ] Create `apps/web/vercel.json` with `regions` set to `sin1`.
- [ ] Create `apps/web/scripts/workflow-bench.ts`.

**Build.**

- [ ] Write a Vercel Workflow in `match.ts` with steps load, run and write, where step input and output carry only ids and counts.
- [ ] Load 2,000 synthetic applicants into staging from the DM-04 generator and run the workflow on a preview deployment.
- [ ] Add a test-only flag that throws once inside the write step to prove retry.
- [ ] Record the outcome in `docs/system-architecture.md` decision 5. If any check fails, switch to Inngest in this PR and record why.

**You see.**

- [ ] The preview deployment log shows the run finishing in under 60 seconds in `sin1`, and a forced throw retries to identical placements.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `apps/web/workflows/match.test.ts` runs the workflow locally against the four-student fixture and asserts the literal placements written. Run `pnpm --filter web test`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high-fast` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Trigger matching at trunk and head. Trunk lacks the workflow, so record that and gate the 2,000-applicant run at head. Save `dm07-run.png`. Pass when the run reaches `ready` with 2,000 rows accounted for.
- [ ] Lane 2. Read the Vercel function region for the run. Save `dm07-region.png`. Pass when it is `sin1`.
- [ ] Lane 3. Run with the forced throw. Save `dm07-retry.png`. Pass when placements equal the clean run.
- [ ] Lane 4. Inspect workflow step payloads in the dashboard. Save `dm07-payload.png`. Pass when no answers or names appear.
- [ ] Lane 5. Run the workflow under `next dev` on Windows on the operator's machine. Save `dm07-windows.png`. Pass when it completes.
- [ ] Lane 6. Trigger two runs for the same cycle at once. Save `dm07-concurrent.png`. Pass when both complete without mixing rows.
- [ ] Lane 7. Call the job route without a valid signature. Save `dm07-auth.png`. Pass when it returns 401.
- [ ] Lane 8. Run with workspace B's id as staff of workspace A. Save `dm07-scope.png`. Pass when the start is rejected.
- [ ] Lane 9. Read peak memory from function logs. Save `dm07-memory.png`. Pass when it stays under 1.5 GB on the default function.
- [ ] Lane 10. Run at 500 applicants. Save `dm07-500.png`. Pass when it completes under 15 seconds.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. End-to-end run time from start to `ready` at 2,000 applicants on the preview deployment, and DM-04 local bench time at trunk and head.
- [ ] Probe. Run `scripts/workflow-bench.ts` three times on preview, and interleave five trunk and head local bench runs.
- [ ] Baseline. Record the trunk local bench median first.
- [ ] Rule. Fail when the preview median exceeds 60 seconds or the head local bench exceeds trunk by 10 percent.

**Review gate.** None. DM-07 is not review-gated. The preview deployment needs the operator's go because it is a deploy.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends DM-07 to the base-branch stack and Yhasmen Nogales lands it bottom-up.

## Let an owner sign up, create a workspace and invite staff (DM-08)

**Depends on.** DM-06.

**Files.**

- [ ] Create `apps/web/app/signup/page.tsx` and `apps/web/app/signup/actions.ts`.
- [ ] Create `apps/web/app/console/[workspace]/layout.tsx`, `page.tsx`, `setup/page.tsx`, `settings/team/page.tsx` and `settings/workspace/page.tsx`.
- [ ] Create `supabase/migrations/<ts>_workspace_rpc.sql` and `supabase/tests/workspace.test.sql`.
- [ ] Create `apps/web/e2e/signup.spec.ts`.

**Build.**

- [ ] Write the `create_workspace` Postgres function that inserts the workspace with trial dates, the Owner membership and an audit event in one transaction.
- [ ] Render the console sidebar from one role-to-items table, hiding items a role cannot use.
- [ ] Derive the setup checklist from data (property, rooms, questionnaire, invite) instead of stored flags.
- [ ] Invite staff by email with a role, and change roles, through Postgres functions that write audit events.

**You see.**

- [ ] A new email signs up, names a workspace and lands on `/console/<slug>/setup` with four unchecked steps and the trial end date.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `workspace.test.sql` asserts `create_workspace` writes one workspace, one Owner and one audit row, and a Staff caller cannot change roles. Run `pnpm supabase test db`.
- [ ] `signup.spec.ts` asserts the literal checklist items after sign-up. Run `pnpm --filter web e2e`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high-fast` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Run sign-in at trunk and head, then open `/signup`. Trunk lacks sign-up, so record that and gate the workspace landing at head. Save `dm08-setup.png`. Pass when the checklist shows four steps.
- [ ] Lane 2. Read the trial banner. Save `dm08-trial.png`. Pass when it shows 60 days from today.
- [ ] Lane 3. Invite a Manager by email and accept as that user. Save `dm08-manager.png`. Pass when the Manager sees no Settings item for team or billing.
- [ ] Lane 4. Invite a Staff member and sign in as them. Save `dm08-staff.png`. Pass when Cycles shows view-only and Audit log is hidden.
- [ ] Lane 5. As Staff, post the change-role action directly. Save `dm08-staff-forbidden.png`. Pass when it returns an error and no role changes.
- [ ] Lane 6. As Owner of workspace A, open workspace B's console URL. Save `dm08-cross.png`. Pass when it shows not found.
- [ ] Lane 7. Rename the workspace and upload a logo. Save `dm08-workspace.png`. Pass when the sidebar shows the new name and logo.
- [ ] Lane 8. Query `audit_event` for the workspace. Save `dm08-audit.png`. Pass when creation, invite and role change rows exist.
- [ ] Lane 9. Sign up with a workspace name that already exists. Save `dm08-slug.png`. Pass when a unique slug is created.
- [ ] Lane 10. Open the console at 1280 px and 390 px widths. Save `dm08-responsive.png`. Pass when the sidebar collapses on mobile.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. TTFB and LCP of `/login` at trunk and head, plus `/console/<slug>` LCP and `create_workspace` duration at head.
- [ ] Probe. Run `scripts/perf.ts` on `/login` interleaved five times each side, then on the console route at head.
- [ ] Baseline. Record trunk `/login` first.
- [ ] Rule. Fail when head `/login` exceeds trunk by 10 percent, console LCP exceeds 2.5 seconds, or sign-up to setup exceeds 1.5 seconds at p50.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 1, 3 and 4 screenshots into `../dormmate-review/dm08-review-<slug>.png`.
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `../dormmate-review/dm08-review.mp4`.
- [ ] Post the screenshots and the video in chat for the operator. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends DM-08 to the base-branch stack and Yhasmen Nogales lands it bottom-up.

## Manage properties, rooms, beds and cycles (DM-09)

**Depends on.** DM-08.

**Files.**

- [ ] Create `apps/web/app/console/[workspace]/properties/page.tsx`, `properties/[id]/page.tsx` and `properties/actions.ts`.
- [ ] Create `apps/web/app/console/[workspace]/cycles/page.tsx`, `cycles/new/page.tsx` and `cycles/actions.ts`.
- [ ] Create `apps/web/lib/schemas/inventory.ts` and `apps/web/e2e/inventory.spec.ts`.

**Build.**

- [ ] Parse property, building, room and cycle forms with Zod schemas in `inventory.ts`, where capacity is 2, 3 or 4 and gender policy is female, male or any.
- [ ] Create beds automatically from room capacity in the room action.
- [ ] Create a cycle as a fixed term or a rolling intake with a matching deadline.

**You see.**

- [ ] The setup checklist ticks property and rooms after an owner adds a property with three rooms.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `apps/web/lib/schemas/inventory.test.ts` asserts capacity 5 and an unknown gender policy fail with literal messages. Run `pnpm --filter web test`.
- [ ] `inventory.spec.ts` creates a property, a triple room and a cycle and asserts three beds exist. Run `pnpm --filter web e2e`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high-fast` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Open the console at trunk and head and add a property. Trunk lacks properties, so record that and gate the checklist tick at head. Save `dm09-checklist.png`. Pass when property and rooms are ticked.
- [ ] Lane 2. Add a building to a property and a room in it. Save `dm09-building.png`. Pass when the room lists under the building.
- [ ] Lane 3. Add a room with capacity 5 through the form. Save `dm09-capacity.png`. Pass when the inline error shows.
- [ ] Lane 4. Add a quad room. Save `dm09-beds.png`. Pass when four beds show.
- [ ] Lane 5. Create a term cycle with a deadline. Save `dm09-term.png`. Pass when the cycle list shows the deadline.
- [ ] Lane 6. Create a rolling intake. Save `dm09-rolling.png`. Pass when it shows as rolling with no end date.
- [ ] Lane 7. As Staff, open the new cycle page. Save `dm09-staff.png`. Pass when the create control is absent.
- [ ] Lane 8. Edit a room's gender policy. Save `dm09-policy.png`. Pass when the new policy shows on reload.
- [ ] Lane 9. Delete an empty room. Save `dm09-delete.png`. Pass when it and its beds are gone.
- [ ] Lane 10. Add 50 rooms and open the property page. Save `dm09-many.png`. Pass when all 50 render.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. LCP of `/console/<slug>` at trunk and head, plus LCP of a property page with 200 rooms at head.
- [ ] Probe. Run `scripts/perf.ts` interleaved five times each side, then on the 200-room page at head.
- [ ] Baseline. Record trunk console LCP first.
- [ ] Rule. Fail when head console LCP exceeds trunk by 10 percent or the 200-room page exceeds 2.5 seconds.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 1, 2 and 6 screenshots into `../dormmate-review/dm09-review-<slug>.png`.
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `../dormmate-review/dm09-review.mp4`.
- [ ] Post the screenshots and the video in chat for the operator. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends DM-09 to the base-branch stack and Yhasmen Nogales lands it bottom-up.

## Configure the questionnaire and weights per cycle (DM-10)

**Depends on.** DM-09.

**Files.**

- [ ] Create `apps/web/app/console/[workspace]/cycles/[id]/questionnaire/page.tsx` and `actions.ts`.
- [ ] Create `apps/web/lib/questionnaire.ts` and `apps/web/lib/questionnaire.test.ts`.
- [ ] Create `supabase/migrations/<ts>_questionnaire.sql`.

**Build.**

- [ ] Define the ten habit categories once in `questionnaire.ts` from the engine's `Category` type, with question copy in `messages/en.json`.
- [ ] Save a `questionnaire_version` with enabled categories, weights, hard constraints and the deal-breaker threshold, defaulting to equal weights and 0.5.
- [ ] Freeze the version once a student submits a profile, so later edits create a new version.

**You see.**

- [ ] The setup checklist ticks questionnaire after a Manager saves weights.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `questionnaire.test.ts` asserts defaults equal literal equal weights and threshold 0.5, and that disabling every category fails. Run `pnpm --filter web test`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high-fast` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Open the cycle at trunk and head. Trunk lacks the questionnaire page, so record that and gate the checklist tick at head. Save `dm10-tick.png`. Pass when questionnaire is ticked.
- [ ] Lane 2. Open the page fresh. Save `dm10-defaults.png`. Pass when every weight is equal and threshold reads 0.5.
- [ ] Lane 3. Disable smoking and save. Save `dm10-disable.png`. Pass when smoking is off on reload.
- [ ] Lane 4. Set sleep weight to 3. Save `dm10-weight.png`. Pass when 3 persists.
- [ ] Lane 5. Disable every category. Save `dm10-none.png`. Pass when the inline error shows.
- [ ] Lane 6. Mark location as a hard constraint. Save `dm10-hard.png`. Pass when it persists.
- [ ] Lane 7. As Staff, open the page. Save `dm10-staff.png`. Pass when inputs are read-only.
- [ ] Lane 8. Search the page for religion, ethnicity or health fields. Save `dm10-sensitive.png`. Pass when none exist.
- [ ] Lane 9. Submit a profile as a seeded student, then edit weights. Save `dm10-version.png`. Pass when a second version row exists.
- [ ] Lane 10. Set the threshold to 1.5 through the action. Save `dm10-threshold.png`. Pass when it is rejected.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. LCP of `/console/<slug>` at trunk and head, plus LCP of the questionnaire page at head.
- [ ] Probe. Run `scripts/perf.ts` interleaved five times each side, then on the questionnaire page at head.
- [ ] Baseline. Record trunk console LCP first.
- [ ] Rule. Fail when head exceeds trunk by 10 percent or the questionnaire page exceeds 2.5 seconds.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 2, 4 and 6 screenshots into `../dormmate-review/dm10-review-<slug>.png`.
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `../dormmate-review/dm10-review.mp4`.
- [ ] Post the screenshots and the video in chat for the operator. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends DM-10 to the base-branch stack and Yhasmen Nogales lands it bottom-up.

## Invite students, approve joins and record guardian consent (DM-11)

**Depends on.** DM-10.

**Files.**

- [ ] Create `apps/web/app/join/[code]/page.tsx`, `join/[code]/verify/page.tsx`, `join/expired/page.tsx` and `join/actions.ts`.
- [ ] Create `apps/web/app/console/[workspace]/cycles/[id]/invite/page.tsx` and `cycles/[id]/applicants/page.tsx` with `actions.ts`.
- [ ] Create `supabase/migrations/<ts>_enrollment_rpc.sql` and `supabase/tests/enrollment.test.sql`.
- [ ] Create `apps/web/e2e/join.spec.ts`.

**Build.**

- [ ] Generate an invite code and QR code per cycle, and rotate it so old links land on `/join/expired`.
- [ ] Create an enrollment as `pending` on verify, or `approved` when the verified email is on the roster.
- [ ] Write `approve_enrollments`, `reject_enrollment` and `record_guardian_consent` Postgres functions that write audit events in the same transaction.
- [ ] Block approval of an under-18 enrollment until a consent date is recorded.

**You see.**

- [ ] A student opens the invite link, verifies a code and appears in the applicants list as pending. The Manager approves them.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `enrollment.test.sql` asserts approval writes one audit row, an under-18 approval without consent raises, and a rotated code no longer resolves. Run `pnpm supabase test db`.
- [ ] `join.spec.ts` asserts the literal pending status after joining. Run `pnpm --filter web e2e`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high-fast` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Sign in at trunk and head, then open an invite link. Trunk lacks join, so record that and gate the pending applicant at head. Save `dm11-pending.png`. Pass when the student shows as pending.
- [ ] Lane 2. Scan the QR code image with a decoder. Save `dm11-qr.png`. Pass when it decodes to the invite URL.
- [ ] Lane 3. Rotate the link and open the old one. Save `dm11-expired.png`. Pass when `/join/expired` shows the dorm contact.
- [ ] Lane 4. Bulk approve three applicants. Save `dm11-bulk.png`. Pass when all three show approved.
- [ ] Lane 5. Join with an email on the seeded roster. Save `dm11-roster.png`. Pass when the enrollment is approved at once.
- [ ] Lane 6. Approve a 16-year-old without consent. Save `dm11-minor.png`. Pass when the approve control asks for the consent date.
- [ ] Lane 7. Record a consent date and approve. Save `dm11-consent.png`. Pass when status is approved and the audit row names the date.
- [ ] Lane 8. Reject an applicant. Save `dm11-reject.png`. Pass when the student sees the rejected state on `/app`.
- [ ] Lane 9. Join the same cycle twice with one email. Save `dm11-duplicate.png`. Pass when one enrollment exists.
- [ ] Lane 10. Open the invite page at 390 px. Save `dm11-mobile.png`. Pass when the dorm name, logo and email field fit without scroll.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. LCP of `/login` at trunk and head, plus `/join/<code>` LCP and the bulk approve duration for 200 applicants at head.
- [ ] Probe. Run `scripts/perf.ts` interleaved five times each side, then on `/join/<code>` and a timed bulk approve at head.
- [ ] Baseline. Record trunk `/login` first.
- [ ] Rule. Fail when head exceeds trunk by 10 percent, `/join/<code>` exceeds 2.5 seconds under 4x CPU throttling, or bulk approve exceeds 2 seconds.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 1, 6 and 10 screenshots into `../dormmate-review/dm11-review-<slug>.png`.
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `../dormmate-review/dm11-review.mp4`.
- [ ] Post the screenshots and the video in chat for the operator. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends DM-11 to the base-branch stack and Yhasmen Nogales lands it bottom-up.

## Onboard students and collect versioned profiles (DM-12)

**Depends on.** DM-11.

**Files.**

- [ ] Create `apps/web/app/app/layout.tsx`, `app/app/page.tsx`, `app/app/onboarding/consent/page.tsx` and `app/app/onboarding/actions.ts`.
- [ ] Create `apps/web/app/app/profile/page.tsx`, `profile/questionnaire/page.tsx`, `profile/import/page.tsx` and `profile/actions.ts`.
- [ ] Create `apps/web/lib/profile.ts`, `apps/web/lib/profile.test.ts` and `apps/web/e2e/profile.spec.ts`.

**Build.**

- [ ] Record consent version, birthdate and the required gender answer on the consent screen, explaining gender is used only for room policy.
- [ ] Parse questionnaire answers into the engine's `Answer` shape in `profile.ts`, with a deal-breaker toggle and importance 1 to 3 per category.
- [ ] Append a `profile_version` on every save and lock edits after the cycle deadline.
- [ ] Copy answers from another workspace's latest profile only after an explicit consent checkbox.
- [ ] Derive the `/app` home status card from enrollment and profile state.

**You see.**

- [ ] An approved student completes consent and the questionnaire, and `/app` shows "Waiting for the deadline".

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `profile.test.ts` asserts form data parses to literal `Answer` values and rejects importance 4. Run `pnpm --filter web test`.
- [ ] `profile.spec.ts` asserts two saves create two versions and an edit after the deadline is refused. Run `pnpm --filter web e2e`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high-fast` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Sign in as an approved student at trunk and head. Trunk lacks onboarding, so record that and gate the waiting state at head. Save `dm12-waiting.png`. Pass when `/app` shows the waiting card.
- [ ] Lane 2. Enter a birthdate under 18. Save `dm12-minor.png`. Pass when the guardian consent notice shows.
- [ ] Lane 3. Try to continue without a gender answer. Save `dm12-gender.png`. Pass when the form blocks with the policy explanation.
- [ ] Lane 4. Step through all ten categories. Save `dm12-steps.png`. Pass when each step shows a deal-breaker toggle and importance.
- [ ] Lane 5. Save, edit and save again. Save `dm12-versions.png`. Pass when the profile page shows version 2.
- [ ] Lane 6. Move the deadline into the past and edit. Save `dm12-locked.png`. Pass when editing is refused with the deadline message.
- [ ] Lane 7. As a student in two workspaces, import answers. Save `dm12-import.png`. Pass when answers copy only after the consent checkbox.
- [ ] Lane 8. As a roommate-to-be, query another student's `profile_version`. Save `dm12-privacy.png`. Pass when 0 rows return.
- [ ] Lane 9. Use the questionnaire at 390 px with touch input. Save `dm12-mobile.png`. Pass when every control is reachable.
- [ ] Lane 10. Leave mid-questionnaire and return. Save `dm12-resume.png`. Pass when saved answers persist.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. LCP of `/login` at trunk and head, plus `/app/profile/questionnaire` LCP and save action duration at head.
- [ ] Probe. Run `scripts/perf.ts` interleaved five times each side, then on the questionnaire at head under 4x CPU throttling.
- [ ] Baseline. Record trunk `/login` first.
- [ ] Rule. Fail when head exceeds trunk by 10 percent, questionnaire LCP exceeds 2.5 seconds, or save exceeds 500 ms at p50.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 2, 4 and 9 screenshots into `../dormmate-review/dm12-review-<slug>.png`.
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `../dormmate-review/dm12-review.mp4`.
- [ ] Post the screenshots and the video in chat for the operator. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends DM-12 to the base-branch stack and Yhasmen Nogales lands it bottom-up.

## Let students request roommates (DM-13)

**Depends on.** DM-12.

**Files.**

- [ ] Create `apps/web/app/app/roommates/page.tsx` and `roommates/actions.ts`.
- [ ] Create `supabase/migrations/<ts>_requests.sql` and `supabase/tests/requests.test.sql`.

**Build.**

- [ ] Add a request by email, resolving `to_enrollment` when that email has an enrollment in the same cycle.
- [ ] Cap requests at the largest room size in the cycle minus one.
- [ ] Show each request as mutual or waiting, using engine drop reasons later in DM-15.

**You see.**

- [ ] Two students request each other and both see "Mutual".

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `requests.test.sql` asserts the cap raises on one request too many and a cross-cycle email never resolves. Run `pnpm supabase test db`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high-fast` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Open `/app` at trunk and head. Trunk lacks requests, so record that and gate the mutual state at head. Save `dm13-mutual.png`. Pass when both students see Mutual.
- [ ] Lane 2. Request a student who has not joined yet, then let them join. Save `dm13-late.png`. Pass when the request resolves on their join.
- [ ] Lane 3. Exceed the cap. Save `dm13-cap.png`. Pass when the form refuses with the cap message.
- [ ] Lane 4. Request yourself. Save `dm13-self.png`. Pass when it is refused.
- [ ] Lane 5. Remove a request. Save `dm13-remove.png`. Pass when the other side changes from Mutual to their own waiting request.
- [ ] Lane 6. Request an email from another workspace. Save `dm13-cross.png`. Pass when it stays waiting and reveals nothing about that person.
- [ ] Lane 7. As Staff, open the applicant row. Save `dm13-staff.png`. Pass when requests show for that applicant.
- [ ] Lane 8. Request after the deadline. Save `dm13-deadline.png`. Pass when it is refused.
- [ ] Lane 9. Use the page at 390 px. Save `dm13-mobile.png`. Pass when the list and form fit.
- [ ] Lane 10. Send the same request twice. Save `dm13-dupe.png`. Pass when one request exists.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. LCP of `/app` at trunk and head, plus `/app/roommates` LCP at head.
- [ ] Probe. Run `scripts/perf.ts` interleaved five times each side under 4x CPU throttling.
- [ ] Baseline. Record trunk `/app` first.
- [ ] Rule. Fail when head exceeds trunk by 10 percent or `/app/roommates` exceeds 2.5 seconds.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 1, 3 and 9 screenshots into `../dormmate-review/dm13-review-<slug>.png`.
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `../dormmate-review/dm13-review.mp4`.
- [ ] Post the screenshots and the video in chat for the operator. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends DM-13 to the base-branch stack and Yhasmen Nogales lands it bottom-up.

## Import rooms, rosters and occupants from CSV (DM-14)

**Depends on.** DM-09 and DM-11.

**Files.**

- [ ] Create `apps/web/app/console/[workspace]/import/page.tsx` and `import/actions.ts`.
- [ ] Create `apps/web/lib/csv.ts`, `apps/web/lib/csv.test.ts` and `apps/web/workflows/import.ts`.

**Build.**

- [ ] Parse each CSV kind with a Zod row schema in `csv.ts`, returning valid rows and row-numbered errors.
- [ ] Preview errors before commit and commit valid files through the `import` workflow, idempotent on re-upload.
- [ ] Mark roster emails `on_roster` so DM-11 auto-approval applies.

**You see.**

- [ ] Uploading a rooms CSV with one bad row shows row 3 with its reason, and fixing it imports every room.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `csv.test.ts` asserts literal errors for a missing capacity, capacity 5 and a duplicate room name. Run `pnpm --filter web test`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high-fast` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Open the console at trunk and head. Trunk lacks import, so record that and gate a clean rooms import at head. Save `dm14-rooms.png`. Pass when every room appears under its property.
- [ ] Lane 2. Upload a rooms file with a bad row. Save `dm14-errors.png`. Pass when the row number and reason show and nothing commits.
- [ ] Lane 3. Import a roster, then join with a roster email. Save `dm14-roster.png`. Pass when the enrollment is auto-approved.
- [ ] Lane 4. Import occupants. Save `dm14-occupants.png`. Pass when beds show current occupants.
- [ ] Lane 5. Upload the same file twice. Save `dm14-idempotent.png`. Pass when no duplicates exist.
- [ ] Lane 6. Upload a file with Excel BOM and CRLF endings. Save `dm14-encoding.png`. Pass when it parses.
- [ ] Lane 7. Upload a non-CSV file. Save `dm14-type.png`. Pass when it is refused.
- [ ] Lane 8. Upload 2,000 roster rows. Save `dm14-large.png`. Pass when the workflow completes and the count matches.
- [ ] Lane 9. As Staff, open import. Save `dm14-staff.png`. Pass when it is hidden.
- [ ] Lane 10. Query `audit_event` after an import. Save `dm14-audit.png`. Pass when one row names the kind and count.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. LCP of `/console/<slug>` at trunk and head, plus time from upload to committed for 2,000 roster rows at head.
- [ ] Probe. Run `scripts/perf.ts` interleaved five times each side, then time three 2,000-row imports at head.
- [ ] Baseline. Record trunk console LCP first.
- [ ] Rule. Fail when head exceeds trunk by 10 percent or the import exceeds 20 seconds.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 1, 2 and 3 screenshots into `../dormmate-review/dm14-review-<slug>.png`.
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `../dormmate-review/dm14-review.mp4`.
- [ ] Post the screenshots and the video in chat for the operator. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends DM-14 to the base-branch stack and Yhasmen Nogales lands it bottom-up.

## Run batch matching, preview and override (DM-15)

**Depends on.** DM-07, DM-13 and DM-14.

**Files.**

- [ ] Edit `apps/web/workflows/match.ts`.
- [ ] Create `apps/web/lib/match-input.ts` and `apps/web/lib/match-input.test.ts`.
- [ ] Create `apps/web/app/console/[workspace]/cycles/[id]/runs/page.tsx`, `runs/[runId]/page.tsx` and `runs/actions.ts`.
- [ ] Create `supabase/migrations/<ts>_runs.sql` and `supabase/tests/runs.test.sql`.

**Build.**

- [ ] Load eligible enrollments, latest profiles, mutual requests and rooms in `match-input.ts`, blocked by property, gender policy and room type.
- [ ] Store `engine_version`, `inputs_hash` and weights on `match_run` and stream step status to the run page.
- [ ] Show the score distribution, unmatched list and dropped requests with reasons on the run page.
- [ ] Write `override_placement` and `lock_placement` Postgres functions with audit, refusing any override that breaks gender policy and requiring a reason for other constraint breaks.

**You see.**

- [ ] A Manager clicks Run matching, watches steps progress, and sees placements with reasons, the unmatched list and dropped requests.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `match-input.test.ts` asserts a seeded cycle maps to a literal `MatchInput` that excludes a pending student and an under-18 student without consent. Run `pnpm --filter web test`.
- [ ] `runs.test.sql` asserts a gender-policy override raises and a valid override writes one audit row. Run `pnpm supabase test db`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high-fast` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Open the cycle at trunk and head with a seeded cycle. Trunk lacks runs, so record that and gate a ready run with placements at head. Save `dm15-run.png`. Pass when the run shows placements and a histogram.
- [ ] Lane 2. Run with a too-large mutual group seeded. Save `dm15-dropped.png`. Pass when it lists with `too_large` in plain words.
- [ ] Lane 3. Run with an unconsented minor seeded. Save `dm15-minor.png`. Pass when the minor appears in no placement.
- [ ] Lane 4. Override a placement within constraints. Save `dm15-override.png`. Pass when the placement moves and the audit log shows it.
- [ ] Lane 5. Override across gender policy. Save `dm15-gender.png`. Pass when it is refused with the rule named.
- [ ] Lane 6. Lock a placement and re-run. Save `dm15-lock.png`. Pass when the locked placement is unchanged.
- [ ] Lane 7. As Staff, open a run. Save `dm15-staff.png`. Pass when override and run controls are absent.
- [ ] Lane 8. Compare `inputs_hash` across two runs with no changes. Save `dm15-hash.png`. Pass when the hashes match.
- [ ] Lane 9. Run with a mixed room set. Save `dm15-mixed.png`. Pass when no room exceeds capacity.
- [ ] Lane 10. Open a placement's reasons. Save `dm15-reasons.png`. Pass when top traits and the weakest trait show in plain words.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Workflow time to `ready` for 2,000 seeded applicants at trunk and head, plus run page LCP with 1,000 placements at head.
- [ ] Probe. Run `scripts/workflow-bench.ts` interleaved three times each side, then `scripts/perf.ts` on the run page at head.
- [ ] Baseline. Record the trunk workflow median first.
- [ ] Rule. Fail when head exceeds 60 seconds or the run page exceeds 2.5 seconds.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 1, 2 and 10 screenshots into `../dormmate-review/dm15-review-<slug>.png`.
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `../dormmate-review/dm15-review.mp4`.
- [ ] Post the screenshots and the video in chat for the operator. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends DM-15 to the base-branch stack and Yhasmen Nogales lands it bottom-up.

## Publish assignments and notify by email (DM-16)

**Depends on.** DM-15.

**Files.**

- [ ] Create `supabase/migrations/<ts>_publish.sql` and `supabase/tests/publish.test.sql`.
- [ ] Create `apps/web/workflows/notify.ts` and `apps/web/emails/assignment.tsx`.
- [ ] Create `apps/web/app/app/assignment/page.tsx`.
- [ ] Edit `apps/web/app/console/[workspace]/cycles/[id]/runs/[runId]/page.tsx`.

**Build.**

- [ ] Write the `publish_run` Postgres function that creates occupancies and room chat threads, freezes the run, ends the trial if first, and writes audit in one transaction.
- [ ] Make `publish_run` idempotent so a second call returns the same result.
- [ ] Fan out emails per recipient in `notify.ts` through Resend and record delivery.
- [ ] Show room, roommates' first names, score and reasons on `/app/assignment`, with no roommate answers.

**You see.**

- [ ] The Manager publishes, each student gets an email, and `/app/assignment` shows their room.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `publish.test.sql` asserts one call creates literal occupancy counts and audit rows, a second call creates none, and a Staff call raises. Run `pnpm supabase test db`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high-fast` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Run matching at trunk and head on one seed. Trunk lacks publish, so record that and gate the student assignment view at head. Save `dm16-assignment.png`. Pass when the student sees room, names, score and reasons.
- [ ] Lane 2. Read Mailpit after publish. Save `dm16-email.png`. Pass when every placed student has one email.
- [ ] Lane 3. Click publish twice quickly. Save `dm16-double.png`. Pass when one set of occupancies exists.
- [ ] Lane 4. Check the trial banner after the first publish. Save `dm16-trial.png`. Pass when the trial shows ended.
- [ ] Lane 5. As a roommate, look for the other's answers. Save `dm16-privacy.png`. Pass when only shared-trait summaries show.
- [ ] Lane 6. Edit an override after publish. Save `dm16-frozen.png`. Pass when the run is read-only.
- [ ] Lane 7. Open the room page in the console. Save `dm16-occupancy.png`. Pass when beds show the published students.
- [ ] Lane 8. Make Resend fail once in staging. Save `dm16-retry.png`. Pass when the workflow retries and every email lands once.
- [ ] Lane 9. Check `chat_thread` rows. Save `dm16-threads.png`. Pass when each published room has one thread.
- [ ] Lane 10. Open `/app/assignment` at 390 px. Save `dm16-mobile.png`. Pass when it fits without scroll.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. LCP of `/app` at trunk and head, plus `publish_run` duration for 1,000 placements and time until the last email is sent at head.
- [ ] Probe. Run `scripts/perf.ts` interleaved five times each side, then time three publishes of 1,000 placements at head.
- [ ] Baseline. Record trunk `/app` first.
- [ ] Rule. Fail when head exceeds trunk by 10 percent, publish exceeds 3 seconds, or the last email exceeds 5 minutes.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 1, 2 and 5 screenshots into `../dormmate-review/dm16-review-<slug>.png`.
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `../dormmate-review/dm16-review.mp4`.
- [ ] Post the screenshots and the video in chat for the operator. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends DM-16 to the base-branch stack and Yhasmen Nogales lands it bottom-up.

## Install the app and send web push (DM-17)

**Depends on.** DM-16.

**Files.**

- [ ] Create `apps/web/app/manifest.ts`, `apps/web/public/sw.js` and app icons.
- [ ] Create `apps/web/app/app/onboarding/install/page.tsx` and `apps/web/app/app/settings/notifications/page.tsx`.
- [ ] Edit `apps/web/workflows/notify.ts`.

**Build.**

- [ ] Serve the manifest and a hand-written service worker that only handles push and notification clicks.
- [ ] Show add-to-home-screen steps on iOS before asking for push permission.
- [ ] Save `push_subscription` rows and send push with `web-push` in `notify.ts`, deleting subscriptions the push service reports as gone.

**You see.**

- [ ] An installed student gets a push notification on publish that opens `/app/assignment`.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `apps/web/workflows/notify.test.ts` asserts a 410 response deletes the literal subscription row and email still sends. Run `pnpm --filter web test`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high-fast` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Publish at trunk and head. Trunk lacks push, so record that and gate the push opening `/app/assignment` at head. Save `dm17-push.png`. Pass when the click lands on the assignment.
- [ ] Lane 2. Run Lighthouse installability on `/app`. Save `dm17-install.png`. Pass when it is installable.
- [ ] Lane 3. Emulate iOS Safari and open install. Save `dm17-ios.png`. Pass when steps show before the permission prompt.
- [ ] Lane 4. Deny permission. Save `dm17-deny.png`. Pass when email still arrives.
- [ ] Lane 5. Turn push off in settings. Save `dm17-off.png`. Pass when no push is sent on the next event.
- [ ] Lane 6. Send to an expired subscription. Save `dm17-expired.png`. Pass when its row is deleted.
- [ ] Lane 7. Fetch `/manifest.webmanifest` and `/sw.js`. Save `dm17-assets.png`. Pass when both return 200 with correct types.
- [ ] Lane 8. Approve a join. Save `dm17-approved.png`. Pass when the student gets a push.
- [ ] Lane 9. Check the service worker for fetch caching. Save `dm17-nocache.png`. Pass when it registers no fetch handler.
- [ ] Lane 10. Inspect a push payload. Save `dm17-payload.png`. Pass when it carries no roommate names.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. LCP of `/app` at trunk and head, plus time from publish to push received at head.
- [ ] Probe. Run `scripts/perf.ts` interleaved five times each side, then time three publish-to-push cycles at head.
- [ ] Baseline. Record trunk `/app` first.
- [ ] Rule. Fail when head exceeds trunk by 10 percent or push arrives later than 60 seconds.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 1, 3 and 5 screenshots into `../dormmate-review/dm17-review-<slug>.png`.
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `../dormmate-review/dm17-review.mp4`.
- [ ] Post the screenshots and the video in chat for the operator. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends DM-17 to the base-branch stack and Yhasmen Nogales lands it bottom-up.

## Chat by room with reports and blocks (DM-18)

**Depends on.** DM-16 and DM-17.

**Files.**

- [ ] Create `apps/web/app/app/chat/page.tsx`, `chat/[threadId]/page.tsx` and `chat/actions.ts`.
- [ ] Create `apps/web/app/console/[workspace]/reports/page.tsx`, `reports/[reportId]/page.tsx` and `reports/actions.ts`.
- [ ] Create `apps/web/lib/moderation.ts`, `apps/web/lib/moderation.test.ts`, `supabase/migrations/<ts>_chat.sql` and `supabase/tests/chat.test.sql`.

**Build.**

- [ ] Authorize Realtime private channels `thread:<id>` with policies for current occupants and mutual request groups before publish.
- [ ] Insert messages through a server action that applies the keyword filter and a per-user rate limit, then broadcast.
- [ ] Report and block from a message or the room menu, and route reports to the console inbox with assign, escalate and resolve notes.
- [ ] Push a notification for new messages to members who are not viewing the thread.

**You see.**

- [ ] Two roommates exchange messages live, one reports a message, and Staff resolves it in the inbox.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `moderation.test.ts` asserts literal filter results and a rate-limit refusal on the eleventh message in ten seconds. Run `pnpm --filter web test`.
- [ ] `chat.test.sql` asserts a non-member reads 0 messages and cannot join the channel. Run `pnpm supabase test db`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high-fast` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Publish at trunk and head with two roommates in two browsers. Trunk lacks chat, so record that and gate live delivery at head. Save `dm18-live.png`. Pass when a message appears in the other browser within 2 seconds.
- [ ] Lane 2. As a student from another room, subscribe to the thread channel. Save `dm18-intruder.png`. Pass when the subscription is refused.
- [ ] Lane 3. Chat between mutual requesters before publish. Save `dm18-group.png`. Pass when the request-group thread works.
- [ ] Lane 4. Send a filtered word. Save `dm18-filter.png`. Pass when the message is masked or refused per the filter rule.
- [ ] Lane 5. Send eleven messages in ten seconds. Save `dm18-rate.png`. Pass when the eleventh is refused.
- [ ] Lane 6. Report a message. Save `dm18-report.png`. Pass when it appears in the console inbox.
- [ ] Lane 7. Resolve a report with a note as Staff. Save `dm18-resolve.png`. Pass when status and note persist and audit logs it.
- [ ] Lane 8. Block a roommate. Save `dm18-block.png`. Pass when the blocker stops seeing their messages and staff see the block event.
- [ ] Lane 9. Reload a thread. Save `dm18-history.png`. Pass when history loads from Postgres in order.
- [ ] Lane 10. Receive a message while the app is closed. Save `dm18-push.png`. Pass when a push arrives without the message text.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. LCP of `/app` at trunk and head, plus send-to-receive latency and thread LCP with 500 messages at head.
- [ ] Probe. Run `scripts/perf.ts` interleaved five times each side, then time 50 sends between two browsers at head.
- [ ] Baseline. Record trunk `/app` first.
- [ ] Rule. Fail when head exceeds trunk by 10 percent, p95 latency exceeds 1 second, or thread LCP exceeds 2.5 seconds.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 1, 6 and 7 screenshots into `../dormmate-review/dm18-review-<slug>.png`.
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `../dormmate-review/dm18-review.mp4`.
- [ ] Post the screenshots and the video in chat for the operator. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends DM-18 to the base-branch stack and Yhasmen Nogales lands it bottom-up.

## Fill open beds against current occupants (DM-19)

**Depends on.** DM-16.

**Files.**

- [ ] Create `apps/web/app/console/[workspace]/properties/[id]/rooms/[roomId]/page.tsx`, `rooms/[roomId]/fill/page.tsx` and `rooms/actions.ts`.
- [ ] Create `supabase/migrations/<ts>_open_bed.sql` and `supabase/tests/open-bed.test.sql`.

**Build.**

- [ ] Mark an occupant moved out by ending their `occupancy` and freeing the bed.
- [ ] Rank approved applicants with the engine's open-bed mode against current occupants on the fill page, showing "Unscored" when no occupant has a profile.
- [ ] Write a `fill_bed` Postgres function that creates the occupancy, adds the student to the room thread, and audits the choice like an override.
- [ ] Invite unprofiled occupants to fill in the questionnaire from the unscored state.

**You see.**

- [ ] A Manager marks a bed free, sees a ranked list, picks the top applicant, and that student sees the assignment and chat.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `open-bed.test.sql` asserts `fill_bed` writes one occupancy, one thread member and one audit row, and refuses an occupied bed. Run `pnpm supabase test db`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high-fast` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Open a published room at trunk and head. Trunk lacks fill, so record that and gate a filled bed at head. Save `dm19-filled.png`. Pass when the new student sees the room and thread.
- [ ] Lane 2. Mark an occupant moved out. Save `dm19-moveout.png`. Pass when the bed shows open.
- [ ] Lane 3. Open fill with profiled occupants. Save `dm19-ranked.png`. Pass when scores sort descending.
- [ ] Lane 4. Open fill with unprofiled occupants. Save `dm19-unscored.png`. Pass when the room shows Unscored and the invite control.
- [ ] Lane 5. Check an applicant failing gender policy. Save `dm19-policy.png`. Pass when they are absent.
- [ ] Lane 6. Fill the same bed in two tabs. Save `dm19-race.png`. Pass when the second is refused.
- [ ] Lane 7. Query audit. Save `dm19-audit.png`. Pass when the choice is logged with the actor.
- [ ] Lane 8. As Staff, open fill. Save `dm19-staff.png`. Pass when it is hidden.
- [ ] Lane 9. Read the filled student's email. Save `dm19-email.png`. Pass when it names the room.
- [ ] Lane 10. Rank 500 applicants. Save `dm19-500.png`. Pass when the list renders.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. LCP of `/console/<slug>` at trunk and head, plus fill page LCP with 500 applicants at head.
- [ ] Probe. Run `scripts/perf.ts` interleaved five times each side, then on the fill page at head.
- [ ] Baseline. Record trunk console LCP first.
- [ ] Rule. Fail when head exceeds trunk by 10 percent or the fill page exceeds 2.5 seconds.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 1, 3 and 4 screenshots into `../dormmate-review/dm19-review-<slug>.png`.
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `../dormmate-review/dm19-review.mp4`.
- [ ] Post the screenshots and the video in chat for the operator. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends DM-19 to the base-branch stack and Yhasmen Nogales lands it bottom-up.

## Show the audit log and honor data rights (DM-20)

**Depends on.** DM-18.

**Files.**

- [ ] Create `apps/web/app/console/[workspace]/audit/page.tsx`.
- [ ] Create `apps/web/app/app/settings/data/page.tsx` and `settings/data/actions.ts`.
- [ ] Create `apps/web/workflows/export.ts`, `apps/web/workflows/delete.ts` and `apps/web/workflows/retention.ts`.
- [ ] Create `apps/web/workflows/retention.test.ts`.

**Build.**

- [ ] List audit events with filters by action, actor and date for Owners and Managers.
- [ ] Build a JSON export in Storage with a signed link, and delete or anonymize a student's data on request.
- [ ] Run a nightly retention workflow that deletes profiles and messages 90 days after cycle end or move-out.

**You see.**

- [ ] A student downloads their export, deletes their account, and the audit log shows the deletion without their answers.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `retention.test.ts` asserts a profile 91 days past cycle end is deleted and one at 89 days remains. Run `pnpm --filter web test`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high-fast` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Publish at trunk and head. Trunk lacks the audit page, so record that and gate the filtered audit list at head. Save `dm20-audit.png`. Pass when publish rows show actor and time.
- [ ] Lane 2. Filter audit by override. Save `dm20-filter.png`. Pass when only override rows show.
- [ ] Lane 3. Export as a student. Save `dm20-export.png`. Pass when the JSON holds their profile versions and messages only.
- [ ] Lane 4. Open the export link signed out. Save `dm20-link.png`. Pass when it expires or refuses access.
- [ ] Lane 5. Delete as a student. Save `dm20-delete.png`. Pass when sign-in fails and messages show as from a deleted user.
- [ ] Lane 6. Run retention with a seeded old cycle. Save `dm20-retention.png`. Pass when old profiles and messages are gone.
- [ ] Lane 7. As Staff, open audit. Save `dm20-staff.png`. Pass when it is hidden.
- [ ] Lane 8. Read the audit payload for a deletion. Save `dm20-payload.png`. Pass when it holds no answers.
- [ ] Lane 9. Run retention twice. Save `dm20-idempotent.png`. Pass when the second run deletes nothing.
- [ ] Lane 10. Page through 10,000 audit rows. Save `dm20-paging.png`. Pass when each page loads.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. LCP of `/console/<slug>` at trunk and head, plus audit page LCP with 10,000 rows and export time for a student with 1,000 messages at head.
- [ ] Probe. Run `scripts/perf.ts` interleaved five times each side, then time three exports at head.
- [ ] Baseline. Record trunk console LCP first.
- [ ] Rule. Fail when head exceeds trunk by 10 percent, audit LCP exceeds 2.5 seconds, or export exceeds 30 seconds.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 1, 3 and 5 screenshots into `../dormmate-review/dm20-review-<slug>.png`.
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `../dormmate-review/dm20-review.mp4`.
- [ ] Post the screenshots and the video in chat for the operator. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends DM-20 to the base-branch stack and Yhasmen Nogales lands it bottom-up.

## Publish the marketing site, legal pages and platform admin (DM-21)

**Depends on.** DM-08.

**Files.**

- [ ] Create `apps/web/app/(marketing)/page.tsx`, `pricing/page.tsx`, `universities/page.tsx`, `privacy/page.tsx`, `terms/page.tsx` and `dpa-request/page.tsx`.
- [ ] Create `apps/web/app/admin/page.tsx`, `admin/workspaces/page.tsx`, `admin/workspaces/[id]/page.tsx` and `admin/jobs/page.tsx`.
- [ ] Create `apps/web/instrumentation.ts` and `apps/web/lib/analytics.ts` for Sentry and PostHog.

**Build.**

- [ ] Write the landing, pricing with a per-bed calculator, universities page with a contact form, and the DPA request form.
- [ ] Draft the privacy notice with a child-friendly summary for counsel to review.
- [ ] Gate `/admin` on a platform-admin claim, with workspace tiers, trial overrides and run timings, and no access to answers or messages.
- [ ] Send operator events and anonymous student funnel events to PostHog, and errors to Sentry.

**You see.**

- [ ] `/` explains DormMate and Start free leads to `/signup`. An admin sees every workspace without student data.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `apps/web/lib/pricing.test.ts` asserts the calculator returns literal totals for 50 Standard beds and 500 Campus beds. Run `pnpm --filter web test`.
- [ ] `supabase/tests/admin.test.sql` asserts a platform admin reads 0 `profile_version` and `message` rows. Run `pnpm supabase test db`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high-fast` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Open `/` at trunk and head. Save `dm21-landing.png`. Pass when head shows the landing and Start free reaches `/signup`.
- [ ] Lane 2. Use the pricing calculator at 120 beds. Save `dm21-pricing.png`. Pass when it shows the literal Standard total.
- [ ] Lane 3. Submit the DPA request form. Save `dm21-dpa.png`. Pass when a confirmation shows and an email reaches Mailpit.
- [ ] Lane 4. Read `/privacy`. Save `dm21-privacy.png`. Pass when the child-friendly summary and Singapore sub-processor show.
- [ ] Lane 5. Open `/admin` as an Owner. Save `dm21-admin-denied.png`. Pass when it shows not found.
- [ ] Lane 6. Open `/admin/workspaces/[id]` as an admin. Save `dm21-admin.png`. Pass when tier and trial show and no answers appear.
- [ ] Lane 7. Extend a trial as admin. Save `dm21-trial.png`. Pass when the Owner sees the new end date.
- [ ] Lane 8. Throw a test error. Save `dm21-sentry.png`. Pass when Sentry records it.
- [ ] Lane 9. Inspect PostHog events from a student session. Save `dm21-posthog.png`. Pass when no email or name appears.
- [ ] Lane 10. Open marketing pages at 390 px. Save `dm21-mobile.png`. Pass when none scrolls sideways.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. LCP and TTFB of `/` at trunk and head, plus `/pricing` LCP at head.
- [ ] Probe. Run `scripts/perf.ts` interleaved five times each side under 4x CPU throttling.
- [ ] Baseline. Record trunk `/` first.
- [ ] Rule. Fail when head `/` LCP exceeds 2.0 seconds or `/pricing` exceeds 2.5 seconds.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 1, 2 and 4 screenshots into `../dormmate-review/dm21-review-<slug>.png`.
- [ ] Record a 30 to 60 second video of the change on a lane VM. Save it as `../dormmate-review/dm21-review.mp4`.
- [ ] Post the screenshots and the video in chat for the operator. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends DM-21 to the base-branch stack and Yhasmen Nogales lands it bottom-up.

## Pass Gate 1 with a dorm dry run (DM-22)

**Depends on.** DM-01 to DM-21.

**Files.**

- [ ] Create `supabase/seed/dry-run.ts`.
- [ ] Create `apps/web/e2e/dry-run.spec.ts`.
- [ ] Create `docs/gate-1-report.md`.

**Build.**

- [ ] Seed a synthetic dorm with 3 properties, 60 rooms, 150 students including 5 minors and 10 mutual request groups in `dry-run.ts`.
- [ ] Script journeys 1 to 5 from `docs/user-journeys.md` end to end in `dry-run.spec.ts`.
- [ ] Run the dry run on staging and write timings, defects and the setup time in `gate-1-report.md`.

**You see.**

- [ ] `dry-run.spec.ts` passes on staging and `gate-1-report.md` shows setup under one hour.

**Verify, unit.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] `dry-run.spec.ts` asserts literal counts for placed students, honored mutual groups and unmatched students. Run `pnpm --filter web e2e dry-run`.

**Verify, live.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked. Ten lanes on `grok-4.7-high-fast` at the PR head, per the boot recipe.

- [ ] Lane 1. Regression lane against trunk. Run `dry-run.spec.ts` at trunk and head. Trunk lacks the spec, so record that and gate the full run at head. Save `dm22-dryrun.png`. Pass when every step passes.
- [ ] Lane 2. Run journey 1, owner setup, by hand with a timer. Save `dm22-setup.png`. Pass when it finishes under one hour.
- [ ] Lane 3. Run journey 2, student invite to room chat, on a phone viewport. Save `dm22-student.png`. Pass when the student reaches chat.
- [ ] Lane 4. Run journey 3, filling open beds. Save `dm22-openbed.png`. Pass when the bed fills and audit logs it.
- [ ] Lane 5. Run journey 4, review, override and publish. Save `dm22-publish.png`. Pass when every placed student is notified.
- [ ] Lane 6. Run journey 5, report and moderation. Save `dm22-report.png`. Pass when the report resolves.
- [ ] Lane 7. Count honored mutual groups. Save `dm22-honor.png`. Pass when 90 percent or more are placed together.
- [ ] Lane 8. Check every minor without consent. Save `dm22-minors.png`. Pass when none is placed.
- [ ] Lane 9. Run cross-workspace probes from DM-05 against staging. Save `dm22-isolation.png`. Pass when all return 0 rows.
- [ ] Lane 10. Read Sentry for the dry-run window. Save `dm22-errors.png`. Pass when no unhandled error is recorded.

**Verify, perf.** Tests alone are not sufficient verification. A PR is verified only when its unit, live, and perf boxes are all checked.

- [ ] Metric. Total `dry-run.spec.ts` wall time and the matching run time on staging, plus `/app` and `/console/<slug>` LCP at trunk and head.
- [ ] Probe. Run the spec three times on staging and `scripts/perf.ts` interleaved five times each side.
- [ ] Baseline. Record trunk LCP first.
- [ ] Rule. Fail when head LCP exceeds trunk by 10 percent, the matching run exceeds 60 seconds, or the spec exceeds 15 minutes.

**Review gate.** The operator reviews before merge.

- [ ] Copy lane 2, 3 and 5 screenshots into `../dormmate-review/dm22-review-<slug>.png`.
- [ ] Record a 30 to 60 second video of the dry run on a lane VM. Save it as `../dormmate-review/dm22-review.mp4`.
- [ ] Post the screenshots, the video and `docs/gate-1-report.md` in chat for the operator. Stop at merge-ready. Wait for the operator's click.

**Merge.**

- [ ] Root's clean verdict at the exact head SHA.
- [ ] Bugbot triage done.
- [ ] Rebased onto current trunk after the verdict, patch-id unchanged.
- [ ] The root appends DM-22 to the base-branch stack and Yhasmen Nogales lands it bottom-up.

## Close the program

- [ ] Every box above is checked with its evidence.
- [ ] Reply to the operator with the report the execution playbook names, with links to the stack root and tip, a one-line verdict per PR, and the Gate 1 result.

## Appendix A. Prototype evidence

**The engine needs no worker and no typed arrays for v1.** A throwaway script at `%TEMP%\dormmate-bench\bench.mjs` (outside the repo, no branch or SHA) generated synthetic applicants with ten categories, deal-breakers at threshold 0.5 and pair-mean importance, then ran all-pairs scoring, greedy pairing and 2 million swap attempts for doubles. Measured on the operator's Windows laptop with Node 24.5.

| Variant | Applicants | Scoring ms | Greedy ms | Local search ms | Total ms | RSS MB |
| --- | --- | --- | --- | --- | --- | --- |
| Plain objects | 2,000 | 1,515 | 428 | 360 | 2,302 | 133 |
| Typed arrays | 2,000 | 110 | 446 | 346 | 902 | 145 |
| Typed arrays | 4,000 | 431 | 2,769 | 471 | 3,671 | 298 |

The plain-object variant is about 26 times under the 60-second target, so DM-02 uses readable objects. Typed arrays stay an option if DM-07 shows Vercel's single vCPU is far slower.

These stay unproven, and the PR named proves each.

- Rooms of 3 and 4 with locked groups, proven by DM-03.
- Realistic answer distributions, proven by DM-04.
- Vercel Workflow in `sin1`, retries and local dev on Windows, proven by DM-07.
- Row-level security query cost at scale, proven by DM-05.

## Appendix B. Alternatives rejected

- **Orchestrate or autopilot-full.** Rejected because the PRs are coupled and Yhasmen Nogales lands each one. Autopilot-stack keeps review before landing.
- **A failing-test PR for engine types alone.** The architecture's Phase 0 unit 1 ends with a failing test, which cannot pass CI on its own. DM-02 merges the types, the fixture and the engine so the stack stays green.
- **Typed arrays from day one.** Rejected by the prototype. Plain objects are fast enough and easier to read.
- **One migration per feature with no foundation schema.** Rejected so row-level security is designed once against the full data model in DM-05. Later PRs add functions and policies only.
- **An ORM such as Drizzle.** Rejected by architecture decision 12. Transactions live in Postgres functions.
- **Planning phases 2 to 4 now.** Rejected because the pilot decides P1 priorities, and SMS, PayMongo and SSO wait on business registration.

## Appendix C. Risks

- **This laptop cannot run the local stack.** Docker is not installed and the C drive has about 1.2 GB free. Live lanes run on cloud VMs. The operator frees disk and installs Docker Desktop before local work on DM-05 or later. Watched from DM-05.
- **The control skills are not installed.** `control-ui` and `control-cli` from `cursor-team-kit` are not in this machine's skill list. Lanes fall back to Playwright scripts and terminal captures until they are installed. Watched from DM-01.
- **The default swarm and judgment models are unavailable here.** `grok-4.7-xhigh-fast` and `claude-opus-5-5-max` are not offered. The plan uses `grok-4.7-high-fast` for lanes and the strongest available Claude model for judgment.
- **Deploys need the operator.** DM-07 and every staging lane need Vercel and Supabase accounts and a go for each deploy. Watched in DM-07.
- **Resend needs a verified domain.** Without DNS access, email lanes run only against Mailpit. Watched in DM-06.
- **Migration ordering can collide.** Parallel owners add migrations. The root renames timestamps to stack order on append. Watched from DM-08.
- **Larger-room quality is unmeasured.** Swap search may leave poor triples. DM-03 reports mean room score against the doubles baseline.
- **Legal text is a draft.** DM-21's privacy notice and DPA form need counsel review before the pilot. Watched in DM-21 and Gate 1.
- **Video review media fills a small disk.** Review media lives in `../dormmate-review/`, outside the repo, and is deleted after landing.

## Appendix D. Links and reading list

- Read `docs/prd.md`, `docs/user-journeys.md`, `docs/site-map.md` and `docs/system-architecture.md` before editing.
- DM-02, DM-05, DM-15, DM-16 and DM-18 run `pstack/skills/how/SKILL.md` before building and `pstack/skills/interrogate/SKILL.md` before code-ready, because they set the engine contract, tenancy, matching, publish and chat security.
- Each owner keeps a `decisions.tsv` trail per `pstack/skills/show-me-your-work/SKILL.md`, uncommitted, and returns it in the report.
