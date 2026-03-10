import { useMemo } from 'react'
import { useLang, useApp } from '../hooks'
import { useAuth } from '../hooks/useAuth'
import { SUBJECT_NAMES, TOPIC_NAMES } from '../constants'
import useLearnerSubjects from '../hooks/useLearnerSubjects'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { Divider, Alert, PageHeader } from '../components/ui/index'
import { Skeleton } from '../components/ui/Skeleton'
import { TopicRow } from '../components/features/TopicRow'
import type { TopicProgressData, TopicStatus } from '../types'
import { renderSafeIcon } from '../utils/renderSafeIcon'
import styles from './AttestationPage.module.css'

interface AttestationPageProps {
  subjectId: string
  onBack: () => void
  onTopicSelect: (subjectId: string, topicId: string) => void
}

const toScorePct = (data: TopicProgressData, totalQuestions?: number) => {
  if (typeof data.masteryScore === 'number') return data.masteryScore
  if (typeof data.quizScore === 'number') {
    const safeTotal = totalQuestions ?? data.quizTotalQuestions ?? 10
    if (!safeTotal || safeTotal <= 0) return 0
    return Math.round((data.quizScore / safeTotal) * 100)
  }
  return 0
}

export function AttestationPage({ subjectId, onBack, onTopicSelect }: AttestationPageProps) {
  const { t, lang } = useLang()
  const { user } = useAuth()
  const { byId, loading, error: subjectLoadError } = useLearnerSubjects()
  const { getTopicStatus, getTopicData, updateTopicProgress, loadError, retryLoad } = useApp()

  const subject = byId.get(subjectId)

  const attestationSection = useMemo(() => {
    if (!subject?.sections) return null
    return subject.sections.find(s => s.type === 'attestation') ?? null
  }, [subject])

  const attestationTopics = useMemo(() => {
    if (!subject || !attestationSection) return []
    return attestationSection.topicIds
      .map(id => subject.topics.find(t => t.id === id))
      .filter(Boolean) as typeof subject.topics
  }, [subject, attestationSection])

  const statusLabels = {
    completed: t('completed'),
    inprogress: t('inProgress'),
    onhold: t('onHold'),
    locked: t('locked'),
  } as const

  const buildAction = (status: TopicStatus, data: TopicProgressData, totalQuestions: number) => {
    const scorePct = toScorePct(data, totalQuestions)
    if (status === 'completed' && scorePct < 85) return { label: t('reviewMistakes'), hint: t('focusWeakQuestions') }
    if (status === 'completed') return { label: t('reviewLesson'), hint: t('lessonCompletedHint') }
    if (data.videoWatched && !data.quizSubmitted) return { label: t('startQuiz'), hint: t('quizPendingHint') }
    if (status === 'inprogress' || status === 'onhold') return { label: t('resume'), hint: t('resumeWhereLeft') }
    return { label: t('startLesson'), hint: t('beginModule') }
  }

  if (!subject && !loading) {
    return (
      <div className="page-content fade-in">
        <Alert variant="warning">Subject not found.</Alert>
        <Button variant="ghost" size="sm" onClick={onBack} style={{ marginTop: 12 }}>← {t('back')}</Button>
      </div>
    )
  }

  if (!subject) {
    return (
      <div className="page-content fade-in">
        <Skeleton width={240} height={18} borderRadius={6} style={{ marginBottom: 20 }} />
        <Skeleton width="100%" height={80} borderRadius="var(--radius-md)" style={{ marginBottom: 24 }} />
        <GlassCard style={{ overflow: 'hidden' }}>
          {Array.from({ length: 3 }).map((_, i) => (
            <Skeleton key={i} width="100%" height={62} borderRadius="var(--radius-md)" style={{ marginBottom: 8 }} />
          ))}
        </GlassCard>
      </div>
    )
  }

  const subjectName = subject.title || SUBJECT_NAMES[lang]?.[subjectId] || subjectId

  return (
    <div className="page-content fade-in">
      <PageHeader
        breadcrumbs={[
          { label: t('lessons'), onClick: () => onBack() },
          { label: subjectName, onClick: onBack },
          { label: 'Attestatsiya' },
        ]}
        title=""
      />

      <div className={styles.header}>
        <div className={styles.iconWrap} style={{ background: subject.gradient }}>
          <span className={styles.iconGlyph}>{renderSafeIcon(subject.icon)}</span>
        </div>
        <div>
          <h2 className={styles.title} style={{ color: subject.color }}>Attestatsiya</h2>
          <p className={styles.meta}>{subjectName} · {attestationTopics.length} {t('lessons')}</p>
        </div>
      </div>

      {subjectLoadError && (
        <Alert variant="warning" className={styles.syncWarning}>{subjectLoadError}</Alert>
      )}
      {loadError && (
        <Alert variant="info" className={styles.syncWarning}>
          {loadError}
          <Button variant="ghost" size="sm" onClick={retryLoad}>{t('retry')}</Button>
        </Alert>
      )}

      {attestationTopics.length === 0 ? (
        <GlassCard style={{ padding: 24, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-2)' }}>{t('noTopicsYet') || 'Hozircha mavzular yo\'q'}</p>
        </GlassCard>
      ) : (
        <GlassCard style={{ overflow: 'hidden' }}>
          {attestationTopics.map((topic, idx) => {
            const status = getTopicStatus(subject.id, topic.id)
            const data = getTopicData(subject.id, topic.id)
            const action = buildAction(status, data, topic.questions.length)

            const handleOpen = () => {
              if (user && (status === 'locked' || status === 'inprogress' || status === 'onhold')) {
                updateTopicProgress(subject.id, topic.id, { status: 'inprogress' })
              }
              onTopicSelect(subject.id, topic.id)
            }

            return (
              <div key={topic.id}>
                <TopicRow
                  name={topic.title || TOPIC_NAMES[lang]?.[topic.id] || topic.id}
                  status={status}
                  statusLabel={statusLabels[status]}
                  quizScore={data.quizScore ?? undefined}
                  masteryScore={data.masteryScore ?? undefined}
                  totalQuestions={topic.questions.length}
                  subjectColor={subject.color}
                  subjectGrad={subject.gradient}
                  actionLabel={action.label}
                  actionHint={action.hint}
                  onAction={handleOpen}
                />
                {idx < attestationTopics.length - 1 && <Divider margin="0 20px" />}
              </div>
            )
          })}
        </GlassCard>
      )}
    </div>
  )
}
