import { useLocation, useNavigate } from 'react-router-dom'
import type { ReactNode } from 'react'
import type { PageId } from '../../types'
import { resolveActivePage } from '../../app/route-meta'
import { useAuth } from '../../hooks/useAuth'
import { useLang } from '../../hooks'
import { cn } from '../../utils'
import { Button } from '../ui/Button'
import styles from './Sidebar.module.css'
import {
  BookOpen,
  CircleDashed,
  Home,
  LogOut,
  Shield,
  Trophy,
} from 'lucide-react'

interface SidebarProps {
  mobileOpen: boolean
  onClose: () => void
}

type SidebarItem = {
  id: string
  label: string
  icon: ReactNode
  path?: string
  soon?: boolean
  adminOnly?: boolean
}

const NAV_ITEMS: SidebarItem[] = [
  { id: 'home', label: 'home', icon: <Home size={20} />, path: '/dashboard' },
  { id: 'subjects', label: 'subjects', icon: <BookOpen size={20} />, path: '/subjects' },
  { id: 'myResults', label: 'myResults', icon: <Trophy size={20} />, path: '/my-results' },
  { id: 'admin', label: 'admin', icon: <Shield size={19} />, path: '/admin', adminOnly: true },
]

const isActiveForItem = (
  itemId: string,
  activePage: PageId,
) => {
  if (itemId === 'home') return activePage === 'dashboard'
  if (itemId === 'subjects') return activePage === 'subjects' || activePage === 'subject' || activePage === 'topic' || activePage === 'attestation' || activePage === 'generalSection'
  if (itemId === 'myResults') return activePage === 'myResults'
  if (itemId === 'admin') return activePage === 'admin'
  return false
}

export function Sidebar({ mobileOpen, onClose }: SidebarProps) {
  const { user, isGuest, logout } = useAuth()
  const { t } = useLang()
  const navigate = useNavigate()
  const location = useLocation()

  const activePage = resolveActivePage(location.pathname)

  const handleNav = (path?: string) => {
    if (!path) return
    navigate(path)
    onClose()
  }

  const visibleNavItems = NAV_ITEMS.filter(
    (item) => !item.adminOnly || user?.role === 'admin' || user?.role === 'superadmin',
  )

  return (
    <>
      {mobileOpen && <div className="overlay" onClick={onClose} />}

      <aside className={cn(styles.sidebar, mobileOpen && styles.mobileOpen)}>
        <div className={styles.logo}>
          <div className={styles.logoIcon}>
            <i className="fa fa-book" aria-hidden="true" />
          </div>
          <div className={styles.logoCopy}>
            <span className={styles.logoText}>Kelajak Merosi</span>
          </div>
        </div>

        <p className={styles.menuLabel}>{t('overview')}</p>

        <nav className={styles.nav} aria-label={t('menu')}>
          {visibleNavItems.map((item) => {
            const active = isActiveForItem(item.id, activePage)

            return (
              <Button
                key={item.id}
                variant="nav"
                active={active}
                onClick={() => handleNav(item.path)}
                disabled={item.soon}
                className={styles.navButton}
                fullWidth
              >
                <span className={styles.navIcon}>{item.icon}</span>
                <span className={styles.navText}>{t(item.label)}</span>
                {item.soon && <span className={styles.soonBadge}>{t('soon')}</span>}
              </Button>
            )
          })}
        </nav>

        <div className={styles.footer}>
          {user ? (
            <>
              <Button
                variant="ghost"
                size="sm"
                fullWidth
                onClick={logout}
                className={styles.logoutButton}
              >
                <LogOut size={16} />
                {t('logout')}
              </Button>
            </>
          ) : isGuest ? (
            <Button
              variant="primary"
              size="sm"
              fullWidth
              onClick={logout}
              className={styles.logoutButton}
            >
              <CircleDashed size={16} />
              {t('login')}
            </Button>
          ) : null}
        </div>
      </aside>
    </>
  )
}
