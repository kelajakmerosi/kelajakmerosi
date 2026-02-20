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

export const progressService = {
  getProgress: async (token?: string): Promise<ProgressSnapshot> => {
    return api.get<ProgressSnapshot>('/users/progress', resolveToken(token))
  },

  patchTopicProgress: async (
    subjectId: string,
    topicId: string,
    data: Partial<TopicProgressData>,
    token?: string,
  ): Promise<PatchResponse> => {
    const safeSubject = encodeURIComponent(subjectId)
    const safeTopic = encodeURIComponent(topicId)

    return api.patch<PatchResponse>(`/users/progress/${safeSubject}/${safeTopic}`, data, resolveToken(token))
  },
}

export default progressService
