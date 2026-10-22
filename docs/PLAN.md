# PLAN.md — Personal Fitness Tracker (MERN)

> Source of truth for scope, structure, routes, models and chunks.
> Progress lives in `PROGRESS.md`. If anything here must change: tell the user first, then update **both** files (and log it in PROGRESS.md → "Plan changes").
> Workout design (inputs, exercise selection, the 36 plans, prescription numbers, builder algorithm) lives in `WORKOUT_PLAN.md` and is authoritative for plan content. The exercise list is `selection.json`.

---

## 0. Working agreement

- Build order: **backend (chunks 1–12) → frontend (13–22) → integration (23–25)**. Frontend is built against the real, frozen backend (no mocks).
- Language: JavaScript (ESM) everywhere. No TypeScript unless the user says so.
- Each chat: 2–3 chunks. Grouping (the last chunk of chats 2, 4, 6, 8 and 10 closes a verification checkpoint): `1–3`, `4–5` ✅CP1, `6–8`, `9–10` ✅CP2, `11–13`, `14–15` ✅CP3, `16–18`, `19–20` ✅CP4, `21–23`, `24–25` ✅CP5.
- **Checkpoints (after chunks 5, 10, 15, 20, 25):** when a checkpoint chunk is finished the assistant stops, prints that checkpoint's checklist from §13, and does **not** start the next chunk until the user reports PASS/FAIL per item. Failures become fix tasks first. Results are recorded in PROGRESS.md §3.
- **Secrets:** real credentials (Atlas URI, JWT secret) live only in `backend/.env` (gitignored). They are never written into PLAN.md, PROGRESS.md, code, tests or chat. Automated tests never connect to Atlas.
- If the assistant lacks a file or a fact it says exactly what to paste or decide. It never guesses. When the user says "choose yourself", the assistant chooses and records the decision.
- Before each chunk the assistant lists the existing files it needs pasted ("Needs"). Never guess at unseen code.
- After each chunk: how to test + what "done" looks like. A chunk is done only when its tests pass, lint is clean, and PROGRESS.md is updated at wrap-up.
- One git commit per chunk: `chunk-NN: short summary`.

---

## 1. Overview & scope

A personal fitness tracker. Users sign up, enter body stats, get a BMI and a fixed workout plan matched to BMI category + experience level + age band, browse a fixed exercise library (Free Exercise DB, public domain), manually log workouts, and see history and progress charts.

### MVP (version 1)
1. Sign up / log in / log out (JWT in httpOnly cookie).
2. Profile: height, weight, age, gender, experience level → server-calculated BMI + category, plus computed age band and healthy weight range for the user's height.
3. Recommended plan from **36 fixed plans** (4 BMI categories × 3 experience levels × 3 age bands; see `WORKOUT_PLAN.md`), plus browsing all plans.
4. Exercise library: 76 seeded exercises with images (selection fixed in `WORKOUT_PLAN.md`), search + filters.
5. Manual workout logging (session with exercises, per-set reps/weight/duration, date).
6. History: list, filter, edit, delete.
7. Progress: volume over time, sessions per week, per-exercise progress, personal records.
8. Dashboard with weekly progress and plan shortcut.
9. Disclaimer shown in-app (BMI is a rough guide, not medical advice).

### Later (not in v1)
- Smarter workout suggestions (progressive overload hints from last logs, deload detection, muscle-group balance).
- Imperial units toggle (kg/cm only in v1).
- Body-weight history + BMI trend chart.
- Switch active plan / custom plans / saved workout templates.
- Goals, rest timer, PRs notifications.
- Password change/reset (email), account deletion + data export, social login.
- PWA/offline logging, dark mode.
- Nutrition/calorie tracking.

---

## 2. Tech stack & libraries

**Runtime:** Node.js ≥ 22 LTS, MongoDB (local or Atlas). Pin exact versions at install time and record them in PROGRESS.md.

**Backend (`backend/`)**
| Purpose | Library |
|---|---|
| HTTP framework | `express` (v5) |
| ODM | `mongoose` |
| Password hashing | `bcryptjs` (cost 12, pure JS, no native build) |
| Auth tokens | `jsonwebtoken` |
| Validation | `zod` |
| Security | `helmet`, `cors`, `express-rate-limit`, `cookie-parser` |
| Config / logging | `dotenv`, `morgan` |
| Dev | `nodemon` (or `node --watch`), `eslint`, `prettier` |
| Tests | `vitest`, `supertest`, `mongodb-memory-server` |
| Seed scripts | built-in `fetch` (Node ≥ 22), `fs/promises` |

**Frontend (`frontend/`)**
| Purpose | Library |
|---|---|
| Build / UI | `vite`, `react`, `react-dom` |
| Routing | `react-router` (v7, declarative `BrowserRouter` mode) |
| Server state | `@tanstack/react-query` |
| HTTP | `axios` (`withCredentials: true`) |
| Forms | `react-hook-form`, `@hookform/resolvers`, `zod` |
| Styling | `tailwindcss` (+ `@tailwindcss/vite`) |
| Charts | `recharts` |
| Toasts | `react-hot-toast` |
| Dates | `date-fns` |
| Dev | `eslint`, `prettier` |

**Root:** `concurrently` (dev both apps in chunk 23).

---

## 3. Key decisions (made up front)

