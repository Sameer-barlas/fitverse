# FitVerse — Personal Fitness & Workout Tracker (MERN)

FitVerse is a full-stack MERN workout planner and tracker featuring server-calculated BMI and age-band classification, **36 deterministic workout plans** (4 BMI categories × 3 experience levels × 3 age bands), a **76-exercise home-friendly library** with step-by-step instructions and images, a custom and plan-prefilled workout session logger, and progress analytics powered by Recharts.

---

## Health & Fitness Disclaimer

> **BMI is a rough guide, not medical advice.** It doesn't account for muscle mass, age or body composition. The workout plans here are general fitness suggestions that adjust for your BMI, age and experience, not a substitute for professional guidance. Check with a doctor before starting a new exercise program (especially if you are over 55 or have a health condition), and stop if you feel pain, dizziness or unusual shortness of breath.

Exercise data and images are sourced from **Free Exercise DB** (public domain).

---

## Tech Stack

- **Backend (`backend/`):** Node.js (≥ 22 LTS), Express 5, MongoDB & Mongoose 8, Zod validation, `bcryptjs` (cost 12), JWT in `httpOnly` `SameSite=Lax` cookie, Helmet, CORS, `express-rate-limit`, Vitest + Supertest + `mongodb-memory-server`.
- **Frontend (`frontend/`):** React 19, Vite 6, React Router v7, Tailwind CSS v4, Axios (`withCredentials: true`), Recharts, Lucide icons, `react-hot-toast`.

---

## Environment Variables (`backend/.env`)

Copy `backend/.env.example` to `backend/.env` and configure your values:

```env
NODE_ENV=development
PORT=5000
MONGODB_URI=mongodb+srv://<db_user>:<db_password>@cluster0.njbymft.mongodb.net/fitverse?retryWrites=true&w=majority
JWT_SECRET=replace-with-a-random-64-char-hex-secret-at-least-32-chars
JWT_EXPIRES_IN=7d
CLIENT_ORIGIN=http://localhost:5173
SERVE_STATIC=false
```

Generate a strong `JWT_SECRET`:
```bash
node -e "console.log(require('crypto').randomBytes(48).toString('hex'))"
```

---

## Setup & Commands (In Order)

### 1. Install dependencies
```bash
cd backend && npm install
cd ../frontend && npm install
```

### 2. Fetch & Seed the 76 Exercises and 36 Workout Plans
```bash
cd backend
npm run seed:fetch
npm run seed
# Or run both in one command:
npm run seed:all
```

### 3. Run in Development
Terminal 1 — Backend (`http://localhost:5000`):
```bash
cd backend
npm run dev
```

Terminal 2 — Frontend (`http://localhost:5173`, proxies `/api` and `/exercise-images` to `:5000`):
```bash
cd frontend
npm run dev
```

### 4. Run Tests & Linting
```bash
# Backend unit + integration tests (46 tests via mongodb-memory-server, never touches Atlas)
cd backend
npm test
npm run lint

# Optional: Live MongoDB Atlas integration check
npm run test:atlas

# Frontend lint & production build
cd ../frontend
npm run lint
npm run build
```

### 5. Single-Origin Production Build & Serve
```bash
cd frontend && npm run build
cd ../backend && SERVE_STATIC=true NODE_ENV=production npm start
```
When `SERVE_STATIC=true` (or `NODE_ENV=production`), Express serves `frontend/dist` and handles SPA deep links on port `5000` alongside `/api` and `/exercise-images`.
