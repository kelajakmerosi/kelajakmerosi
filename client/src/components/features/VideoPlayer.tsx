import { GlassCard } from '../ui/GlassCard'
import { Button }    from '../ui/Button'
import { Alert }     from '../ui/index'
import { useLang }   from '../../hooks'
import { Check }     from 'lucide-react'
import styles        from './VideoPlayer.module.css'

interface VideoPlayerProps {
  videoId:      string
  title:        string
  watched:      boolean
  onMarkWatched: () => void
}

export function VideoPlayer({ videoId, title, watched, onMarkWatched }: VideoPlayerProps) {
  const { t } = useLang()

  return (
    <div className="fade-in">
      <GlassCard padding={24} style={{ marginBottom: 20 }}>
        <div className={styles.videoWrap}>
          <iframe
            src={`https://www.youtube-nocookie.com/embed/${videoId}`}
            title={title}
            allowFullScreen
            referrerPolicy="strict-origin-when-cross-origin"
            className={styles.iframe}
          />
        </div>
      </GlassCard>

      {!watched ? (
        <div className={styles.watchRow}>
          <Button onClick={onMarkWatched} size="lg">
            <Check size={16} /> {t('videoWatched')}
          </Button>
        </div>
      ) : (
        <Alert variant="success" className={styles.watchedAlert}>
          {t('videoWatched')}
        </Alert>
      )}
    </div>
  )
}
