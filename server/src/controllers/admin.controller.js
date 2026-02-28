const User = require('../models/User.model')
const ERROR_CODES = require('../constants/errorCodes')
const { sendError, sendSuccess } = require('../utils/http')
const { getAdminEmails, getAdminPhones } = require('../utils/adminAccess')

exports.getSystemInfo = async (req, res) => {
  const uptimeSec = Math.round(process.uptime())
  return sendSuccess(res, {
    uptime: `${uptimeSec}s`,
    version: process.env.npm_package_version || '1.0.0',
    env: process.env.NODE_ENV || 'development',
    adminAccess: {
      emailCount: getAdminEmails().size,
      phoneCount: getAdminPhones().size,
    },
  })
}

exports.getAdminUsers = async (req, res, next) => {
  try {
    const users = await User.listPublicSummaries()
    return sendSuccess(res, users, { total: users.length })
  } catch (err) {
    return next(err)
  }
}

exports.deleteAdminUser = async (req, res, next) => {
  try {
    const { userId } = req.params
    if (req.user?.id === userId) {
      return sendError(res, {
        status: 400,
        code: ERROR_CODES.ADMIN_SELF_DELETE_FORBIDDEN,
        message: 'You cannot delete your own account from admin panel.',
        requestId: req.id,
      })
    }

    const deleted = await User.deleteById(userId)
    if (!deleted) {
      return sendError(res, {
        status: 404,
        code: ERROR_CODES.USER_NO_LONGER_EXISTS,
        message: 'User not found',
        requestId: req.id,
      })
    }

    return sendSuccess(res, { deleted: true, userId: deleted.id })
  } catch (err) {
    return next(err)
  }
}
