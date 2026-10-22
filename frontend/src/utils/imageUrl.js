/**
 * Helper to resolve exercise image URLs in both local dev (Vite proxy)
 * and production (direct backend host or proxied via Vercel).
 */
export function getExerciseImageUrl(pathOrUrl) {
  if (!pathOrUrl) return null;
  if (pathOrUrl.startsWith('http://') || pathOrUrl.startsWith('https://')) {
    return pathOrUrl;
  }

  const apiBase = import.meta.env.VITE_API_BASE_URL || '';
  const backendBase = apiBase.startsWith('http')
    ? apiBase.replace(/\/api\/?$/, '')
    : '';

  const cleanPath = pathOrUrl.startsWith('/') ? pathOrUrl : `/${pathOrUrl}`;
  return `${backendBase}${cleanPath}`;
}
