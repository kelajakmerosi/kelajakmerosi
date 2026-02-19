const { Router } = require('express');
const authRoutes    = require('./auth.routes');
const subjectRoutes = require('./subject.routes');
const userRoutes    = require('./user.routes');

const router = Router();

router.use('/auth',     authRoutes);
router.use('/subjects', subjectRoutes);
router.use('/users',    userRoutes);

module.exports = router;
