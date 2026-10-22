import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { mapExercise } from './mapExercise.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DATA_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/dist/exercises.json';
const IMAGE_BASE_URL = 'https://raw.githubusercontent.com/yuhonas/free-exercise-db/main/exercises/';

const SELECTION_PATH = path.join(__dirname, 'data', 'selection.json');
const OUTPUT_DATA_PATH = path.join(__dirname, 'data', 'exercises.selected.json');
const PUBLIC_IMAGES_DIR = path.join(__dirname, '..', '..', 'public', 'exercise-images');

async function downloadFile(url, destPath) {
  const res = await fetch(url);
  if (!res.ok) {
    throw new Error(`Failed to download ${url}: status ${res.status}`);
  }
  const arrayBuffer = await res.arrayBuffer();
  await fs.mkdir(path.dirname(destPath), { recursive: true });
  await fs.writeFile(destPath, Buffer.from(arrayBuffer));
}

export function checkCoverage(exercises) {
  const slotRequirements = {
    squat: { min: 4, beginner: 2, lowImpact: 2 },
    hinge: { min: 4, beginner: 2, lowImpact: 2 },
    lunge: { min: 3, beginner: 2, lowImpact: 2 },
    push_h: { min: 5, beginner: 2, lowImpact: 2 },
    push_v: { min: 4, beginner: 2, lowImpact: 2 },
    pull_h: { min: 5, beginner: 2, lowImpact: 2 },
    pull_v: { min: 4, beginner: 2, lowImpact: 2 },
    shoulder: { min: 3, beginner: 2, lowImpact: 2 },
    biceps: { min: 3, beginner: 2, lowImpact: 2 },
    triceps: { min: 3, beginner: 2, lowImpact: 2 },
    calves: { min: 2, beginner: 2, lowImpact: 2 },
    core: { min: 6, beginner: 2, lowImpact: 2 },
    cardio: { min: 4, beginner: 2, lowImpact: 3 },
    stretch: { min: 5, beginner: 2, lowImpact: 2 },
  };

  const report = {};
  let allOk = true;

  for (const [slot, reqs] of Object.entries(slotRequirements)) {
    const candidates = exercises.filter((e) => e.slots.includes(slot));
    const beginners = candidates.filter((e) => e.level === 'beginner');
    const lowImpact = candidates.filter((e) => e.lowImpact);

    const ok =
      candidates.length >= reqs.min &&
      beginners.length >= reqs.beginner &&
      lowImpact.length >= reqs.lowImpact;

    if (!ok) {
      allOk = false;
    }

    report[slot] = {
      candidates: candidates.length,
      minRequired: reqs.min,
      beginners: beginners.length,
      lowImpact: lowImpact.length,
      status: ok ? 'OK' : 'FAIL',
    };
  }

  return { allOk, report };
}

export async function fetchExercises() {
  console.info('Reading selection.json...');
  const selectionRaw = await fs.readFile(SELECTION_PATH, 'utf-8');
  const selection = JSON.parse(selectionRaw);
  console.info(`Found ${selection.length} selections.`);

  console.info(`Fetching raw dataset from ${DATA_URL}...`);
  const res = await fetch(DATA_URL);
  if (!res.ok) {
    throw new Error(`Failed to fetch exercises dataset: ${res.status}`);
  }
  const allExercises = await res.json();
  const datasetMap = new Map(allExercises.map((e) => [e.id, e]));

  const missingIds = [];
  const selectedRecords = [];

  for (const item of selection) {
    const raw = datasetMap.get(item.id);
    if (!raw) {
      missingIds.push(item.id);
    } else {
      selectedRecords.push(mapExercise(raw, item));
    }
  }

  if (missingIds.length > 0) {
    throw new Error(`Missing IDs from dataset: ${missingIds.join(', ')}`);
  }

  console.info(`Successfully mapped ${selectedRecords.length} exercises.`);

  // Write exercises.selected.json
  await fs.writeFile(OUTPUT_DATA_PATH, JSON.stringify(selectedRecords, null, 2));
  console.info(`Saved ${selectedRecords.length} records to ${OUTPUT_DATA_PATH}`);

  // Download images
  console.info('Downloading exercise images...');
  const imageTasks = [];
  for (const exercise of selectedRecords) {
    for (const imageRelPath of exercise.images) {
      imageTasks.push(imageRelPath);
    }
  }

  const batchSize = 16;
  for (let i = 0; i < imageTasks.length; i += batchSize) {
    const batch = imageTasks.slice(i, i + batchSize);
    await Promise.all(
      batch.map(async (imageRelPath) => {
        const destPath = path.join(PUBLIC_IMAGES_DIR, imageRelPath);
        try {
          await fs.access(destPath);
        } catch {
          const imageUrl = `${IMAGE_BASE_URL}${imageRelPath}`;
          await downloadFile(imageUrl, destPath);
        }
      }),
    );
  }
  console.info(`Verified ${imageTasks.length} images in ${PUBLIC_IMAGES_DIR}`);

  // Coverage check
  const { allOk, report } = checkCoverage(selectedRecords);
  console.info('Coverage report:');
  console.table(report);

  if (!allOk) {
    throw new Error('Coverage check failed against WORKOUT_PLAN.md requirements!');
  }
  console.info('Coverage check passed for all 14 slots!');
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  fetchExercises().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
