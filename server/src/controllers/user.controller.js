const User = require('../models/User.model');

// ─── GET /api/users/profile ───────────────────────────────────────────────────

exports.getProfile = async (req, res) => {
  res.json(req.user.toPublic());
};

// ─── PUT /api/users/profile ───────────────────────────────────────────────────

exports.updateProfile = async (req, res, next) => {
  try {
    const { name, avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, avatar },
      { new: true, runValidators: true }
    );
    res.json(user.toPublic());
  } catch (err) { next(err); }
};

// ─── GET /api/users/progress ──────────────────────────────────────────────────

exports.getProgress = async (req, res) => {
  // TODO: aggregate quiz/lesson progress for the authenticated user
  res.json({ progress: req.user.progress || [] });
};
