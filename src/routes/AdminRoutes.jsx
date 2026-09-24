import { Routes, Route } from 'react-router-dom'

import AdminLayout from '../components/admin/AdminLayout'

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

function AdminRoutes() {
  return (
    <Routes>
      <Route path="/admin" element={<AdminLayout />}>

        <Route index element={<Dashboard />} />

        {/* Products */}
        <Route path="products" element={<Products />} />
        <Route path="products/add" element={<AddProduct />} />
        <Route path="products/edit/:id" element={<EditProduct />} />

        {/* Categories */}
        <Route path="categories" element={<Categories />} />

        {/* Inventory */}
        <Route path="inventory" element={<Inventory />} />

        {/* Orders */}
        <Route path="orders" element={<Orders />} />

        {/* Customers */}
        <Route path="customers" element={<Customers />} />

        {/* Payments */}
        <Route path="payments" element={<Payments />} />

        {/* Invoices */}
        <Route path="invoices" element={<Invoices />} />

        {/* Coupons */}
        <Route path="coupons" element={<Coupons />} />

        {/* Reports */}
        <Route path="reports" element={<Reports />} />

        {/* Notifications */}
        <Route path="notifications" element={<Notifications />} />

        {/* Users & Roles */}
        <Route path="users" element={<Users />} />

        {/* Activity Logs */}
        <Route path="activity-logs" element={<ActivityLogs />} />

        {/* Settings */}
        <Route path="settings" element={<Settings />} />

      </Route>
    </Routes>
  )
}

export default AdminRoutes