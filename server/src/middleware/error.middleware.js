/**
 * 404 handler — mounted last, before errorHandler.
 */
exports.notFound = (req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
};

/**
 * Global error handler — catches anything passed via next(err).
 */
// eslint-disable-next-line no-unused-vars
exports.errorHandler = (err, req, res, next) => {
  const statusCode = err.status ?? (res.statusCode !== 200 ? res.statusCode : 500);

  // Mongoose validation error → 400
  if (err.name === 'ValidationError') {
    return res.status(400).json({
      message: 'Validation failed',
      errors: Object.values(err.errors).map((e) => e.message),
    });
  }

  // Mongoose duplicate key → 409
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(409).json({ message: `${field} is already taken` });
  }

  console.error(`[error] ${err.message}`);
  res.status(statusCode).json({
    message: err.message || 'Internal server error',
    ...(process.env.NODE_ENV === 'development' && { stack: err.stack }),
  });
};
