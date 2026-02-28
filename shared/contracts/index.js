const { z } = require('zod')

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
  email: z.string().email(),
  avatar: z.string().optional().nullable(),
  role: z.enum(['student', 'admin']).optional(),
  createdAt: z.union([z.string(), z.number()]).optional(),
})

const AuthPayloadSchema = z.object({
  token: z.string(),
  user: PublicUserSchema,
})

const RegisterRequestSchema = z.object({
  name: z.string().min(1).max(120).optional(),
  email: z.string().email(),
  password: z.string().min(6).max(200),
}).strict()

const LoginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1).max(200),
}).strict()

const GoogleAuthRequestSchema = z.object({
  idToken: z.string().min(1),
}).strict()

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
  ProfileUpdateSchema,
  TopicProgressPatchSchema,
  ProgressTopicParamsSchema,
  SubjectPathParamsSchema,
  SubjectCreateSchema,
  SubjectUpdateSchema,
}
