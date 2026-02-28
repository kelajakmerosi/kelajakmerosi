const { Router } = require('express')
const { getSystemInfo, getAdminUsers } = require('../controllers/admin.controller')
const { protect, adminOnly } = require('../middleware/auth.middleware')

const router = Router()

router.get('/info', protect, adminOnly, getSystemInfo)
router.get('/users', protect, adminOnly, getAdminUsers)

module.exports = router
