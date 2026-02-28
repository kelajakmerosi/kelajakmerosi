import { z } from 'zod'
import type { LessonHistoryEntry, TopicProgressData, TopicProgressMap } from '../types'
import api from './api'
import { tokenStore } from './auth.service'

export interface ProgressMetrics {
  streakDays: number
  timeOnTaskSec: number
  lastActivityAt: number | null
}

export interface ProgressSnapshot {
  topicProgress: TopicProgressMap
  lessonHistory: LessonHistoryEntry[]
  metrics: ProgressMetrics
}

interface PatchResponse extends ProgressSnapshot {
  updated: TopicProgressData
}

const resolveToken = (token?: string) => token ?? tokenStore.get() ?? undefined

const ProgressMetricsSchema = z.object({
  streakDays: z.number(),
  timeOnTaskSec: z.number(),
  lastActivityAt: z.number().nullable(),
})

const ProgressSnapshotSchema = z.object({
  topicProgress: z.record(z.any()),
  lessonHistory: z.array(z.object({
    subjectId: z.string(),
    topicId: z.string(),
    quizScore: z.number().optional(),
    timestamp: z.number(),
  })),
  metrics: ProgressMetricsSchema,
})

const PatchResponseSchema = ProgressSnapshotSchema.extend({
  updated: z.record(z.any()),
})

export const progressService = {
  getProgress: async (token?: string): Promise<ProgressSnapshot> => {
    return api.get<ProgressSnapshot>('/users/progress', resolveToken(token), ProgressSnapshotSchema)
  },

  patchTopicProgress: async (
    subjectId: string,
    topicId: string,
    data: Partial<TopicProgressData>,
    token?: string,
  ): Promise<PatchResponse> => {
    const safeSubject = encodeURIComponent(subjectId)
    const safeTopic = encodeURIComponent(topicId)

    return api.patch<PatchResponse>(
      `/users/progress/${safeSubject}/${safeTopic}`,
      data,
      resolveToken(token),
      PatchResponseSchema,
    )
  },
}

export default progressService
