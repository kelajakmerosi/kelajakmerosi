const { Router } = require('express')
const { getSystemInfo, getAdminUsers, deleteAdminUser } = require('../controllers/admin.controller')
const { protect, adminOnly } = require('../middleware/auth.middleware')
const { validateParams } = require('../middleware/validate.middleware')
const { AdminUserPathParamsSchema } = require('../../../shared/contracts')

const router = Router()

router.get('/info', protect, adminOnly, getSystemInfo)
router.get('/users', protect, adminOnly, getAdminUsers)
router.delete('/users/:userId', protect, adminOnly, validateParams(AdminUserPathParamsSchema), deleteAdminUser)

module.exports = router
