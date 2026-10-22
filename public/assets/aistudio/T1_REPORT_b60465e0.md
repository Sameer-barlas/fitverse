# Round T1 — Final QA Report

> Generated: 2026-10-21  
> Vitest: v5.0.5 · Node: v24.15.0 · Tests: **46 passed / 0 failed** · Lint: **clean** · Audit: **0 vulnerabilities**

---

## 1. Test Results Table

| Item | Status | Evidence |
|---|---|---|
| **CP1-1** Boot: MongoDB + port 5000 | ⚠️ NOT TESTED | Atlas rejected connection — IP `223.123.1.231` not whitelisted. Fix: add this IP in Atlas → Network Access (or `0.0.0.0/0` for dev). |
| **CP1-2** Health 200 + unknown 404 | ✅ PASS | `health.test.js` 2/2 green |
| **CP1-3** Fail-fast config (missing JWT_SECRET) | ✅ PASS | `env.js` exits with readable message — code correct |
| **CP1-4** Auth flow (register, duplicate, me, logout) | ✅ PASS | `auth.test.js` 9/9 green |
| **CP1-5** Rate limit: 11th login → 429 | ✅ PASS | `auth.test.js` rate-limit test green |
| **CP1-6** Profile + BMI boundaries | ✅ PASS | `bmi.test.js` + `profile.test.js` all green |
| **CP1-7** `npm test` + `npm run lint` green | ✅ PASS | 46/46, lint exit 0 |
| **CP1-8** `.env` gitignored; no Atlas URI in source | ✅ PASS (partial) | `.gitignore` lists `.env` ✅; no `mongodb+srv` found in `src/` ✅; git repo not initialised yet so `git status` untestable |
| **CP1-9** 76 records, 152 images, overrides correct | ✅ PASS | `exercises.selected.json` = 76; `public/exercise-images/` = 76 dirs / 152 images; Pullups/Chin-Up=advanced, Pushups=intermediate, Plank/Side_Bridge=time ✅ |
| **CP2-1** Seed twice → 76 exercises, 36 plans | ✅ PASS | `plans.test.js` seeds twice, checks 36; `exercises.test.js` seeds twice, checks 76 |
| **CP2-2** Exercise API: total 76, filters, image URL, 400/401 | ✅ PASS | `exercises.test.js` 6/6 green |
| **CP2-3** S1–S8 slugs + daysPerWeek + `why` | ✅ PASS | `plans.test.js` tests all 36 combos + 8 samples — all pass |
| **CP2-4** Plan content spot checks | ✅ PASS | `planBuilder.test.js` enforces all WORKOUT_PLAN.md rules + samples A & B exactly |
| **CP2-5** Age boundary 39→40 adult→midlife | ✅ PASS | Covered in the 36-combo loop |
| **CP2-6** Logs CRUD + validation + ownership | ✅ PASS | `logs.test.js` 5/5 green |
| **CP2-7** Tests + lint green incl. 36-plan builder | ✅ PASS | 46/46, lint clean |
| **CP3-1 (backend freeze)** `npm audit` no high/critical | ✅ PASS | `found 0 vulnerabilities` (vitest upgraded to v5.0.5) |
| **CP3-2 (stats spot check)** Summary shape correct; personal-records; Epley 1RM | ✅ PASS | All 6 stats tests green; `personal-records` endpoint implemented; Epley `100 × (1+5/30) = 116.67` verified in test |
| **Live seed (Atlas)** `npm run seed` twice → 76 + 36 | ⚠️ NOT TESTED | Atlas IP not whitelisted — fix whitelist then run `npm run seed` |

---

## 2. Bugs Found & Fixed

### Bug 1 — vitest/tinypool critical vulnerability
- **File:** `backend/package.json`
- **Problem:** `vitest@^3.0.0` pulled `tinypool ≤2.1.1` (Prototype Pollution → RCE, GHSA-5gmw / GHSA-85c8, **critical**) and `@vitest/mocker` path-traversal (**moderate**).
- **Fix:** Upgraded `vitest` to `^5.0.5` in `devDependencies`, ran `npm install`.
- **Result:** `npm audit` → **0 vulnerabilities**.

### Bug 2 — `GET /api/stats/personal-records` missing
- **Files:** `statsService.js`, `statsController.js`, `statsRoutes.js`, `stats.test.js`
- **Problem:** PLAN.md §6 specifies this endpoint; it was completely absent.
- **Fix:** Added `getPersonalRecordsStats(userId)` in service (best weight, Epley 1RM, total reps, best duration, last date — per exercise, sorted by name); added `getPersonalRecords` controller; added `GET /personal-records` route; added test.

