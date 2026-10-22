import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import { buildAllPlans } from './planBuilder.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const SELECTED_DATA_PATH = path.join(__dirname, 'data', 'exercises.selected.json');

export function formatPlanPreview(plan) {
  const lines = [`=== ${plan.slug} (${plan.name}) ===`];
  for (const day of plan.days) {
    lines.push(`Day ${day.dayNumber} ${day.title}`);
    for (const ex of day.exercises) {
      const targetStr =
        ex.durationSec !== null ? `${ex.durationSec}s` : `${ex.repsMin}-${ex.repsMax}`;
      const label = `${ex.order}. ${ex.exerciseName} [${ex.slot}]`.padEnd(50, ' ');
      const vol = `${ex.sets} x ${targetStr}`.padEnd(10, ' ');
      lines.push(`  ${label} ${vol} rest ${ex.restSec}s`);
    }
  }
  return lines.join('\n');
}

async function runPreview() {
  const raw = await fs.readFile(SELECTED_DATA_PATH, 'utf-8');
  const exercises = JSON.parse(raw);
  const plans = buildAllPlans(exercises);

  const targetSlug = process.argv[2];
  if (targetSlug) {
    const match = plans.find((p) => p.slug === targetSlug);
    if (!match) {
      console.error(`Plan slug "${targetSlug}" not found.`);
      process.exit(1);
    }
    console.info(formatPlanPreview(match));
    return;
  }

  for (const plan of plans) {
    console.info(formatPlanPreview(plan));
    console.info('');
  }
  console.info(`Total plans previewed: ${plans.length}`);
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  runPreview().catch((err) => {
    console.error(err);
    process.exit(1);
  });
}
