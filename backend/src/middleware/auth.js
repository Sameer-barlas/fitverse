import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { User } from '../models/User.js';
import { ApiError } from '../utils/ApiError.js';

export async function protect(req, _res, next) {
  const token = req.cookies?.token;

  if (!token) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Authentication token required');
  }

  try {
    const decoded = jwt.verify(token, env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      throw new ApiError(401, 'UNAUTHORIZED', 'User not found');
    }

    req.user = user;
    next();
  } catch (err) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid or expired token');
  }
}
