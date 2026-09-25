import { useMemo, useState } from 'react'

const STORAGE_KEY = 'al-brr-admin-users'

const ROLES = ['Super Admin', 'Admin', 'Staff']

const PERMISSIONS = [
  { id: 'dashboard', label: 'Dashboard' },
  { id: 'products', label: 'Products' },
  { id: 'categories', label: 'Categories' },
  { id: 'inventory', label: 'Inventory' },
  { id: 'orders', label: 'Orders' },
  { id: 'customers', label: 'Customers' },
  { id: 'payments', label: 'Payments' },
  { id: 'invoices', label: 'Invoices' },
  { id: 'coupons', label: 'Coupons' },
  { id: 'reports', label: 'Reports' },
  { id: 'notifications', label: 'Notifications' },
  { id: 'users', label: 'Users & Roles' },
  { id: 'activityLogs', label: 'Activity Logs' },
  { id: 'settings', label: 'Settings' },
]

const ROLE_PERMISSIONS = {
  'Super Admin': PERMISSIONS.map((item) => item.id),

  Admin: [
    'dashboard',
    'products',
    'categories',
    'inventory',
    'orders',
    'customers',
    'payments',
    'invoices',
    'coupons',
    'reports',
    'notifications',
  ],

  Staff: [
    'dashboard',
    'products',
    'inventory',
    'orders',
    'customers',
    'notifications',
  ],
}

const EMPTY_FORM = {
  name: '',
  email: '',
  phone: '',
  role: 'Staff',
  status: 'Active',
  permissions: ROLE_PERMISSIONS.Staff,
}

function loadUsers() {
  try {
    const data = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )

    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
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
  const parts = String(name || 'Admin')
    .trim()
    .split(/\s+/)
    .filter(Boolean)

  if (parts.length === 0) return 'A'

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase()
  }

  return `${parts[0][0]}${parts[1][0]}`.toUpperCase()
}

