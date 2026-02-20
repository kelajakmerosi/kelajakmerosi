import { StatusBadge, ProgressBar } from '../ui/index'
import { Button } from '../ui/Button'
import type { TopicStatus } from '../../types'
import styles from './TopicRow.module.css'

interface TopicRowProps {
  name:         string
  status:       TopicStatus
  statusLabel:  string
  quizScore?:   number
  masteryScore?: number
  totalQuestions?: number
  subjectColor: string
  subjectGrad:  string
  actionLabel:  string
  actionHint:   string
  onAction:     () => void
}

export function TopicRow({
  name,
  status,
  statusLabel,
  quizScore,
  masteryScore,
  totalQuestions,
  subjectColor,
  subjectGrad,
  actionLabel,
  actionHint,
  onAction,
}: TopicRowProps) {
  const pct = masteryScore ?? (
    quizScore !== undefined
      ? Math.round((quizScore / Math.max(totalQuestions ?? 10, 1)) * 100)
      : 0
  )

  return (
    <div className={styles.row}>
      <div className={styles.info}>
        <div className={styles.header}>
          <h4 className={styles.name}>{name}</h4>
          <StatusBadge status={status} label={statusLabel} className={styles.rowBadge} />
        </div>

        {quizScore !== undefined && (
          <div className={styles.progressWrap}>
            <ProgressBar value={pct} color={subjectGrad} height={5} />
            <span className={styles.score} style={{ color: subjectColor }}>
              {pct}%
            </span>
          </div>
        )}

        <p className={styles.hint}>{actionHint}</p>
      </div>

      <Button onClick={onAction} className={styles.actionButton}>{actionLabel}</Button>
    </div>
  )
}
