import { useMemo, useState } from 'react'

const LOGS_KEY = 'al-brr-admin-activity-logs'
const ADMIN_USERS_KEY = 'al-brr-admin-users'

const ACTIVITY_TYPES = [
  'Login',
  'Logout',
  'Product',
  'Category',
  'Inventory',
  'Order',
  'Customer',
  'Payment',
  'Invoice',
  'Coupon',
  'User',
  'Settings',
  'System',
]

function loadArray(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function getLogUser(log) {
  return (
    log.userName ||
    log.user ||
    log.adminName ||
    log.actor?.name ||
    'System'
  )
}

function getLogEmail(log) {
  return (
    log.userEmail ||
    log.email ||
    log.adminEmail ||
    log.actor?.email ||
    ''
  )
}

function getActivity(log) {
  return (
    log.activity ||
    log.type ||
    log.category ||
    'System'
  )
}

function getDescription(log) {
  return (
    log.description ||
    log.message ||
    log.details ||
    'Activity recorded.'
  )
}

function getLogDate(log) {
  return (
    log.createdAt ||
    log.timestamp ||
    log.date ||
    log.updatedAt ||
    null
  )
}

function getIpAddress(log) {
  return (
    log.ipAddress ||
    log.ip ||
    'Local'
  )
}

function formatDateTime(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return '—'
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function getInitials(name) {
  const parts = String(name || 'System')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (!parts.length) return 'S'

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function normalizeClass(value) {
  return String(value || 'system')
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
}

function ActivityLogs() {
  const [logs, setLogs] = useState(() =>
    loadArray(LOGS_KEY)
  )

  const [adminUsers] = useState(() =>
    loadArray(ADMIN_USERS_KEY)
  )

  const [search, setSearch] = useState('')
  const [userFilter, setUserFilter] = useState('all')
  const [activityFilter, setActivityFilter] = useState('all')
  const [dateFilter, setDateFilter] = useState('all')

  const [selectedLog, setSelectedLog] = useState(null)

  /* =====================================================
     AVAILABLE USERS
  ===================================================== */

  const availableUsers = useMemo(() => {
    const names = new Set()

    adminUsers.forEach((user) => {
      if (user.name) {
        names.add(user.name)
      }
    })

    logs.forEach((log) => {
      const name = getLogUser(log)

      if (name) {
        names.add(name)
      }
    })

    return Array.from(names).sort((a, b) =>
      a.localeCompare(b)
    )
  }, [adminUsers, logs])

  /* =====================================================
     STATS
  ===================================================== */

  const todayCount = useMemo(() => {
    const today = new Date()

    return logs.filter((log) => {
      const value = getLogDate(log)

      if (!value) return false

      const date = new Date(value)

      if (Number.isNaN(date.getTime())) {
        return false
      }

      return (
        date.getFullYear() === today.getFullYear() &&
        date.getMonth() === today.getMonth() &&
        date.getDate() === today.getDate()
      )
    }).length
  }, [logs])

  const uniqueUsers = useMemo(() => {
    return new Set(
      logs.map(getLogUser).filter(Boolean)
    ).size
  }, [logs])

  const systemActivities = useMemo(() => {
    return logs.filter(
      (log) =>
        getActivity(log).toLowerCase() === 'system'
    ).length
  }, [logs])

  /* =====================================================
     FILTERING
  ===================================================== */

  const filteredLogs = useMemo(() => {
    const query = search.trim().toLowerCase()

    const now = new Date()

    return logs
      .filter((log) => {
        const user = getLogUser(log)
        const email = getLogEmail(log)
        const activity = getActivity(log)
        const description = getDescription(log)
        const ip = getIpAddress(log)

        const matchesSearch =
          !query ||
          user.toLowerCase().includes(query) ||
          email.toLowerCase().includes(query) ||
          activity.toLowerCase().includes(query) ||
          description.toLowerCase().includes(query) ||
          ip.toLowerCase().includes(query)

        const matchesUser =
          userFilter === 'all' ||
          user === userFilter

        const matchesActivity =
          activityFilter === 'all' ||
          activity.toLowerCase() ===
            activityFilter.toLowerCase()

        let matchesDate = true

        if (dateFilter !== 'all') {
          const rawDate = getLogDate(log)

          if (!rawDate) {
            matchesDate = false
          } else {
            const logDate = new Date(rawDate)

            if (Number.isNaN(logDate.getTime())) {
              matchesDate = false
            } else if (dateFilter === 'today') {
              matchesDate =
                logDate.getFullYear() === now.getFullYear() &&
                logDate.getMonth() === now.getMonth() &&
                logDate.getDate() === now.getDate()
            } else {
              const difference =
                now.getTime() - logDate.getTime()

              const days =
                difference / (1000 * 60 * 60 * 24)

              if (dateFilter === '7days') {
                matchesDate = days >= 0 && days <= 7
              }

              if (dateFilter === '30days') {
                matchesDate = days >= 0 && days <= 30
              }
            }
          }
        }

        return (
          matchesSearch &&
          matchesUser &&
          matchesActivity &&
          matchesDate
        )
      })
      .sort((a, b) => {
        const aTime = getLogDate(a)
          ? new Date(getLogDate(a)).getTime()
          : 0

        const bTime = getLogDate(b)
          ? new Date(getLogDate(b)).getTime()
          : 0

        return bTime - aTime
      })
  }, [
    logs,
    search,
    userFilter,
    activityFilter,
    dateFilter,
  ])

  /* =====================================================
     CLEAR
  ===================================================== */

  const clearLogs = () => {
    if (!logs.length) return

    const confirmed = window.confirm(
      'Clear all admin activity logs? This action cannot be undone.'
    )

    if (!confirmed) return

    localStorage.setItem(
      LOGS_KEY,
      JSON.stringify([])
    )

    setLogs([])
    setSelectedLog(null)
  }

  /* =====================================================
     CSV
  ===================================================== */

  const escapeCsv = (value) => {
    return `"${String(value ?? '').replace(/"/g, '""')}"`
  }

  const exportCsv = () => {
    if (!filteredLogs.length) {
      window.alert(
        'No activity logs available to export.'
      )
      return
    }

    const rows = [
      [
        'User',
        'Email',
        'Activity',
        'Description',
        'Date',
        'IP Address',
      ],
      ...filteredLogs.map((log) => [
        getLogUser(log),
        getLogEmail(log),
        getActivity(log),
        getDescription(log),
        formatDateTime(getLogDate(log)),
        getIpAddress(log),
      ]),
    ]

    const csv = rows
      .map((row) =>
        row.map(escapeCsv).join(',')
      )
      .join('\n')

    const blob = new Blob(
      [`\uFEFF${csv}`],
      {
        type: 'text/csv;charset=utf-8;',
      }
    )

    const url = URL.createObjectURL(blob)

    const link = document.createElement('a')

    link.href = url
    link.download = 'al-brr-activity-logs.csv'

    document.body.appendChild(link)
    link.click()
    link.remove()

    URL.revokeObjectURL(url)
  }

  return (
    <div className="admin-activity-page">

      {/* HEADER */}

      <div className="admin-activity-header">

        <div>
          <p className="admin-page-eyebrow">
            SECURITY & AUDIT
          </p>

          <h1>Activity Logs</h1>

          <p className="admin-page-description">
            Track administrative actions and important system activity.
          </p>
        </div>

        <div className="admin-activity-header-actions">

          <button
            type="button"
            className="admin-activity-clear-btn"
            onClick={clearLogs}
            disabled={!logs.length}
          >
            Clear Logs
          </button>

          <button
            type="button"
            className="admin-activity-export-btn"
            onClick={exportCsv}
          >
            ↓ Export CSV
          </button>

        </div>

      </div>

      {/* STATS */}

      <div className="admin-activity-stats">

        <div className="admin-activity-stat-card">

          <div className="admin-activity-stat-icon">
            ↻
          </div>

          <div>
            <span>Total Activities</span>
            <strong>{logs.length}</strong>
            <small>Recorded audit events</small>
          </div>

        </div>

        <div className="admin-activity-stat-card">

          <div className="admin-activity-stat-icon">
            ◷
          </div>

          <div>
            <span>Today</span>
            <strong>{todayCount}</strong>
            <small>Activities today</small>
          </div>

        </div>

        <div className="admin-activity-stat-card">

          <div className="admin-activity-stat-icon">
            ♙
          </div>

          <div>
            <span>Users</span>
            <strong>{uniqueUsers}</strong>
            <small>Users in audit history</small>
          </div>

        </div>

        <div className="admin-activity-stat-card">

          <div className="admin-activity-stat-icon">
            ⚙
          </div>

          <div>
            <span>System Events</span>
            <strong>{systemActivities}</strong>
            <small>Automated activities</small>
          </div>

        </div>

      </div>

      {/* FILTERS */}

      <section className="admin-activity-filter-panel">

        <div className="admin-activity-search">
          <span>⌕</span>

          <input
            type="text"
            placeholder="Search user, activity, description or IP..."
            value={search}
            onChange={(event) =>
              setSearch(event.target.value)
            }
          />
        </div>

        <div className="admin-activity-filters">

          <select
            value={userFilter}
            onChange={(event) =>
              setUserFilter(event.target.value)
            }
          >
            <option value="all">
              All Users
            </option>

            {availableUsers.map((user) => (
              <option
                key={user}
                value={user}
              >
                {user}
              </option>
            ))}
          </select>

          <select
            value={activityFilter}
            onChange={(event) =>
              setActivityFilter(event.target.value)
            }
          >
            <option value="all">
              All Activities
            </option>

            {ACTIVITY_TYPES.map((activity) => (
              <option
                key={activity}
                value={activity}
              >
                {activity}
              </option>
            ))}
          </select>

          <select
            value={dateFilter}
            onChange={(event) =>
              setDateFilter(event.target.value)
            }
          >
            <option value="all">
              All Time
            </option>

            <option value="today">
              Today
            </option>

            <option value="7days">
              Last 7 Days
            </option>

            <option value="30days">
              Last 30 Days
            </option>
          </select>

        </div>

      </section>

      {/* TABLE */}

      <section className="admin-activity-panel">

        <div className="admin-activity-panel-heading">

          <div>
            <h2>Activity History</h2>

            <p>
              Recent admin and system activities.
            </p>
          </div>

          <span>
            {filteredLogs.length} Records
          </span>

        </div>

        <div className="admin-activity-table-wrap">

          <table className="admin-activity-table">

            <thead>
              <tr>
                <th>User</th>
                <th>Activity</th>
                <th>Description</th>
                <th>Date & Time</th>
                <th>IP Address</th>
                <th>Details</th>
              </tr>
            </thead>

            <tbody>

              {filteredLogs.length > 0 ? (
                filteredLogs.map((log, index) => {

                  const user = getLogUser(log)
                  const email = getLogEmail(log)
                  const activity = getActivity(log)

                  return (
                    <tr
                      key={
                        log.id ||
                        `${activity}-${index}`
                      }
                    >

                      <td>
                        <div className="admin-activity-user">

                          <div className="admin-activity-avatar">
                            {getInitials(user)}
                          </div>

                          <div>
                            <strong>
                              {user}
                            </strong>

                            <span>
                              {email || 'Admin/System'}
                            </span>
                          </div>

                        </div>
                      </td>

                      <td>
                        <span
                          className={`admin-activity-badge ${normalizeClass(
                            activity
                          )}`}
                        >
                          {activity}
                        </span>
                      </td>

                      <td>
                        <p className="admin-activity-description">
                          {getDescription(log)}
                        </p>
                      </td>

                      <td>
                        <div className="admin-activity-date">
                          <strong>
                            {formatDate(
                              getLogDate(log)
                            )}
                          </strong>

                          <span>
                            {formatDateTime(
                              getLogDate(log)
                            )}
                          </span>
                        </div>
                      </td>

                      <td>
                        <code className="admin-activity-ip">
                          {getIpAddress(log)}
                        </code>
                      </td>

                      <td>
                        <button
                          type="button"
                          className="admin-activity-view-btn"
                          onClick={() =>
                            setSelectedLog(log)
                          }
                        >
                          View
                        </button>
                      </td>

                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td
                    colSpan="6"
                    className="admin-activity-empty"
                  >
                    {logs.length === 0
                      ? 'No activity logs have been recorded yet.'
                      : 'No activity logs match the selected filters.'}
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        <div className="admin-activity-footer">
          Showing{' '}
          <strong>{filteredLogs.length}</strong>{' '}
          of <strong>{logs.length}</strong>{' '}
          activity logs
        </div>

      </section>

      {/* =================================================
          DETAILS DRAWER
      ================================================= */}

      {selectedLog && (
        <div
          className="admin-activity-drawer-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setSelectedLog(null)
            }
          }}
        >

          <aside className="admin-activity-drawer">

            <div className="admin-activity-drawer-header">

              <div>
                <p>ACTIVITY DETAILS</p>

                <h2>
                  {getActivity(selectedLog)}
                </h2>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedLog(null)
                }
              >
                ×
              </button>

            </div>

            <div className="admin-activity-drawer-body">

              <section className="admin-activity-detail-section">

                <h3>Activity</h3>

                <div className="admin-activity-detail-main">

                  <span
                    className={`admin-activity-badge ${normalizeClass(
                      getActivity(selectedLog)
                    )}`}
                  >
                    {getActivity(selectedLog)}
                  </span>

                  <p>
                    {getDescription(selectedLog)}
                  </p>

                </div>

              </section>

              <section className="admin-activity-detail-section">

                <h3>User Information</h3>

                <div className="admin-activity-detail-grid">

                  <div>
                    <span>User</span>
                    <strong>
                      {getLogUser(selectedLog)}
                    </strong>
                  </div>

                  <div>
                    <span>Email</span>
                    <strong>
                      {getLogEmail(selectedLog) || '—'}
                    </strong>
                  </div>

                </div>

              </section>

              <section className="admin-activity-detail-section">

                <h3>Audit Information</h3>

                <div className="admin-activity-detail-grid">

                  <div>
                    <span>Date & Time</span>
                    <strong>
                      {formatDateTime(
                        getLogDate(selectedLog)
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>IP Address</span>
                    <strong>
                      {getIpAddress(selectedLog)}
                    </strong>
                  </div>

                  <div>
                    <span>Log ID</span>
                    <strong>
                      {selectedLog.id || '—'}
                    </strong>
                  </div>

                  <div>
                    <span>Source</span>
                    <strong>
                      {selectedLog.source || 'Admin Panel'}
                    </strong>
                  </div>

                </div>

              </section>

              {selectedLog.metadata &&
                typeof selectedLog.metadata === 'object' && (
                  <section className="admin-activity-detail-section">

                    <h3>Metadata</h3>

                    <pre className="admin-activity-metadata">
                      {JSON.stringify(
                        selectedLog.metadata,
                        null,
                        2
                      )}
                    </pre>

                  </section>
                )}

            </div>

          </aside>

        </div>
      )}

    </div>
  )
}

export default ActivityLogs