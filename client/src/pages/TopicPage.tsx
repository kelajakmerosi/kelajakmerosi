import { useEffect, useState } from 'react'
import { useLang, useApp } from '../hooks'
import { useAuth } from '../hooks/useAuth'
import { SUBJECTS, SUBJECT_NAMES, TOPIC_NAMES } from '../constants'
import { Button } from '../components/ui/Button'
import { Tabs, Alert } from '../components/ui/index'
import { VideoPlayer } from '../components/features/VideoPlayer'
import { QuizPanel } from '../components/features/QuizPanel'
import styles from './TopicPage.module.css'

interface TopicPageProps {
  subjectId: string
  topicId:   string
  onBack:    () => void
}

export function TopicPage({ subjectId, topicId, onBack }: TopicPageProps) {
  const { t, lang } = useLang()
  const { user } = useAuth()
  const {
    getTopicData,
    updateTopicProgress,
    recordTimeOnTask,
    loadError,
    retryLoad,
  } = useApp()

  const subject = SUBJECTS.find(s => s.id === subjectId)
  const topic = subject?.topics.find(tp => tp.id === topicId)
  if (!subject || !topic) return null

  const data = getTopicData(subjectId, topicId)
  const [tab, setTab] = useState<'video' | 'quiz'>('video')
  const [videoWatched, setVideoWatched] = useState(data.videoWatched ?? false)

  useEffect(() => {
    setVideoWatched(data.videoWatched ?? false)
  }, [data.videoWatched])

  useEffect(() => {
    if (!user) return

    const currentStatus = data.status
    if (currentStatus !== 'completed') {
      updateTopicProgress(subjectId, topicId, {
        status: currentStatus && currentStatus !== 'locked' ? currentStatus : 'inprogress',
        lastActivityAt: Date.now(),
      })
    }

    let lastTick = Date.now()

    const interval = window.setInterval(() => {
      const now = Date.now()
      const delta = Math.floor((now - lastTick) / 1000)
      lastTick = now
      if (delta > 0) recordTimeOnTask(subjectId, topicId, delta)
    }, 15_000)

    return () => {
      window.clearInterval(interval)
      const now = Date.now()
      const delta = Math.floor((now - lastTick) / 1000)
      if (delta > 0) recordTimeOnTask(subjectId, topicId, delta)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [subjectId, topicId, user?.id])

  const handleMarkVideoWatched = () => {
    setVideoWatched(true)
    if (user) {
      updateTopicProgress(subjectId, topicId, {
        videoWatched: true,
        status: data.status === 'locked' || !data.status ? 'inprogress' : data.status,
        lastActivityAt: Date.now(),
      })
    }

    setTab('quiz')
  }

  const quizLabel = data.quizSubmitted
    ? `${t('quiz')} (${data.masteryScore ?? data.quizScore ?? 0}%)`
    : t('quiz')

  const tabs = [
    { id: 'video', label: videoWatched ? `${t('video')} • ${t('videoWatched')}` : t('video') },
    { id: 'quiz',  label: quizLabel },
  ]

  return (
    <div className="page-content fade-in">
      <Button variant="ghost" size="sm" onClick={onBack} className={styles.backButton}>
        ← {t('back')}
      </Button>

      <div className={styles.header}>
        <h2 className={styles.title}>{TOPIC_NAMES[lang][topicId]}</h2>
        <p className={styles.subtitle}>{SUBJECT_NAMES[lang][subjectId]}</p>
      </div>

      {loadError && (
        <Alert variant="info" className={styles.syncWarning}>
          {loadError}
          <Button variant="ghost" size="sm" onClick={retryLoad}>{t('retry')}</Button>
        </Alert>
      )}

      <div className="mb-24">
        <Tabs tabs={tabs} active={tab} onChange={id => setTab(id as typeof tab)} />
      </div>

      {tab === 'video' && (
        <div id="tab-panel-video" role="tabpanel" aria-label="Video lesson">
          <VideoPlayer
            videoId={topic.videoId}
            title={TOPIC_NAMES[lang][topicId]}
            watched={videoWatched}
            onMarkWatched={handleMarkVideoWatched}
          />
        </div>
      )}

      {tab === 'quiz' && (
        <div id="tab-panel-quiz" role="tabpanel" aria-label="Quiz">
          <QuizPanel
            topic={topic}
            subjectId={subjectId}
            videoWatched={videoWatched}
          />
        </div>
      )}
    </div>
  )
}
