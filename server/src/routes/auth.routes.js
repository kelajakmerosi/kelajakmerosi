const { Router } = require('express');
const { register, login, getMe, googleAuth } = require('../controllers/auth.controller');
const { protect } = require('../middleware/auth.middleware');
const { validateBody } = require('../middleware/validate.middleware');
const {
  RegisterRequestSchema,
  LoginRequestSchema,
  GoogleAuthRequestSchema,
} = require('../../../shared/contracts');

const router = Router();

router.post('/register', validateBody(RegisterRequestSchema), register);
router.post('/login',    validateBody(LoginRequestSchema), login);
router.post('/google',   validateBody(GoogleAuthRequestSchema), googleAuth);
router.get('/me',        protect, getMe);

module.exports = router;
