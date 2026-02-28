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
export const PasswordSchema: z.ZodTypeAny
export const NameSchema: z.ZodTypeAny
export const PhoneSchema: z.ZodTypeAny
export const OtpCodeSchema: z.ZodTypeAny
export const PhoneRequestCodeSchema: z.ZodTypeAny
export const PhoneVerifyCodeSchema: z.ZodTypeAny
export const SignupRequestCodeSchema: z.ZodTypeAny
export const SignupConfirmSchema: z.ZodTypeAny
export const LoginWithPasswordSchema: z.ZodTypeAny
export const LegacyLoginOtpRequestCodeSchema: z.ZodTypeAny
export const LegacyLoginOtpConfirmSchema: z.ZodTypeAny
export const PasswordResetRequestCodeSchema: z.ZodTypeAny
export const PasswordResetConfirmCodeSchema: z.ZodTypeAny
export const PasswordResetCompleteSchema: z.ZodTypeAny
export const PasswordSetupCompleteSchema: z.ZodTypeAny
export const OtpRequestCodeResponseSchema: z.ZodTypeAny
export const PasswordResetConfirmCodeResponseSchema: z.ZodTypeAny
export const ProfileUpdateSchema: z.ZodTypeAny
export const TopicProgressPatchSchema: z.ZodTypeAny
export const ProgressTopicParamsSchema: z.ZodTypeAny
export const SubjectPathParamsSchema: z.ZodTypeAny
export const AdminUserPathParamsSchema: z.ZodTypeAny
export const SubjectCreateSchema: z.ZodTypeAny
export const SubjectUpdateSchema: z.ZodTypeAny
