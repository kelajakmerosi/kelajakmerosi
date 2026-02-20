import type { CSSProperties } from 'react'
import { GlassCard } from '../ui/GlassCard'
import { Alert } from '../ui/index'
import { Button } from '../ui/Button'
import { useLang } from '../../hooks'
import { Smile, ThumbsUp, BookOpen, Trophy, ListChecks, CheckCircle2, XCircle, Target } from 'lucide-react'
import type { Question, QuizAttemptEntry } from '../../types'
import { OPTION_LABELS } from '../../constants'
import styles from './QuizResult.module.css'

interface QuizResultProps {
  questions:     Question[]
  answers:       Record<number, number>
  score:         number
  masteryScore:  number
  videoWatched:  boolean
  quizAttempts:  number
  attemptHistory: QuizAttemptEntry[]
  studyNext:     string[]
  onRetry:       () => void
}

export function QuizResult({
  questions,
  answers,
  score,
  masteryScore,
  videoWatched,
  quizAttempts,
  attemptHistory,
  studyNext,
  onRetry,
}: QuizResultProps) {
  const { t } = useLang()
  const total = questions.length
  const pct = Math.round((score / total) * 100)
  const allOk = masteryScore >= 80 && videoWatched
  const recentAttempts = attemptHistory.slice(0, 5)

  return (
    <div className="fade-in">
      <GlassCard padding={34} className={styles.scoreCard}>
        <div
          className={styles.circle}
          style={{ '--score-angle': `${masteryScore * 3.6}deg` } as CSSProperties}
        >
          <div className={styles.circleInner}>
            <span className={styles.pctText}>{masteryScore}%</span>
            <span className={styles.fraction}>{score}/{total}</span>
          </div>
        </div>

        <div className={styles.resultIcon}>
          {masteryScore >= 85
            ? <Smile size={46} color="var(--success)" />
            : masteryScore >= 65
              ? <ThumbsUp size={46} color="var(--accent)" />
              : <BookOpen size={46} color="var(--warning)" />}
        </div>

        <h3 className={styles.resultMessage}>
          {masteryScore >= 85 ? t('excellentWork') : masteryScore >= 65 ? t('goodProgress') : t('needsReview')}
        </h3>

        <div className={styles.stats}>
          <div className={styles.stat}>
            <span className={styles.statVal} style={{ color: 'var(--success)' }}>{score}</span>
            <span className={styles.statLabel}>{t('correct')}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statVal} style={{ color: 'var(--danger)' }}>{total - score}</span>
            <span className={styles.statLabel}>{t('incorrect')}</span>
          </div>
          <div className={styles.stat}>
            <span className={styles.statVal} style={{ color: 'var(--accent)' }}>{quizAttempts}</span>
            <span className={styles.statLabel}>{t('attempts')}</span>
          </div>
        </div>

        {allOk
          ? <Alert variant="success" className={styles.alert}><Trophy size={18} /> {t('masteryReached')}</Alert>
          : <Alert variant="info" className={styles.alert}>{t('studyThenRetry')}</Alert>}

        <div className={styles.primaryAction}>
          <Button onClick={onRetry} size="lg">{t('retryQuiz')}</Button>
        </div>
      </GlassCard>

      {recentAttempts.length > 0 && (
        <GlassCard padding={24} style={{ maxWidth: 720, marginTop: 18 }}>
          <h4 className={styles.reviewTitle}><Trophy size={18} /> {t('attemptHistory')}</h4>
          <div className={styles.attemptList}>
            {recentAttempts.map((attempt, idx) => (
              <div key={attempt.id} className={styles.attemptRow}>
                <span className={styles.attemptLabel}>#{idx + 1}</span>
                <span className={styles.attemptScore}>{attempt.masteryScore}% ({attempt.score}/{attempt.totalQuestions})</span>
                <span className={styles.attemptTime}>
                  {new Date(attempt.attemptedAt).toLocaleString()}
                </span>
              </div>
            ))}
          </div>
        </GlassCard>
      )}

      <GlassCard padding={24} style={{ maxWidth: 720, marginTop: 18 }}>
        <h4 className={styles.reviewTitle}><Target size={18} /> {t('studyNext')}</h4>
        <ul className={styles.studyList}>
          {studyNext.map(item => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </GlassCard>

      <GlassCard padding={24} style={{ maxWidth: 720, marginTop: 18 }}>
        <h4 className={styles.reviewTitle}><ListChecks size={20} /> {t('quizReview')}</h4>
        <div className={styles.reviewList}>
          {questions.map((q, i) => {
            const userAns = answers[i]
            const isRight = userAns === q.answer

            return (
              <div key={q.id} className={styles.reviewItem}>
                <div className={styles.reviewQ}>
                  {i + 1}. {q.text}
                  <span style={{ marginLeft: 8, display: 'inline-flex', verticalAlign: 'middle' }}>
                    {isRight
                      ? <CheckCircle2 size={18} color="var(--success)" />
                      : <XCircle size={18} color="var(--danger)" />}
                  </span>
                </div>

                <div className={styles.reviewOpts}>
                  {q.options.map((opt, oi) => (
                    <div
                      key={oi}
                      className={`${styles.reviewOpt}
                        ${oi === q.answer ? styles.correct : ''}
                        ${oi === userAns && !isRight ? styles.wrong : ''}`}
                    >
                      {OPTION_LABELS[oi]}. {opt}
                    </div>
                  ))}
                </div>

                {!isRight && q.explanation && (
                  <p className={styles.explanation}>{q.explanation}</p>
                )}
              </div>
            )
          })}
        </div>
      </GlassCard>

      <GlassCard padding={16} style={{ maxWidth: 720, marginTop: 18 }}>
        <Alert variant={pct >= 70 ? 'success' : 'warning'}>
          {pct >= 70 ? t('feedbackStrong') : t('feedbackNeedsPractice')}
        </Alert>
      </GlassCard>
    </div>
  )
}
