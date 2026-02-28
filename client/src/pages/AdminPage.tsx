import { useEffect, useMemo, useState } from 'react'
import { Alert } from '../components/ui'
import { GlassCard } from '../components/ui/GlassCard'
import { Button } from '../components/ui/Button'
import { adminService, type AdminUserSummary, type SystemInfo } from '../services/admin.service'
import { useAuth } from '../hooks/useAuth'
import styles from './AdminPage.module.css'

export function AdminPage(): JSX.Element {
  const { user: currentUser, logout } = useAuth()
  const [info, setInfo] = useState<SystemInfo | null>(null)
  const [users, setUsers] = useState<AdminUserSummary[]>([])
  const [loading, setLoading] = useState(true)
  const [deletingUserId, setDeletingUserId] = useState<string | null>(null)
  const [pendingDeleteUserId, setPendingDeleteUserId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)

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
  const adminUsers = useMemo(
    () => users.filter(user => user.role === 'admin'),
    [users],
  )
  const registeredUsers = useMemo(
    () => users.filter(user => user.role !== 'admin'),
    [users],
  )

  const handleDelete = async (targetUser: AdminUserSummary) => {
    const isSelfDelete = targetUser.id === currentUser?.id
    setDeletingUserId(targetUser.id)
    setError(null)
    setSuccess(null)
    try {
      await adminService.deleteUser(targetUser.id)
      setUsers((prev) => prev.filter((user) => user.id !== targetUser.id))
      if (isSelfDelete) {
        logout()
        return
      }
      setSuccess(`User "${targetUser.name}" deleted.`)
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to delete user'
      setError(message)
    } finally {
      setDeletingUserId(null)
      setPendingDeleteUserId(null)
    }
  }

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
        {success && (
          <Alert variant="success">
            {success}
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
            <div className={styles.metricLabel}>Admins / Registered</div>
            <div className={styles.metricValue}>{adminCount} / {registeredUsers.length}</div>
          </GlassCard>
          <GlassCard padding={18}>
            <div className={styles.metricLabel}>Admin Allowlist</div>
            <div className={styles.metricValue}>
              {info?.adminAccess?.emailCount ?? 0} email / {info?.adminAccess?.phoneCount ?? 0} phone
            </div>
          </GlassCard>
        </div>

        <GlassCard padding={0}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Admin Accounts</h3>
            <p className={styles.sectionSubtitle}>Allowlisted admin identities (email/phone based)</p>
          </div>
          {loading ? (
            <div className={styles.empty}>Loading admins...</div>
          ) : adminUsers.length === 0 ? (
            <div className={styles.empty}>No admin accounts found.</div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Access</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {adminUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email ?? '—'}</td>
                      <td>{user.phone ?? '—'}</td>
                      <td><span className={styles.adminTag}>Admin</span></td>
                      <td>
                        {pendingDeleteUserId === user.id ? (
                          <div className={styles.actionRow}>
                            <Button
                              variant="danger"
                              size="sm"
                              disabled={deletingUserId === user.id}
                              onClick={() => void handleDelete(user)}
                            >
                              {deletingUserId === user.id ? 'Deleting...' : 'Confirm'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={deletingUserId === user.id}
                              onClick={() => setPendingDeleteUserId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setPendingDeleteUserId(user.id)
                              setError(null)
                              setSuccess(null)
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </GlassCard>

        <GlassCard padding={0}>
          <div className={styles.sectionHeader}>
            <h3 className={styles.sectionTitle}>Registered Users</h3>
            <p className={styles.sectionSubtitle}>Regular learner accounts</p>
          </div>
          {loading ? (
            <div className={styles.empty}>Loading users...</div>
          ) : registeredUsers.length === 0 ? (
            <div className={styles.empty}>No registered users found.</div>
          ) : (
            <div className={styles.tableWrap}>
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Role</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {registeredUsers.map(user => (
                    <tr key={user.id}>
                      <td>{user.name}</td>
                      <td>{user.email ?? '—'}</td>
                      <td>{user.phone ?? '—'}</td>
                      <td>{user.role ?? 'student'}</td>
                      <td>
                        {pendingDeleteUserId === user.id ? (
                          <div className={styles.actionRow}>
                            <Button
                              variant="danger"
                              size="sm"
                              disabled={deletingUserId === user.id}
                              onClick={() => void handleDelete(user)}
                            >
                              {deletingUserId === user.id ? 'Deleting...' : 'Confirm'}
                            </Button>
                            <Button
                              variant="ghost"
                              size="sm"
                              disabled={deletingUserId === user.id}
                              onClick={() => setPendingDeleteUserId(null)}
                            >
                              Cancel
                            </Button>
                          </div>
                        ) : (
                          <Button
                            variant="danger"
                            size="sm"
                            onClick={() => {
                              setPendingDeleteUserId(user.id)
                              setError(null)
                              setSuccess(null)
                            }}
                          >
                            Delete
                          </Button>
                        )}
                      </td>
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
