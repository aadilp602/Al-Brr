import { Outlet, NavLink } from 'react-router-dom'

const menuItems = [
  { name: 'Dashboard', path: '/admin' },
  { name: 'Products', path: '/admin/products' },
  { name: 'Categories', path: '/admin/categories' },
  { name: 'Inventory', path: '/admin/inventory' },
  { name: 'Orders', path: '/admin/orders' },
  { name: 'Customers', path: '/admin/customers' },
  { name: 'Payments', path: '/admin/payments' },
  { name: 'Invoices', path: '/admin/invoices' },
  { name: 'Coupons', path: '/admin/coupons' },
  { name: 'Reports', path: '/admin/reports' },
  { name: 'Notifications', path: '/admin/notifications' },
  { name: 'Users & Roles', path: '/admin/users' },
  { name: 'Activity Logs', path: '/admin/activity-logs' },
  { name: 'Settings', path: '/admin/settings' },
]

function AdminLayout() {
  return (
    <div className="min-h-screen bg-white">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 border-r bg-black text-white">
        <div className="flex h-20 items-center border-b px-6">
          <h1 className="text-xl font-semibold">
            Al Brr Perfumes
          </h1>
        </div>

        <nav className="p-4">
          {menuItems.map((item) => (
            <NavLink
              key={item.path}
              to={item.path}
              end={item.path === '/admin'}
              className={({ isActive }) =>
                `mb-1 block rounded-lg px-4 py-3 text-sm transition ${
                  isActive
                    ? 'bg-white text-black'
                    : 'text-white hover:bg-white/10'
                }`
              }
            >
              {item.name}
            </NavLink>
          ))}
        </nav>
      </aside>

      {/* Main Area */}
      <div className="ml-64 min-h-screen">
        {/* Topbar */}
        <header className="flex h-20 items-center justify-between border-b bg-white px-8">
          <div>
            <h2 className="text-xl font-semibold">
              Admin Panel
            </h2>
          </div>

          <div className="flex items-center gap-4">
            <span className="text-sm text-gray-600">
              Admin
            </span>

            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-black text-sm text-white">
              A
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="p-8">
          <Outlet />
        </main>
      </div>
    </div>
  )
}

export default AdminLayout
