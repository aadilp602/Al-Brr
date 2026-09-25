import { useMemo, useState } from 'react'

const ORDERS_KEY = 'al-brr-orders'

const PAYMENT_STATUSES = [
  'Pending',
  'Paid',
  'Failed',
  'Refunded',
  'Partially Refunded',
]

function loadOrders() {
  try {
    const data = JSON.parse(
      localStorage.getItem(ORDERS_KEY) || '[]'
    )

    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function getOrderId(order) {
  return order.orderId || order.id || order._id || '—'
}

function getTransactionId(order) {
  return (
    order.transactionId ||
    order.payment?.transactionId ||
    order.paymentId ||
    `TXN-${String(getOrderId(order)).replace('#', '')}`
  )
}

function getCustomerName(order) {
  return (
    order.customer?.name ||
    order.customerName ||
    order.shippingAddress?.name ||
    order.shipping?.name ||
    order.user?.name ||
    order.name ||
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

function getPaymentStatus(order) {
  return (
    order.paymentStatus ||
    order.payment?.status ||
    'Pending'
  )
}

function getPaymentMethod(order) {
  return (
    order.paymentMethod ||
    order.payment?.method ||
    order.paymentMode ||
    'COD'
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

  const items =
    order.items ||
    order.cartItems ||
    order.products ||
    []

  if (!Array.isArray(items)) return 0

  return items.reduce((total, item) => {
    const price =
      Number(item.price ?? item.product?.price ?? 0) || 0

    const quantity =
      Number(item.quantity ?? item.qty ?? 1) || 1

    return total + price * quantity
  }, 0)
}

function getPaymentDate(order) {
  return (
    order.payment?.paidAt ||
    order.paidAt ||
    order.updatedAt ||
    order.createdAt ||
    order.orderDate ||
    order.date ||
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

function Payments() {
  const [orders, setOrders] = useState(loadOrders)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState('all')
  const [methodFilter, setMethodFilter] =
    useState('all')

  const [selectedPayment, setSelectedPayment] =
    useState(null)

  /* =====================================================
     SAVE
  ===================================================== */

  const saveOrders = (updatedOrders) => {
    setOrders(updatedOrders)

    localStorage.setItem(
      ORDERS_KEY,
      JSON.stringify(updatedOrders)
    )
  }

  /* =====================================================
     STATS
  ===================================================== */

  const totalPayments = orders.length

  const paidAmount = orders
    .filter(
      (order) =>
        getPaymentStatus(order).toLowerCase() === 'paid'
    )
    .reduce(
      (total, order) =>
        total + getOrderAmount(order),
      0
    )

  const pendingAmount = orders
    .filter(
      (order) =>
        getPaymentStatus(order).toLowerCase() ===
        'pending'
    )
    .reduce(
      (total, order) =>
        total + getOrderAmount(order),
      0
    )

  const refundedAmount = orders
    .filter((order) => {
      const status =
        getPaymentStatus(order).toLowerCase()

      return (
        status === 'refunded' ||
        status === 'partially refunded'
      )
    })
    .reduce(
      (total, order) =>
        total + getOrderAmount(order),
      0
    )

  /* =====================================================
     PAYMENT METHODS
  ===================================================== */

  const paymentMethods = useMemo(() => {
    return [
      ...new Set(
        orders
          .map(getPaymentMethod)
          .filter(Boolean)
      ),
    ]
  }, [orders])

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredPayments = useMemo(() => {
    const query = search.trim().toLowerCase()

    return orders.filter((order) => {
      const transaction = String(
        getTransactionId(order)
      ).toLowerCase()

      const orderId = String(
        getOrderId(order)
      ).toLowerCase()

      const customer = getCustomerName(order)
        .toLowerCase()

      const email = getCustomerEmail(order)
        .toLowerCase()

      const status = getPaymentStatus(order)
        .toLowerCase()

      const method = getPaymentMethod(order)
        .toLowerCase()

      const matchesSearch =
        !query ||
        transaction.includes(query) ||
        orderId.includes(query) ||
        customer.includes(query) ||
        email.includes(query)

      const matchesStatus =
        statusFilter === 'all' ||
        status === statusFilter.toLowerCase()

      const matchesMethod =
        methodFilter === 'all' ||
        method === methodFilter.toLowerCase()

      return (
        matchesSearch &&
        matchesStatus &&
        matchesMethod
      )
    })
  }, [
    orders,
    search,
    statusFilter,
    methodFilter,
  ])

  /* =====================================================
     UPDATE PAYMENT STATUS
  ===================================================== */

  const updatePaymentStatus = (
    orderId,
    newStatus
  ) => {
    const now = new Date().toISOString()

    const updatedOrders = orders.map((order) => {
      if (
        String(getOrderId(order)) !==
        String(orderId)
      ) {
        return order
      }

      return {
        ...order,

        paymentStatus: newStatus,

        payment: {
          ...(order.payment || {}),
          status: newStatus,
          ...(newStatus === 'Paid'
            ? { paidAt: now }
            : {}),
        },

        updatedAt: now,
      }
    })

    saveOrders(updatedOrders)

    if (
      selectedPayment &&
      String(getOrderId(selectedPayment)) ===
        String(orderId)
    ) {
      const updatedSelected =
        updatedOrders.find(
          (order) =>
            String(getOrderId(order)) ===
            String(orderId)
        )

      setSelectedPayment(
        updatedSelected || null
      )
    }
  }

  return (
    <div className="admin-payments-page">

      {/* HEADER */}

      <div className="admin-payments-header">
        <div>
          <p className="admin-page-eyebrow">
            PAYMENT MANAGEMENT
          </p>

          <h1>Payments</h1>

          <p className="admin-page-description">
            Monitor customer transactions and manage
            payment statuses.
          </p>
        </div>
      </div>

      {/* STATS */}

      <div className="admin-payment-stats">

        <div className="admin-payment-stat-card">
          <div className="admin-payment-stat-icon">
            ₹
          </div>

          <div>
            <span>Total Payments</span>
            <strong>{totalPayments}</strong>
            <small>Order transactions</small>
          </div>
        </div>

        <div className="admin-payment-stat-card">
          <div className="admin-payment-stat-icon">
            ✓
          </div>

          <div>
            <span>Paid</span>
            <strong>
              {formatCurrency(paidAmount)}
            </strong>
            <small>Successfully collected</small>
          </div>
        </div>

        <div className="admin-payment-stat-card">
          <div className="admin-payment-stat-icon">
            ◷
          </div>

          <div>
            <span>Pending</span>
            <strong>
              {formatCurrency(pendingAmount)}
            </strong>
            <small>Awaiting payment</small>
          </div>
        </div>

        <div className="admin-payment-stat-card">
          <div className="admin-payment-stat-icon">
            ↶
          </div>

          <div>
            <span>Refunded</span>
            <strong>
              {formatCurrency(refundedAmount)}
            </strong>
            <small>Refunded transactions</small>
          </div>
        </div>

      </div>

      {/* PAYMENTS PANEL */}

      <section className="admin-payments-panel">

        <div className="admin-payments-panel-heading">
          <div>
            <h2>Payment Transactions</h2>

            <p>
              View payment information linked to
              customer orders.
            </p>
          </div>
        </div>

        {/* TOOLBAR */}

        <div className="admin-payments-toolbar">

          <div className="admin-payments-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search transaction, order or customer..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <div className="admin-payments-filters">

            <select
              value={statusFilter}
              onChange={(e) =>
                setStatusFilter(e.target.value)
              }
            >
              <option value="all">
                All Status
              </option>

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

            <select
              value={methodFilter}
              onChange={(e) =>
                setMethodFilter(e.target.value)
              }
            >
              <option value="all">
                All Methods
              </option>

              {paymentMethods.map(
                (method) => (
                  <option
                    key={method}
                    value={method}
                  >
                    {method}
                  </option>
                )
              )}
            </select>

          </div>

        </div>

        {/* TABLE */}

        <div className="admin-payments-table-wrap">

          <table className="admin-payments-table">

            <thead>
              <tr>
                <th>Transaction ID</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Status</th>
                <th className="admin-table-action">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredPayments.length > 0 ? (
                filteredPayments.map(
                  (order, index) => {
                    const status =
                      getPaymentStatus(order)

                    return (
                      <tr
                        key={`${getOrderId(
                          order
                        )}-${index}`}
                      >

                        <td>
                          <span className="admin-transaction-id">
                            {getTransactionId(
                              order
                            )}
                          </span>
                        </td>

                        <td>
                          <span className="admin-payment-order-id">
                            {String(
                              getOrderId(order)
                            ).startsWith('#')
                              ? getOrderId(
                                  order
                                )
                              : `#${getOrderId(
                                  order
                                )}`}
                          </span>
                        </td>

                        <td>
                          <div className="admin-payment-customer">

                            <div className="admin-payment-customer-avatar">
                              {getCustomerName(
                                order
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {getCustomerName(
                                  order
                                )}
                              </strong>

                              <span>
                                {getCustomerEmail(
                                  order
                                ) || 'No email'}
                              </span>
                            </div>

                          </div>
                        </td>

                        <td>
                          <span className="admin-payment-date">
                            {formatDate(
                              getPaymentDate(
                                order
                              )
                            )}
                          </span>
                        </td>

                        <td>
                          <strong className="admin-payment-amount">
                            {formatCurrency(
                              getOrderAmount(
                                order
                              )
                            )}
                          </strong>
                        </td>

                        <td>
                          <span className="admin-payment-method">
                            {getPaymentMethod(
                              order
                            )}
                          </span>
                        </td>

                        <td>
                          <span
                            className={`admin-payment-transaction-status ${normalizeClass(
                              status
                            )}`}
                          >
                            <i />
                            {status}
                          </span>
                        </td>

                        <td>
                          <button
                            type="button"
                            className="admin-payment-view-btn"
                            onClick={() =>
                              setSelectedPayment(
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
                    className="admin-payments-empty"
                  >
                    {orders.length === 0
                      ? 'No payment transactions yet.'
                      : 'No transactions match your filters.'}
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        <div className="admin-payments-footer">
          Showing{' '}
          <strong>
            {filteredPayments.length}
          </strong>{' '}
          of{' '}
          <strong>{orders.length}</strong>{' '}
          transactions
        </div>

      </section>

      {/* =================================================
          PAYMENT DRAWER
      ================================================= */}

      {selectedPayment && (
        <div
          className="admin-payment-drawer-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedPayment(null)
            }
          }}
        >

          <aside className="admin-payment-drawer">

            <div className="admin-payment-drawer-header">

              <div>
                <p className="admin-page-eyebrow">
                  TRANSACTION DETAILS
                </p>

                <h2>
                  {getTransactionId(
                    selectedPayment
                  )}
                </h2>

                <span>
                  {formatDateTime(
                    getPaymentDate(
                      selectedPayment
                    )
                  )}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedPayment(null)
                }
              >
                ×
              </button>

            </div>

            <div className="admin-payment-drawer-body">

              {/* PAYMENT SUMMARY */}

              <section className="admin-payment-detail-section">

                <div className="admin-payment-detail-title">
                  <span>01</span>
                  <h3>Payment Summary</h3>
                </div>

                <div className="admin-payment-big-amount">
                  <span>Transaction Amount</span>

                  <strong>
                    {formatCurrency(
                      getOrderAmount(
                        selectedPayment
                      )
                    )}
                  </strong>

                  <div
                    className={`admin-payment-transaction-status ${normalizeClass(
                      getPaymentStatus(
                        selectedPayment
                      )
                    )}`}
                  >
                    <i />
                    {getPaymentStatus(
                      selectedPayment
                    )}
                  </div>
                </div>

                <div className="admin-payment-detail-grid">

                  <div>
                    <span>Order ID</span>

                    <strong>
                      {String(
                        getOrderId(
                          selectedPayment
                        )
                      ).startsWith('#')
                        ? getOrderId(
                            selectedPayment
                          )
                        : `#${getOrderId(
                            selectedPayment
                          )}`}
                    </strong>
                  </div>

                  <div>
                    <span>Method</span>

                    <strong>
                      {getPaymentMethod(
                        selectedPayment
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Transaction</span>

                    <strong>
                      {getTransactionId(
                        selectedPayment
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Date</span>

                    <strong>
                      {formatDate(
                        getPaymentDate(
                          selectedPayment
                        )
                      )}
                    </strong>
                  </div>

                </div>

              </section>

              {/* STATUS */}

              <section className="admin-payment-detail-section">

                <div className="admin-payment-detail-title">
                  <span>02</span>
                  <h3>Payment Status</h3>
                </div>

                <div className="admin-payment-status-editor">

                  <label>
                    Update Status
                  </label>

                  <select
                    value={getPaymentStatus(
                      selectedPayment
                    )}
                    onChange={(e) =>
                      updatePaymentStatus(
                        getOrderId(
                          selectedPayment
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

                  <p>
                    Changes are automatically
                    synchronized with the Orders
                    module.
                  </p>

                </div>

              </section>

              {/* CUSTOMER */}

              <section className="admin-payment-detail-section">

                <div className="admin-payment-detail-title">
                  <span>03</span>
                  <h3>Customer</h3>
                </div>

                <div className="admin-payment-customer-card">

                  <div className="admin-payment-profile-avatar">
                    {getCustomerName(
                      selectedPayment
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>
                      {getCustomerName(
                        selectedPayment
                      )}
                    </strong>

                    <span>
                      {getCustomerEmail(
                        selectedPayment
                      ) || 'No email'}
                    </span>

                    <span>
                      {getCustomerPhone(
                        selectedPayment
                      ) || 'No phone'}
                    </span>
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

export default Payments