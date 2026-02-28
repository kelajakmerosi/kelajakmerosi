import { useEffect, useMemo, useState } from 'react'
import { Alert } from '../components/ui'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { adminService, type AdminUserSummary, type SystemInfo } from '../services/admin.service'
import styles from './AdminPage.module.css'

export function AdminPage(): JSX.Element {
  const [info, setInfo] = useState<SystemInfo | null>(null)
  const [users, setUsers] = useState<AdminUserSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const load = async () => {
    setLoading(true)
    setError(null)
    try {
      const [nextInfo, nextUsers] = await Promise.all([
        adminService.getSystemInfo(),
        adminService.getUsers(),
      ])
      setInfo(nextInfo)
      setUsers(nextUsers)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to load admin data'
      setError(message)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    void load()
  }, [])

  const adminCount = useMemo(
    () => users.filter(user => user.role === 'admin').length,
    [users],
  )

  return (
    <div className="page-content fade-in">
      <div className={styles.page}>
        <div className={styles.header}>
          <div>
            <h2 className={styles.title}>Admin</h2>
            <p className={styles.subtitle}>System visibility and user summary</p>
          </div>
          <Button variant="ghost" onClick={() => void load()} disabled={loading}>Refresh</Button>
        </div>

        {error && (
          <Alert variant="error">
            {error}
          </Alert>
        )}

        <div className={styles.grid}>
          <GlassCard padding={18}>
            <div className={styles.metricLabel}>Environment</div>
            <div className={styles.metricValue}>{info?.env ?? 'unknown'}</div>
          </GlassCard>
          <GlassCard padding={18}>
            <div className={styles.metricLabel}>Uptime</div>
            <div className={styles.metricValue}>{info?.uptime ?? '-'}</div>
          </GlassCard>
          <GlassCard padding={18}>
            <div className={styles.metricLabel}>Admins / Users</div>
            <div className={styles.metricValue}>{adminCount} / {users.length}</div>
          </GlassCard>
        </div>

        <GlassCard padding={0}>
          {loading ? (
            <div className={styles.empty}>Loading users...</div>
          ) : users.length === 0 ? (
            <div className={styles.empty}>No users found.</div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td>{user.role ?? 'student'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>
      </div>
    </div>
  )
}

export default AdminPage
