# PROGRESS.md — Fitverse (personal fitness tracker)

> Update at the end of every chat ("wrap up"). Paste this file together with `PLAN.md` and `WORKOUT_PLAN.md` at the start of each new chat.
> `PLAN.md` / `WORKOUT_PLAN.md` are the plan; this file is what was **actually built**.

**Last updated:** 2026-10-21 (planning finalized, no code written yet)
**Current phase:** Backend
**Backend status:** not started _(change to FROZEN after chunk 12)_
**Next chunk:** 1 — Backend foundation
**Next checkpoint:** CP1 — after chunk 5

---

## 1. Chunk checklist

### Backend
- [ ] 1 — Backend foundation (Express 5, env, DB, errors, tooling)
- [ ] 2 — User model, register, login
- [ ] 3 — Protect middleware, me, logout, rate limits
- [ ] 4 — Profile & BMI (+ age band, healthy weight range)
- [ ] 5 — Exercise model + fetch pipeline (76 exercises)
- [ ] ✅ **CHECKPOINT 1** passed (PLAN.md §13)
- [ ] 6 — Seed exercises + exercise API
- [ ] 7 — WorkoutPlan model + templates + builder (36 plans)
- [ ] 8 — Seed plans + plan API + recommendation
- [ ] 9 — Workout logs: model, create, list, get
- [ ] 10 — Logs: update, delete, ownership
- [ ] ✅ **CHECKPOINT 2** passed (PLAN.md §13)
- [ ] 11 — Stats part 1: summary, volume, frequency
- [ ] 12 — Stats part 2 + backend freeze

### Frontend
- [ ] 13 — Frontend scaffold
- [ ] 14 — Auth UI
- [ ] 15 — Profile & BMI UI
- [ ] ✅ **CHECKPOINT 3** passed (PLAN.md §13)
- [ ] 16 — Exercise library UI
- [ ] 17 — Plans UI
- [ ] 18 — Log workout UI
- [ ] 19 — History UI
- [ ] 20 — Dashboard
- [ ] ✅ **CHECKPOINT 4** passed (PLAN.md §13)
- [ ] 21 — Progress charts
- [ ] 22 — Frontend polish

### Integration
- [ ] 23 — Single-origin production build + root scripts
- [ ] 24 — End-to-end QA & fixes
- [ ] 25 — Deployment (optional)
- [ ] ✅ **CHECKPOINT 5 (final)** passed (PLAN.md §13)

---

## 2. Chat plan

| Chat | Chunks | Ends with |
|---|---|---|
| 1 | 1–3 | |
| 2 | 4–5 | **CP1** |
| 3 | 6–8 | |
| 4 | 9–10 | **CP2** |
| 5 | 11–13 | |
| 6 | 14–15 | **CP3** |
| 7 | 16–18 | |
| 8 | 19–20 | **CP4** |
| 9 | 21–23 | |
| 10 | 24–25 | **CP5** |

---

## 3. Checkpoint results
At each checkpoint the assistant prints the checklist from `PLAN.md` §13. Record your reply here. Do not start the next chunk until every item is PASS (or the failure is logged in §11 as accepted).

| Checkpoint | After chunk | Date | Result (item numbers) | Notes / fixes needed |
|---|---|---|---|---|
| CP1 | 5 | | | |
| CP2 | 10 | | | |
| CP3 | 15 | | | |
| CP4 | 20 | | | |
| CP5 | 25 | | | |

---

## 4. Environment & setup status

| Item | Value |
|---|---|
| Node version | _ (needs ≥ 22) |
| MongoDB | Atlas, cluster host `fitverse.gjdcxk8.mongodb.net`, database `fitverse` |
| Connection string | Stored **only** in `backend/.env`. Never record it here. |
| `.env` created with real URI + generated `JWT_SECRET` | ☐ |
| Atlas Network Access allows my IP | ☐ |
| **Atlas DB password rotated** (it was pasted in chat, treat as exposed) | ☐ |
| Backend port | 5000 (planned) |
| Frontend dev port | 5173 (planned) |
| Installed versions (pin here) | _ |

---

## 5. Decisions made
Planning decisions D1–D23 are in `PLAN.md` §3; workout decisions W1–W8 are in `WORKOUT_PLAN.md` §2. Log **new or changed** decisions here.

| ID | Chunk | Decision | Why |
|---|---|---|---|
| D18–D23 | planning | Home-first equipment; selection level overrides; age band as third plan dimension (36 plans); impact rule; Atlas DB `fitverse`; checkpoints every 5 chunks | See `PLAN.md` §3 |
| W1–W8 | planning | Home-first 76-exercise selection from Free Exercise DB; pull-ups advanced; 28 library-only exercises | See `WORKOUT_PLAN.md` §2 |
| _ | _ | _ | _ |

---

## 6. Plan changes (deviations from PLAN.md)
Anything that changed routes, fields, files or chunks after this point. Must also be edited in PLAN.md / WORKOUT_PLAN.md.

