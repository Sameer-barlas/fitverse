import { ApiError } from '../utils/ApiError.js';

export function notFound(req, _res, _next) {
  throw new ApiError(404, 'NOT_FOUND', `Route ${req.method} ${req.originalUrl} not found`);
}
