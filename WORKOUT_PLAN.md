# WORKOUT_PLAN.md — Fitverse workout design (source of truth for plans & exercises)

> Authoritative for: which inputs drive the plan, the exercise dataset and the exact 76-exercise selection, the 36 plans, and the algorithm that builds them.
> `PLAN.md` references this file. If a rule here changes, update this file **and** the matching part of `PLAN.md` / `PROGRESS.md`.
> Machine-readable exercise list: `selection.json` → goes to `backend/src/seed/data/selection.json` in chunk 5.

---

## 1. What drives the plan

| Input | Used for | Notes |
|---|---|---|
| **Height + weight** | BMI → **BMI category** → goal, reps, rest, finisher type, impact rule | BMI = kg / m². Height also drives the **healthy weight range** shown to the user (§5). |
| **Age** | **Age band** → training days, set caps, rest, rep floor, impact rule, cardio cap | Bands: `adult` 18–39, `midlife` 40–54, `senior` 55–80. |
| **Experience level** | Split, days/week, sets, which exercise levels are allowed | `beginner`, `intermediate`, `advanced` (self-declared). |
| Gender | **Not used in v1** | No evidence-based reason to change exercise selection; stored for later (e.g. calorie estimates). |

Honest note on height: height has no effect on the workout except through BMI and the healthy-range display. It is not used to pick exercises.

**Result:** `bmiCategory (4) × experienceLevel (3) × ageBand (3) = 36 stored plans`, slug `<bmiCategory>-<experienceLevel>-<ageBand>` (e.g. `overweight-advanced-senior`). Plans are generated deterministically at seed time (D9) from `selection.json`; none are hand-written.

---

## 2. Decisions made (you can veto any of these)

