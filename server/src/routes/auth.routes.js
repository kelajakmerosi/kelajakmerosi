const { Router } = require('express')
const {
  register,
  login,
  getMe,
  googleAuth,
  requestPhoneCode,
  verifyPhoneCode,
  signupRequestCode,
  signupConfirm,
  loginWithPassword,
  legacyLoginOtpRequestCode,
  legacyLoginOtpConfirm,
  passwordResetRequestCode,
  passwordResetConfirmCode,
  passwordResetComplete,
  passwordSetupComplete,
} = require('../controllers/auth.controller')
const { protect } = require('../middleware/auth.middleware')
const { validateBody } = require('../middleware/validate.middleware')
const {
  RegisterRequestSchema,
  LoginRequestSchema,
  GoogleAuthRequestSchema,
  PhoneRequestCodeSchema,
  PhoneVerifyCodeSchema,
  SignupRequestCodeSchema,
  SignupConfirmSchema,
  LoginWithPasswordSchema,
  LegacyLoginOtpRequestCodeSchema,
  LegacyLoginOtpConfirmSchema,
  PasswordResetRequestCodeSchema,
  PasswordResetConfirmCodeSchema,
  PasswordResetCompleteSchema,
  PasswordSetupCompleteSchema,
} = require('../../../shared/contracts')

const router = Router()

// Deprecated endpoints kept for compatibility.
router.post('/register', validateBody(RegisterRequestSchema), register)
router.post('/login', validateBody(LoginRequestSchema), login)
router.post('/phone/request-code', validateBody(PhoneRequestCodeSchema), requestPhoneCode)
router.post('/phone/verify-code', validateBody(PhoneVerifyCodeSchema), verifyPhoneCode)

router.post('/signup/request-code', validateBody(SignupRequestCodeSchema), signupRequestCode)
router.post('/signup/confirm', validateBody(SignupConfirmSchema), signupConfirm)
router.post('/login/password', validateBody(LoginWithPasswordSchema), loginWithPassword)
router.post('/login/otp/request-code', validateBody(LegacyLoginOtpRequestCodeSchema), legacyLoginOtpRequestCode)
router.post('/login/otp/confirm', validateBody(LegacyLoginOtpConfirmSchema), legacyLoginOtpConfirm)
router.post('/password/reset/request-code', validateBody(PasswordResetRequestCodeSchema), passwordResetRequestCode)
router.post('/password/reset/confirm-code', validateBody(PasswordResetConfirmCodeSchema), passwordResetConfirmCode)
router.post('/password/reset/complete', validateBody(PasswordResetCompleteSchema), passwordResetComplete)
router.post('/password/setup/complete', protect, validateBody(PasswordSetupCompleteSchema), passwordSetupComplete)

router.post('/google', validateBody(GoogleAuthRequestSchema), googleAuth)
router.get('/me', protect, getMe)

module.exports = router
