const User = require('../models/User.model');

// ─── GET /api/users/profile ───────────────────────────────────────────────────

exports.getProfile = async (req, res) => {
  res.json(User.toPublic(req.user));
};

// ─── PUT /api/users/profile ───────────────────────────────────────────────────

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.update(req.user.id, { name, avatar });
    res.json(User.toPublic(user));
  } catch (err) { next(err); }
};

// ─── GET /api/users/progress ──────────────────────────────────────────────────

exports.getProgress = async (req, res) => {
  // TODO: aggregate quiz/lesson progress for the authenticated user
  res.json({ progress: [] });
};