| Date | Chunk | Change | Section updated |
|---|---|---|---|
| 2026-10-21 | planning | Added `WORKOUT_PLAN.md` and `selection.json` (76 verified exercises). Plans went from 12 to 36 (age bands). Exercise model gained `lowImpact`, `slots`; WorkoutPlan gained `ageBand`; profile endpoints return computed `ageBand`, `healthyWeightRangeKg`; plans endpoints take `ageBand` and recommended returns `why`. Added checkpoints (§13), chat grouping, secrets rules. Chunks 1, 4, 5, 6, 7, 8, 15, 17, 25 edited. | PLAN.md §0, 1, 3, 4, 5, 6, 7, 9, 10, 11, 12, 13 |
| _ | _ | _ | _ |

---

## 7. Files created / changed

| Chunk | File | Created / Changed | Notes |
|---|---|---|---|
| planning | `PLAN.md` | Created, then updated | Includes §13 checkpoints |
| planning | `PROGRESS.md` | Created, then updated | This file |
| planning | `WORKOUT_PLAN.md` | Created | Workout design, 76 exercises, 36 plans |
| planning | `selection.json` | Created | Copy to `backend/src/seed/data/selection.json` in chunk 5 |

---

## 8. API routes as built
Status: `☐` not built · `✔` built and tested. In **Notes**, record request body, query params, response shape and error codes **as actually implemented**.

| Method | Path | Auth | Chunk | Status | Notes (as built) |
|---|---|---|---|---|---|
| GET | `/api/health` | no | 1 | ☐ | |
| POST | `/api/auth/register` | no | 2 | ☐ | |
| POST | `/api/auth/login` | no | 2 | ☐ | |
| POST | `/api/auth/logout` | no | 3 | ☐ | |
| GET | `/api/auth/me` | yes | 3 | ☐ | profile incl. `ageBand`, `healthyWeightRangeKg` |
| GET | `/api/profile` | yes | 4 | ☐ | + `ageBand`, `healthyWeightRangeKg` |
| PUT | `/api/profile` | yes | 4 | ☐ | + `ageBand`, `healthyWeightRangeKg` |
| GET | `/api/exercises` | yes | 6 | ☐ | |
| GET | `/api/exercises/filters` | yes | 6 | ☐ | |
| GET | `/api/exercises/:id` | yes | 6 | ☐ | |
| GET | `/exercise-images/*` | no | 6 | ☐ | |
| GET | `/api/plans` | yes | 8 | ☐ | filters `bmiCategory`, `experienceLevel`, `ageBand`; 36 total |
| GET | `/api/plans/recommended` | yes | 8 | ☐ | includes `why` |
| GET | `/api/plans/:id` | yes | 8 | ☐ | |
| POST | `/api/logs` | yes | 9 | ☐ | |
| GET | `/api/logs` | yes | 9 | ☐ | |
| GET | `/api/logs/:id` | yes | 9 | ☐ | |
| PUT | `/api/logs/:id` | yes | 10 | ☐ | |
| DELETE | `/api/logs/:id` | yes | 10 | ☐ | |
| GET | `/api/stats/summary` | yes | 11 | ☐ | |
| GET | `/api/stats/volume` | yes | 11 | ☐ | |
| GET | `/api/stats/frequency` | yes | 11 | ☐ | |
| GET | `/api/stats/exercise/:exerciseId` | yes | 12 | ☐ | |
| GET | `/api/stats/personal-records` | yes | 12 | ☐ | |

---

## 9. Models as built
Record the **actual** fields, types, defaults, indexes and any virtuals/transforms once built.

### User — chunk 2
_not built_

### Profile — chunk 4
_not built_ (computed, not stored: `ageBand`, `healthyWeightRangeKg`)

### Exercise — chunk 5
_not built_ (includes `lowImpact`, `slots`)

### WorkoutPlan — chunk 7
_not built_ (includes `ageBand`; unique index `{ bmiCategory, experienceLevel, ageBand }`)

### WorkoutLog — chunk 9
_not built_

---

## 10. Seed data status
| Item | Status | Notes |
|---|---|---|
| `selection.json` (ids + slot tags) | ✔ decided, verified | 76 entries; all ids exist in dataset; 152/152 images reachable (2026-10-17) |
| Copied into `backend/src/seed/data/` | ☐ | chunk 5 |
| `exercises.selected.json` | ☐ | chunk 5 |
| Images in `public/exercise-images/` | ☐ | expect 152 |
| Coverage report (`WORKOUT_PLAN.md` §4) | ☐ | all 14 slots must be OK |
| Exercises in DB | ☐ | expect 76 |
| Plans in DB | ☐ | expect 36 |
| Selection changes requested after plan review (CP2 item 8) | _ | |

---

## 11. Known issues

| # | Chunk | Issue | Severity | Status |
|---|---|---|---|---|
| _ | _ | _ | _ | open |

---

## 12. Frontend notes (fill from chunk 13)
- Routes implemented: _
- Shared components available: _
- Query keys in use: _

---

## 13. Next chunk
**Chunk 1 — Backend foundation**
- Needs from you: nothing to paste. Create `backend/.env` yourself with your Atlas URI (database `fitverse`) and a generated `JWT_SECRET` (see `PLAN.md` §10). Node ≥ 22.
- First, rotate the Atlas database password (it was shared in chat) and allow your IP in Atlas → Network Access.
- After it: how to test + "done when" from `PLAN.md` §11. Chunks 2–3 follow in the same chat.
