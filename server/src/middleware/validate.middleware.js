const ERROR_CODES = require('../constants/errorCodes')
const { sendError } = require('../utils/http')

const validateBody = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.body)
  if (!parsed.success) {
    return sendError(res, {
      status: 400,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Validation failed',
      requestId: req.id,
      details: parsed.error.flatten(),
    })
  }

  req.body = parsed.data
  return next()
}

const validateParams = (schema) => (req, res, next) => {
  const parsed = schema.safeParse(req.params)
  if (!parsed.success) {
    return sendError(res, {
      status: 400,
      code: ERROR_CODES.VALIDATION_ERROR,
      message: 'Invalid path parameters',
      requestId: req.id,
      details: parsed.error.flatten(),
    })
  }

  req.params = parsed.data
  return next()
}

module.exports = { validateBody, validateParams }