| # | Decision | Why |
|---|---|---|
| W1 | **Home-first equipment**: bodyweight, a pair of dumbbells, resistance bands, a mat, a sturdy chair/bench. A doorway pull-up bar is optional and only needed in **advanced** plans. One exercise (Goblet Squat) lists a kettlebell; hold one dumbbell instead. | Project description says home workouts. No barbells, machines or cable stations in plans. |
| W2 | **Dataset = Free Exercise DB** (`yuhonas/free-exercise-db`, Unlicense / public domain). 876 exercises, 2 images each. We use a fixed set of **76**. | Matches your brief; verified live (§3). |
| W3 | **Low-impact rule** = no jumping, running or ballistic moves. Applies to every plan where BMI is overweight/obese **or** age band is midlife/senior. Only `normal`/`underweight` + `adult` can receive high-impact cardio. | Joint safety; simple, testable. |
| W4 | **Pull-ups are `advanced`** (selection overrides dataset's `beginner`). | Unrealistic for most beginners/intermediates, especially at higher BMI. |
| W5 | **Standard push-ups are `intermediate`**, feet-elevated push-ups `advanced`. Beginners get incline push-ups, dumbbell/band presses. | Same reason. |
| W6 | Plans use **one finisher per day** (cardio or stretch), counted in exercises/day. | Keeps sessions 6–8 exercises, ~40–60 min. |
| W7 | Age and BMI are read **at request time**; changing the profile changes the recommended plan. No stored "active plan" in v1. | Matches PLAN.md §7.4. |
| W8 | 28 of the 76 exercises are **not used by any stored plan** (listed in §10). They stay in the library for manual logging and for the "smarter suggestions" feature later. | Library should be bigger than any single plan. |

---

## 3. Exercise dataset (verified)

Checked on 2026-10-17 against the live repo:

| Fact | Value |
|---|---|
| Source | `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json` (≈1 MB) |
| License | Unlicense (README badge: "Open Public Domain Exercise Dataset") |
| Size | 876 exercises: strength 584, stretching 123, plyometrics 61, powerlifting 38, olympic weightlifting 35, strongman 21, cardio 14 |
| Levels in dataset | beginner 525, intermediate 294, **expert** 57 (we store `expert` as `advanced`) |
| Record fields | `id, name, force, level, mechanic, equipment, primaryMuscles, secondaryMuscles, instructions, category, images` |
| Images | `exercises/<id>/0.jpg`, `1.jpg` at `https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/<path>`. **All 152 images for our 76 exercises returned HTTP 200.** |
| Null values | `equipment`, `force`, `mechanic` can be `null` → stored as `other` / `null` / `null`. |

Credit line for the footer/README: "Exercise data and images: Free Exercise DB (public domain)."

**Pipeline** (chunk 5): `selection.json` → `npm run seed:fetch` downloads `exercises.json`, keeps our 76 records, downloads their 152 images into `backend/public/exercise-images/<id>/{0,1}.jpg`, writes `exercises.selected.json`.

**Field mapping** (`mapExercise.js`):
- `level`: selection override if present, else dataset level with `expert → advanced`.
- `trackingType`: selection override if present; else `time` for categories `cardio` and `stretching`; else `reps`.
- `muscleGroup` from `primaryMuscles[0]`: chest→chest · lats, middle back, lower back, traps→back · shoulders, neck→shoulders · biceps, triceps, forearms→arms · quadriceps, hamstrings, glutes, calves, abductors, adductors→legs · abdominals→core · category `cardio`→cardio.
- `lowImpact`, `slots`: copied from selection.

---

## 4. The 76 selected exercises

Order inside each table = preference order (earlier = used first when levels tie). `Level` is the **effective** level we store.

**Squat** (`squat`, 5 candidates)

| # | Exercise | Dataset id | Level | Equipment | Low-impact | Tracking | Also tagged |
|---|---|---|---|---|---|---|---|
| 1 | Bodyweight Squat | `Bodyweight_Squat` | beginner | body only | yes | reps | – |
| 2 | Goblet Squat | `Goblet_Squat` | beginner | kettlebells | yes | reps | – |
| 3 | Dumbbell Squat | `Dumbbell_Squat` | beginner | dumbbell | yes | reps | – |
| 4 | Squats - With Bands | `Squats_-_With_Bands` | beginner | bands | yes | reps | – |
| 5 | Plie Dumbbell Squat | `Plie_Dumbbell_Squat` | beginner | dumbbell | yes | reps | – |

**Hinge / glutes** (`hinge`, 7 candidates)

| # | Exercise | Dataset id | Level | Equipment | Low-impact | Tracking | Also tagged |
|---|---|---|---|---|---|---|---|
| 1 | Stiff-Legged Dumbbell Deadlift | `Stiff-Legged_Dumbbell_Deadlift` | beginner | dumbbell | yes | reps | – |
| 2 | Band Good Morning | `Band_Good_Morning` | beginner | bands | yes | reps | – |
| 3 | Band Good Morning (Pull Through) | `Band_Good_Morning_Pull_Through` | beginner | bands | yes | reps | – |
| 4 | Butt Lift (Bridge) | `Butt_Lift_Bridge` | beginner | body only | yes | reps | – |
| 5 | Single Leg Glute Bridge | `Single_Leg_Glute_Bridge` | beginner | body only | yes | reps | – |
| 6 | Kettlebell One-Legged Deadlift | `Kettlebell_One-Legged_Deadlift` | intermediate | kettlebells | yes | reps | – |
| 7 | Hyperextensions With No Hyperextension Bench | `Hyperextensions_With_No_Hyperextension_Bench` | intermediate | body only | yes | reps | – |

**Lunge / step** (`lunge`, 5 candidates)

| # | Exercise | Dataset id | Level | Equipment | Low-impact | Tracking | Also tagged |
|---|---|---|---|---|---|---|---|
| 1 | Split Squat with Dumbbells | `Split_Squat_with_Dumbbells` | beginner | dumbbell | yes | reps | – |
| 2 | Dumbbell Lunges | `Dumbbell_Lunges` | beginner | dumbbell | yes | reps | – |
| 3 | Step-up with Knee Raise | `Step-up_with_Knee_Raise` | beginner | body only | yes | reps | – |
| 4 | Dumbbell Step Ups | `Dumbbell_Step_Ups` | intermediate | dumbbell | yes | reps | – |
| 5 | Dumbbell Rear Lunge | `Dumbbell_Rear_Lunge` | intermediate | dumbbell | yes | reps | – |

**Horizontal push** (`push_h`, 6 candidates)

| # | Exercise | Dataset id | Level | Equipment | Low-impact | Tracking | Also tagged |
|---|---|---|---|---|---|---|---|
| 1 | Incline Push-Up | `Incline_Push-Up` | beginner | body only | yes | reps | – |
| 2 | Dumbbell Bench Press | `Dumbbell_Bench_Press` | beginner | dumbbell | yes | reps | – |
| 3 | Bench Press - With Bands | `Bench_Press_-_With_Bands` | beginner | bands | yes | reps | – |
| 4 | Incline Dumbbell Press | `Incline_Dumbbell_Press` | beginner | dumbbell | yes | reps | – |
| 5 | Pushups | `Pushups` | intermediate (override, dataset: beginner) | body only | yes | reps | – |
| 6 | Push-Ups With Feet Elevated | `Push-Ups_With_Feet_Elevated` | advanced (override, dataset: beginner) | body only | yes | reps | – |

**Vertical push** (`push_v`, 6 candidates)

| # | Exercise | Dataset id | Level | Equipment | Low-impact | Tracking | Also tagged |
|---|---|---|---|---|---|---|---|
| 1 | Standing Dumbbell Press | `Standing_Dumbbell_Press` | beginner | dumbbell | yes | reps | – |
| 2 | Seated Dumbbell Press | `Seated_Dumbbell_Press` | beginner | dumbbell | yes | reps | – |
| 3 | Shoulder Press - With Bands | `Shoulder_Press_-_With_Bands` | beginner | bands | yes | reps | – |
| 4 | Standing Alternating Dumbbell Press | `Standing_Alternating_Dumbbell_Press` | beginner | dumbbell | yes | reps | – |
| 5 | Dumbbell Shoulder Press | `Dumbbell_Shoulder_Press` | intermediate | dumbbell | yes | reps | – |
| 6 | Arnold Dumbbell Press | `Arnold_Dumbbell_Press` | intermediate | dumbbell | yes | reps | – |

**Horizontal pull (rows)** (`pull_h`, 5 candidates)

| # | Exercise | Dataset id | Level | Equipment | Low-impact | Tracking | Also tagged |
|---|---|---|---|---|---|---|---|
| 1 | One-Arm Dumbbell Row | `One-Arm_Dumbbell_Row` | beginner | dumbbell | yes | reps | – |
| 2 | Bent Over Two-Dumbbell Row | `Bent_Over_Two-Dumbbell_Row` | beginner | dumbbell | yes | reps | – |
| 3 | Dumbbell Incline Row | `Dumbbell_Incline_Row` | beginner | dumbbell | yes | reps | pull_v |
| 4 | Bent Over Two-Dumbbell Row With Palms In | `Bent_Over_Two-Dumbbell_Row_With_Palms_In` | beginner | dumbbell | yes | reps | pull_v |
| 5 | Two-Arm Kettlebell Row | `Two-Arm_Kettlebell_Row` | intermediate | kettlebells | yes | reps | – |

**Vertical pull** (`pull_v`, 5 candidates)

| # | Exercise | Dataset id | Level | Equipment | Low-impact | Tracking | Also tagged |
|---|---|---|---|---|---|---|---|
| 1 | Dumbbell Incline Row | `Dumbbell_Incline_Row` | beginner | dumbbell | yes | reps | pull_h |
| 2 | Bent Over Two-Dumbbell Row With Palms In | `Bent_Over_Two-Dumbbell_Row_With_Palms_In` | beginner | dumbbell | yes | reps | pull_h |
| 3 | Chin-Up | `Chin-Up` | advanced (override, dataset: beginner) | body only | yes | reps | – |
| 4 | Pullups | `Pullups` | advanced (override, dataset: beginner) | body only | yes | reps | – |
| 5 | Straight-Arm Dumbbell Pullover | `Straight-Arm_Dumbbell_Pullover` | intermediate | dumbbell | yes | reps | – |

**Shoulder isolation** (`shoulder`, 4 candidates)

| # | Exercise | Dataset id | Level | Equipment | Low-impact | Tracking | Also tagged |
|---|---|---|---|---|---|---|---|
| 1 | Side Lateral Raise | `Side_Lateral_Raise` | beginner | dumbbell | yes | reps | – |
| 2 | Lateral Raise - With Bands | `Lateral_Raise_-_With_Bands` | beginner | bands | yes | reps | – |
| 3 | Reverse Flyes | `Reverse_Flyes` | beginner | dumbbell | yes | reps | – |
| 4 | Back Flyes - With Bands | `Back_Flyes_-_With_Bands` | beginner | bands | yes | reps | – |

**Biceps** (`biceps`, 5 candidates)

| # | Exercise | Dataset id | Level | Equipment | Low-impact | Tracking | Also tagged |
|---|---|---|---|---|---|---|---|
| 1 | Dumbbell Bicep Curl | `Dumbbell_Bicep_Curl` | beginner | dumbbell | yes | reps | – |
| 2 | Hammer Curls | `Hammer_Curls` | beginner | dumbbell | yes | reps | – |
| 3 | Concentration Curls | `Concentration_Curls` | beginner | dumbbell | yes | reps | – |
| 4 | Cross Body Hammer Curl | `Cross_Body_Hammer_Curl` | beginner | dumbbell | yes | reps | – |
| 5 | Zottman Curl | `Zottman_Curl` | intermediate | dumbbell | yes | reps | – |

**Triceps** (`triceps`, 5 candidates)

| # | Exercise | Dataset id | Level | Equipment | Low-impact | Tracking | Also tagged |
|---|---|---|---|---|---|---|---|
| 1 | Standing Dumbbell Triceps Extension | `Standing_Dumbbell_Triceps_Extension` | beginner | dumbbell | yes | reps | – |
| 2 | Tricep Dumbbell Kickback | `Tricep_Dumbbell_Kickback` | beginner | dumbbell | yes | reps | – |
| 3 | Bench Dips | `Bench_Dips` | beginner | body only | yes | reps | – |
| 4 | Seated Triceps Press | `Seated_Triceps_Press` | beginner | dumbbell | yes | reps | – |
| 5 | Speed Band Overhead Triceps | `Speed_Band_Overhead_Triceps` | beginner | bands | yes | reps | – |

**Calves** (`calves`, 3 candidates)

| # | Exercise | Dataset id | Level | Equipment | Low-impact | Tracking | Also tagged |
|---|---|---|---|---|---|---|---|
| 1 | Calf Raises - With Bands | `Calf_Raises_-_With_Bands` | beginner | bands | yes | reps | – |
| 2 | Dumbbell Seated One-Leg Calf Raise | `Dumbbell_Seated_One-Leg_Calf_Raise` | beginner | dumbbell | yes | reps | – |
| 3 | Standing Dumbbell Calf Raise | `Standing_Dumbbell_Calf_Raise` | intermediate | dumbbell | yes | reps | – |

**Core** (`core`, 8 candidates)

| # | Exercise | Dataset id | Level | Equipment | Low-impact | Tracking | Also tagged |
|---|---|---|---|---|---|---|---|
| 1 | Plank | `Plank` | beginner | body only | yes | time | – |
| 2 | Side Bridge | `Side_Bridge` | beginner | body only | yes | time | – |
| 3 | Dead Bug | `Dead_Bug` | beginner | body only | yes | reps | – |
| 4 | Crunches | `Crunches` | beginner | body only | yes | reps | – |
| 5 | Reverse Crunch | `Reverse_Crunch` | beginner | body only | yes | reps | – |
| 6 | Bent-Knee Hip Raise | `Bent-Knee_Hip_Raise` | beginner | body only | yes | reps | – |
| 7 | Russian Twist | `Russian_Twist` | intermediate | body only | yes | reps | – |
| 8 | Air Bike | `Air_Bike` | beginner | body only | yes | reps | – |

**Cardio finisher** (`cardio`, 6 candidates)

| # | Exercise | Dataset id | Level | Equipment | Low-impact | Tracking | Also tagged |
|---|---|---|---|---|---|---|---|
| 1 | Trail Running/Walking | `Trail_Running_Walking` | beginner | none | yes | time | – |
| 2 | Bicycling | `Bicycling` | beginner | other | yes | time | – |
| 3 | Walking, Treadmill | `Walking_Treadmill` | beginner | machine | yes | time | – |
| 4 | Bicycling, Stationary | `Bicycling_Stationary` | beginner | machine | yes | time | – |
| 5 | Jogging, Treadmill | `Jogging_Treadmill` | beginner | machine | no | time | – |
| 6 | Rope Jumping | `Rope_Jumping` | intermediate | other | no | time | – |

**Stretch finisher** (`stretch`, 8 candidates)

| # | Exercise | Dataset id | Level | Equipment | Low-impact | Tracking | Also tagged |
|---|---|---|---|---|---|---|---|
| 1 | Child's Pose | `Childs_Pose` | beginner | none | yes | time | – |
| 2 | Hamstring Stretch | `Hamstring_Stretch` | beginner | none | yes | time | – |
| 3 | Kneeling Hip Flexor | `Kneeling_Hip_Flexor` | beginner | none | yes | time | – |
| 4 | Cat Stretch | `Cat_Stretch` | beginner | none | yes | time | – |
| 5 | Shoulder Stretch | `Shoulder_Stretch` | beginner | none | yes | time | – |
| 6 | Standing Gastrocnemius Calf Stretch | `Standing_Gastrocnemius_Calf_Stretch` | beginner | none | yes | time | – |
| 7 | Knee Across The Body | `Knee_Across_The_Body` | beginner | none | yes | time | – |
| 8 | Hug Knees To Chest | `Hug_Knees_To_Chest` | beginner | none | yes | time | – |

**Library balance (by derived muscle group):** legs 23 · back 11 · shoulders 11 · arms 10 · core 8 · chest 7 · cardio 6 · (stretching exercises map to the muscle they stretch).

**Coverage check (run on the real data, all pass):**

| Slot | Candidates (min) | Beginner (min 2) | Low-impact (min 2; cardio 3) |
|---|---|---|---|
| squat | 5 (4) | 5 | 5 |
| hinge | 7 (4) | 5 | 7 |
| lunge | 5 (3) | 3 | 5 |
| push_h | 6 (5) | 4 | 6 |
| push_v | 6 (4) | 4 | 6 |
| pull_h | 5 (5) | 4 | 5 |
| pull_v | 5 (4) | 2 | 5 |
| shoulder | 4 (3) | 4 | 4 |
| biceps | 5 (3) | 4 | 5 |
| triceps | 5 (3) | 5 | 5 |
| calves | 3 (2) | 2 | 3 |
| core | 8 (6, ≥1 timed) | 7 | 8 |
| cardio | 6 (4) | 5 | 4 |
| stretch | 8 (5) | 8 | 8 |

Notes: two rows (`Dumbbell_Incline_Row`, `Bent_Over_Two-Dumbbell_Row_With_Palms_In`) are tagged for both `pull_h` and `pull_v` so beginners and intermediates (no pull-up bar) still get a back exercise on "vertical pull" slots. Two exercises are timed holds: `Plank`, `Side_Bridge`.

---

## 5. Classification rules

**BMI** = `weightKg / (heightCm/100)²`, rounded to 1 decimal; the category comes from the rounded value.

| Category | BMI |
|---|---|
| underweight | < 18.5 |
| normal | 18.5 – 24.9 |
| overweight | 25.0 – 29.9 |
| obese | ≥ 30.0 |

**Healthy weight range for the user's height** (shown on the BMI card, computed at request time, not stored): `min = 18.5 × h²`, `max = 24.9 × h²` (h in metres), rounded to 1 decimal. Example: 175 cm → 56.7–76.3 kg. Wording must stay neutral: "A BMI of 18.5–24.9 for your height is about X–Y kg. It's a rough guide only." Never show targets like "lose N kg".

**Age band** from `profile.age`:

| Band | Ages | Label |
|---|---|---|
| adult | 18–39 | Ages 18–39 |
| midlife | 40–54 | Ages 40–54 |
| senior | 55–80 | Ages 55–80 |

Validation: age 18–80 (D14).

---

## 6. The 36 plans

### 6.1 Days per week

| Level | adult (18–39) | midlife (40–54) | senior (55–80) |
|---|---|---|---|
| beginner | 3 · Full Body A/B/A′ | 3 · Full Body | 3 · Full Body |
| intermediate | 4 · Upper/Lower ×2 | 4 · Upper/Lower ×2 | **3** · Full Body |
| advanced | **5** · Push/Pull/Legs/Upper/Lower | **4** · Upper/Lower ×2 | **4** · Upper/Lower ×2 |

Exception: **obese + advanced + adult = 4 days** (instead of 5). Rule in one line: `advanced` gets 5 days only when `ageBand = adult` and `bmi ≠ obese`.

### 6.2 Day templates (slots)

Compound slots: `squat, hinge, lunge, push_h, push_v, pull_h, pull_v`. Isolation slots: `shoulder, biceps, triceps, calves, core`. `finisher` resolves to `cardio` or `stretch` (§7.3).

| Day | Slots (in order) |
|---|---|
| Full Body A / A′ | squat, push_h, pull_h, hinge, core, finisher |
| Full Body B | lunge, push_v, pull_v, calves, core, finisher |
| Upper A | push_h, pull_h, push_v, pull_v, biceps, triceps, finisher |
| Lower A | squat, hinge, lunge, calves, core, core, finisher |
| Upper B | push_h, pull_v, push_v, pull_h, shoulder, triceps, finisher |
| Lower B | hinge, squat, lunge, calves, core, core, finisher |
| Push | push_h, push_h, push_v, shoulder, triceps, triceps, finisher |
| Pull | pull_v, pull_h, pull_h, biceps, biceps, core, finisher |
| Legs | squat, hinge, lunge, squat, calves, core, finisher |
| Upper (5-day) | push_h, pull_h, push_v, pull_v, shoulder, biceps, triceps, finisher |
| Lower (5-day) | hinge, squat, lunge, calves, core, core, finisher |

Splits: 3 days → [Full Body A, Full Body B, Full Body A′]; 4 days → [Upper A, Lower A, Upper B, Lower B]; 5 days → [Push, Pull, Legs, Upper, Lower]. Exercises per day: 6 (3-day), 7 (4-day), 7–8 (5-day), including the finisher.

---

## 7. Prescription (the numbers)

Apply in this order: **(1) level sets → (2) BMI prescription → (3) obese cap → (4) age modifiers**.

### 7.1 Sets by level (compound / isolation)
beginner 3 / 2 · intermediate 4 / 3 · advanced 4 / 3.

### 7.2 BMI category → goal, reps, rest

| Category | Goal text | Reps compound | Reps isolation | Rest compound | Rest isolation |
|---|---|---|---|---|---|
| underweight | Build strength & muscle | 6–10 | 8–12 | 120 s | 90 s |
| normal | Balanced strength & fitness | 8–12 | 10–15 | 90 s | 60 s |
| overweight | Strength + general fitness | 10–15 | 12–15 | 60 s | 45 s |
| obese | Safe, low-impact start | 10–15 | 12–15 | 75 s | 60 s |

Obese cap: **max 3 sets** for any exercise.

### 7.3 Finisher (one per day)

| BMI | Finisher on each day |
|---|---|
| underweight | `stretch` every day (no cardio) |
| normal | `cardio` on the **last day** of the week, `stretch` on the others |
| overweight, obese | `cardio` every day |

- `stretch`: 2 sets × 30 s, rest 15 s.
- `cardio`: 1 set; duration **600 s** if normal, or if beginner; **900 s** if overweight/obese and intermediate/advanced; rest 0.
- Timed strength exercise (Plank, Side Bridge): sets as isolation; `durationSec` 30 / 45 / 60 for beginner / intermediate / advanced; rest 45 s.

### 7.4 Age modifiers

| Modifier | adult | midlife (40–54) | senior (55–80) |
|---|---|---|---|
| Rest (strength + timed strength) | +0 | **+15 s** | **+30 s** |
| Set caps | – | – | compound ≤ 3, isolation ≤ 2 |
| Rep floor | – | – | repsMin ≥ 8, repsMax ≥ 12 (lighter loads, more reps) |
| Cardio duration | per §7.3 | per §7.3 | **cap 600 s** |
| Timed-hold duration | per §7.3 | per §7.3 | **cap 45 s** |
| Exercise level cap | plan level | plan level | **intermediate max** (no advanced-only moves) |
| Impact rule | see below | low-impact only | low-impact only |
| Days/week | §6.1 | §6.1 | §6.1 |
| Extra guideline | – | longer warm-up | balance + doctor note |

**Impact rule:** low-impact-only if `bmi ∈ {overweight, obese}` **or** `ageBand ≠ adult`. Otherwise (normal/underweight adults) all exercises allowed.

---

## 8. Builder algorithm (what `planBuilder.js` must do)

Pure and deterministic — same input, same output, no randomness. Verified in a reference simulation on the real dataset (§9).

```
for each (bmiCategory, experienceLevel, ageBand):
  dpw        = daysPerWeek(level, bmi, band)            # §6.1
  levelCap   = (band == senior and level == advanced) ? intermediate : level
  lowOnly    = bmi in {overweight, obese} or band != adult
  used[slot] = 0 for every slot                         # counts per plan, not per day
  for each day in split(dpw):
    picked = {}
    for each slot in template(day):
      if slot == finisher: slot = cardio | stretch      # §7.3
      pool = selection where slot in e.slots and e.level <= levelCap
      if lowOnly: pool = pool where e.lowImpact
      pool = stable sort pool by level DESC             # plan-level moves first, then easier ones
      if pool empty: throw Error("no candidate for <slug> slot <slot>")
      start = used[slot]
      pick  = first e in pool starting at index (start mod len), wrapping, with e.id not in picked
      if none: throw Error("all candidates already used today")
      used[slot] += 1; picked.add(pick.id)
      emit sets/reps/duration/rest per §7
```

Plan metadata composed by the builder:
- `slug`: `<bmi>-<level>-<band>`
- `name`: `<Bmi label> · <Level> · <Age label> — <Split label>`, e.g. "Overweight · Advanced · Ages 55–80 — Upper/Lower 4×/week"
- `goal`: from §7.2 table
- `description`: one sentence built from goal + split + equipment note
- `guidelines`: §11 strings, in order: common → level → BMI → age → schedule

---

## 9. Verification already done (reference simulation on the real dataset)

| Check | Result |
|---|---|
| All 76 ids exist in dataset | ✔ |
| All 152 images reachable (HTTP 200) | ✔ |
| Coverage minimums (§4 table) | ✔ all 14 slots |
| 36 / 36 plans built, zero errors | ✔ |
| No exercise repeated within a day | ✔ |
| Exercise level ≤ plan level (≤ intermediate for senior) | ✔ |
| Overweight / obese / midlife / senior plans contain only low-impact exercises | ✔ |
| Obese plans never exceed 3 sets | ✔ |
| Distinct exercises per plan | 18 to 36 |

Chunk 7 must re-prove these as automated tests.

### Sample output A — `normal-beginner-adult` (3 days)

```
Day 1 Full Body A
  1. Bodyweight Squat [squat]                      3 x 8-12   rest 90s
  2. Incline Push-Up [push_h]                      3 x 8-12   rest 90s
  3. One-Arm Dumbbell Row [pull_h]                 3 x 8-12   rest 90s
  4. Stiff-Legged Dumbbell Deadlift [hinge]        3 x 8-12   rest 90s
  5. Plank [core]                                  2 x 30s    rest 45s
  6. Child's Pose [stretch]                        2 x 30s    rest 15s
Day 2 Full Body B
  1. Split Squat with Dumbbells [lunge]            3 x 8-12   rest 90s
  2. Standing Dumbbell Press [push_v]              3 x 8-12   rest 90s
  3. Dumbbell Incline Row [pull_v]                 3 x 8-12   rest 90s
  4. Calf Raises - With Bands [calves]             2 x 10-15  rest 60s
  5. Side Bridge [core]                            2 x 30s    rest 45s
  6. Hamstring Stretch [stretch]                   2 x 30s    rest 15s
Day 3 Full Body A'
  1. Goblet Squat [squat]                          3 x 8-12   rest 90s
  2. Dumbbell Bench Press [push_h]                 3 x 8-12   rest 90s
  3. Bent Over Two-Dumbbell Row [pull_h]           3 x 8-12   rest 90s
  4. Band Good Morning [hinge]                     3 x 8-12   rest 90s
  5. Dead Bug [core]                               2 x 10-15  rest 60s
  6. Trail Running/Walking [cardio]                1 x 600s   rest 0s
```

### Sample output B — `obese-advanced-senior` (4 days)

```
Day 1 Upper A
  1. Pushups [push_h]                              3 x 10-15  rest 105s
  2. Two-Arm Kettlebell Row [pull_h]               3 x 10-15  rest 105s
  3. Dumbbell Shoulder Press [push_v]              3 x 10-15  rest 105s
  4. Straight-Arm Dumbbell Pullover [pull_v]       3 x 10-15  rest 105s
  5. Zottman Curl [biceps]                         2 x 12-15  rest 90s
  6. Standing Dumbbell Triceps Extension [triceps] 2 x 12-15  rest 90s
  7. Trail Running/Walking [cardio]                1 x 600s   rest 0s
Day 2 Lower A
  1. Bodyweight Squat [squat]                      3 x 10-15  rest 105s
  2. Kettlebell One-Legged Deadlift [hinge]        3 x 10-15  rest 105s
  3. Dumbbell Step Ups [lunge]                     3 x 10-15  rest 105s
  4. Standing Dumbbell Calf Raise [calves]         2 x 12-15  rest 90s
  5. Russian Twist [core]                          2 x 12-15  rest 90s
  6. Plank [core]                                  2 x 45s    rest 75s
  7. Bicycling [cardio]                            1 x 600s   rest 0s
(Days 3–4 follow the same pattern with rotated exercises.)
```

(Real output will differ slightly only if `selection.json` changes. Review a few plans with `npm run plans:preview` in chunk 7 and tell me what you'd swap.)

---

## 10. Library-only exercises (not used by any stored plan)

`Squats_-_With_Bands`, `Plie_Dumbbell_Squat`, `Band_Good_Morning_Pull_Through`, `Butt_Lift_Bridge`, `Single_Leg_Glute_Bridge`, `Dumbbell_Lunges`, `Step-up_with_Knee_Raise`, `Bench_Press_-_With_Bands`, `Incline_Dumbbell_Press`, `Seated_Dumbbell_Press`, `Shoulder_Press_-_With_Bands`, `Standing_Alternating_Dumbbell_Press`, `Bent_Over_Two-Dumbbell_Row_With_Palms_In`, `Reverse_Flyes`, `Back_Flyes_-_With_Bands`, `Concentration_Curls`, `Cross_Body_Hammer_Curl`, `Seated_Triceps_Press`, `Speed_Band_Overhead_Triceps`, `Dumbbell_Seated_One-Leg_Calf_Raise`, `Crunches`, `Reverse_Crunch`, `Bent-Knee_Hip_Raise`, `Air_Bike`, `Jogging_Treadmill`, `Standing_Gastrocnemius_Calf_Stretch`, `Knee_Across_The_Body`, `Hug_Knees_To_Chest`.

They remain searchable and loggable. They are the alternates pool for "smarter suggestions" later (Later list).

---

## 11. Guideline strings (stored in `plan.guidelines`, in this order)

**Common (all plans)**
1. "Equipment: a pair of dumbbells (adjustable is best), resistance bands, a mat and a sturdy chair or bench. A doorway pull-up bar is optional and only used in advanced plans."
2. "Warm up for 5–8 minutes before every session: easy walking or marching, arm circles, bodyweight squats."
3. "Progress gradually: when you reach the top of the rep range on every set with good form, add a little weight (or use a stronger band) next session."
4. "Stop if you feel sharp pain, dizziness or unusual shortness of breath."

**By level**
- beginner: "Focus on form first. For the first 2 weeks pick a weight that leaves 2–3 reps in reserve."
- intermediate: "Finish each set with about 1–2 reps in reserve."
- advanced: "Take a lighter week (about half the sets) every 6–8 weeks to recover."

**By BMI category**
- underweight: "Your goal is to build strength and muscle. Take the full rest between sets, eat enough and sleep 7–9 hours so you recover."
- normal: "Your goal is balanced strength and fitness: strength work first, with a cardio finisher on your last training day."
- overweight: "Your goal is strength plus general fitness. Shorter rests keep your heart rate up, and walking on rest days counts too."
- obese: "Your goal is a safe, low-impact start. There is no jumping or running. Take longer rests whenever you need them and build up gradually."

**By age band**
- adult: *(none)*
- midlife: "You get an extra 15 seconds of rest between sets. Spend 8–10 minutes on your warm-up to look after your joints."
- senior: "You get an extra 30 seconds of rest between sets. Move slowly and under control, and keep a chair or wall within reach for balance. Check with your doctor before starting a new exercise program."

**Schedule (by days/week)**
- 3: "Suggested days: Monday, Wednesday, Friday."
- 4: "Suggested days: Monday, Tuesday, Thursday, Friday."
- 5: "Suggested days: Monday to Wednesday, then Friday and Saturday."

---

## 12. API and UI consequences (already reflected in PLAN.md)

- `Exercise` model gains `lowImpact` (Boolean) and `slots` ([String]).
- `WorkoutPlan` gains `ageBand` and the unique index becomes `{ bmiCategory, experienceLevel, ageBand }`; slug has three parts.
- `GET /api/profile`, `PUT /api/profile`, `GET /api/auth/me` return computed (not stored) `ageBand` and `healthyWeightRangeKg: { min, max }` next to `bmi` and `bmiCategory`.
- `GET /api/plans/recommended` looks up the plan with `(bmiCategory, experienceLevel, ageBand)`; the response includes `why`: `{ bmi, bmiCategory, ageBand, experienceLevel }` so the UI can explain the choice.
- `GET /api/plans` accepts `ageBand` as a filter. The Plans page shows the user's age band by default (12 cards) with a band switcher.

---

## 13. Items you may want to change later (not blockers)

- Equipment modes (gym / no equipment): would double or triple the plan set; deferred.
- More alternates per slot for smarter suggestions.
- A "swap this exercise" button using the 28 library-only exercises.
