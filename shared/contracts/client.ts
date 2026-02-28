import { z } from 'zod'

export const ErrorEnvelopeSchema = z.object({
  error: z.object({
    code: z.string(),
    message: z.string(),
    requestId: z.string().optional(),
    details: z.unknown().optional(),
  }),
})

export const SuccessEnvelopeSchema = <T extends z.ZodTypeAny>(payloadSchema: T) => z.object({
  data: payloadSchema,
  meta: z.record(z.unknown()).optional(),
})
