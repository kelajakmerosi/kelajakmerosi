import { useMemo } from 'react'
import { useAuth }          from '../hooks/useAuth'
import { useLang, useApp }  from '../hooks'
import { useSubjectStats }  from '../hooks/useSubjectStats'
import { GlassCard }        from '../components/ui/GlassCard'
import { ProgressBar, Alert, StatCard } from '../components/ui/index'
import { SUBJECTS, SUBJECT_NAMES, TOPIC_NAMES } from '../constants'
import { relativeTime }     from '../utils'
import type { PageId }      from '../types'
import { 
  FileText, CheckCircle2, XCircle, Trophy, 
  BarChart3, Clock 
} from 'lucide-react'
import styles               from './DashboardPage.module.css'

interface DashboardPageProps {
  onNavigate: (page: PageId, opts?: { subjectId?: string }) => void
}

export function DashboardPage(_props: DashboardPageProps) {
  const { user, isGuest } = useAuth()
  const { t, lang }       = useLang()
  const { lessonHistory } = useApp()
  const subjectStats      = useSubjectStats()

  const totals = useMemo(() => subjectStats.reduce(
    (acc, s) => ({
      tests:     acc.tests     + s.tests,
      correct:   acc.correct   + s.correct,
      incorrect: acc.incorrect + s.incorrect,
      completed: acc.completed + s.completed,
      total:     acc.total     + s.total,
    }),
    { tests:0, correct:0, incorrect:0, completed:0, total:0 },
  ), [subjectStats])

  return (
    <div className={`page-content fade-in`}>
      {/* Header */}
      <div className={styles.header}>
        <h2 className={styles.title}>
          {user ? `${t('welcome')}, ${user.name}!` : `${t('welcome')}!`}
        </h2>
        <p className={styles.subtitle}>{t('startLearning')}</p>
      </div>

      {isGuest && (
        <Alert variant="warning" className="mb-24">
          {t('guestWarning')} — <strong>{t('loginToSave')}</strong>
        </Alert>
      )}

      {/* Stats row */}
      <div className={styles.statsGrid}>
        {([
          { icon: <FileText size={28} className="text-accent" />,     value: totals.tests,     label: t('totalTests')    },
          { icon: <CheckCircle2 size={28} className="text-success" />, value: totals.correct,   label: t('correct')       },
          { icon: <XCircle size={28} className="text-danger" />,      value: totals.incorrect, label: t('incorrect')     },
          { icon: <Trophy size={28} className="text-warning" />,       value: `${totals.completed}/${totals.total}`, label: t('completed') },
        ]).map(s => (
          <StatCard key={s.label} icon={s.icon} value={s.value} label={s.label} />
        ))}
      </div>

      {/* Subject progress */}
      <GlassCard padding={24} style={{ marginBottom: 24 }}>
        <h3 className={styles.sectionTitle}>
          <BarChart3 size={20} className="text-accent" /> {t('progress')}
        </h3>
        <div className={styles.progressList}>
          {subjectStats.map(({ subject, completionPct }) => (
            <div key={subject.id} className={styles.progressItem}>
              <div className={styles.progressRow}>
                <div className={styles.progressInfo}>
                  <span className={styles.progressIcon}>{subject.icon}</span>
                  <span className={styles.progressName}>{SUBJECT_NAMES[lang][subject.id]}</span>
                </div>
                <span className={styles.progressPct}>
                  {completionPct}%
                </span>
              </div>
              <ProgressBar value={completionPct} color={subject.gradient} />
            </div>
          ))}
        </div>
      </GlassCard>

      {/* Recent history */}
      {user && (
        <GlassCard padding={24}>
          <h3 className={styles.sectionTitle}>
             <Clock size={20} className="text-accent" /> {t('recentLessons')}
          </h3>
          {lessonHistory.length === 0 ? (
            <p className="text-light text-sm">{t('noHistory')}</p>
          ) : (
            <div className={styles.historyList}>
              {lessonHistory.slice(0, 6).map(h => {
                const sub = SUBJECTS.find(s => s.id === h.subjectId)
                return (
                  <div key={`${h.topicId}_${h.timestamp}`} className={styles.historyItem}>
                    <div className={styles.progressIcon}>{sub?.icon}</div>
                    <div className={styles.historyInfo}>
                      <span className={styles.historyTopic}>{TOPIC_NAMES[lang][h.topicId]}</span>
                      <span className={styles.historyMeta}>
                        {SUBJECT_NAMES[lang][h.subjectId]} · {relativeTime(h.timestamp, lang)}
                      </span>
                    </div>
                    {h.quizScore !== undefined && (
                      <span className={styles.historyScore}>{h.quizScore}/10</span>
                    )}
                  </div>
                )
              })}
            </div>
          )}
        </GlassCard>
      )}
    </div>
  )
}
