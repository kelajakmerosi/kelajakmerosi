const jwt  = require('jsonwebtoken');
const User = require('../models/User.model');

/**
 * Protect — verifies the Bearer JWT and attaches `req.user`.
 */
exports.protect = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith('Bearer '))
      return res.status(401).json({ message: 'Not authorised, no token' });

    const token = auth.split(' ')[1];
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    req.user = await User.findById(decoded.id);
    if (!req.user) return res.status(401).json({ message: 'User no longer exists' });

    next();
  } catch {
    res.status(401).json({ message: 'Not authorised, invalid token' });
  }
};

/**
 * adminOnly — must come after `protect`.
 */
exports.adminOnly = (req, res, next) => {
  if (req.user?.role !== 'admin')
    return res.status(403).json({ message: 'Admin access required' });
  next();
};
