import client from './client.js';

function getTodayLocalStr() {
  const now = new Date();
  const y = now.getFullYear();
  const m = String(now.getMonth() + 1).padStart(2, '0');
  const d = String(now.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const getSummaryStats = (today = getTodayLocalStr()) =>
  client.get('/stats/summary', { params: { today } });

export const getVolumeStats = (weeks = 8) =>
  client.get('/stats/volume', { params: { weeks } });

export const getFrequencyStats = (days = 28) =>
  client.get('/stats/frequency', { params: { days } });

export const getMuscleStats = (days = 30) =>
  client.get('/stats/muscles', { params: { days } });

export const getExerciseProgressStats = (exerciseId) =>
  client.get(`/stats/exercise/${exerciseId}`);

export const getPersonalRecordsStats = () =>
  client.get('/stats/personal-records');
