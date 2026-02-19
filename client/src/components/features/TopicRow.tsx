import { StatusBadge, ProgressBar } from '../ui/index'
import { Button }                   from '../ui/Button'
import type { TopicStatus }         from '../../types'
import { cn }                       from '../../utils'
import styles                       from './TopicRow.module.css'

interface TopicRowProps {
  name:         string
  status:       TopicStatus
  statusLabel:  string
  quizScore?:   number
  subjectColor: string
  subjectGrad:  string
  isCompleted:  boolean
  onOpen:       () => void
  onMarkInProgress: () => void
  onMarkOnHold:     () => void
  isLoggedIn:       boolean
}

export function TopicRow({
  name, status, statusLabel, quizScore,
  subjectColor, subjectGrad, isCompleted,
  onOpen, onMarkInProgress, onMarkOnHold, isLoggedIn,
}: TopicRowProps) {
  const pct = quizScore !== undefined ? Math.round((quizScore / 10) * 100) : 0

  const dotClass = status === 'completed'  ? styles.dotCompleted
    : status === 'inprogress' ? styles.dotInprogress
    : status === 'onhold'     ? styles.dotOnhold
    : styles.dotLocked

  return (
    <div className={styles.row}>
      {/* Status dot */}
      <div className={cn(styles.dot, dotClass)} />

      {/* Info */}
      <div className={styles.info}>
        <button
          className={`${styles.name} ${isCompleted ? styles.completed : ''}`}
          onClick={onOpen}
        >
          {name}
        </button>
        {quizScore !== undefined && (
          <div className={styles.bar}>
            <ProgressBar value={pct} color={subjectGrad} height={4} />
          </div>
        )}
      </div>

      {/* Score */}
      {quizScore !== undefined && (
        <span className={styles.score} style={{ color: subjectColor }}>
          {quizScore}/10
        </span>
      )}

      {/* Badge */}
      <StatusBadge status={status} label={statusLabel} />

      {/* Status actions */}
      {isLoggedIn && status !== 'completed' && (
        <div className={`${styles.actions} hide-mobile`}>
          {status !== 'inprogress' && (
            <Button
              variant="icon"
              size="sm"
              onClick={onMarkInProgress}
              title="Mark in progress"
            >
              🟢
            </Button>
          )}
          {status !== 'onhold' && (
            <Button
              variant="icon"
              size="sm"
              onClick={onMarkOnHold}
              title="Put on hold"
            >
              🟡
            </Button>
          )}
        </div>
      )}
    </div>
  )
}
