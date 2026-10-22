import bcrypt from 'bcryptjs';
import { User } from '../models/User.js';
import { Profile } from '../models/Profile.js';
import { ApiError } from '../utils/ApiError.js';
import { signToken, setAuthCookie, clearAuthCookie } from '../utils/tokens.js';
import { formatProfileResponse } from '../services/bmiService.js';

// Pre-computed bcrypt cost 12 dummy hash for constant-time comparisons on unknown emails
const DUMMY_HASH = '$2a$12$e8wV5nJg3q1y2u3i4o5p6u8v9w0x1y2z3a4b5c6d7e8f9g0h1i2j3';

export async function register(req, res) {
  const { name, email, password } = req.validated.body;

  const existing = await User.findOne({ email });
  if (existing) {
    throw new ApiError(409, 'EMAIL_TAKEN', 'An account with this email already exists');
  }

  const user = await User.create({ name, email, password });
  const token = signToken({ id: user.id });
  setAuthCookie(res, token);

  res.status(201).json({
    data: {
      user: user.toJSON(),
    },
  });
}

export async function login(req, res) {
  const { email, password } = req.validated.body;

  const user = await User.findOne({ email }).select('+password');
  const valid = user ? await user.comparePassword(password) : await bcrypt.compare(password, DUMMY_HASH);

  if (!user || !valid) {
    throw new ApiError(401, 'UNAUTHORIZED', 'Invalid email or password');
  }

  const token = signToken({ id: user.id });
  setAuthCookie(res, token);

  res.status(200).json({
    data: {
      user: user.toJSON(),
    },
  });
}

export async function logout(_req, res) {
  clearAuthCookie(res);

  res.status(200).json({
    data: {
      message: 'Logged out successfully',
    },
  });
}

export async function me(req, res) {
  const profileDoc = await Profile.findOne({ user: req.user.id });
  const profile = profileDoc ? formatProfileResponse(profileDoc) : null;

  res.status(200).json({
    data: {
      user: req.user.toJSON(),
      profile,
    },
  });
}
