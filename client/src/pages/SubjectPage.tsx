import { useMemo } from 'react'
import { useLang, useApp } from '../hooks'
import { SUBJECT_NAMES } from '../constants'
import useLearnerSubjects from '../hooks/useLearnerSubjects'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { Alert, PageHeader } from '../components/ui/index'
import { Skeleton } from '../components/ui/Skeleton'
import { renderSafeIcon } from '../utils/renderSafeIcon'
import { ChevronRight, Lock } from 'lucide-react'
import styles from './SubjectPage.module.css'

interface SubjectPageProps {
  subjectId: string
  onBack: () => void
  onTopicSelect: (topic: { subjectId: string; topicId: string }) => void
  onSectionSelect: (sectionType: string, sectionId: string, subjectId: string) => void
}

export function SubjectPage({ subjectId, onBack, onSectionSelect }: SubjectPageProps) {
  const { t, lang } = useLang()
  const { byId, loading: loadingSubject, error: subjectLoadError } = useLearnerSubjects()
  const { loadError, retryLoad } = useApp()

  const subject = byId.get(subjectId)

  const sections = useMemo(() => {
    if (!subject?.sections) return []
    return subject.sections
  }, [subject])

  if (!subject && !loadingSubject) {
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
        <Skeleton width={180} height={18} borderRadius={6} style={{ marginBottom: 20 }} />
        <Skeleton width="100%" height={80} borderRadius="var(--radius-md)" style={{ marginBottom: 24 }} />
        <GlassCard style={{ overflow: 'hidden' }}>
          <div className={styles.skeletonList}>
            {Array.from({ length: 3 }).map((_, idx) => (
              <Skeleton key={idx} width="100%" height={62} borderRadius="var(--radius-md)" />
            ))}
          </div>
        </GlassCard>
      </div>
    )
  }

  const subjectName = subject.title || SUBJECT_NAMES[lang]?.[subject.id] || subject.id

  return (
    <div className="page-content fade-in">
      <PageHeader
        breadcrumbs={[
          { label: t('lessons'), onClick: onBack },
          { label: subjectName }
        ]}
        title=""
      />

      <div className={styles.header}>
        <div className={styles.iconWrap} style={{ background: subject.gradient }}>
          <span className={styles.iconGlyph}>{renderSafeIcon(subject.icon)}</span>
        </div>
        <div>
          <h2 className={styles.title} style={{ color: subject.color }}>{subjectName}</h2>
          <p className={styles.meta}>
            {sections.length} {sections.length === 1 ? 'bo\'lim' : 'bo\'limlar'} · {subject.topics.length} {t('lessons')}
          </p>
        </div>
      </div>

      {subjectLoadError ? (
        <Alert variant="warning" className={styles.syncWarning}>{subjectLoadError}</Alert>
      ) : null}

      {loadError && (
        <Alert variant="info" className={styles.syncWarning}>
          {loadError}
          <Button variant="ghost" size="sm" onClick={retryLoad}>{t('retry')}</Button>
        </Alert>
      )}

      {sections.length === 0 ? (
        <GlassCard style={{ padding: 24, textAlign: 'center' }}>
          <p style={{ color: 'var(--text-2)' }}>{t('noTopicsYet') || 'Hozircha bo\'limlar yo\'q'}</p>
        </GlassCard>
      ) : (
        <div className={styles.sectionGrid}>
          {sections.map((section) => {
            const isComingSoon = section.comingSoon
            const topicCount = section.topicIds.length

            const handleClick = () => {
              if (isComingSoon) return
              onSectionSelect(section.type, section.id, subject.id)
            }

            return (
              <GlassCard
                key={section.id}
                className={styles.sectionCard}
                style={{ cursor: isComingSoon ? 'default' : 'pointer', opacity: isComingSoon ? 0.7 : 1 }}
                onClick={isComingSoon ? undefined : handleClick}
              >
                <div className={styles.sectionCardInner}>
                  <div>
                    <h3 className={styles.sectionTitle}>{section.title}</h3>
                    <p className={styles.sectionMeta}>
                      {isComingSoon
                        ? 'Tez kunda'
                        : `${topicCount} ${topicCount === 1 ? 'mavzu' : 'mavzular'}`}
                    </p>
                  </div>
                  <div className={styles.sectionAction}>
                    {isComingSoon ? (
                      <span className={styles.comingSoonBadge}>
                        <Lock size={14} />
                        Tez kunda
                      </span>
                    ) : (
                      <ChevronRight size={20} style={{ color: subject.color }} />
                    )}
                  </div>
                </div>
              </GlassCard>
            )
          })}
        </div>
      )}
    </div>
  )
}
