import { useMemo, useState } from 'react'

const ORDERS_STORAGE_KEY = 'al-brr-orders'

const ORDER_STATUSES = [
  'Pending',
  'Confirmed',
  'Processing',
  'Shipped',
  'Delivered',
  'Completed',
  'Cancelled',
  'Returned',
  'Refunded',
]

const PAYMENT_STATUSES = [
  'Pending',
  'Paid',
  'Failed',
  'Refunded',
  'Partially Refunded',
]

/* =========================================================
   HELPERS
========================================================= */

function loadOrders() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(ORDERS_STORAGE_KEY) || '[]'
    )

    return Array.isArray(saved) ? saved : []
  } catch (error) {
    console.error('Unable to load orders:', error)
    return []
  }
}

function getOrderId(order) {
  return (
    order.orderId ||
    order.id ||
    order._id ||
    '—'
  )
}

function getCustomerName(order) {
  return (
    order.customer?.name ||
    order.customerName ||
    order.shippingAddress?.name ||
    order.shipping?.name ||
    order.name ||
    order.user?.name ||
    'Guest Customer'
  )
}

function getCustomerEmail(order) {
  return (
    order.customer?.email ||
    order.email ||
    order.shippingAddress?.email ||
    order.shipping?.email ||
    order.user?.email ||
    ''
  )
}

function getCustomerPhone(order) {
  return (
    order.customer?.phone ||
    order.phone ||
    order.shippingAddress?.phone ||
    order.shipping?.phone ||
    ''
  )
}

function getAddress(order) {
  const address =
    order.shippingAddress ||
    order.shipping ||
    order.address ||
    {}

  if (typeof address === 'string') {
    return address
  }

  const parts = [
    address.address,
    address.addressLine1,
    address.addressLine2,
    address.street,
    address.city,
    address.state,
    address.pincode,
    address.postalCode,
    address.country,
  ].filter(Boolean)

  return parts.join(', ') || 'No address available'
}

function getOrderItems(order) {
  const items =
    order.items ||
    order.cartItems ||
    order.products ||
    []

  return Array.isArray(items) ? items : []
}

function getItemQuantity(item) {
  return Number(
    item.quantity ??
    item.qty ??
    1
  ) || 1
}

function getItemPrice(item) {
  return Number(
    item.price ??
    item.product?.price ??
    0
  ) || 0
}

function getItemName(item) {
  return (
    item.name ||
    item.productName ||
    item.product?.name ||
    'Product'
  )
}

function getOrderAmount(order) {
  const directAmount =
    order.total ??
    order.totalAmount ??
    order.grandTotal ??
    order.amount ??
    order.orderTotal

  if (
    directAmount !== undefined &&
    directAmount !== null &&
    directAmount !== ''
  ) {
    return Number(directAmount) || 0
  }

  return getOrderItems(order).reduce(
    (total, item) =>
      total +
      getItemPrice(item) *
        getItemQuantity(item),
    0
  )
}

function getOrderStatus(order) {
  return order.status || 'Pending'
}

function getPaymentStatus(order) {
  return (
    order.paymentStatus ||
    order.payment?.status ||
    (order.paymentMethod === 'COD'
      ? 'Pending'
      : 'Pending')
  )
}

