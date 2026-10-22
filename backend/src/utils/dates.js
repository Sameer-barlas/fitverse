export function isValidDateString(dateStr) {
  if (typeof dateStr !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(dateStr)) {
    return false;
  }
  const [year, month, day] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(year, month - 1, day));
  return (
    dt.getUTCFullYear() === year &&
    dt.getUTCMonth() === month - 1 &&
    dt.getUTCDate() === day
  );
}

export function formatUtcDate(dateObj) {
  const y = dateObj.getUTCFullYear();
  const m = String(dateObj.getUTCMonth() + 1).padStart(2, '0');
  const d = String(dateObj.getUTCDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export function getTodayUtcString(now = new Date()) {
  const today = new Date(Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()));
  return formatUtcDate(today);
}

export function getTomorrowUtcString(now = new Date()) {
  const tomorrow = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate() + 1),
  );
  return formatUtcDate(tomorrow);
}

export function isNotAfterTomorrow(dateStr) {
  if (!isValidDateString(dateStr)) {
    return false;
  }
  return dateStr <= getTomorrowUtcString();
}

export function addUtcDays(dateStr, deltaDays) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(year, month - 1, day + deltaDays));
  return formatUtcDate(dt);
}

export function getMondayOfUtcWeek(dateStr) {
  const [year, month, day] = dateStr.split('-').map(Number);
  const dt = new Date(Date.UTC(year, month - 1, day));
  const dayOfWeek = dt.getUTCDay(); // 0 = Sun, 1 = Mon, ..., 6 = Sat
  const diffToMonday = (dayOfWeek + 6) % 7;
  dt.setUTCDate(dt.getUTCDate() - diffToMonday);
  return formatUtcDate(dt);
}

export function getPastWeekStarts(weeks, todayStr = getTodayUtcString()) {
  const currentMonday = getMondayOfUtcWeek(todayStr);
  const result = [];
  for (let i = weeks - 1; i >= 0; i--) {
    result.push(addUtcDays(currentMonday, -i * 7));
  }
  return result;
}

export function getPastDateStrings(days, todayStr = getTodayUtcString()) {
  const result = [];
  for (let i = days - 1; i >= 0; i--) {
    result.push(addUtcDays(todayStr, -i));
  }
  return result;
}
