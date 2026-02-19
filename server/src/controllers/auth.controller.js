const jwt      = require('jsonwebtoken');
const bcrypt   = require('bcryptjs');
const User     = require('../models/User.model');

// ─── Helpers ─────────────────────────────────────────────────────────────────

const signToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: process.env.JWT_EXPIRES_IN || '7d' });

// ─── POST /api/auth/register ──────────────────────────────────────────────────

exports.register = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    const existing = await User.findOne({ email });
    if (existing) return res.status(409).json({ message: 'Email already in use' });

    const user = await User.create({ name, email, password });
    const token = signToken(user._id);

    res.status(201).json({ token, user: user.toPublic() });
  } catch (err) { next(err); }
};

// ─── POST /api/auth/login ─────────────────────────────────────────────────────

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user || !(await bcrypt.compare(password, user.password)))
      return res.status(401).json({ message: 'Invalid credentials' });

    const token = signToken(user._id);
    res.json({ token, user: user.toPublic() });
  } catch (err) { next(err); }
};

// ─── POST /api/auth/google ────────────────────────────────────────────────────

exports.googleAuth = async (req, res, next) => {
  try {
    // TODO: verify Google ID token, upsert user
    res.status(501).json({ message: 'Google OAuth not yet implemented' });
  } catch (err) { next(err); }
};

// ─── GET /api/auth/me ─────────────────────────────────────────────────────────

exports.getMe = async (req, res) => {
  res.json({ user: req.user.toPublic() });
};
