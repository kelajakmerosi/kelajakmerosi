const User = require('../models/User.model')
const { sendSuccess } = require('../utils/http')

exports.getSystemInfo = async (req, res) => {
  const uptimeSec = Math.round(process.uptime())
  return sendSuccess(res, {
    uptime: `${uptimeSec}s`,
    version: process.env.npm_package_version || '1.0.0',
    env: process.env.NODE_ENV || 'development',
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
