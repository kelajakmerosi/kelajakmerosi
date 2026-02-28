import { z } from 'zod'

export const ErrorEnvelopeSchema: z.ZodObject<{
  error: z.ZodObject<{
    code: z.ZodString
    message: z.ZodString
    requestId: z.ZodOptional<z.ZodString>
    details: z.ZodOptional<z.ZodUnknown>
  }>
}>

export const SuccessEnvelopeSchema: <T extends z.ZodTypeAny>(payloadSchema: T) => z.ZodObject<{
  data: T
  meta: z.ZodOptional<z.ZodRecord<z.ZodString, z.ZodUnknown>>
}>

export const PublicUserSchema: z.ZodTypeAny
export const AuthPayloadSchema: z.ZodTypeAny
export const RegisterRequestSchema: z.ZodTypeAny
export const LoginRequestSchema: z.ZodTypeAny
export const GoogleAuthRequestSchema: z.ZodTypeAny
export const ProfileUpdateSchema: z.ZodTypeAny
export const TopicProgressPatchSchema: z.ZodTypeAny
export const ProgressTopicParamsSchema: z.ZodTypeAny
export const SubjectPathParamsSchema: z.ZodTypeAny
export const SubjectCreateSchema: z.ZodTypeAny
export const SubjectUpdateSchema: z.ZodTypeAny
