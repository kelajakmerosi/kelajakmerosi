const { Router } = require('express');
const { register, login, getMe, googleAuth } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');

const router = Router();

router.post('/register', register);
router.post('/login',    login);
router.post('/google',   googleAuth);
router.get('/me',        protect, getMe);

module.exports = router;
