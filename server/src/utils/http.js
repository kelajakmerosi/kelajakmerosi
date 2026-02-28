const ERROR_CODES = require('../constants/errorCodes')

const sendSuccess = (res, data, meta, status = 200) => {
  const payload = { data }
  if (meta) payload.meta = meta
  return res.status(status).json(payload)
}

const sendError = (res, { status, code, message, requestId, details }) => {
  const payload = {
    error: {
      code: code || ERROR_CODES.INTERNAL_SERVER_ERROR,
      message: message || 'Internal server error',
    },
  }

  if (requestId) payload.error.requestId = requestId
  if (details) payload.error.details = details

  return res.status(status || 500).json(payload)
}

module.exports = { sendError, sendSuccess }