| # | Decision | Why |
|---|---|---|
| D1 | Auth = JWT (7d) in **httpOnly, SameSite=Lax cookie** named `token`; `Secure` in production. Same-origin: Vite proxy in dev, Express serves the built client in prod. | No token in JS (XSS-safe), no cross-site cookie/CORS pain, Lax + JSON-only writes covers CSRF for this app. |
| D2 | **Express 5.** Async errors auto-forward to the error handler (no `asyncHandler`). `req.query` is read-only, so the `validate` middleware writes parsed data to `req.validated = { body, query, params }`. | Cleaner controllers; avoids Express 5 pitfalls. |
| D3 | No `express-mongo-sanitize`. Every input goes through zod with strict typed parsing (strings stay strings), which blocks `$` operator injection. | Package conflicts with Express 5; zod already solves it. |
| D4 | ESM (`"type": "module"`) in both apps. | One module style. |
| D5 | Metric units only (cm, kg). | Keeps v1 simple; imperial is in Later. |
| D6 | Workout `date` stored as a **`'YYYY-MM-DD'` string** (user's calendar day). | No timezone shifts (user is UTC+5); sorts and range-queries lexicographically. |
| D7 | A **WorkoutLog is a session**: `entries[]` (one per exercise) each with `sets[]` rows. One entry per exercise per session. | Natural history UI; simple stats; per-set data for charts. |
| D8 | `bmi` and `bmiCategory` are **computed server-side only**; client values are ignored. Category is derived from the BMI rounded to 1 decimal. | Single source of truth, matches what the user sees. |
| D9 | The 36 plans are **generated deterministically at seed time** from `selection.json` (exercise → slot tags) + `planTemplates.js`, then stored as fixed documents. Recommended plan is derived from the profile (not stored). | No hand-authoring 12 plans; reproducible; edits are data changes. |
| D10 | Exercise images are downloaded once into `backend/public/exercise-images/` and **committed** (small, public domain) and served statically. | No hotlinking GitHub raw; works offline. |
| D11 | Ownership: every user-owned query filters by `req.user.id`; someone else's document returns **404**, never 403. | No existence leak. |
| D12 | Validation errors → **400** `VALIDATION_ERROR` with per-field `details`. | One consistent shape. |
| D13 | Stats: Mongo aggregates **per day**; weekly rollups done in JS (`utils/dates.js`). Client sends `today=YYYY-MM-DD` to avoid server-timezone errors. | Simple, timezone-safe. |
| D14 | Adults only: age **18–80**. | BMI categories are adult WHO ranges. |
| D15 | Streak = **weekly streak** (consecutive Mon-start weeks with ≥ 1 session; current week counts only if it has one, else counting starts from last week). | Day streaks punish 3–5×/week plans. |
| D16 | Tests: Vitest + supertest + `mongodb-memory-server` (fallback: a `fitverse_test` DB on a **local** MongoDB, never Atlas). `tests/setup.js` refuses to run if the test URI contains `mongodb+srv`. | Fast, isolated, can never touch real data. |
| D17 | Exercise `level` stored in our enum (`beginner/intermediate/advanced`); dataset `expert` → `advanced`, unless `selection.json` overrides it (D19). | Matches `experienceLevel`. |
| D18 | Home-first equipment: bodyweight, a pair of dumbbells, resistance bands, mat, chair/bench; a pull-up bar is optional and only needed in advanced plans. No barbells, machines or cables in plans. | Project is a home-workout app. |
| D19 | `selection.json` may override an exercise's `level` (pull-ups → advanced, push-ups → intermediate) and `tracking` (plank, side bridge → time). | Dataset difficulty ratings don't match real-world difficulty. |
| D20 | **Age band** (`adult` 18–39, `midlife` 40–54, `senior` 55–80) is a third plan dimension → **36 plans**. Age band and `healthyWeightRangeKg` are computed at request time, never stored. | Age changes volume, rest and impact; computing avoids stale data. |
| D21 | Impact rule: low-impact-only exercises when BMI is overweight/obese **or** age band ≠ adult. | Joint safety; simple and testable. |
| D22 | MongoDB Atlas, database name `fitverse` (cluster host `fitverse.gjdcxk8.mongodb.net`). The full URI exists only in `backend/.env`. | Keeps secrets out of files. |
| D23 | Verification checkpoints after chunks 5, 10, 15, 20 and 25 (§13). | Catch a wrong direction early. |

---

## 4. Folder structure

```
fitverse/
├─ PLAN.md
├─ PROGRESS.md
├─ WORKOUT_PLAN.md               # workout design (source of truth for plans)
├─ README.md
├─ .gitignore
├─ package.json                  # root scripts (chunk 23)
├─ backend/
│  ├─ package.json
│  ├─ .env.example
│  ├─ eslint.config.js
│  ├─ .prettierrc
│  ├─ vitest.config.js
│  ├─ public/
│  │  └─ exercise-images/        # <externalId>/0.jpg, 1.jpg (committed)
│  ├─ requests/                  # Thunder Client / Postman / .http collection (chunk 12)
│  ├─ src/
│  │  ├─ server.js               # connect DB + listen
│  │  ├─ app.js                  # express app wiring
│  │  ├─ config/
│  │  │  ├─ env.js               # zod-validated env, only place reading process.env
│  │  │  └─ db.js
│  │  ├─ models/
│  │  │  ├─ User.js
│  │  │  ├─ Profile.js
│  │  │  ├─ Exercise.js
│  │  │  ├─ WorkoutPlan.js
│  │  │  └─ WorkoutLog.js
│  │  ├─ validators/             # zod schemas
│  │  │  ├─ authValidators.js
│  │  │  ├─ profileValidators.js
│  │  │  ├─ exerciseValidators.js
│  │  │  ├─ planValidators.js
│  │  │  ├─ logValidators.js
│  │  │  └─ statsValidators.js
│  │  ├─ controllers/            # thin: parse → service/model → respond
│  │  │  ├─ authController.js
│  │  │  ├─ profileController.js
│  │  │  ├─ exerciseController.js
│  │  │  ├─ planController.js
│  │  │  ├─ logController.js
│  │  │  └─ statsController.js
│  │  ├─ routes/
│  │  │  ├─ index.js             # mounts everything under /api
│  │  │  ├─ healthRoutes.js
│  │  │  ├─ authRoutes.js
│  │  │  ├─ profileRoutes.js
│  │  │  ├─ exerciseRoutes.js
│  │  │  ├─ planRoutes.js
│  │  │  ├─ logRoutes.js
│  │  │  └─ statsRoutes.js
│  │  ├─ middleware/
│  │  │  ├─ auth.js              # protect
│  │  │  ├─ validate.js
│  │  │  ├─ rateLimiters.js
│  │  │  ├─ notFound.js
│  │  │  └─ errorHandler.js
│  │  ├─ services/
│  │  │  ├─ bmiService.js        # bmi, category, healthy range, age band
│  │  │  ├─ planService.js       # getRecommendedPlan
│  │  │  └─ statsService.js
│  │  ├─ utils/
│  │  │  ├─ ApiError.js
│  │  │  ├─ tokens.js
│  │  │  └─ dates.js
│  │  └─ seed/
│  │     ├─ index.js             # `npm run seed` (exercises then plans)
│  │     ├─ fetchExercises.js    # `npm run seed:fetch`
│  │     ├─ mapExercise.js
│  │     ├─ seedExercises.js
│  │     ├─ planTemplates.js
│  │     ├─ planBuilder.js
│  │     ├─ seedPlans.js
│  │     ├─ previewPlans.js      # `npm run plans:preview`
│  │     └─ data/
│  │        ├─ selection.json            # the 76 picks (input, copied from planning)
│  │        └─ exercises.selected.json   # generated slim records
│  └─ tests/
│     ├─ setup.js
│     └─ *.test.js
└─ frontend/
   ├─ package.json
   ├─ vite.config.js             # proxy /api and /exercise-images → :5000
   ├─ index.html
   ├─ eslint.config.js
   ├─ .prettierrc
   └─ src/
      ├─ main.jsx
      ├─ App.jsx
      ├─ routes.jsx
      ├─ styles/index.css
      ├─ api/
      │  ├─ client.js            # axios instance + 401 handling
      │  ├─ authApi.js  profileApi.js  exerciseApi.js
      │  └─ planApi.js  logApi.js  statsApi.js
      ├─ context/AuthContext.jsx
      ├─ hooks/                  # useAuth.js, useDebounce.js
      ├─ utils/                  # constants.js, format.js, bmi.js, logHelpers.js
      ├─ pages/                  # *Page.jsx
      └─ components/
         ├─ layout/  ui/  auth/  profile/  exercises/
         └─ plans/  logs/  dashboard/  charts/  progress/
```

---

## 5. MongoDB models

All have `timestamps: true`. JSON output uses `id` (not `_id`) and omits `__v`.

### 5.1 User (`users`)
| Field | Type | Rules |
|---|---|---|
| name | String | required, trim, 2–50 |
| email | String | required, unique, lowercase, trim |
| password | String | required, bcrypt hash, `select: false`, hashed in pre-save |

### 5.2 Profile (`profiles`) — one per user
| Field | Type | Rules |
|---|---|---|
| user | ObjectId → User | required, **unique** |
| heightCm | Number | 100–250 |
| weightKg | Number | 30–300 |
| age | Number (int) | 18–80 |
| gender | String enum | `male`, `female`, `other` (not used in BMI/plan mapping in v1) |
| experienceLevel | String enum | `beginner`, `intermediate`, `advanced` |
| bmi | Number | server-computed, 1 decimal |
| bmiCategory | String enum | server-computed: `underweight`, `normal`, `overweight`, `obese` |

Computed at request time and returned by profile endpoints (not stored): `ageBand` (`adult` 18–39, `midlife` 40–54, `senior` 55–80) and `healthyWeightRangeKg: { min, max }` = 18.5 / 24.9 × (heightCm/100)², 1 decimal. Both live in `services/bmiService.js`.

### 5.3 Exercise (`exercises`) — seeded, read-only via API
| Field | Type | Notes |
|---|---|---|
| externalId | String | required, **unique** (dataset `id`, e.g. `Barbell_Squat`) |
| name | String | required, text-indexed |
| category | String enum | `strength`, `stretching`, `cardio`, `plyometrics`, `powerlifting`, `strongman`, `olympic weightlifting` |
| level | String enum | `beginner`, `intermediate`, `advanced`; dataset `expert` → `advanced`; selection may override (D19) |
| force | String \| null | `push`/`pull`/`static`/null |
| mechanic | String \| null | `compound`/`isolation`/null |
| equipment | String | lowercase; null → `other` |
| primaryMuscles | [String] | dataset values |
| secondaryMuscles | [String] | |
| muscleGroup | String enum | `chest`, `back`, `shoulders`, `arms`, `legs`, `core`, `cardio` (derived, see `WORKOUT_PLAN.md` §3) |
| trackingType | String enum | `reps` (default) \| `time` (cardio + stretching + any selection entry flagged time) |
| lowImpact | Boolean | from selection; no jumping/running/ballistic moves (D21) |
| slots | [String] | from selection: `squat, hinge, lunge, push_h, push_v, pull_h, pull_v, shoulder, biceps, triceps, calves, core, cardio, stretch` |
| instructions | [String] | |
| images | [String] | relative paths, e.g. `Barbell_Squat/0.jpg` |
| imageUrls | virtual | `/exercise-images/<path>` |

Indexes: `externalId` unique; `{ muscleGroup, level }`; text on `name`.

### 5.4 WorkoutPlan (`workoutplans`) — seeded, read-only via API
| Field | Type | Notes |
|---|---|---|
| slug | String | unique, `<bmiCategory>-<experienceLevel>-<ageBand>`, e.g. `overweight-advanced-senior` |
| name | String | e.g. "Overweight · Advanced · Ages 55–80 — Upper/Lower 4×/week" |
| description | String | |
| goal | String | e.g. "Build strength & muscle" |
| bmiCategory | String enum | as Profile |
| experienceLevel | String enum | as Profile |
| ageBand | String enum | `adult`, `midlife`, `senior` |
| daysPerWeek | Number | 3 / 4 / 5 |
| guidelines | [String] | short tips (rest days, warm-up, progression) |
| days | [subdoc, `_id:false`] | below |

`days[]`: `{ dayNumber: Number (1-based), title: String, focus: String, exercises: [ { order: Number, exercise: ObjectId → Exercise, sets: Number, repsMin: Number|null, repsMax: Number|null, durationSec: Number|null, restSec: Number } ] }`

Indexes: `slug` unique; **unique compound `{ bmiCategory, experienceLevel, ageBand }`**.

### 5.5 WorkoutLog (`workoutlogs`) — one document per session
| Field | Type | Rules |
|---|---|---|
| user | ObjectId → User | required, indexed |
| date | String | required, `YYYY-MM-DD`, real calendar date, not later than tomorrow (UTC) |
| title | String | optional, ≤ 80 |
| notes | String | optional, ≤ 500 |
| planDay | `{ plan: ObjectId → WorkoutPlan, dayNumber: Number }` | optional (set when started from a plan day) |
| entries | [subdoc] | 1–20 items, **unique exercise per session** |

`entries[]`: `{ exercise: ObjectId → Exercise (required), notes: String ≤ 200, sets: [ { reps: Number|null, weightKg: Number (default 0), durationSec: Number|null } ] }` — 1–20 sets.

Set rules by `exercise.trackingType`:
- `reps`: `reps` int 1–200 required; `weightKg` 0–1000 (0 = bodyweight); `durationSec` must be absent.
- `time`: `durationSec` int 1–36000 required; `reps` absent; `weightKg` 0.

Indexes: `{ user: 1, date: -1 }`, `{ user: 1, 'entries.exercise': 1, date: -1 }`.

---

## 6. API

Base path `/api`. JSON only. Everything requires the auth cookie **except** `register`, `login`, `logout`, `health`, and static images.

**Response shapes**
- Success: `{ "data": <object|array> }`; lists add `"meta": { "page", "limit", "total", "totalPages" }`. Deletes return `204` with no body.
- Error: `{ "error": { "code": "VALIDATION_ERROR", "message": "…", "details": { "field": "msg" } } }`.
- Codes: `VALIDATION_ERROR` 400, `PROFILE_REQUIRED` 400, `UNAUTHORIZED` 401, `NOT_FOUND` 404, `PROFILE_NOT_FOUND` 404, `EMAIL_TAKEN` 409, `RATE_LIMITED` 429, `INTERNAL_ERROR` 500.
- Pagination defaults: `page=1`, `limit=20`, max `limit=100`.

**Rate limits:** `/api/auth/login` + `/register` → 10 / 15 min / IP. Global `/api` → 300 / 15 min / IP.

| Method | Path | Purpose | Auth | Chunk |
|---|---|---|---|---|
| GET | `/api/health` | liveness check | no | 1 |
| POST | `/api/auth/register` | create user, set cookie, return `{user}` | no | 2 |
| POST | `/api/auth/login` | verify credentials, set cookie, return `{user}` | no | 2 |
| POST | `/api/auth/logout` | clear cookie | no | 3 |
| GET | `/api/auth/me` | current `{user, profile\|null}`; profile includes computed `ageBand`, `healthyWeightRangeKg` | yes | 3 |
| GET | `/api/profile` | own profile + computed `ageBand`, `healthyWeightRangeKg` (404 `PROFILE_NOT_FOUND` if none) | yes | 4 |
| PUT | `/api/profile` | create/update own profile; recomputes BMI; returns computed `ageBand`, `healthyWeightRangeKg` | yes | 4 |
| GET | `/api/exercises` | list; query `q`, `muscleGroup`, `category`, `equipment`, `level`, `page`, `limit` | yes | 6 |
| GET | `/api/exercises/filters` | distinct values for filter dropdowns | yes | 6 |
| GET | `/api/exercises/:id` | one exercise | yes | 6 |
| GET | `/exercise-images/*` | static images | no | 6 |
| GET | `/api/plans` | plan summaries (36 total); query `bmiCategory`, `experienceLevel`, `ageBand` | yes | 8 |
| GET | `/api/plans/recommended` | plan matching own BMI category + level + age band (400 `PROFILE_REQUIRED` if none), populated exercises, plus `why: { bmi, bmiCategory, ageBand, experienceLevel }` | yes | 8 |
| GET | `/api/plans/:id` | one plan, populated exercises | yes | 8 |
| POST | `/api/logs` | create session | yes | 9 |
| GET | `/api/logs` | own sessions newest-first; query `from`, `to`, `exerciseId`, `page`, `limit` | yes | 9 |
| GET | `/api/logs/:id` | one own session | yes | 9 |
| PUT | `/api/logs/:id` | replace own session (same validation as create) | yes | 10 |
| DELETE | `/api/logs/:id` | delete own session | yes | 10 |
| GET | `/api/stats/summary` | `?today=YYYY-MM-DD` → `{ totalSessions, totalVolumeKg, sessionsThisWeek, weeklyStreak, lastWorkoutDate, lastPlanDay }` | yes | 11 |
| GET | `/api/stats/volume` | `?from&to&groupBy=day\|week` → zero-filled `[{ period, volumeKg, totalSets, totalReps }]` | yes | 11 |
| GET | `/api/stats/frequency` | `?from&to` → `[{ weekStart, sessions }]` | yes | 11 |
| GET | `/api/stats/exercise/:exerciseId` | `?from&to` → `[{ date, topWeightKg, bestEst1RM, volumeKg, totalReps, totalDurationSec }]` | yes | 12 |
| GET | `/api/stats/personal-records` | one row per logged exercise: best weight / est. 1RM / reps / duration + last date (also feeds the exercise picker on Progress) | yes | 12 |

Notes:
- Stats range cap: 366 days → else 400.
- Est. 1RM = Epley `w × (1 + reps/30)`, only for sets with weight > 0 and reps ≤ 12.
- Volume = Σ reps × weightKg (bodyweight sets contribute 0 volume but count in `totalReps`).
- Auth cookie: `token`, httpOnly, SameSite=Lax, `Secure` in production, 7 days.
- Password rules: 8–72 chars (bcrypt limit). Login failure message is always "Invalid email or password"; a dummy hash compare runs for unknown emails.

---

## 7. Workout plan design

> **Authoritative design: `WORKOUT_PLAN.md`** (inputs, dataset facts, the 76-exercise selection, the 36 plans, all prescription numbers, builder algorithm, guideline strings, sample output). This section only states what the code and API must do. If the two ever disagree, `WORKOUT_PLAN.md` wins and this section gets fixed.

### 7.1 Inputs → plan
| Input | Effect |
|---|---|
| height + weight | BMI → category (`underweight` < 18.5 · `normal` 18.5–24.9 · `overweight` 25.0–29.9 · `obese` ≥ 30.0) → goal, reps, rest, finisher type; height also gives the healthy weight range |
| age | age band `adult` 18–39 · `midlife` 40–54 · `senior` 55–80 → days/week, set caps, rest +0/15/30 s, rep floor, cardio cap, impact rule |
| experience level | split, days/week, base sets, allowed exercise levels |
| gender | not used in v1 |

### 7.2 The plans
- 4 BMI categories × 3 levels × 3 age bands = **36 plans**, slug `<bmiCategory>-<experienceLevel>-<ageBand>`.
- Days per week: beginner 3; intermediate 4 (senior 3); advanced 5 only for `adult` and not `obese`, otherwise 4.
- Day templates: 3 days = Full Body A/B/A′; 4 days = Upper A / Lower A / Upper B / Lower B; 5 days = Push / Pull / Legs / Upper / Lower. 6–8 exercises per day, the last one is a cardio or stretch finisher.

### 7.3 Data flow (exercises → plans)
1. `selection.json` (76 picks: `id`, `slots`, `lowImpact`, optional `level` / `tracking` overrides) is the only input. It was verified against the live dataset (all ids exist, all 152 images reachable).
2. `npm run seed:fetch` downloads the dataset, keeps the 76 records, downloads their images into `backend/public/exercise-images/` and writes `exercises.selected.json`. `mapExercise.js` maps fields exactly as in `WORKOUT_PLAN.md` §3.
3. `npm run seed` upserts exercises by `externalId` (never deletes), then builds and upserts the 36 plans by `slug`.
4. `planBuilder.js` is pure and deterministic (no randomness) and follows `WORKOUT_PLAN.md` §8: eligible pool per slot (slot tag, level ≤ level cap, low-impact filter), stable sort by level descending, rotate by how often the slot was used in the plan, never repeat an exercise within a day, throw a readable error if a slot has no candidate.
5. Plans reference exercises by `ObjectId` (resolved from `externalId` at seed time). The API populates `name`, `imageUrls`, `trackingType`, `muscleGroup`.

### 7.4 Recommendation rule
`GET /api/plans/recommended` → read own profile → compute `ageBand` from `age` → `WorkoutPlan.findOne({ bmiCategory, experienceLevel, ageBand })` → populate. No stored "active plan" in v1; changing weight, height, age or level changes the recommendation. The UI also lets the user browse all plans read-only.

### 7.5 Plan → log link
"Start this workout" on a plan day opens `/log/new?planId=…&day=N`, prefilled with that day's exercises and `sets` rows (reps = `repsMax`, duration = `durationSec`, weight blank). Saved logs keep `planDay`. Dashboard "next day" = day after the last logged `planDay` for the recommended plan (wraps to day 1; day 1 if none).

---

## 8. Frontend pages & components

### 8.1 Pages & routes
| Route | Page | Access | Purpose |
|---|---|---|---|
| `/login` | LoginPage | public-only | log in |
| `/register` | RegisterPage | public-only | sign up |
| `/onboarding` | OnboardingPage | auth | first profile entry (BMI live preview) |
| `/` → `/dashboard` | DashboardPage | auth + profile | summary, next workout, recent logs |
| `/profile` | ProfilePage | auth | edit stats, BMI card |
| `/plan` | PlanPage | auth + profile | recommended plan detail |
| `/plans` | PlansPage | auth | plans of your age band (12), band switcher for all 36, yours highlighted |
| `/plans/:id` | PlanDetailPage | auth | any plan, read-only |
| `/exercises` | ExercisesPage | auth | library grid, search, filters (URL params) |
| `/exercises/:id` | ExerciseDetailPage | auth | images, muscles, instructions |
| `/log/new` | LogNewPage | auth + profile | create session (optional plan prefill) |
| `/log/:id/edit` | LogEditPage | auth + profile | edit session |
| `/history` | HistoryPage | auth + profile | list, filter, delete |
| `/progress` | ProgressPage | auth + profile | charts + PRs |
| `*` | NotFoundPage | any | 404 |

Gate rule: authed user with no profile is redirected to `/onboarding` for every "auth + profile" route.

### 8.2 Components (by folder)
- `layout/`: AppLayout, Navbar, Footer (shows disclaimer short form).
- `ui/`: Button, Input, FormField, Select, Card, Modal, Spinner, Skeleton, EmptyState, ErrorMessage, Pagination, DisclaimerBanner.
- `auth/`: ProtectedRoute, PublicOnlyRoute.
- `profile/`: ProfileForm, BmiCard.
- `exercises/`: ExerciseCard, ExerciseGrid, ExerciseFilters, ExerciseDetail, ImageCarousel.
- `plans/`: PlanSummaryCard, PlanDayCard, PlanExerciseRow.
- `logs/`: WorkoutForm, ExercisePicker, EntryEditor, SetRow, LogCard, LogFilters, DeleteLogDialog.
- `dashboard/`: StatCard, TodayPlanCard, RecentLogs, QuickActions.
- `charts/`: ChartCard, RangeSelect, VolumeChart, FrequencyChart, ExerciseProgressChart.
- `progress/`: PersonalRecordsTable.

### 8.3 Frontend rules
- API calls only in `src/api/*`; components never call axios directly.
- Server state via React Query (`['logs', filters]`, `['plans','recommended']`, …); auth state in `AuthContext` fed by `GET /auth/me`.
- Forms: react-hook-form + zod; ranges mirrored from `utils/constants.js` (backend stays authoritative).
- Always render loading, empty and error states. Tailwind utilities only (no CSS modules).
- Dates: keep as `'YYYY-MM-DD'` strings end-to-end; send `today` from the browser's local date.

---

## 9. Naming conventions & coding rules

**Naming**
- Backend files: models `PascalCase.js` (singular), `xController.js`, `xRoutes.js`, `xValidators.js`, `xService.js`, middleware `camelCase.js`, tests `x.test.js`.
- Frontend files: components/pages `PascalCase.jsx` (one default-exported component per file; pages end in `Page`), hooks `useX.js`, api modules `xApi.js` (named exports), utils `camelCase.js`.
- JSON fields `camelCase`; enum values lowercase (`beginner`, `weight_reps` style not used); env vars `UPPER_SNAKE_CASE`.
- Routes: plural nouns, kebab-case, no verbs (exceptions: `recommended`, `filters`, `summary`).
- Collections: Mongoose defaults.

**Backend rules**
- Layers: routes → (validate) → controller → service/model. No business logic in routes; controllers stay thin; reusable logic in services.
- All input (body, query, params) validated with zod via `validate()`; read it from `req.validated`. Unknown keys stripped.
- `process.env` read **only** in `config/env.js` (validated at boot; fails fast with a readable message; `JWT_SECRET` ≥ 32 chars).
- Throw `ApiError(status, code, message, details?)`; one `errorHandler` formats everything; never leak stack traces or Mongo errors in production.
- Never trust client for `user`, `bmi`, `bmiCategory`. Scope user-owned queries by `req.user.id`. Use `.lean()` for reads.
- Never return `password`. Hash with bcryptjs cost 12.
- Security middleware: `helmet`, strict CORS (only `CLIENT_ORIGIN`, credentials on), JSON body limit 10 kb, `x-powered-by` off, rate limits.
- No `console.log` in app code (use `morgan`; `console.error` only in the error handler/seed scripts).
- Seeds are idempotent (upsert) and never delete exercises referenced by logs.
- Each route gets at least one happy-path and one failure-path test; ownership tests for every user-owned resource.
- Secrets only in `backend/.env` (gitignored); `.env.example` holds placeholders only. Never log, commit or echo credentials. Tests never connect to Atlas (D16).

**Frontend rules** — see §8.3. Also: no secrets in the client; no `dangerouslySetInnerHTML`; every input has a label; buttons disabled while submitting.

**Formatting:** Prettier — single quotes, semicolons, 2 spaces, width 100, trailing commas `all`. ESLint clean before every commit.

---

## 10. Environment variables

`backend/.env.example`
```
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<db_user>:<db_password>@fitverse.gjdcxk8.mongodb.net/fitverse?retryWrites=true&w=majority
JWT_SECRET=change-me-to-a-random-string-of-32-plus-characters
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
```
Frontend needs none in dev (Vite proxy). Never commit `.env`.

**Atlas setup notes (D22):**
- Put the real URI only in `backend/.env`, with the database name `fitverse` after the host and URL-encoded special characters in the password.
- In Atlas → Network Access, allow your current IP (or `0.0.0.0/0` for development only; remove before deployment).
- The database password was pasted into a chat. Treat it as exposed: rotate it in Atlas → Database Access, then update `.env`.
- Generate `JWT_SECRET` with `node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"`.

---

## 11. Chunks

Each chunk: **Goal · Needs (files to paste) · Files · Done when**. "Files" = created (c) or edited (e). All backend chunks add/extend tests under `backend/tests/`.

### Backend

**Chunk 1 — Backend foundation**
- Goal: runnable Express 5 skeleton with validated config, DB connection, error handling, tooling.
- Needs: nothing to paste. You create `backend/.env` from `.env.example` with your real Atlas URI (database `fitverse`) and a generated `JWT_SECRET` (§10). Node ≥ 22.
- Files: (c) root `.gitignore`, `README.md`; `backend/package.json`, `.env.example`, `eslint.config.js`, `.prettierrc`, `vitest.config.js`; `src/server.js`, `src/app.js`, `src/config/env.js`, `src/config/db.js`, `src/routes/index.js`, `src/routes/healthRoutes.js`, `src/middleware/{validate,notFound,errorHandler}.js`, `src/utils/ApiError.js`; `tests/setup.js`, `tests/health.test.js`.
- Done when: `npm run dev` connects to MongoDB and logs the port · `GET /api/health` → `{"data":{"status":"ok"}}` · unknown route → 404 JSON `NOT_FOUND` · a missing/short env var stops boot with a clear message · `.env` is gitignored (`git status` does not list it) · `npm test` and `npm run lint` pass.

**Chunk 2 — User model, register, login**
- Goal: accounts with hashed passwords and cookie JWT.
- Needs: `src/app.js`, `src/routes/index.js`, `src/middleware/{validate,errorHandler}.js`, `src/utils/ApiError.js`, `src/config/env.js`.
- Files: (c) `models/User.js`, `validators/authValidators.js`, `utils/tokens.js`, `controllers/authController.js` (register, login), `routes/authRoutes.js`, `tests/auth.test.js`; (e) `routes/index.js`.
- Done when: register → 201 `{data:{user}}`, no password in response, httpOnly `token` cookie set, DB value is a bcrypt hash · duplicate email → 409 `EMAIL_TAKEN` · bad email / short password → 400 with field details · login OK sets cookie · wrong password and unknown email → identical 401.

**Chunk 3 — Protect middleware, me, logout, rate limits**
- Goal: authenticated requests and abuse protection.
- Needs: `app.js`, `controllers/authController.js`, `routes/authRoutes.js`, `models/User.js`.
- Files: (c) `middleware/auth.js`, `middleware/rateLimiters.js`; (e) `authController.js` (me, logout), `authRoutes.js`, `app.js` (cookie-parser, global limiter), `tests/auth.test.js`.
- Done when: `GET /api/auth/me` without cookie → 401; with cookie → `{user, profile:null}` · logout clears cookie and `me` then 401 · tampered/expired token → 401 · 11th login in the window → 429 · tests green.

**Chunk 4 — Profile & BMI**
- Goal: store body stats + experience, compute BMI/category, age band and healthy weight range server-side.
- Needs: `routes/index.js`, `controllers/authController.js`, `middleware/auth.js`.
- Files: (c) `models/Profile.js`, `services/bmiService.js`, `validators/profileValidators.js`, `controllers/profileController.js`, `routes/profileRoutes.js`, `tests/bmi.test.js`, `tests/profile.test.js`; (e) `routes/index.js`, `authController.js` (`me` returns profile).
- Done when: `PUT /api/profile` creates then updates the same single doc · client-sent `bmi`/`bmiCategory` ignored · BMI boundary tests at height 200 cm: 72 kg→18.0 underweight, 74 kg→18.5 normal, 99.6 kg→24.9 normal, 100 kg→25.0 overweight, 119.6 kg→29.9 overweight, 120 kg→30.0 obese · computed `ageBand`: 18/39→adult, 40/54→midlife, 55/80→senior · `healthyWeightRangeKg` for 175 cm = 56.7–76.3 and for 200 cm = 74.0–99.6 · out-of-range inputs → 400 · `GET /api/profile` before creation → 404 `PROFILE_NOT_FOUND` · `me` includes profile.

**Chunk 5 — Exercise model + fetch pipeline for the decided 76 exercises**
- Goal: the 76 decided exercises and their images on disk, plus a coverage report.
- Needs: `selection.json` (delivered with the plan) copied to `backend/src/seed/data/selection.json`. Nothing else.
- Files: (c) `models/Exercise.js` (incl. `lowImpact`, `slots`), `seed/mapExercise.js`, `seed/fetchExercises.js`, generated `seed/data/exercises.selected.json` and `public/exercise-images/**`; (e) `package.json` (`seed:fetch`).
- Done when: `npm run seed:fetch` writes exactly 76 records and 152 images · any missing id is listed and fails the run · `public/exercise-images/<id>/0.jpg` opens for every exercise · the coverage report matches `WORKOUT_PLAN.md` §4 (all 14 slots OK) · overrides applied (`Pullups`, `Chin-Up` = advanced; `Pushups` = intermediate; `Push-Ups_With_Feet_Elevated` = advanced; `Plank`, `Side_Bridge` = time) · `npm test` and `npm run lint` pass.

> ✅ **CHECKPOINT 1** — stop here and run §13 Checkpoint 1 before starting chunk 6.

**Chunk 6 — Seed exercises + exercise API**
- Goal: exercises in MongoDB, browsable via API, images served.
- Needs: `app.js`, `routes/index.js`, `models/Exercise.js`, `package.json`.
- Files: (c) `seed/seedExercises.js`, `seed/index.js`, `validators/exerciseValidators.js`, `controllers/exerciseController.js`, `routes/exerciseRoutes.js`, `tests/exercises.test.js`; (e) `app.js` (static `/exercise-images`), `routes/index.js`, `package.json` (`seed`).
- Done when: running `npm run seed` twice leaves exactly 76 exercises (idempotent) · `GET /api/exercises?q=squat&muscleGroup=legs&page=1&limit=10` returns filtered `{data, meta}` · `/filters` returns distinct values (route declared before `/:id`) · `/:id` returns `imageUrls` that load at `http://localhost:5000/exercise-images/...` · invalid ObjectId → 400 · no cookie → 401.

**Chunk 7 — WorkoutPlan model + templates + builder**
- Goal: deterministic generation of all 36 plans from the seeded exercises (no DB write yet), exactly as specified in `WORKOUT_PLAN.md` §6–§8 and §11.
- Needs: `seed/data/exercises.selected.json`, `models/Exercise.js`, `WORKOUT_PLAN.md`.
- Files: (c) `models/WorkoutPlan.js`, `seed/planTemplates.js` (templates, number tables, guideline strings), `seed/planBuilder.js`, `seed/previewPlans.js`, `tests/planBuilder.test.js`; (e) `package.json` (`plans:preview`).
- Done when: `npm run plans:preview` prints all 36 plans (days, exercise names, sets × reps/duration, rest) and `npm run plans:preview -- <slug>` prints one · the test loops all 36 plans and asserts: days/week per `WORKOUT_PLAN.md` §6.1; exercises/day per template; no duplicate exercise in a day; exercise level ≤ plan level (≤ intermediate for senior); only low-impact exercises when BMI is overweight/obese or age band ≠ adult; obese sets ≤ 3; senior caps (compound ≤ 3, isolation ≤ 2, repsMin ≥ 8, cardio ≤ 600 s, holds ≤ 45 s); rest = base + 0/15/30 s by band; finisher rule per BMI (underweight stretch only, normal cardio on last day only, overweight/obese cardio daily) · output matches the two samples in `WORKOUT_PLAN.md` §9 (`normal-beginner-adult` all days, `obese-advanced-senior` days 1–2) · a slot with no candidate throws a readable error.

**Chunk 8 — Seed plans + plan API + recommendation**
- Goal: 36 plans in the DB and served; recommendation correct for every combination.
- Needs: `seed/index.js`, `routes/index.js`, `seed/planBuilder.js`, `models/WorkoutPlan.js`, `services/bmiService.js`.
- Files: (c) `seed/seedPlans.js`, `services/planService.js`, `validators/planValidators.js`, `controllers/planController.js`, `routes/planRoutes.js`, `tests/plans.test.js`; (e) `seed/index.js`, `routes/index.js`.
- Done when: `npm run seed` yields 36 plans, idempotent by slug · `GET /api/plans` lists 36 summaries and the `bmiCategory`, `experienceLevel`, `ageBand` filters work · `GET /api/plans/recommended` returns the right plan for all 36 combinations (a test loops profile → expected slug) and for the sample profiles in §13 Checkpoint 2 · response includes `why` · no profile → 400 `PROFILE_REQUIRED` · `GET /api/plans/:id` returns exercises populated with `name`, `imageUrls`, `trackingType`, `muscleGroup`.

**Chunk 9 — Workout logs: model, create, list, get**
- Goal: log a session with validated entries/sets.
- Needs: `routes/index.js`, `models/Exercise.js`, `middleware/validate.js`.
- Files: (c) `models/WorkoutLog.js`, `utils/dates.js`, `validators/logValidators.js`, `controllers/logController.js` (create, list, getOne), `routes/logRoutes.js`, `tests/logs.test.js`; (e) `routes/index.js`.
- Done when: `POST /api/logs` with 2 entries → 201 · reps-vs-time rules enforced per `trackingType` · unknown exercise → 400 · duplicate exercise in one session → 400 · date more than tomorrow, or an invalid date like `2026-02-30` → 400 · `GET /api/logs` is paginated, newest first, filters `from`/`to`/`exerciseId` work, exercises populated · another user's log → 404.

**Chunk 10 — Logs: update, delete, ownership**
- Goal: full CRUD with isolation tests.
- Needs: `controllers/logController.js`, `routes/logRoutes.js`, `tests/logs.test.js`.
- Files: (e) `logController.js` (update, remove), `logRoutes.js`, `tests/logs.test.js`.
- Done when: `PUT` replaces a session with create-level validation · `DELETE` → 204 · a second user gets 404 on read/update/delete of user 1's log · nonexistent id → 404 · all log tests green.

> ✅ **CHECKPOINT 2** — stop here and run §13 Checkpoint 2 before starting chunk 11.

**Chunk 11 — Stats part 1: summary, volume, frequency**
- Goal: dashboard + chart data.
- Needs: `routes/index.js`, `utils/dates.js`, `models/WorkoutLog.js`.
- Files: (c) `services/statsService.js`, `validators/statsValidators.js`, `controllers/statsController.js`, `routes/statsRoutes.js`, `tests/stats.test.js`; (e) `routes/index.js`, `utils/dates.js` (`weekStart`, `addDays`, range helpers).
- Done when: with fixture logs `summary?today=…` returns correct `totalSessions`, `totalVolumeKg`, `sessionsThisWeek`, `weeklyStreak`, `lastWorkoutDate`, `lastPlanDay` · `volume` returns zero-filled day/week series · `frequency` returns sessions per week · results are scoped to the caller · range > 366 days → 400.

**Chunk 12 — Stats part 2 + backend freeze**
- Goal: per-exercise progress, PRs, final backend hardening and handoff.
- Needs: `services/statsService.js`, `controllers/statsController.js`, `routes/statsRoutes.js`, `package.json`.
- Files: (e) the three stats files + `tests/stats.test.js`, `package.json` (`seed:all` = fetch + seed), root `README.md` (API section); (c) `backend/requests/` collection covering every route.
- Done when: `/api/stats/exercise/:exerciseId` and `/api/stats/personal-records` return correct values (Epley rule, time-based handled) · full `npm test` green · fresh clone → `npm i && npm run seed:fetch && npm run seed && npm run dev` works · `npm audit` has no high/critical issues · indexes reviewed · PROGRESS.md marks the backend **FROZEN**.

### Frontend

**Chunk 13 — Frontend scaffold**
- Goal: Vite + React + Tailwind shell wired to the API through the proxy.
- Needs: the backend port and `GET /api/health` shape (from PROGRESS.md).
- Files: (c) `frontend/package.json`, `vite.config.js`, `index.html`, `eslint.config.js`, `.prettierrc`, `src/main.jsx`, `App.jsx`, `routes.jsx`, `styles/index.css`, `api/client.js`, `utils/{constants,format}.js`, `components/layout/{AppLayout,Navbar,Footer}.jsx`, `components/ui/{Button,Card,Spinner,EmptyState,ErrorMessage,DisclaimerBanner}.jsx`, `pages/NotFoundPage.jsx`.
- Done when: `npm run dev` shows layout with navbar and footer disclaimer · a temporary health check through `/api` proxy succeeds · unknown URL shows NotFound · Tailwind applies · lint clean.

**Chunk 14 — Auth UI**
- Goal: register/login/logout with route guards.
- Needs: `routes.jsx`, `api/client.js`, `components/layout/Navbar.jsx`, `components/ui/*`.
- Files: (c) `api/authApi.js`, `context/AuthContext.jsx`, `hooks/useAuth.js`, `components/auth/{ProtectedRoute,PublicOnlyRoute}.jsx`, `components/ui/{Input,FormField}.jsx`, `pages/{LoginPage,RegisterPage}.jsx`; (e) `Navbar.jsx`, `routes.jsx`, `api/client.js` (401 handling).
- Done when: register → `/onboarding` · login with a profile → `/dashboard` · refresh keeps the session · logout → `/login` · visiting a protected URL logged-out redirects to `/login` then returns after login · server field errors show under inputs · a 401 mid-session logs out cleanly.

**Chunk 15 — Profile & BMI UI**
- Goal: onboarding and profile editing with live BMI.
- Needs: `routes.jsx`, `components/auth/ProtectedRoute.jsx`, `context/AuthContext.jsx`, `utils/constants.js`.
- Files: (c) `api/profileApi.js`, `utils/bmi.js`, `components/profile/{ProfileForm,BmiCard}.jsx`, `pages/{OnboardingPage,ProfilePage}.jsx`; (e) `routes.jsx`, `ProtectedRoute.jsx` (profile gate).
- Done when: BMI preview updates while typing and matches the server's saved value/category · the BMI card shows the healthy weight range and age band label (values from the API, not recomputed) · client validation mirrors server ranges · submit creates/updates the profile · users without a profile can't open "auth + profile" routes · disclaimer visible on both pages.

> ✅ **CHECKPOINT 3** — stop here and run §13 Checkpoint 3 before starting chunk 16.

**Chunk 16 — Exercise library UI**
- Goal: browse the fixed exercise set.
- Needs: `routes.jsx`, `components/ui/*`, `utils/constants.js`.
- Files: (c) `api/exerciseApi.js`, `hooks/useDebounce.js`, `components/ui/{Pagination,Modal,Select}.jsx`, `components/exercises/{ExerciseCard,ExerciseGrid,ExerciseFilters,ExerciseDetail,ImageCarousel}.jsx`, `pages/{ExercisesPage,ExerciseDetailPage}.jsx`; (e) `routes.jsx`.
- Done when: grid shows images · debounced search + muscle/equipment/level/category filters + pagination work and live in URL params · detail page shows both images, muscles and instructions · empty/error states shown.

**Chunk 17 — Plans UI**
- Goal: recommended plan page + browse all.
- Needs: `routes.jsx`, `components/ui/*`, `components/exercises/ImageCarousel.jsx` (if reused).
- Files: (c) `api/planApi.js`, `components/plans/{PlanSummaryCard,PlanDayCard,PlanExerciseRow}.jsx`, `pages/{PlanPage,PlansPage,PlanDetailPage}.jsx`; (e) `routes.jsx`.
- Done when: `/plan` shows the plan for the user's BMI category + level + age band with a "why this plan" line (from the API `why`) · days list exercises with sets × reps/duration and rest · `/plans` lists the 12 plans of the user's age band with the user's plan highlighted, and a band switcher reaches all 36 · `/plans/:id` works · each day has "Start this workout" → `/log/new?planId=…&day=N`.

**Chunk 18 — Log workout UI**
- Goal: create a session, optionally prefilled from a plan day.
- Needs: `routes.jsx`, `components/ui/*`, `api/planApi.js`, `api/exerciseApi.js`.
- Files: (c) `api/logApi.js`, `utils/logHelpers.js`, `components/logs/{WorkoutForm,ExercisePicker,EntryEditor,SetRow}.jsx`, `pages/LogNewPage.jsx`; (e) `routes.jsx`.
- Done when: log date/title/notes + exercises via a searchable picker + sets (add, remove, copy previous) · time-based exercises show duration instead of reps/weight · plan-day prefill works · client + server errors surface · success → toast and `/history`.

**Chunk 19 — History UI**
- Goal: list, filter, edit, delete sessions.
- Needs: `components/logs/WorkoutForm.jsx`, `api/logApi.js`, `routes.jsx`.
- Files: (c) `components/logs/{LogCard,LogFilters,DeleteLogDialog}.jsx`, `pages/{HistoryPage,LogEditPage}.jsx`; (e) `WorkoutForm.jsx` (edit mode), `routes.jsx`.
- Done when: newest-first paginated list · date-range and exercise filters · expandable sets · edit saves · delete with confirm updates the list · empty state links to logging.

**Chunk 20 — Dashboard**
- Goal: weekly progress and next workout at a glance.
- Needs: `api/planApi.js`, `api/logApi.js`, `components/profile/BmiCard.jsx`, `routes.jsx`.
- Files: (c) `api/statsApi.js`, `components/dashboard/{StatCard,TodayPlanCard,RecentLogs,QuickActions}.jsx`, `pages/DashboardPage.jsx`; (e) `routes.jsx`.
- Done when: BMI card, "this week X of daysPerWeek", weekly streak, total volume, next suggested plan day (§7.5), last 3 sessions · `today` param sent from the browser's local date · skeletons while loading.

> ✅ **CHECKPOINT 4** — stop here and run §13 Checkpoint 4 before starting chunk 21.

**Chunk 21 — Progress charts**
- Goal: charts and PRs.
- Needs: `api/statsApi.js`, `routes.jsx`, `components/ui/Select.jsx`.
- Files: (c) `components/charts/{ChartCard,RangeSelect,VolumeChart,FrequencyChart,ExerciseProgressChart}.jsx`, `components/progress/PersonalRecordsTable.jsx`, `pages/ProgressPage.jsx`; (e) `routes.jsx`.
- Done when: range selector (4w / 12w / 6m / 1y) · volume over time · sessions per week · per-exercise line (top weight + est. 1RM, or duration for time-based) with a picker of logged exercises · PR table · empty state with no data · readable on a 360px screen.

**Chunk 22 — Frontend polish**
- Goal: production-feel UX pass.
- Needs: whichever pages/components the assistant requests after reviewing the app (list in PROGRESS.md).
- Files: edits across `pages/` and `components/`; (c) favicon, per-page titles.
- Done when: every page has loading/empty/error states · layouts hold at 360 / 768 / 1280 px · keyboard focus and labels OK, no critical axe issues · consistent toasts · disclaimer present on onboarding, profile, plan and footer · frontend lint clean.

### Integration

**Chunk 23 — Single-origin production build + root scripts**
- Goal: one command runs the app; production serves the built client.
- Needs: `backend/src/app.js`, `backend/src/config/env.js`, `backend/package.json`, `frontend/package.json`, `frontend/vite.config.js`.
- Files: (c) root `package.json` (scripts: `dev` via concurrently, `build`, `start`, `seed`); (e) `app.js` (production: serve `frontend/dist`, SPA fallback using Express 5 syntax `/{*splat}`, excluding `/api` and `/exercise-images`; `trust proxy`), `env.js`, `README.md`.
- Done when: `npm run dev` starts both · `npm run build && NODE_ENV=production npm start` serves everything on one port · refreshing a deep link like `/history` works · unknown `/api/*` still returns JSON 404 · `Secure` cookie only in production.

**Chunk 24 — End-to-end QA & fixes**
- Goal: prove the whole flow on a fresh DB and fix what breaks.
- Needs: PROGRESS.md "Known issues"; files for any failing area.
- Files: (c) `docs/QA_CHECKLIST.md`; optional `e2e/` Playwright smoke test; fixes as required.
- Done when: checklist passes — register → onboarding → plan → log from a plan day → history edit/delete → progress charts → logout · a second account sees none of the first's data · all backend tests (and the optional smoke test) green · remaining issues triaged in PROGRESS.md.

**Chunk 25 — Deployment (optional)**
- Goal: live on the internet.
- Needs: root `package.json`, `backend/src/config/env.js`.
- Files: (c) deploy config for the chosen host (e.g. `render.yaml`), `docs/DEPLOY.md`.
- Done when: MongoDB Atlas (network access restricted, DB password rotated) + one Node web service running · env vars set · production seed done · login works over HTTPS with the Secure cookie · README documents the steps.

> ✅ **CHECKPOINT 5 (final)** — run §13 Checkpoint 5.

---

## 12. In-app disclaimer (use verbatim; store in `frontend/src/utils/constants.js` as `DISCLAIMER_TEXT`)

> **BMI is a rough guide, not medical advice.** It doesn't account for muscle mass, age or body composition. The workout plans here are general fitness suggestions that adjust for your BMI, age and experience, not a substitute for professional guidance. Check with a doctor before starting a new exercise program (especially if you are over 55 or have a health condition), and stop if you feel pain, dizziness or unusual shortness of breath.

Show it on: onboarding, profile (BMI card and healthy weight range), plan pages, and a short form in the footer.

Credit (footer/README): exercise data and images from Free Exercise DB (public domain).

---

## 13. Verification checkpoints

**How it works.** After chunks **5, 10, 15, 20 and 25** the assistant stops and shows the matching checklist below. You run it, then reply with `CP<n>: item numbers PASS / FAIL` and paste the output for any FAIL. Nothing new is built until every item passes (or you explicitly accept a known issue, which goes into PROGRESS.md §11). Results are logged in PROGRESS.md §3.

Sample profiles used by several checkpoints (BMI values verified by calculation):

| # | Height | Weight | Age | Level | BMI → category | Expected plan slug | Days |
|---|---|---|---|---|---|---|---|
| S1 | 175 cm | 50 kg | 25 | beginner | 16.3 → underweight | `underweight-beginner-adult` | 3 |
| S2 | 175 cm | 70 kg | 45 | intermediate | 22.9 → normal | `normal-intermediate-midlife` | 4 |
| S3 | 170 cm | 80 kg | 60 | advanced | 27.7 → overweight | `overweight-advanced-senior` | 4 |
| S4 | 165 cm | 95 kg | 30 | advanced | 34.9 → obese | `obese-advanced-adult` | 4 |
| S5 | 180 cm | 100 kg | 35 | intermediate | 30.9 → obese | `obese-intermediate-adult` | 4 |
| S6 | 160 cm | 45 kg | 70 | beginner | 17.6 → underweight | `underweight-beginner-senior` | 3 |
| S7 | 175 cm | 70 kg | 30 | advanced | 22.9 → normal | `normal-advanced-adult` | 5 |
| S8 | 170 cm | 70 kg | 62 | intermediate | 24.2 → normal | `normal-intermediate-senior` | 3 |

### Checkpoint 1 — after chunk 5 (foundation, auth, profile, exercise data)
Run `cd backend && npm run dev` first.
1. **Boot:** the log shows the MongoDB connection and port 5000. After step 4, Atlas → Browse Collections shows database `fitverse`.
2. **Health + 404:** `curl -i localhost:5000/api/health` → 200 `{"data":{"status":"ok"}}`; `curl -i localhost:5000/api/nope` → 404 JSON with `NOT_FOUND`.
3. **Fail-fast config:** temporarily remove `JWT_SECRET` from `.env` → boot stops with a readable message. Restore it.
4. **Auth flow** (use a cookie jar, `curl -c jar -b jar`, or Thunder Client):
   - register → 201, `Set-Cookie: token=…; HttpOnly; SameSite=Lax`, no `password` in the body; in Atlas the stored password starts with `$2`;
   - same email again → 409 `EMAIL_TAKEN`; 5-character password → 400 with field details;
   - login OK → 200; wrong password and unknown email → identical 401 body;
   - `GET /api/auth/me` with cookie → user and `profile: null`; without cookie → 401; after logout → 401.
5. **Rate limit:** 11 failed logins in a row → the 11th returns 429 `RATE_LIMITED`.
6. **Profile + BMI** (`PUT /api/profile`, then `GET`):
   - 200 cm / 99.6 kg → bmi 24.9, `normal`; 200 cm / 100 kg → bmi 25, `overweight`; 200 cm / 120 kg → `obese`;
   - response includes `healthyWeightRangeKg` = `{min: 74, max: 99.6}` for 200 cm;
   - age 39 → `adult`, 40 → `midlife`, 55 → `senior`; age 17 → 400;
   - sending `bmi: 5` in the body is ignored; two PUTs leave exactly one document in `profiles`.
7. **Tests and lint:** `npm test` and `npm run lint` are green; Atlas contains no extra test databases.
8. **Secrets:** `git status` does not list `.env`; `git grep -n "mongodb+srv"` shows only the placeholder in `.env.example`.
9. **Exercise data:** `npm run seed:fetch` reports 76 records and 152 images and the coverage report shows all 14 slots OK; open `public/exercise-images/Pushups/0.jpg`; in `exercises.selected.json` `Pullups` is `advanced` and `Plank` is `time`.

### Checkpoint 2 — after chunk 10 (exercises, plans, logs)
1. **Seed twice:** `npm run seed` two times → Atlas: `exercises` = 76 and `workoutplans` = 36 both times.
2. **Exercise API:** `GET /api/exercises?limit=100` → `meta.total` 76; `?q=squat` and `?muscleGroup=legs` filter correctly; `/api/exercises/filters` returns values; an image URL opens in the browser (`http://localhost:5000/exercise-images/Pushups/0.jpg`); `/api/exercises/not-an-id` → 400; no cookie → 401.
3. **Recommendation:** for each sample S1–S8, `PUT /api/profile` then `GET /api/plans/recommended` → `slug` and `daysPerWeek` match the table above; `why` is present.
4. **Plan content spot checks** (`GET /api/plans/<id>`):
   - `obese-advanced-adult`: every exercise is low-impact, no `sets` above 3, a cardio finisher on every day;
   - `underweight-beginner-adult`: a stretch finisher on every day, no cardio;
   - `normal-beginner-adult`: cardio only on day 3;
   - any `senior` plan: `restSec` is 30 higher than the same level's `adult` plan, `repsMin` ≥ 8, no advanced-level exercise;
   - `normal-intermediate-adult` vs `normal-intermediate-midlife`: `restSec` differs by exactly 15.
5. **Age boundary:** same user and BMI, change age 39 → 40 → the recommended slug changes from `-adult` to `-midlife`.
6. **Logs:**
   - create a session from a plan day's exercise ids → 201;
   - reps on a timed exercise (Plank) → 400; `durationSec` on a reps exercise → 400; the same exercise twice → 400; date `2026-02-30` → 400;
   - list is newest first and the `from`/`to`/`exerciseId` filters work; `PUT` updates; `DELETE` → 204;
   - a second account gets 404 on read, update and delete of the first account's log.
7. **Tests and lint:** all green, including the 36-plan builder test and the ownership tests.
8. **Review the plans:** `npm run plans:preview` for 3 plans of your choice. Tell me any exercise you would swap. Changes to `selection.json` are cheapest now, before the frontend exists.

### Checkpoint 3 — after chunk 15 (backend frozen, frontend auth + profile)
1. **Backend freeze:** `npm test` is green; `npm audit` shows no high/critical issues; a fresh clone into a new folder runs with `npm i && npm run seed && npm run dev`.
2. **Stats spot check** (backend, three hand-made sessions): `summary` totals match your hand calculation; `volume` has zeros for empty days; a set of 100 kg × 5 reps gives an estimated 1RM of 116.7 in `personal-records`.
3. **Frontend boots:** `npm run dev` on 5173; the browser network tab shows `/api/...` calls going to 5173 (proxy) and succeeding.
4. **Onboarding:** register lands on `/onboarding`; entering 200 cm / 100 kg shows a live BMI of 25.0 (overweight); after saving, the BMI card shows the same value.
5. **Session and guards:** refresh keeps you logged in; logout returns to `/login`; opening a protected URL logged out redirects to `/login` and back after login; a user without a profile is sent to `/onboarding`.
6. **Cookie safety:** in the browser console `document.cookie` does not contain `token` (httpOnly).
7. **Profile edit:** change age 39 → 40 and save → the BMI card shows the new age band label and the healthy weight range.
8. **Responsive:** login, register, onboarding and profile have no horizontal scroll at 360, 768 and 1280 px; buttons are easy to tap on 360 px.
9. **Disclaimer:** visible on onboarding, profile and in the footer.

### Checkpoint 4 — after chunk 20 (all main user flows)
1. **Library:** 76 exercises; search "squat" and a muscle filter work; the detail page shows both images; filters survive a page refresh (URL params).
2. **Plans:** for S1, S3 and S7 the Plan page shows the expected plan (day count, split, exercises), with a "why this plan" line. `/plans` shows 12 cards for the user's age band and the switcher reaches the other bands.
3. **Start a workout:** "Start this workout" on a plan day opens a prefilled form; timed exercises ask for seconds, others for reps/weight; save → it appears in History.
4. **History:** date and exercise filters, edit, delete with confirmation, pagination.
5. **Dashboard:** "this week X of N" and total volume match History by hand; after logging plan day 1 the "next workout" moves to day 2; the weekly streak counts the current week.
6. **Isolation:** a second account sees none of the first account's logs.
7. **Mobile:** every page above is usable at 360 px, including navigation.
8. **Console and network:** no errors in the browser console on any page; no failed requests except expected 401s.

### Checkpoint 5 — after chunk 25 (final)
1. **QA checklist:** `docs/QA_CHECKLIST.md` passes end to end: register → onboarding → plan → log from a plan day → history edit/delete → progress charts → logout.
2. **Charts:** volume, sessions per week and per-exercise numbers match a hand calculation; a brand-new user sees clean empty states.
3. **Production build:** `npm run build && NODE_ENV=production npm start` serves everything on one port; refreshing `/history` works; `/api/unknown` returns JSON 404.
4. **Security pass:** `curl -I` shows helmet headers; cookie is `Secure` only over HTTPS; CORS allows only your origin; `.env` is not in git; `JWT_SECRET` is not the example value; `npm audit` has no high/critical issues.
5. **Deployment** (if done): Atlas network access restricted, DB password rotated, production seed counts 76 exercises and 36 plans, login works over HTTPS.
6. **Wrap-up:** all tests green, lint clean, PROGRESS.md fully updated, remaining known issues triaged.