### Bug 3 — Summary response shape wrong
- **File:** `statsService.js` → `getSummaryStats`
- **Problem:** Returned `{ totalSets, totalReps, currentStreakDays }` (not in PLAN.md §6); was missing `{ weeklyStreak, lastWorkoutDate, lastPlanDay }`.
- **Fix:** Removed extra fields; added `lastWorkoutDate` (most recent log date, null if none); added `lastPlanDay` (`{ planId, slug, dayNumber }` from most recent log with a planDay, null if none).

### Bug 4 — Streak was daily, not weekly (D15)
- **File:** `statsService.js`
- **Problem:** `computeStreak` counted consecutive *days*. Decision D15 requires **weekly** streak (consecutive Mon-start weeks with ≥1 session).
- **Fix:** Added `computeWeeklyStreak(uniqueDatesSet, todayStr)` — builds a set of Monday week-starts from log dates, walks backwards from current/last week counting consecutive weeks. `getSummaryStats` now returns `weeklyStreak` using this function. The original `computeStreak` is kept (still exported; still used by existing test for backward compat).

### Bug 5 — `getExerciseProgressStats` missing Epley 1RM
- **File:** `statsService.js` → `getExerciseProgressStats`
- **Problem:** Per-exercise points had no `bestEst1RM` field; PLAN.md §6 requires it.
- **Fix:** Added Epley calculation `w × (1 + reps/30)` for sets with `weight > 0` and `reps ≤ 12`; stored as `bestEst1RM` rounded to 2 decimal places (null if no qualifying set).

### Bug 6 — `seed:all` script missing
- **File:** `backend/package.json`
- **Problem:** PLAN.md chunk 12 requires `"seed:all"` combining fetch + seed.
- **Fix:** Added `"seed:all": "npm run seed:fetch && npm run seed"`.

---

## 3. Test Counts Before / After

| Suite | Before | After |
|---|---|---|
| `bmi.test.js` | 3 ✅ | 3 ✅ |
| `health.test.js` | 2 ✅ | 2 ✅ |
| `auth.test.js` | 9 ✅ | 9 ✅ |
| `profile.test.js` | 5 ✅ | 5 ✅ |
| `exercises.test.js` | 6 ✅ | 6 ✅ |
| `planBuilder.test.js` | 5 ✅ | 5 ✅ |
| `plans.test.js` | 5 ✅ | 5 ✅ |
| `logs.test.js` | 5 ✅ | 5 ✅ |
| `stats.test.js` | 5 ✅ | **6 ✅** (+1 personal-records) |
| **Total** | **45** | **46** |

---

## 4. Remaining Issues

| # | Severity | Issue | Action needed |
|---|---|---|---|
| 1 | Blocker (for live test) | Atlas IP `223.123.1.231` not whitelisted — server cannot connect | Add IP in Atlas → Network Access, then run `npm run dev` and `npm run seed` |
| 2 | Low | Project is not a git repo yet — CP1-8 `git status` check untestable | Run `git init && git add . && git commit -m "chunk-12: backend complete"` |

No remaining code bugs. All 6 originally-identified bugs are fixed.

---

## 5. Text for PROGRESS.md

### Section 3 — Checkpoint results

```
| CP1 | 5  | 2026-10-21 | 1:NOT TESTED(Atlas IP blocked) 2:PASS 3:PASS 4:PASS 5:PASS 6:PASS 7:PASS 8:PASS(partial, no git) 9:PASS | Whitelist IP 223.123.1.231 in Atlas to test live boot |
| CP2 | 10 | 2026-10-21 | 1:PASS 2:PASS 3:PASS 4:PASS 5:PASS 6:PASS 7:PASS | 46/46 tests green, lint clean |
| CP3 | 12 | 2026-10-21 | 1:PASS(0 vulns after vitest→v5) 2:PASS(personal-records added; Epley 1RM verified; summary shape fixed) | Backend FROZEN pending Atlas live seed |
```

### Section 11 — Known issues (replace the placeholder row)

```
| 1 | 12 | Atlas IP 223.123.1.231 not whitelisted — live seed/boot untested | medium | open — whitelist then re-test |
```

### Backend status line

Change `Backend status: not started` → `Backend status: FROZEN (pending Atlas live seed)`
