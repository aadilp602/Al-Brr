import { Routes, Route } from 'react-router-dom'
import AdminLayout from '../components/admin/AdminLayout'
import Dashboard from '../pages/admin/Dashboard'
import Products from '../pages/admin/Products'
import AddProduct from '../pages/admin/AddProduct'
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

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>
        <Route index element={<Dashboard />} />
        <Route path="products" element={<Products />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="categories" element={<Categories />} />
        <Route path="inventory" element={<Inventory />} />
        <Route path="orders" element={<Orders />} />
        <Route path="customers" element={<Customers />} />
        <Route path="payments" element={<Payments />} />
        <Route path="invoices" element={<Invoices />} />
        <Route path="coupons" element={<Coupons />} />
        <Route path="reports" element={<Reports />} />
        <Route path="notifications" element={<Notifications />} />
        <Route path="users" element={<Users />} />
        <Route path="activity-logs" element={<ActivityLogs />} />
        <Route path="settings" element={<Settings />} />
      </Route>
    </Routes>
  )
}

export default AdminRoutes