function Users() {
  const [users, setUsers] = useState(loadUsers)

  const [search, setSearch] = useState('')
  const [roleFilter, setRoleFilter] = useState('all')
  const [statusFilter, setStatusFilter] = useState('all')

  const [showModal, setShowModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  const [form, setForm] = useState(EMPTY_FORM)
  const [error, setError] = useState('')

  /* =====================================================
     SAVE
  ===================================================== */

  const saveUsers = (updatedUsers) => {
    setUsers(updatedUsers)

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedUsers)
    )
  }

  /* =====================================================
     STATS
  ===================================================== */

  const totalUsers = users.length

  const activeUsers = users.filter(
    (user) => user.status !== 'Inactive'
  ).length

  const assignedRoles = new Set(
    users.map((user) => user.role).filter(Boolean)
  ).size

  const superAdmins = users.filter(
    (user) => user.role === 'Super Admin'
  ).length

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredUsers = useMemo(() => {
    const query = search.trim().toLowerCase()

    return users.filter((user) => {
      const matchesSearch =
        !query ||
        user.name?.toLowerCase().includes(query) ||
        user.email?.toLowerCase().includes(query) ||
        user.phone?.toLowerCase().includes(query)

      const matchesRole =
        roleFilter === 'all' ||
        user.role === roleFilter

      const matchesStatus =
        statusFilter === 'all' ||
        user.status === statusFilter

      return (
        matchesSearch &&
        matchesRole &&
        matchesStatus
      )
    })
  }, [
    users,
    search,
    roleFilter,
    statusFilter,
  ])

  /* =====================================================
     MODAL
  ===================================================== */

  const openAddModal = () => {
    setEditingUser(null)

    setForm({
      ...EMPTY_FORM,
      permissions: [...ROLE_PERMISSIONS.Staff],
    })

    setError('')
    setShowModal(true)
  }

  const openEditModal = (user) => {
    setEditingUser(user)

    setForm({
      name: user.name || '',
      email: user.email || '',
      phone: user.phone || '',
      role: user.role || 'Staff',
      status: user.status || 'Active',
      permissions: Array.isArray(user.permissions)
        ? [...user.permissions]
        : [...(ROLE_PERMISSIONS[user.role] || [])],
    })

    setError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingUser(null)
    setError('')
  }

  /* =====================================================
     FORM
  ===================================================== */

  const handleChange = (event) => {
    const { name, value } = event.target

    if (name === 'role') {
      setForm((current) => ({
        ...current,
        role: value,
        permissions: [
          ...(ROLE_PERMISSIONS[value] || []),
        ],
      }))

      setError('')
      return
    }

    setForm((current) => ({
      ...current,
      [name]: value,
    }))

    setError('')
  }

  const togglePermission = (permissionId) => {
    if (form.role === 'Super Admin') {
      return
    }

    setForm((current) => {
      const exists =
        current.permissions.includes(permissionId)

      return {
        ...current,
        permissions: exists
          ? current.permissions.filter(
              (item) => item !== permissionId
            )
          : [...current.permissions, permissionId],
      }
    })
  }

  const selectAllPermissions = () => {
    if (form.role === 'Super Admin') return

    setForm((current) => ({
      ...current,
      permissions: PERMISSIONS.map(
        (item) => item.id
      ),
    }))
  }

  const clearPermissions = () => {
    if (form.role === 'Super Admin') return

    setForm((current) => ({
      ...current,
      permissions: [],
    }))
  }

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = (event) => {
    event.preventDefault()

    const name = form.name.trim()
    const email = form.email.trim().toLowerCase()
    const phone = form.phone.trim()

    if (!name) {
      setError('User name is required.')
      return
    }

    if (!email) {
      setError('Email address is required.')
      return
    }

    const emailPattern =
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/

    if (!emailPattern.test(email)) {
      setError('Enter a valid email address.')
      return
    }

    const duplicateEmail = users.some(
      (user) =>
        user.email?.trim().toLowerCase() === email &&
        user.id !== editingUser?.id
    )

    if (duplicateEmail) {
      setError(
        'An admin user with this email already exists.'
      )
      return
    }

    const now = new Date().toISOString()

    const permissions =
      form.role === 'Super Admin'
        ? [...ROLE_PERMISSIONS['Super Admin']]
        : [...form.permissions]

    if (editingUser) {
      const updatedUsers = users.map((user) =>
        user.id === editingUser.id
          ? {
              ...user,
              name,
              email,
              phone,
              role: form.role,
              status: form.status,
              permissions,
              updatedAt: now,
            }
          : user
      )

      saveUsers(updatedUsers)
    } else {
      const newUser = {
        id: `admin-user-${Date.now()}`,
        name,
        email,
        phone,
        role: form.role,
        status: form.status,
        permissions,
        createdAt: now,
        updatedAt: now,
      }

      saveUsers([
        newUser,
        ...users,
      ])
    }

    closeModal()
  }

  /* =====================================================
     STATUS
  ===================================================== */

  const toggleStatus = (user) => {
    const updatedUsers = users.map((item) =>
      item.id === user.id
        ? {
            ...item,
            status:
              item.status === 'Inactive'
                ? 'Active'
                : 'Inactive',
            updatedAt: new Date().toISOString(),
          }
        : item
    )

    saveUsers(updatedUsers)
  }

  /* =====================================================
     DELETE
  ===================================================== */

  const deleteUser = (user) => {
    const confirmed = window.confirm(
      `Delete admin user "${user.name}"?`
    )

    if (!confirmed) return

    saveUsers(
      users.filter(
        (item) => item.id !== user.id
      )
    )
  }

  return (
    <div className="admin-users-page">

      {/* HEADER */}

      <div className="admin-users-header">

        <div>
          <p className="admin-page-eyebrow">
            ACCESS MANAGEMENT
          </p>

          <h1>Users & Roles</h1>

          <p className="admin-page-description">
            Manage admin staff, roles and access permissions.
          </p>
        </div>

        <button
          type="button"
          className="admin-add-user-btn"
          onClick={openAddModal}
        >
          <span>+</span>
          Add User
        </button>

      </div>

      {/* STATS */}

      <div className="admin-user-stats">

        <div className="admin-user-stat-card">
          <div className="admin-user-stat-icon">
            ♙
          </div>

          <div>
            <span>Total Users</span>
            <strong>{totalUsers}</strong>
            <small>Admin accounts</small>
          </div>
        </div>

        <div className="admin-user-stat-card">
          <div className="admin-user-stat-icon">
            ✓
          </div>

          <div>
            <span>Active Users</span>
            <strong>{activeUsers}</strong>
            <small>Enabled accounts</small>
          </div>
        </div>

        <div className="admin-user-stat-card">
          <div className="admin-user-stat-icon">
            ◇
          </div>

          <div>
            <span>Assigned Roles</span>
            <strong>{assignedRoles}</strong>
            <small>Roles currently in use</small>
          </div>
        </div>

        <div className="admin-user-stat-card">
          <div className="admin-user-stat-icon">
            ★
          </div>

          <div>
            <span>Super Admins</span>
            <strong>{superAdmins}</strong>
            <small>Full access users</small>
          </div>
        </div>

      </div>

      {/* PANEL */}

      <section className="admin-users-panel">

        <div className="admin-users-panel-heading">
          <div>
            <h2>Admin Users</h2>

            <p>
              Manage staff accounts and their assigned roles.
            </p>
          </div>
        </div>

        {/* TOOLBAR */}

        <div className="admin-users-toolbar">

          <div className="admin-users-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search name, email or phone..."
              value={search}
              onChange={(event) =>
                setSearch(event.target.value)
              }
            />
          </div>

          <div className="admin-users-filters">

            <select
              value={roleFilter}
              onChange={(event) =>
                setRoleFilter(event.target.value)
              }
            >
              <option value="all">
                All Roles
              </option>

              {ROLES.map((role) => (
                <option
                  key={role}
                  value={role}
                >
                  {role}
                </option>
              ))}
            </select>

            <select
              value={statusFilter}
              onChange={(event) =>
                setStatusFilter(event.target.value)
              }
            >
              <option value="all">
                All Status
              </option>

              <option value="Active">
                Active
              </option>

              <option value="Inactive">
                Inactive
              </option>
            </select>

          </div>

        </div>

        {/* TABLE */}

        <div className="admin-users-table-wrap">

          <table className="admin-users-table">

            <thead>
              <tr>
                <th>User</th>
                <th>Contact</th>
                <th>Role</th>
                <th>Permissions</th>
                <th>Created</th>
                <th>Status</th>
                <th className="admin-table-action">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredUsers.length > 0 ? (
                filteredUsers.map((user) => (

                  <tr key={user.id}>

                    <td>
                      <div className="admin-user-profile-cell">

                        <div className="admin-user-avatar">
                          {getInitials(user.name)}
                        </div>

                        <div>
                          <strong>
                            {user.name}
                          </strong>

                          <span>
                            Admin Staff
                          </span>
                        </div>

                      </div>
                    </td>

                    <td>
                      <div className="admin-user-contact">
                        <strong>
                          {user.email}
                        </strong>

                        <span>
                          {user.phone || 'No phone'}
                        </span>
                      </div>
                    </td>

                    <td>
                      <span
                        className={`admin-user-role ${user.role
                          .toLowerCase()
                          .replace(/\s+/g, '-')}`}
                      >
                        {user.role}
                      </span>
                    </td>

                    <td>
                      <div className="admin-user-permission-count">
                        <strong>
                          {Array.isArray(user.permissions)
                            ? user.permissions.length
                            : 0}
                        </strong>

                        <span>
                          / {PERMISSIONS.length} modules
                        </span>
                      </div>
                    </td>

                    <td>
                      <span className="admin-user-date">
                        {formatDate(user.createdAt)}
                      </span>
                    </td>

                    <td>
                      <button
                        type="button"
                        className={`admin-user-status ${
                          user.status === 'Inactive'
                            ? 'inactive'
                            : 'active'
                        }`}
                        onClick={() =>
                          toggleStatus(user)
                        }
                      >
                        <i />
                        {user.status || 'Active'}
                      </button>
                    </td>

                    <td>
                      <div className="admin-user-actions">

                        <button
                          type="button"
                          onClick={() =>
                            openEditModal(user)
                          }
                        >
                          Edit
                        </button>

                        <button
                          type="button"
                          className="delete"
                          onClick={() =>
                            deleteUser(user)
                          }
                        >
                          Delete
                        </button>

                      </div>
                    </td>

                  </tr>

                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="admin-users-empty"
                  >
                    {users.length === 0
                      ? 'No admin users yet. Add your first user.'
                      : 'No users match the selected filters.'}
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        <div className="admin-users-footer">
          Showing{' '}
          <strong>{filteredUsers.length}</strong>{' '}
          of <strong>{users.length}</strong>{' '}
          admin users
        </div>

      </section>

      {/* =================================================
          ADD / EDIT USER MODAL
      ================================================= */}

      {showModal && (
        <div
          className="admin-user-modal-overlay"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              closeModal()
            }
          }}
        >

          <div className="admin-user-modal">

            <div className="admin-user-modal-header">

              <div>
                <p className="admin-page-eyebrow">
                  {editingUser
                    ? 'UPDATE ADMIN USER'
                    : 'CREATE ADMIN USER'}
                </p>

                <h2>
                  {editingUser
                    ? 'Edit User'
                    : 'Add User'}
                </h2>
              </div>

              <button
                type="button"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleSubmit}>

              <div className="admin-user-form-grid">

                <div className="admin-user-field">
                  <label>
                    Full Name
                    <strong>*</strong>
                  </label>

                  <input
                    type="text"
                    name="name"
                    placeholder="e.g. Ahmed Khan"
                    value={form.name}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-user-field">
                  <label>
                    Email Address
                    <strong>*</strong>
                  </label>

                  <input
                    type="email"
                    name="email"
                    placeholder="admin@example.com"
                    value={form.email}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-user-field">
                  <label>
                    Phone
                  </label>

                  <input
                    type="tel"
                    name="phone"
                    placeholder="+91 98765 43210"
                    value={form.phone}
                    onChange={handleChange}
                  />
                </div>

                <div className="admin-user-field">
                  <label>
                    Status
                  </label>

                  <select
                    name="status"
                    value={form.status}
                    onChange={handleChange}
                  >
                    <option value="Active">
                      Active
                    </option>

                    <option value="Inactive">
                      Inactive
                    </option>
                  </select>
                </div>

              </div>

              {/* ROLE */}

              <div className="admin-user-role-section">

                <div className="admin-user-section-heading">
                  <div>
                    <h3>Role</h3>

                    <p>
                      Select the primary access level for this user.
                    </p>
                  </div>
                </div>

                <div className="admin-user-role-options">

                  {ROLES.map((role) => (

                    <label
                      key={role}
                      className={`admin-user-role-option ${
                        form.role === role
                          ? 'selected'
                          : ''
                      }`}
                    >

                      <input
                        type="radio"
                        name="role"
                        value={role}
                        checked={form.role === role}
                        onChange={handleChange}
                      />

                      <div>
                        <strong>{role}</strong>

                        <span>
                          {role === 'Super Admin' &&
                            'Complete access to every admin module.'}

                          {role === 'Admin' &&
                            'Manage store operations without user/settings access.'}

                          {role === 'Staff' &&
                            'Day-to-day products, stock, orders and customers.'}
                        </span>
                      </div>

                    </label>

                  ))}

                </div>

              </div>

              {/* PERMISSIONS */}

              <div className="admin-user-permissions-section">

                <div className="admin-user-section-heading">

                  <div>
                    <h3>Permissions</h3>

                    <p>
                      Choose which admin modules this user can access.
                    </p>
                  </div>

                  {form.role !== 'Super Admin' && (
                    <div className="admin-user-permission-tools">

                      <button
                        type="button"
                        onClick={selectAllPermissions}
                      >
                        Select All
                      </button>

                      <button
                        type="button"
                        onClick={clearPermissions}
                      >
                        Clear
                      </button>

                    </div>
                  )}

                </div>

                {form.role === 'Super Admin' && (
                  <div className="admin-user-super-note">
                    Super Admin automatically has full access to all admin modules.
                  </div>
                )}

                <div className="admin-user-permission-grid">

                  {PERMISSIONS.map((permission) => {

                    const checked =
                      form.permissions.includes(
                        permission.id
                      )

                    return (
                      <label
                        key={permission.id}
                        className={`admin-user-permission-item ${
                          checked ? 'selected' : ''
                        }`}
                      >

                        <input
                          type="checkbox"
                          checked={checked}
                          disabled={
                            form.role === 'Super Admin'
                          }
                          onChange={() =>
                            togglePermission(
                              permission.id
                            )
                          }
                        />

                        <span className="admin-user-permission-check">
                          {checked ? '✓' : ''}
                        </span>

                        <strong>
                          {permission.label}
                        </strong>

                      </label>
                    )
                  })}

                </div>

              </div>

              {error && (
                <div className="admin-user-error">
                  {error}
                </div>
              )}

              <div className="admin-user-modal-actions">

                <button
                  type="button"
                  className="cancel"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save"
                >
                  {editingUser
                    ? 'Update User'
                    : 'Create User'}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  )
}

export default Users