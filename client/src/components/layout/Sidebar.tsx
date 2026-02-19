import type { PageId } from '../../types'
import { useAuth } from '../../hooks/useAuth'
import { useLang } from '../../hooks'
import { cn }      from '../../utils'
import { Avatar }  from '../ui/index'
import { Button }  from '../ui/Button'
import styles      from './Sidebar.module.css'

interface SidebarProps {
  activePage:    PageId
  navigate:      (page: PageId) => void
  mobileOpen:    boolean
  onClose:       () => void
}

import { LayoutDashboard, BookOpen, User, LogOut } from 'lucide-react'

const NAV_ITEMS = [
  { id: 'dashboard' as PageId, icon: <LayoutDashboard size={20} /> },
  { id: 'subjects'  as PageId, icon: <BookOpen size={20} /> },
  { id: 'profile'   as PageId, icon: <User size={20} /> },
]

export function Sidebar({ activePage, navigate, mobileOpen, onClose }: SidebarProps) {
  const { user, logout } = useAuth()
  const { t } = useLang()

  const handleNav = (page: PageId) => { navigate(page); onClose() }

  return (
    <>
      {mobileOpen && <div className="overlay" onClick={onClose} />}

      <aside className={cn(styles.sidebar, mobileOpen && styles.mobileOpen)}>
        {/* Logo */}
        <div className={styles.logo}>
          <div className={styles.logoIcon}>KM</div>
          <span className={styles.logoText}>KelajakMerosi</span>
        </div>

        {/* Nav */}
        <nav className={styles.nav}>
          {NAV_ITEMS.map(item => (
            <Button
              key={item.id}
              variant="nav"
              active={activePage === item.id}
              onClick={() => handleNav(item.id)}
              fullWidth
            >
              <span className={styles.navIcon}>{item.icon}</span>
              {t(item.id as any)}
            </Button>
          ))}
        </nav>

        {/* User footer */}
        <div className={styles.footer}>
          {user ? (
            <>
              <div className={styles.userRow}>
                <Avatar name={user.name} size={34} />
                <div className={styles.userInfo}>
                  <span className={styles.userName}>{user.name}</span>
                  <span className={styles.userRole}>Pro</span>
                </div>
              </div>
              <Button variant="ghost" size="sm" fullWidth onClick={logout}
                style={{ marginTop: 10, justifyContent:'center', gap: 8 }}>
                <LogOut size={16} /> {t('logout')}
              </Button>
            </>
          ) : (
            <div>
              <span className={styles.guestBadge}>
                <User size={14} /> Guest
              </span>
              <p className={styles.guestNote}>{t('guestWarning')}</p>
            </div>
          )}
        </div>
      </aside>
    </>
  )
}
