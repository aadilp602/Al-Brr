import { Navigate, Outlet, Route, Routes } from 'react-router-dom'

import AdminLayout from '../components/admin/AdminLayout'

import AdminLogin from '../pages/admin/AdminLogin'
import Dashboard from '../pages/admin/Dashboard'
import Products from '../pages/admin/Products'
import AddProduct from '../pages/admin/AddProduct'
import EditProduct from '../pages/admin/EditProduct'
import Categories from '../pages/admin/Categories'
import Inventory from '../pages/admin/Inventory'
import Orders from '../pages/admin/Orders'
import Customers from '../pages/admin/Customers'
import Payments from '../pages/admin/Payments'
import Invoices from '../pages/admin/Invoices'
import Coupons from '../pages/admin/Coupons'
import Reports from '../pages/admin/Reports'
import Notifications from '../pages/admin/Notifications'
import Users from '../pages/admin/Users'
import ActivityLogs from '../pages/admin/ActivityLogs'
import Settings from '../pages/admin/Settings'

const ADMIN_SESSION_KEY = 'al-brr-admin-session'

function isAdminAuthenticated() {
  try {
    const session = JSON.parse(
      sessionStorage.getItem(ADMIN_SESSION_KEY)
    )

    return session?.authenticated === true
  } catch {
    return false
  }
}

function ProtectedAdminRoute() {
  if (!isAdminAuthenticated()) {
    return (
      <Navigate
        to="/admin/login"
        replace
      />
    )
  }

  return <Outlet />
}

function AdminRoutes() {
  return (
    <Routes>
      {/* PUBLIC ADMIN LOGIN */}
      <Route
        path="/admin/login"
        element={
          isAdminAuthenticated()
            ? <Navigate to="/admin" replace />
            : <AdminLogin />
        }
      />

      {/* PROTECTED ADMIN ROUTES */}
      <Route element={<ProtectedAdminRoute />}>
        <Route
          path="/admin"
          element={<AdminLayout />}
        >
          <Route
            index
            element={<Dashboard />}
          />

          <Route
            path="products"
            element={<Products />}
          />

          <Route
            path="products/add"
            element={<AddProduct />}
          />

          <Route
            path="products/edit/:id"
            element={<EditProduct />}
          />

          <Route
            path="categories"
            element={<Categories />}
          />

          <Route
            path="inventory"
            element={<Inventory />}
          />

          <Route
            path="orders"
            element={<Orders />}
          />

          <Route
            path="customers"
            element={<Customers />}
          />

          <Route
            path="payments"
            element={<Payments />}
          />

          <Route
            path="invoices"
            element={<Invoices />}
          />

          <Route
            path="coupons"
            element={<Coupons />}
          />

          <Route
            path="reports"
            element={<Reports />}
          />

          <Route
            path="notifications"
            element={<Notifications />}
          />

          <Route
            path="users"
            element={<Users />}
          />

          <Route
            path="activity-logs"
            element={<ActivityLogs />}
          />

          <Route
            path="settings"
            element={<Settings />}
          />
        </Route>
      </Route>
    </Routes>
  )
}

export default AdminRoutes