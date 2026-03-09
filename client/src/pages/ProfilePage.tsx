import type { CSSProperties } from 'react'
import { useLang } from '../hooks'
import { useAuth } from '../hooks/useAuth'
import { useSubjectStats } from '../hooks/useSubjectStats'
import { Avatar, ProgressBar } from '../components/ui/index'
import { GlassCard } from '../components/ui/GlassCard'
import { SUBJECT_NAMES } from '../constants'
import { getSubjectVisual } from '../utils/subjectVisuals'
import {
  BarChart3,
  BookOpen,
  CheckCircle2,
  Trophy,
  Mail,
  Shield,
  User,
  Settings,
  ArrowRight,
  Target
} from 'lucide-react'
import styles from './ProfilePage.module.css'

export function ProfilePage() {
  const { t, lang } = useLang()
  const { user, isGuest } = useAuth()
  const subjectStats = useSubjectStats()

  const totalTests = subjectStats.reduce((sum, entry) => sum + entry.tests, 0)
  const totalCorrect = subjectStats.reduce((sum, entry) => sum + entry.correct, 0)
  const totalTopics = subjectStats.reduce((sum, entry) => sum + entry.total, 0)
  const totalCompletedTopics = subjectStats.reduce((sum, entry) => sum + entry.completed, 0)
  const overallAccuracy = totalTests ? Math.round((totalCorrect / totalTests) * 100) : 0
  const overallCompletion = totalTopics ? Math.round((totalCompletedTopics / totalTopics) * 100) : 0

  const roleLabel = user?.role && user.role !== 'student' ? t(user.role) : null

  return (
    <div className={`page-content fade-in ${styles.pageRoot}`}>
      <header className={styles.header}>
        <div className={styles.headerTitles}>
          <p className={styles.eyebrow}>{t('profile')} &bull; {t('overview')}</p>
          <h1 className={styles.title}>{t('profile')}</h1>
        </div>
      </header>

      <div className={styles.topGrid}>
        {/* User Identity Panel */}
        <GlassCard className={styles.identityCard} padding={0}>
          <div className={styles.identityCardInner}>
            <div className={styles.identityHeader}>
              <div className={styles.avatarWrap}>
                <div className={styles.avatarGlow} aria-hidden="true" />
                <Avatar name={user?.name ?? 'Guest'} size={96} />
              </div>
              <div className={styles.identityBadges}>
                {isGuest ? (
                  <span className={styles.badgeGuest}>
                    <User size={12} /> {t('guestMode')}
                  </span>
                ) : null}
                {roleLabel ? (
                  <span className={styles.badgeRole}>
                    <Shield size={12} /> {roleLabel}
                  </span>
                ) : null}
              </div>
            </div>

            <div className={styles.identityBody}>
              <h2 className={styles.userName}>{user?.name ?? 'Guest'}</h2>
              {user?.email ? (
                <p className={styles.userEmail}>
                  <Mail size={16} /> {user.email}
                </p>
              ) : null}
            </div>

            <div className={styles.identityFooter}>
              <button className={styles.editBtn}>
                <Settings size={16} /> {t('settings')}
              </button>
            </div>
          </div>
        </GlassCard>

        {/* Global Stats Dashboard */}
        <div className={styles.statsGrid}>
          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>{t('subjects')}</span>
              <div className={styles.statIcon}><BookOpen size={18} /></div>
            </div>
            <div className={styles.statBody}>
              <span className={styles.statValue}>{subjectStats.length}</span>
              <span className={styles.statSub}>Active courses</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>{t('totalTests')}</span>
              <div className={styles.statIcon}><BarChart3 size={18} /></div>
            </div>
            <div className={styles.statBody}>
              <span className={styles.statValue}>{totalTests}</span>
              <span className={styles.statSub}>Questions answered</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>{t('correct')}</span>
              <div className={styles.statIcon}><CheckCircle2 size={18} /></div>
            </div>
            <div className={styles.statBody}>
              <span className={styles.statValue}>{overallAccuracy}%</span>
              <span className={styles.statSub}>Overall accuracy</span>
            </div>
          </div>

          <div className={styles.statCard}>
            <div className={styles.statHeader}>
              <span className={styles.statLabel}>{t('completion')}</span>
              <div className={styles.statIcon}><Trophy size={18} /></div>
            </div>
            <div className={styles.statBody}>
              <span className={styles.statValue}>{overallCompletion}%</span>
              <span className={styles.statSub}>{totalCompletedTopics} / {totalTopics} topics</span>
            </div>
          </div>
        </div>
      </div>

      <section className={styles.courseSection}>
        <div className={styles.sectionHeader}>
          <div>
            <h3 className={styles.sectionTitle}>{t('subjects')}</h3>
            <p className={styles.sectionDesc}>Track your progress across different learning modules.</p>
          </div>
        </div>

        <div className={styles.courseGrid}>
          {subjectStats.map(({ subject, tests, correct, pct, completed, total, completionPct }) => {
            const subjectName = SUBJECT_NAMES[lang][subject.id]
            const visual = getSubjectVisual(subject.id)
            const isDone = completionPct >= 100
            
            const cardStyle = {
              '--course-color': subject.color,
              '--course-bg': `color-mix(in srgb, ${subject.color} 8%, transparent)`,
              '--course-ring': `color-mix(in srgb, ${subject.color} 20%, transparent)`
            } as CSSProperties

            return (
              <GlassCard key={subject.id} className={styles.courseCard} style={cardStyle} padding={0}>
                <div className={styles.courseInner}>
                  <div className={styles.courseTop}>
                    <div className={styles.courseVisualWrap}>
                      <img src={visual.imageUrl} alt={visual.imageAlt} className={styles.courseImage} loading="lazy" />
                    </div>
                    <div className={styles.courseMeta}>
                      <span className={styles.courseBadge}>
                        {isDone ? t('completed') : t('inProgress')}
                      </span>
                      <h4 className={styles.courseName}>{subjectName}</h4>
                      <p className={styles.courseMetrics}>
                        <Target size={14} /> {completed}/{total} Topics
                      </p>
                    </div>
                    <button className={styles.courseAction}>
                      <ArrowRight size={20} />
                    </button>
                  </div>

                  <div className={styles.courseProgress}>
                    <div className={styles.progressText}>
                      <span className={styles.progressLabel}>Completion</span>
                      <strong className={styles.progressValue}>{completionPct}%</strong>
                    </div>
                    <ProgressBar value={completionPct} color={subject.gradient || subject.color} height={8} />
                  </div>

                  <div className={styles.courseFoot}>
                    <div className={styles.footStat}>
                      <span>Tests Taken</span>
                      <strong>{tests}</strong>
                    </div>
                    <div className={styles.footStat}>
                      <span>Correct</span>
                      <strong>{correct}</strong>
                    </div>
                    <div className={styles.footStat}>
                      <span>Accuracy</span>
                      <strong style={{ color: 'var(--course-color)' }}>{pct}%</strong>
                    </div>
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>
      </section>
    </div>
  )
}