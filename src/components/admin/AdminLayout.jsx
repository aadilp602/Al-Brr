import { Outlet, NavLink } from 'react-router-dom'

const menuItems = [
  { name: 'Dashboard', path: '/admin', icon: '⌂' },
  { name: 'Products', path: '/admin/products', icon: '◇' },
  { name: 'Categories', path: '/admin/categories', icon: '▦' },
  { name: 'Inventory', path: '/admin/inventory', icon: '▤' },
  { name: 'Orders', path: '/admin/orders', icon: '□' },
  { name: 'Customers', path: '/admin/customers', icon: '♙' },
  { name: 'Payments', path: '/admin/payments', icon: '₹' },
  { name: 'Invoices', path: '/admin/invoices', icon: '▧' },
  { name: 'Coupons', path: '/admin/coupons', icon: '%' },
  { name: 'Reports', path: '/admin/reports', icon: '⌁' },
  { name: 'Notifications', path: '/admin/notifications', icon: '○' },
  { name: 'Users & Roles', path: '/admin/users', icon: '♙' },
  { name: 'Activity Logs', path: '/admin/activity-logs', icon: '↻' },
  { name: 'Settings', path: '/admin/settings', icon: '⚙' },
]

function AdminLayout() {
  return (
    <div className="admin-shell">

      {/* SIDEBAR */}
      <aside className="admin-sidebar">

        {/* BRAND */}
        <div className="admin-brand">
          <div className="admin-brand-mark">
            <span>AB</span>
          </div>

          <div className="admin-brand-copy">
            <strong>AL BRR</strong>
            <small>PERFUMES</small>
          </div>
        </div>

        {/* MENU LABEL */}
        <div className="admin-menu-label">
          MANAGEMENT
        </div>

        {/* NAVIGATION */}
        <nav className="admin-navigation">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                isActive
                  ? 'admin-nav-link admin-nav-link-active'
                  : 'admin-nav-link'
              }
            >
              <span className="admin-nav-icon">
                {item.icon}
              </span>

              <span className="admin-nav-name">
                {item.name}
              </span>
            </NavLink>
          ))}
        </nav>

        {/* SIDEBAR FOOTER */}
        <div className="admin-sidebar-footer">
          <span>AL BRR</span>
          <p>Luxury Perfume Administration</p>
        </div>

      </aside>

      {/* =====================================================
          MAIN AREA
      ====================================================== */}

      <div className="admin-main">

        {/* TOPBAR */}
        <header className="admin-topbar">

          <div className="admin-topbar-left">
            <span className="admin-topbar-eyebrow">
              AL BRR PERFUMES
            </span>

            <h2>Admin Panel</h2>
          </div>

          <div className="admin-topbar-right">

            <div className="admin-status">
              <span className="admin-status-dot"></span>
              ONLINE
            </div>

            <div className="admin-user-info">
              <span>Administrator</span>
              <small>Super Admin</small>
            </div>

            <div className="admin-avatar">
              A
            </div>

          </div>

        </header>

        {/* PAGE CONTENT */}
        <main className="admin-page-content">
          <Outlet />
        </main>

      </div>

    </div>
  )
}

export default AdminLayout