function getPaymentMethod(order) {
  return (
    order.paymentMethod ||
    order.payment?.method ||
    order.paymentMode ||
    '—'
  )
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

function formatCurrency(value) {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(Number(value) || 0)
}

function formatDate(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function formatDateTime(value) {
  if (!value) return '—'

  const date = new Date(value)

  if (Number.isNaN(date.getTime())) {
    return String(value)
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(date)
}

function normalizeClass(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, '-')
}

/* =========================================================
   ORDERS
========================================================= */

function Orders() {
  const [orders, setOrders] = useState(loadOrders)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState('all')

  const [paymentFilter, setPaymentFilter] =
    useState('all')

  const [selectedOrder, setSelectedOrder] =
    useState(null)

  /* =======================================================
     SAVE
  ======================================================= */

  const saveOrders = (updatedOrders) => {
    setOrders(updatedOrders)

    localStorage.setItem(
      ORDERS_STORAGE_KEY,
      JSON.stringify(updatedOrders)
    )
  }

  /* =======================================================
     STATS
  ======================================================= */

  const totalOrders = orders.length

  const pendingOrders = orders.filter(
    (order) =>
      getOrderStatus(order).toLowerCase() ===
      'pending'
  ).length

  const processingOrders = orders.filter(
    (order) =>
      getOrderStatus(order).toLowerCase() ===
      'processing'
  ).length

  const deliveredOrders = orders.filter(
    (order) =>
      getOrderStatus(order).toLowerCase() ===
      'delivered'
  ).length

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredOrders = useMemo(() => {
    const searchValue =
      search.trim().toLowerCase()

    return orders.filter((order) => {
      const orderId = String(
        getOrderId(order)
      ).toLowerCase()

      const customer = String(
        getCustomerName(order)
      ).toLowerCase()

      const email = String(
        getCustomerEmail(order)
      ).toLowerCase()

      const phone = String(
        getCustomerPhone(order)
      ).toLowerCase()

      const orderStatus = String(
        getOrderStatus(order)
      ).toLowerCase()

      const paymentStatus = String(
        getPaymentStatus(order)
      ).toLowerCase()

      const matchesSearch =
        !searchValue ||
        orderId.includes(searchValue) ||
        customer.includes(searchValue) ||
        email.includes(searchValue) ||
        phone.includes(searchValue)

      const matchesStatus =
        statusFilter === 'all' ||
        orderStatus ===
          statusFilter.toLowerCase()

      const matchesPayment =
        paymentFilter === 'all' ||
        paymentStatus ===
          paymentFilter.toLowerCase()

      return (
        matchesSearch &&
        matchesStatus &&
        matchesPayment
      )
    })
  }, [
    orders,
    search,
    statusFilter,
    paymentFilter,
  ])

  /* =======================================================
     UPDATE ORDER STATUS
  ======================================================= */

  const updateOrderStatus = (
    orderId,
    newStatus
  ) => {
    const updatedOrders = orders.map(
      (order) =>
        String(getOrderId(order)) ===
        String(orderId)
          ? {
              ...order,
              status: newStatus,
              updatedAt:
                new Date().toISOString(),
            }
          : order
    )

    saveOrders(updatedOrders)

    if (
      selectedOrder &&
      String(getOrderId(selectedOrder)) ===
        String(orderId)
    ) {
      setSelectedOrder((previous) => ({
        ...previous,
        status: newStatus,
        updatedAt:
          new Date().toISOString(),
      }))
    }
  }

  /* =======================================================
     UPDATE PAYMENT
  ======================================================= */

  const updatePaymentStatus = (
    orderId,
    newStatus
  ) => {
    const updatedOrders = orders.map(
      (order) =>
        String(getOrderId(order)) ===
        String(orderId)
          ? {
              ...order,
              paymentStatus: newStatus,
              updatedAt:
                new Date().toISOString(),
            }
          : order
    )

    saveOrders(updatedOrders)

    if (
      selectedOrder &&
      String(getOrderId(selectedOrder)) ===
        String(orderId)
    ) {
      setSelectedOrder((previous) => ({
        ...previous,
        paymentStatus: newStatus,
        updatedAt:
          new Date().toISOString(),
      }))
    }
  }

  /* =======================================================
     SELECTED ORDER DATA
  ======================================================= */

  const selectedItems = selectedOrder
    ? getOrderItems(selectedOrder)
    : []

  return (
    <div className="admin-orders-page">

      {/* ================= HEADER ================= */}

      <div className="admin-orders-header">
        <div>
          <p className="admin-page-eyebrow">
            ORDER MANAGEMENT
          </p>

          <h1>Orders</h1>

          <p className="admin-page-description">
            Track customer orders, payments and
            fulfilment status.
          </p>
        </div>
      </div>

      {/* ================= STATS ================= */}

      <div className="admin-order-stats">

        <div className="admin-order-stat-card">
          <div className="admin-order-stat-icon">
            □
          </div>

          <div>
            <span>Total Orders</span>
            <strong>{totalOrders}</strong>
            <small>All customer orders</small>
          </div>
        </div>

        <div className="admin-order-stat-card">
          <div className="admin-order-stat-icon">
            ◷
          </div>

          <div>
            <span>Pending</span>
            <strong>{pendingOrders}</strong>
            <small>Awaiting confirmation</small>
          </div>
        </div>

        <div className="admin-order-stat-card">
          <div className="admin-order-stat-icon">
            ↻
          </div>

          <div>
            <span>Processing</span>
            <strong>{processingOrders}</strong>
            <small>Being prepared</small>
          </div>
        </div>

        <div className="admin-order-stat-card">
          <div className="admin-order-stat-icon">
            ✓
          </div>

          <div>
            <span>Delivered</span>
            <strong>{deliveredOrders}</strong>
            <small>Successfully delivered</small>
          </div>
        </div>

      </div>

      {/* =================================================
          ORDERS PANEL
      ================================================= */}

      <section className="admin-orders-panel">

        <div className="admin-orders-panel-heading">
          <div>
            <h2>All Orders</h2>

            <p>
              View and manage customer orders.
            </p>
          </div>
        </div>

        {/* ================= TOOLBAR ================= */}

        <div className="admin-orders-toolbar">

          <div className="admin-orders-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search order, customer, email or phone..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="admin-orders-filters">

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="all">
                All Status
              </option>

              {ORDER_STATUSES.map(
                (status) => (
                  <option
                    value={status}
                    key={status}
                  >
                    {status}
                  </option>
                )
              )}
            </select>

            <select
              value={paymentFilter}
              onChange={(e) =>
                setPaymentFilter(
                  e.target.value
                )
              }
            >
              <option value="all">
                All Payments
              </option>

              {PAYMENT_STATUSES.map(
                (status) => (
                  <option
                    value={status}
                    key={status}
                  >
                    {status}
                  </option>
                )
              )}
            </select>

          </div>

        </div>

        {/* ================= TABLE ================= */}

        <div className="admin-orders-table-wrap">

          <table className="admin-orders-table">

            <thead>
              <tr>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Items</th>
                <th>Amount</th>
                <th>Payment</th>
                <th>Status</th>
                <th className="admin-table-action">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredOrders.length > 0 ? (
                filteredOrders.map(
                  (order, index) => {
                    const orderId =
                      getOrderId(order)

                    const customerName =
                      getCustomerName(order)

                    const customerEmail =
                      getCustomerEmail(order)

                    const status =
                      getOrderStatus(order)

                    const payment =
                      getPaymentStatus(order)

                    const items =
                      getOrderItems(order)

                    return (
                      <tr
                        key={`${orderId}-${index}`}
                      >

                        {/* ORDER ID */}

                        <td>
                          <button
                            type="button"
                            className="admin-order-id"
                            onClick={() =>
                              setSelectedOrder(
                                order
                              )
                            }
                          >
                            {String(orderId)
                              .startsWith('#')
                              ? orderId
                              : `#${orderId}`}
                          </button>
                        </td>

                        {/* CUSTOMER */}

                        <td>
                          <div className="admin-order-customer">

                            <div className="admin-order-customer-avatar">
                              {customerName
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {customerName}
                              </strong>

                              <span>
                                {customerEmail ||
                                  'No email'}
                              </span>
                            </div>

                          </div>
                        </td>

                        {/* DATE */}

                        <td>
                          <span className="admin-order-date">
                            {formatDate(
                              getOrderDate(
                                order
                              )
                            )}
                          </span>
                        </td>

                        {/* ITEMS */}

                        <td>
                          <span className="admin-order-items-count">
                            {items.reduce(
                              (
                                total,
                                item
                              ) =>
                                total +
                                getItemQuantity(
                                  item
                                ),
                              0
                            )}
                          </span>
                        </td>

                        {/* AMOUNT */}

                        <td>
                          <strong className="admin-order-amount">
                            {formatCurrency(
                              getOrderAmount(
                                order
                              )
                            )}
                          </strong>
                        </td>

                        {/* PAYMENT */}

                        <td>
                          <span
                            className={`admin-payment-status ${normalizeClass(
                              payment
                            )}`}
                          >
                            <i />
                            {payment}
                          </span>
                        </td>

                        {/* STATUS */}

                        <td>
                          <span
                            className={`admin-order-status ${normalizeClass(
                              status
                            )}`}
                          >
                            <i />
                            {status}
                          </span>
                        </td>

                        {/* ACTION */}

                        <td>
                          <button
                            type="button"
                            className="admin-view-order-btn"
                            onClick={() =>
                              setSelectedOrder(
                                order
                              )
                            }
                          >
                            View
                          </button>
                        </td>

                      </tr>
                    )
                  }
                )
              ) : (
                <tr>
                  <td
                    colSpan="8"
                    className="admin-orders-empty"
                  >
                    {orders.length === 0
                      ? 'No customer orders yet.'
                      : 'No orders match your filters.'}
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        <div className="admin-orders-footer">
          Showing{' '}
          <strong>
            {filteredOrders.length}
          </strong>{' '}
          of{' '}
          <strong>{orders.length}</strong>{' '}
          orders
        </div>

      </section>

      {/* =================================================
          ORDER DETAILS DRAWER
      ================================================= */}

      {selectedOrder && (
        <div
          className="admin-order-drawer-overlay"
          onMouseDown={(e) => {
            if (
              e.target === e.currentTarget
            ) {
              setSelectedOrder(null)
            }
          }}
        >

          <aside className="admin-order-drawer">

            {/* HEADER */}

            <div className="admin-order-drawer-header">

              <div>
                <p className="admin-page-eyebrow">
                  ORDER DETAILS
                </p>

                <h2>
                  {String(
                    getOrderId(
                      selectedOrder
                    )
                  ).startsWith('#')
                    ? getOrderId(
                        selectedOrder
                      )
                    : `#${getOrderId(
                        selectedOrder
                      )}`}
                </h2>

                <span>
                  {formatDateTime(
                    getOrderDate(
                      selectedOrder
                    )
                  )}
                </span>
              </div>

              <button
                type="button"
                className="admin-order-drawer-close"
                onClick={() =>
                  setSelectedOrder(null)
                }
              >
                ×
              </button>

            </div>

            <div className="admin-order-drawer-body">

              {/* ================= STATUS ================= */}

              <section className="admin-order-detail-section">

                <div className="admin-order-detail-title">
                  <span>01</span>
                  <h3>Order Status</h3>
                </div>

                <div className="admin-order-status-controls">

                  <div>
                    <label>
                      Order Status
                    </label>

                    <select
                      value={getOrderStatus(
                        selectedOrder
                      )}
                      onChange={(e) =>
                        updateOrderStatus(
                          getOrderId(
                            selectedOrder
                          ),
                          e.target.value
                        )
                      }
                    >
                      {ORDER_STATUSES.map(
                        (status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  <div>
                    <label>
                      Payment Status
                    </label>

                    <select
                      value={getPaymentStatus(
                        selectedOrder
                      )}
                      onChange={(e) =>
                        updatePaymentStatus(
                          getOrderId(
                            selectedOrder
                          ),
                          e.target.value
                        )
                      }
                    >
                      {PAYMENT_STATUSES.map(
                        (status) => (
                          <option
                            key={status}
                            value={status}
                          >
                            {status}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                </div>

              </section>

              {/* ================= CUSTOMER ================= */}

              <section className="admin-order-detail-section">

                <div className="admin-order-detail-title">
                  <span>02</span>
                  <h3>Customer</h3>
                </div>

                <div className="admin-order-customer-card">

                  <div className="admin-order-detail-avatar">
                    {getCustomerName(
                      selectedOrder
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>
                      {getCustomerName(
                        selectedOrder
                      )}
                    </strong>

                    <span>
                      {getCustomerEmail(
                        selectedOrder
                      ) || 'No email'}
                    </span>

                    <span>
                      {getCustomerPhone(
                        selectedOrder
                      ) || 'No phone'}
                    </span>
                  </div>

                </div>

                <div className="admin-order-address">
                  <span>
                    Shipping Address
                  </span>

                  <p>
                    {getAddress(
                      selectedOrder
                    )}
                  </p>
                </div>

              </section>

              {/* ================= ITEMS ================= */}

              <section className="admin-order-detail-section">

                <div className="admin-order-detail-title">
                  <span>03</span>
                  <h3>Order Items</h3>
                </div>

                <div className="admin-order-detail-items">

                  {selectedItems.length >
                  0 ? (
                    selectedItems.map(
                      (item, index) => (
                        <div
                          className="admin-order-detail-item"
                          key={
                            item.id ||
                            item.productId ||
                            index
                          }
                        >

                          <div className="admin-order-detail-item-image">

                            {item.image ||
                            item.product
                              ?.image ? (
                              <img
                                src={
                                  item.image ||
                                  item
                                    .product
                                    ?.image
                                }
                                alt={getItemName(
                                  item
                                )}
                              />
                            ) : (
                              <span>
                                {getItemName(
                                  item
                                )
                                  .charAt(0)
                                  .toUpperCase()}
                              </span>
                            )}

                          </div>

                          <div className="admin-order-detail-item-info">

                            <strong>
                              {getItemName(
                                item
                              )}
                            </strong>

                            <span>
                              Qty:{' '}
                              {getItemQuantity(
                                item
                              )}
                            </span>

                          </div>

                          <strong className="admin-order-detail-item-price">
                            {formatCurrency(
                              getItemPrice(
                                item
                              ) *
                                getItemQuantity(
                                  item
                                )
                            )}
                          </strong>

                        </div>
                      )
                    )
                  ) : (
                    <p className="admin-order-no-items">
                      No item details
                      available.
                    </p>
                  )}

                </div>

              </section>

              {/* ================= PAYMENT ================= */}

              <section className="admin-order-detail-section">

                <div className="admin-order-detail-title">
                  <span>04</span>
                  <h3>Payment Summary</h3>
                </div>

                <div className="admin-order-payment-summary">

                  <div>
                    <span>
                      Payment Method
                    </span>

                    <strong>
                      {getPaymentMethod(
                        selectedOrder
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>
                      Payment Status
                    </span>

                    <strong>
                      {getPaymentStatus(
                        selectedOrder
                      )}
                    </strong>
                  </div>

                  <div className="total">
                    <span>
                      Order Total
                    </span>

                    <strong>
                      {formatCurrency(
                        getOrderAmount(
                          selectedOrder
                        )
                      )}
                    </strong>
                  </div>

                </div>

              </section>

            </div>

          </aside>

        </div>
      )}

    </div>
  )
}

export default Orders