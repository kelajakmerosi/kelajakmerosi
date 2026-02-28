const { Router } = require('express');
const authRoutes    = require('./auth.routes');
const subjectRoutes = require('./subject.routes');
const userRoutes    = require('./user.routes');
const adminRoutes   = require('./admin.routes');

const router = Router();

router.use('/auth',     authRoutes);
router.use('/subjects', subjectRoutes);
router.use('/users',    userRoutes);
router.use('/admin',    adminRoutes);

module.exports = router;
