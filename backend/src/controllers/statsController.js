import {
  getSummaryStats,
  getVolumeStats,
  getFrequencyStats,
  getMuscleDistributionStats,
  getExerciseProgressStats,
  getPersonalRecordsStats,
} from '../services/statsService.js';

export async function getSummary(req, res) {
  const summary = await getSummaryStats(req.user.id);
  res.status(200).json({
    data: summary,
  });
}

export async function getVolume(req, res) {
  const { weeks } = req.validated.query;
  const series = await getVolumeStats(req.user.id, weeks);
  res.status(200).json({
    data: series,
  });
}

export async function getFrequency(req, res) {
  const { days } = req.validated.query;
  const series = await getFrequencyStats(req.user.id, days);
  res.status(200).json({
    data: series,
  });
}

export async function getMuscles(req, res) {
  const { days } = req.validated.query;
  const distribution = await getMuscleDistributionStats(req.user.id, days);
  res.status(200).json({
    data: distribution,
  });
}

export async function getExerciseProgress(req, res) {
  const { exerciseId } = req.validated.params;
  const progress = await getExerciseProgressStats(req.user.id, exerciseId);
  res.status(200).json({
    data: progress,
  });
}

export async function getPersonalRecords(req, res) {
  const records = await getPersonalRecordsStats(req.user.id);
  res.status(200).json({
    data: records,
  });
}
