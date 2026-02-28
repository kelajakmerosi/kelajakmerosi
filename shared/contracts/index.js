let z
try {
  ;({ z } = require('zod'))
} catch (error) {
  try {
    ;({ z } = require('../../server/node_modules/zod'))
  } catch (fallbackError) {
    throw error
  }
}

const ErrorEnvelopeSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    requestId: z.string().optional(),
    details: z.unknown().optional(),
  }),
})

const SuccessEnvelopeSchema = (payloadSchema) => z.object({
  data: payloadSchema,
  meta: z.record(z.unknown()).optional(),
})

const PublicUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  firstName: z.string().nullable().optional(),
  lastName: z.string().nullable().optional(),
  email: z.string().email().nullable().optional(),
  phone: z.string().nullable().optional(),
  avatar: z.string().optional().nullable(),
  role: z.enum(['student', 'admin']).optional(),
  createdAt: z.union([z.string(), z.number()]).optional(),
})

const AuthPayloadSchema = z.object({
  token: z.string(),
  user: PublicUserSchema,
  requiresPasswordSetup: z.boolean().optional(),
})

const RegisterRequestSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  email: z.string().email().optional(),
  password: z.string().min(6).max(200).optional(),
}).strict()

const LoginRequestSchema = z.object({
  email: z.string().email().optional(),
  password: z.string().min(1).max(200).optional(),
}).strict()

const GoogleAuthRequestSchema = z.object({
  idToken: z.string().min(1),
}).strict()

const UZ_PHONE_REGEX = /^\+998\d{9}$/
const OTP_CODE_REGEX = /^\d{6}$/
const PASSWORD_HAS_LETTER_REGEX = /[A-Za-z]/
const PASSWORD_HAS_NUMBER_REGEX = /\d/

const PasswordSchema = z
  .string()
  .min(8)
  .max(128)
  .refine((value) => PASSWORD_HAS_LETTER_REGEX.test(value), {
    message: 'Password must contain at least one letter',
  })
  .refine((value) => PASSWORD_HAS_NUMBER_REGEX.test(value), {
    message: 'Password must contain at least one number',
  })

const NameSchema = z.string().trim().min(1).max(80)
const PhoneSchema = z.string().regex(UZ_PHONE_REGEX, 'Phone must match +998XXXXXXXXX')
const OtpCodeSchema = z.string().regex(OTP_CODE_REGEX, 'Code must be 6 digits')

const PhoneRequestCodeSchema = z.object({
  phone: PhoneSchema,
}).strict()

const PhoneVerifyCodeSchema = z.object({
  phone: PhoneSchema,
  code: OtpCodeSchema,
  mode: z.enum(['login', 'signup']).optional(),
  name: z.string().min(1).max(120).optional(),
}).strict()

const SignupRequestCodeSchema = z.object({
  phone: PhoneSchema,
}).strict()

const SignupConfirmSchema = z.object({
  firstName: NameSchema,
  lastName: NameSchema,
  phone: PhoneSchema,
  password: PasswordSchema,
  code: OtpCodeSchema,
}).strict()

const LoginWithPasswordSchema = z.object({
  phone: PhoneSchema,
  password: z.string().min(1).max(128),
}).strict()

const LegacyLoginOtpRequestCodeSchema = z.object({
  phone: PhoneSchema,
}).strict()

const LegacyLoginOtpConfirmSchema = z.object({
  phone: PhoneSchema,
  code: OtpCodeSchema,
}).strict()

const PasswordResetRequestCodeSchema = z.object({
  phone: PhoneSchema,
}).strict()

const PasswordResetConfirmCodeSchema = z.object({
  phone: PhoneSchema,
  code: OtpCodeSchema,
}).strict()

const PasswordResetCompleteSchema = z.object({
  phone: PhoneSchema,
  resetToken: z.string().min(1),
  newPassword: PasswordSchema,
}).strict()

const PasswordSetupCompleteSchema = z.object({
  newPassword: PasswordSchema,
}).strict()

const OtpRequestCodeResponseSchema = z.object({
  sent: z.boolean(),
  phone: PhoneSchema,
  ttlSec: z.number().int().positive(),
  resendCooldownSec: z.number().int().positive(),
})

const PasswordResetConfirmCodeResponseSchema = z.object({
  verified: z.boolean(),
  resetToken: z.string().min(1),
  resetTokenTtlSec: z.number().int().positive(),
})

const ProfileUpdateSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  avatar: z.string().url().or(z.literal('')).optional(),
}).strict()

const TopicProgressPatchSchema = z.object({
  status: z.enum(['locked', 'inprogress', 'onhold', 'completed']).optional(),
  videoWatched: z.boolean().optional(),
  quizScore: z.number().int().nonnegative().nullable().optional(),
  quizAnswers: z.record(z.union([z.string(), z.number(), z.boolean(), z.null()])).or(z.record(z.any())).optional(),
  quizSubmitted: z.boolean().optional(),
  masteryScore: z.number().int().nonnegative().nullable().optional(),
  quizAttempts: z.number().int().nonnegative().optional(),
  quizTotalQuestions: z.number().int().nonnegative().optional(),
  timeOnTaskSec: z.number().int().nonnegative().optional(),
  resumeQuestionIndex: z.number().int().nonnegative().optional(),
  lastActivityAt: z.number().int().optional(),
  completedAt: z.number().int().nullable().optional(),
}).strict()

const ProgressTopicParamsSchema = z.object({
  subjectId: z.string().min(1),
  topicId: z.string().min(1),
}).strict()

const SubjectPathParamsSchema = z.object({
  id: z.string().min(1),
}).strict()

const AdminUserPathParamsSchema = z.object({
  userId: z.string().uuid(),
}).strict()

const SubjectTopicSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  videoId: z.string().min(1).optional(),
  questions: z.array(z.object({
    id: z.number().int().optional(),
    text: z.string().min(1),
    options: z.array(z.string()).min(2),
    answer: z.number().int().nonnegative(),
  })).optional(),
}).passthrough()

const SubjectCreateSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  icon: z.string().optional(),
  color: z.string().optional(),
  order: z.number().int().optional(),
  topics: z.array(SubjectTopicSchema).optional(),
}).strict()

const SubjectUpdateSchema = SubjectCreateSchema.partial().refine(
  (value) => Object.keys(value).length > 0,
  { message: 'At least one field must be provided' },
)

module.exports = {
  ErrorEnvelopeSchema,
  SuccessEnvelopeSchema,
  PublicUserSchema,
  AuthPayloadSchema,
  RegisterRequestSchema,
  LoginRequestSchema,
  GoogleAuthRequestSchema,
  PasswordSchema,
  NameSchema,
  PhoneSchema,
  OtpCodeSchema,
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
  OtpRequestCodeResponseSchema,
  PasswordResetConfirmCodeResponseSchema,
  ProfileUpdateSchema,
  TopicProgressPatchSchema,
  ProgressTopicParamsSchema,
  SubjectPathParamsSchema,
  AdminUserPathParamsSchema,
  SubjectCreateSchema,
  SubjectUpdateSchema,
}
