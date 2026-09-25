import { useMemo, useState } from 'react'

const ORDERS_KEY = 'al-brr-orders'
const PRODUCTS_KEY = 'al-brr-admin-products'
const USERS_KEY = 'al-brr-users'
const STATE_KEY = 'al-brr-admin-notification-state'

function loadArray(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function loadNotificationState() {
  try {
    const data = JSON.parse(localStorage.getItem(STATE_KEY) || '{}')

    return {
      readIds: Array.isArray(data.readIds) ? data.readIds : [],
      deletedIds: Array.isArray(data.deletedIds) ? data.deletedIds : [],
    }
  } catch {
    return {
      readIds: [],
      deletedIds: [],
    }
  }
}

function getOrderId(order, index) {
  return order.orderId || order.id || order._id || `order-${index}`
}

function getCustomerName(order) {
  return (
    order.customer?.name ||
    order.customerName ||
    order.shippingAddress?.name ||
    order.shipping?.name ||
    order.user?.name ||
    order.name ||
    'Customer'
  )
}

function getOrderAmount(order) {
  const direct =
    order.total ??
    order.totalAmount ??
    order.grandTotal ??
    order.amount ??
    order.orderTotal

  if (direct !== undefined && direct !== null && direct !== '') {
    return Number(direct) || 0
  }

  const items = order.items || order.cartItems || order.products || []

  if (!Array.isArray(items)) return 0

  return items.reduce((total, item) => {
    const price = Number(item.price ?? item.product?.price ?? 0)
    const quantity = Number(item.quantity ?? item.qty ?? 1)

    return total + price * quantity
  }, 0)
}

function getPaymentStatus(order) {
  return order.paymentStatus || order.payment?.status || 'Pending'
}

function getOrderDate(order) {
  return (
    order.createdAt ||
    order.orderDate ||
    order.date ||
    order.created_at ||
    null
  )
}

function getProductId(product, index) {
  return product.id || product.sku || `product-${index}`
}

function getUserId(user, index) {
  return user.id || user.userId || user.email || `user-${index}`
}

function getUserName(user) {
  return (
    user.name ||
    user.fullName ||
    [user.firstName, user.lastName].filter(Boolean).join(' ') ||
    'New Customer'
  )
}

function getUserDate(user) {
  return user.createdAt || user.registeredAt || user.date || null
}

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

function formatDateTime(value) {
  if (!value) return 'Recently'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) return 'Recently'

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function Notifications() {
  const [orders] = useState(() => loadArray(ORDERS_KEY))
  const [products] = useState(() => loadArray(PRODUCTS_KEY))
  const [users] = useState(() => loadArray(USERS_KEY))

  const initialState = loadNotificationState()

  const [readIds, setReadIds] = useState(initialState.readIds)
  const [deletedIds, setDeletedIds] = useState(initialState.deletedIds)

  const [filter, setFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  /* =====================================================
     GENERATE NOTIFICATIONS
  ===================================================== */

  const generatedNotifications = useMemo(() => {
    const list = []

    /* ---------------- ORDERS ---------------- */

    orders.forEach((order, index) => {
      const orderId = getOrderId(order, index)
      const customer = getCustomerName(order)
      const amount = getOrderAmount(order)
      const paymentStatus = getPaymentStatus(order)
      const createdAt = getOrderDate(order)

      list.push({
        id: `order-${orderId}`,
        type: 'order',
        title: 'New Order Received',
        message: `${customer} placed order ${String(orderId).startsWith('#') ? orderId : `#${orderId}`} for ${formatCurrency(amount)}.`,
        createdAt,
      })

      if (paymentStatus.toLowerCase() === 'pending') {
        list.push({
          id: `payment-pending-${orderId}`,
          type: 'payment',
          title: 'Payment Pending',
          message: `Payment for order ${String(orderId).startsWith('#') ? orderId : `#${orderId}`} is still pending.`,
          createdAt: order.updatedAt || createdAt,
        })
      }

      if (paymentStatus.toLowerCase() === 'failed') {
        list.push({
          id: `payment-failed-${orderId}`,
          type: 'payment',
          title: 'Payment Failed',
          message: `Payment failed for order ${String(orderId).startsWith('#') ? orderId : `#${orderId}`}.`,
          createdAt: order.updatedAt || createdAt,
        })
      }

      if (paymentStatus.toLowerCase() === 'refunded') {
        list.push({
          id: `payment-refunded-${orderId}`,
          type: 'payment',
          title: 'Payment Refunded',
          message: `Payment for order ${String(orderId).startsWith('#') ? orderId : `#${orderId}`} has been refunded.`,
          createdAt: order.updatedAt || createdAt,
        })
      }

      if (paymentStatus.toLowerCase() === 'partially refunded') {
        list.push({
          id: `payment-partial-${orderId}`,
          type: 'payment',
          title: 'Payment Partially Refunded',
          message: `Order ${String(orderId).startsWith('#') ? orderId : `#${orderId}`} has a partial refund.`,
          createdAt: order.updatedAt || createdAt,
        })
      }
    })

    /* ---------------- INVENTORY ---------------- */

    products.forEach((product, index) => {
      const productId = getProductId(product, index)
      const stock = Number(product.stock || 0)

      const threshold =
        product.lowStockThreshold === '' ||
        product.lowStockThreshold === null ||
        product.lowStockThreshold === undefined
          ? 10
          : Number(product.lowStockThreshold)

      if (stock <= 0) {
        list.push({
          id: `stock-out-${productId}`,
          type: 'inventory',
          title: 'Product Out of Stock',
          message: `${product.name || 'Product'} is currently out of stock.`,
          createdAt: product.updatedAt || product.createdAt || null,
        })
      } else if (stock <= threshold) {
        list.push({
          id: `stock-low-${productId}`,
          type: 'inventory',
          title: 'Low Stock Alert',
          message: `${product.name || 'Product'} has only ${stock} unit${stock === 1 ? '' : 's'} remaining.`,
          createdAt: product.updatedAt || product.createdAt || null,
        })
      }
    })

    /* ---------------- CUSTOMERS ---------------- */

    users.forEach((user, index) => {
      const userId = getUserId(user, index)

      list.push({
        id: `customer-${userId}`,
        type: 'customer',
        title: 'Customer Registered',
        message: `${getUserName(user)} registered as a customer.`,
        createdAt: getUserDate(user),
      })
    })

    return list.sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0

      return bTime - aTime
    })
  }, [orders, products, users])

  /* =====================================================
     STATE
  ===================================================== */

  const saveState = (nextReadIds, nextDeletedIds) => {
    localStorage.setItem(
      STATE_KEY,
      JSON.stringify({
        readIds: nextReadIds,
        deletedIds: nextDeletedIds,
      })
    )
  }

  const visibleNotifications = useMemo(() => {
    return generatedNotifications
      .filter((notification) => !deletedIds.includes(notification.id))
      .map((notification) => ({
        ...notification,
        read: readIds.includes(notification.id),
      }))
  }, [generatedNotifications, readIds, deletedIds])

  const filteredNotifications = useMemo(() => {
    return visibleNotifications.filter((notification) => {
      const matchesRead =
        filter === 'all' ||
        (filter === 'unread' && !notification.read) ||
        (filter === 'read' && notification.read)

      const matchesType =
        typeFilter === 'all' || notification.type === typeFilter

      return matchesRead && matchesType
    })
  }, [visibleNotifications, filter, typeFilter])

  /* =====================================================
     STATS
  ===================================================== */

  const totalNotifications = visibleNotifications.length

  const unreadNotifications = visibleNotifications.filter(
    (notification) => !notification.read
  ).length

  const readNotifications = visibleNotifications.filter(
    (notification) => notification.read
  ).length

  /* =====================================================
     ACTIONS
  ===================================================== */

  const markAsRead = (id) => {
    if (readIds.includes(id)) return

    const nextReadIds = [...readIds, id]

    setReadIds(nextReadIds)
    saveState(nextReadIds, deletedIds)
  }

  const markAsUnread = (id) => {
    const nextReadIds = readIds.filter((item) => item !== id)

    setReadIds(nextReadIds)
    saveState(nextReadIds, deletedIds)
  }

  const markAllAsRead = () => {
    const allIds = visibleNotifications.map(
      (notification) => notification.id
    )

    const nextReadIds = [...new Set([...readIds, ...allIds])]

    setReadIds(nextReadIds)
    saveState(nextReadIds, deletedIds)
  }

  const deleteNotification = (id) => {
    const nextDeletedIds = [...new Set([...deletedIds, id])]

    setDeletedIds(nextDeletedIds)
    saveState(readIds, nextDeletedIds)
  }

  const clearAll = () => {
    if (visibleNotifications.length === 0) return

    const confirmed = window.confirm(
      'Clear all current notifications?'
    )

    if (!confirmed) return

    const allIds = visibleNotifications.map(
      (notification) => notification.id
    )

    const nextDeletedIds = [...new Set([...deletedIds, ...allIds])]

    setDeletedIds(nextDeletedIds)
    saveState(readIds, nextDeletedIds)
  }

  const getIcon = (type) => {
    if (type === 'order') return '□'
    if (type === 'payment') return '₹'
    if (type === 'inventory') return '▤'
    if (type === 'customer') return '♙'

    return '○'
  }

  return (
    <div className="admin-notifications-page">

      {/* HEADER */}

      <div className="admin-notifications-header">
        <div>
          <p className="admin-page-eyebrow">
            STORE ACTIVITY
          </p>

          <h1>Notifications</h1>

          <p className="admin-page-description">
            Monitor orders, payments, inventory and customer activity.
          </p>
        </div>

        <div className="admin-notifications-header-actions">
          <button
            type="button"
            className="admin-notification-secondary-btn"
            onClick={clearAll}
            disabled={totalNotifications === 0}
          >
            Clear All
          </button>

          <button
            type="button"
            className="admin-notification-primary-btn"
            onClick={markAllAsRead}
            disabled={unreadNotifications === 0}
          >
            ✓ Mark All as Read
          </button>
        </div>
      </div>

      {/* STATS */}

      <div className="admin-notification-stats">

        <div className="admin-notification-stat-card">
          <div className="admin-notification-stat-icon">
            ○
          </div>

          <div>
            <span>Total Notifications</span>
            <strong>{totalNotifications}</strong>
            <small>Current alerts</small>
          </div>
        </div>

        <div className="admin-notification-stat-card">
          <div className="admin-notification-stat-icon">
            !
          </div>

          <div>
            <span>Unread</span>
            <strong>{unreadNotifications}</strong>
            <small>Require attention</small>
          </div>
        </div>

        <div className="admin-notification-stat-card">
          <div className="admin-notification-stat-icon">
            ✓
          </div>

          <div>
            <span>Read</span>
            <strong>{readNotifications}</strong>
            <small>Reviewed notifications</small>
          </div>
        </div>

      </div>

      {/* PANEL */}

      <section className="admin-notifications-panel">

        <div className="admin-notifications-panel-heading">
          <div>
            <h2>All Notifications</h2>

            <p>
              Recent system and store activity.
            </p>
          </div>

          {unreadNotifications > 0 && (
            <span className="admin-notification-unread-count">
              {unreadNotifications} Unread
            </span>
          )}
        </div>

        {/* FILTERS */}

        <div className="admin-notifications-toolbar">

          <div className="admin-notification-tabs">

            <button
              type="button"
              className={filter === 'all' ? 'active' : ''}
              onClick={() => setFilter('all')}
            >
              All
            </button>

            <button
              type="button"
              className={filter === 'unread' ? 'active' : ''}
              onClick={() => setFilter('unread')}
            >
              Unread
            </button>

            <button
              type="button"
              className={filter === 'read' ? 'active' : ''}
              onClick={() => setFilter('read')}
            >
              Read
            </button>

          </div>

          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value)}
          >
            <option value="all">
              All Types
            </option>

            <option value="order">
              Orders
            </option>

            <option value="payment">
              Payments
            </option>

            <option value="inventory">
              Inventory
            </option>

            <option value="customer">
              Customers
            </option>
          </select>

        </div>

        {/* LIST */}

        <div className="admin-notifications-list">

          {filteredNotifications.length > 0 ? (
            filteredNotifications.map((notification) => (

              <div
                key={notification.id}
                className={`admin-notification-item ${
                  notification.read ? 'read' : 'unread'
                }`}
              >

                <div
                  className={`admin-notification-type-icon ${notification.type}`}
                >
                  {getIcon(notification.type)}
                </div>

                <div className="admin-notification-content">

                  <div className="admin-notification-title-row">

                    <div>
                      <h3>
                        {notification.title}
                      </h3>

                      {!notification.read && (
                        <span className="admin-notification-new">
                          New
                        </span>
                      )}
                    </div>

                    <span className="admin-notification-time">
                      {formatDateTime(notification.createdAt)}
                    </span>

                  </div>

                  <p>
                    {notification.message}
                  </p>

                  <div className="admin-notification-meta">
                    <span>
                      {notification.type}
                    </span>
                  </div>

                </div>

                <div className="admin-notification-actions">

                  {notification.read ? (
                    <button
                      type="button"
                      onClick={() => markAsUnread(notification.id)}
                    >
                      Mark Unread
                    </button>
                  ) : (
                    <button
                      type="button"
                      className="read-action"
                      onClick={() => markAsRead(notification.id)}
                    >
                      Mark Read
                    </button>
                  )}

                  <button
                    type="button"
                    className="delete-action"
                    onClick={() =>
                      deleteNotification(notification.id)
                    }
                  >
                    Delete
                  </button>

                </div>

              </div>

            ))
          ) : (
            <div className="admin-notifications-empty">

              <div>○</div>

              <h3>No notifications</h3>

              <p>
                {visibleNotifications.length === 0
                  ? 'There are no current store notifications.'
                  : 'No notifications match the selected filters.'}
              </p>

            </div>
          )}

        </div>

      </section>

    </div>
  )
}

export default Notifications