import { useMemo, useState } from 'react'

const USERS_KEY = 'al-brr-users'
const ORDERS_KEY = 'al-brr-orders'

function loadArray(key) {
  try {
    const data = JSON.parse(localStorage.getItem(key) || '[]')
    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
}

function customerId(customer, index = 0) {
  return (
    customer.id ||
    customer.userId ||
    customer.email ||
    `customer-${index}`
  )
}

function customerName(customer) {
  return (
    customer.name ||
    customer.fullName ||
    `${customer.firstName || ''} ${customer.lastName || ''}`.trim() ||
    'Customer'
  )
}

function customerEmail(customer) {
  return customer.email || ''
}

function customerPhone(customer) {
  return customer.phone || customer.mobile || ''
}

function customerStatus(customer) {
  return customer.status || 'Active'
}

function orderEmail(order) {
  return (
    order.customer?.email ||
    order.email ||
    order.shippingAddress?.email ||
    order.shipping?.email ||
    order.user?.email ||
    ''
  )
}

function orderCustomerId(order) {
  return (
    order.customer?.id ||
    order.customerId ||
    order.userId ||
    order.user?.id ||
    ''
  )
}

function orderAmount(order) {
  const value =
    order.total ??
    order.totalAmount ??
    order.grandTotal ??
    order.amount ??
    order.orderTotal

  if (value !== undefined && value !== null && value !== '') {
    return Number(value) || 0
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

function orderDate(order) {
  return (
    order.createdAt ||
    order.orderDate ||
    order.date ||
    order.created_at ||
    null
  )
}

function orderId(order) {
  return order.orderId || order.id || order._id || '—'
}

function orderStatus(order) {
  return order.status || 'Pending'
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
    return '—'
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function isNewCustomer(customer) {
  const value =
    customer.createdAt ||
    customer.registeredAt ||
    customer.date

  if (!value) return false

  const created = new Date(value)

  if (Number.isNaN(created.getTime())) {
    return false
  }

  const thirtyDays =
    30 * 24 * 60 * 60 * 1000

  return Date.now() - created.getTime() <= thirtyDays
}

function Customers() {
  const [customers, setCustomers] = useState(() =>
    loadArray(USERS_KEY)
  )

  const [orders] = useState(() =>
    loadArray(ORDERS_KEY)
  )

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState('all')

  const [selectedCustomer, setSelectedCustomer] =
    useState(null)

  const [editingCustomer, setEditingCustomer] =
    useState(null)

  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    status: 'Active',
  })

  const [error, setError] = useState('')

  /* =====================================================
     CUSTOMER ORDERS
  ===================================================== */

  const getCustomerOrders = (customer) => {
    const email = customerEmail(customer)
      .trim()
      .toLowerCase()

    const id = String(
      customer.id || customer.userId || ''
    )

    return orders.filter((order) => {
      const oEmail = orderEmail(order)
        .trim()
        .toLowerCase()

      const oId = String(orderCustomerId(order))

      return (
        (email && oEmail === email) ||
        (id && oId === id)
      )
    })
  }

  const getTotalSpent = (customer) =>
    getCustomerOrders(customer).reduce(
      (total, order) => total + orderAmount(order),
      0
    )

  /* =====================================================
     STATS
  ===================================================== */

  const totalCustomers = customers.length

  const newCustomers = customers.filter(
    isNewCustomer
  ).length

  const activeCustomers = customers.filter(
    (customer) =>
      customerStatus(customer).toLowerCase() ===
      'active'
  ).length

  const totalRevenue = customers.reduce(
    (total, customer) =>
      total + getTotalSpent(customer),
    0
  )

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredCustomers = useMemo(() => {
    const query = search.trim().toLowerCase()

    return customers.filter((customer) => {
      const matchesSearch =
        !query ||
        customerName(customer)
          .toLowerCase()
          .includes(query) ||
        customerEmail(customer)
          .toLowerCase()
          .includes(query) ||
        customerPhone(customer)
          .toLowerCase()
          .includes(query)

      const matchesStatus =
        statusFilter === 'all' ||
        customerStatus(customer).toLowerCase() ===
          statusFilter

      return matchesSearch && matchesStatus
    })
  }, [customers, search, statusFilter])

  /* =====================================================
     SAVE
  ===================================================== */

  const saveCustomers = (updated) => {
    setCustomers(updated)

    localStorage.setItem(
      USERS_KEY,
      JSON.stringify(updated)
    )
  }

  /* =====================================================
     EDIT
  ===================================================== */

  const openEdit = (customer) => {
    setEditingCustomer(customer)

    setForm({
      name: customerName(customer),
      email: customerEmail(customer),
      phone: customerPhone(customer),
      status: customerStatus(customer),
    })

    setError('')
  }

  const closeEdit = () => {
    setEditingCustomer(null)
    setError('')
  }

  const handleUpdate = (e) => {
    e.preventDefault()

    const name = form.name.trim()
    const email = form.email.trim().toLowerCase()

    if (!name) {
      setError('Customer name is required.')
      return
    }

    if (!email) {
      setError('Customer email is required.')
      return
    }

    const duplicate = customers.some(
      (customer) =>
        customer !== editingCustomer &&
        customerEmail(customer).toLowerCase() === email
    )

    if (duplicate) {
      setError('Another customer already uses this email.')
      return
    }

    const updated = customers.map((customer) =>
      customer === editingCustomer
        ? {
            ...customer,
            name,
            email,
            phone: form.phone.trim(),
            status: form.status,
            updatedAt: new Date().toISOString(),
          }
        : customer
    )

    saveCustomers(updated)

    if (selectedCustomer === editingCustomer) {
      setSelectedCustomer({
        ...editingCustomer,
        name,
        email,
        phone: form.phone.trim(),
        status: form.status,
      })
    }

    closeEdit()
  }

  /* =====================================================
     STATUS
  ===================================================== */

  const toggleStatus = (customer) => {
    const newStatus =
      customerStatus(customer) === 'Active'
        ? 'Inactive'
        : 'Active'

    const updated = customers.map((item) =>
      item === customer
        ? {
            ...item,
            status: newStatus,
            updatedAt: new Date().toISOString(),
          }
        : item
    )

    saveCustomers(updated)
  }

  /* =====================================================
     DELETE
  ===================================================== */

  const deleteCustomer = (customer) => {
    const count =
      getCustomerOrders(customer).length

    const message =
      count > 0
        ? `${customerName(
            customer
          )} has ${count} order${
            count === 1 ? '' : 's'
          }. Delete this customer account anyway? Order records will remain available.`
        : `Delete customer "${customerName(
            customer
          )}"?`

    if (!window.confirm(message)) return

    const updated = customers.filter(
      (item) => item !== customer
    )

    saveCustomers(updated)

    if (selectedCustomer === customer) {
      setSelectedCustomer(null)
    }
  }

  const selectedOrders = selectedCustomer
    ? getCustomerOrders(selectedCustomer)
    : []

  const selectedSpent = selectedCustomer
    ? getTotalSpent(selectedCustomer)
    : 0

  return (
    <div className="admin-customers-page">

      {/* HEADER */}

      <div className="admin-customers-header">
        <div>
          <p className="admin-page-eyebrow">
            CUSTOMER MANAGEMENT
          </p>

          <h1>Customers</h1>

          <p className="admin-page-description">
            Manage registered customers and review
            their purchasing activity.
          </p>
        </div>
      </div>

      {/* STATS */}

      <div className="admin-customer-stats">

        <div className="admin-customer-stat-card">
          <div className="admin-customer-stat-icon">
            ♙
          </div>

          <div>
            <span>Total Customers</span>
            <strong>{totalCustomers}</strong>
            <small>Registered accounts</small>
          </div>
        </div>

        <div className="admin-customer-stat-card">
          <div className="admin-customer-stat-icon">
            +
          </div>

          <div>
            <span>New Customers</span>
            <strong>{newCustomers}</strong>
            <small>Last 30 days</small>
          </div>
        </div>

        <div className="admin-customer-stat-card">
          <div className="admin-customer-stat-icon">
            ✓
          </div>

          <div>
            <span>Active Customers</span>
            <strong>{activeCustomers}</strong>
            <small>Active accounts</small>
          </div>
        </div>

        <div className="admin-customer-stat-card">
          <div className="admin-customer-stat-icon">
            ₹
          </div>

          <div>
            <span>Total Spent</span>
            <strong>
              {formatCurrency(totalRevenue)}
            </strong>
            <small>Registered customers</small>
          </div>
        </div>

      </div>

      {/* CUSTOMER PANEL */}

      <section className="admin-customers-panel">

        <div className="admin-customers-panel-heading">
          <div>
            <h2>All Customers</h2>

            <p>
              Customer information and order activity.
            </p>
          </div>
        </div>

        {/* TOOLBAR */}

        <div className="admin-customers-toolbar">

          <div className="admin-customers-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search name, email or phone..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <select
            className="admin-customers-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="all">
              All Customers
            </option>

            <option value="active">
              Active
            </option>

            <option value="inactive">
              Inactive
            </option>
          </select>

        </div>

        {/* TABLE */}

        <div className="admin-customers-table-wrap">

          <table className="admin-customers-table">

            <thead>
              <tr>
                <th>Customer</th>
                <th>Contact</th>
                <th>Joined</th>
                <th>Orders</th>
                <th>Total Spent</th>
                <th>Status</th>
                <th className="admin-table-action">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredCustomers.length > 0 ? (
                filteredCustomers.map(
                  (customer, index) => {
                    const customerOrders =
                      getCustomerOrders(customer)

                    return (
                      <tr
                        key={customerId(
                          customer,
                          index
                        )}
                      >

                        <td>
                          <div className="admin-customer-info">

                            <div className="admin-customer-avatar">
                              {customerName(
                                customer
                              )
                                .charAt(0)
                                .toUpperCase()}
                            </div>

                            <div>
                              <strong>
                                {customerName(
                                  customer
                                )}
                              </strong>

                              <span>
                                Customer
                              </span>
                            </div>

                          </div>
                        </td>

                        <td>
                          <div className="admin-customer-contact">
                            <span>
                              {customerEmail(
                                customer
                              ) || 'No email'}
                            </span>

                            <small>
                              {customerPhone(
                                customer
                              ) || 'No phone'}
                            </small>
                          </div>
                        </td>

                        <td>
                          <span className="admin-customer-date">
                            {formatDate(
                              customer.createdAt ||
                                customer.registeredAt
                            )}
                          </span>
                        </td>

                        <td>
                          <span className="admin-customer-orders-count">
                            {
                              customerOrders.length
                            }
                          </span>
                        </td>

                        <td>
                          <strong className="admin-customer-spent">
                            {formatCurrency(
                              getTotalSpent(
                                customer
                              )
                            )}
                          </strong>
                        </td>

                        <td>
                          <button
                            type="button"
                            className={`admin-customer-status ${
                              customerStatus(
                                customer
                              ) === 'Active'
                                ? 'active'
                                : 'inactive'
                            }`}
                            onClick={() =>
                              toggleStatus(
                                customer
                              )
                            }
                          >
                            <i />
                            {customerStatus(
                              customer
                            )}
                          </button>
                        </td>

                        <td>
                          <div className="admin-customer-actions">

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedCustomer(
                                  customer
                                )
                              }
                            >
                              View
                            </button>

                            <button
                              type="button"
                              onClick={() =>
                                openEdit(
                                  customer
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="delete"
                              onClick={() =>
                                deleteCustomer(
                                  customer
                                )
                              }
                            >
                              Delete
                            </button>

                          </div>
                        </td>

                      </tr>
                    )
                  }
                )
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="admin-customers-empty"
                  >
                    {customers.length === 0
                      ? 'No registered customers yet.'
                      : 'No customers match your filters.'}
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        <div className="admin-customers-footer">
          Showing{' '}
          <strong>
            {filteredCustomers.length}
          </strong>{' '}
          of{' '}
          <strong>{customers.length}</strong>{' '}
          customers
        </div>

      </section>

      {/* =================================================
          CUSTOMER DETAILS DRAWER
      ================================================= */}

      {selectedCustomer && (
        <div
          className="admin-customer-drawer-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setSelectedCustomer(null)
            }
          }}
        >

          <aside className="admin-customer-drawer">

            <div className="admin-customer-drawer-header">

              <div>
                <p className="admin-page-eyebrow">
                  CUSTOMER PROFILE
                </p>

                <h2>
                  {customerName(
                    selectedCustomer
                  )}
                </h2>

                <span>
                  {customerEmail(
                    selectedCustomer
                  )}
                </span>
              </div>

              <button
                type="button"
                onClick={() =>
                  setSelectedCustomer(null)
                }
              >
                ×
              </button>

            </div>

            <div className="admin-customer-drawer-body">

              {/* PROFILE */}

              <section className="admin-customer-detail-section">

                <div className="admin-customer-detail-title">
                  <span>01</span>
                  <h3>Customer Details</h3>
                </div>

                <div className="admin-customer-profile-card">

                  <div className="admin-customer-profile-avatar">
                    {customerName(
                      selectedCustomer
                    )
                      .charAt(0)
                      .toUpperCase()}
                  </div>

                  <div>
                    <strong>
                      {customerName(
                        selectedCustomer
                      )}
                    </strong>

                    <span>
                      {customerEmail(
                        selectedCustomer
                      ) || 'No email'}
                    </span>

                    <span>
                      {customerPhone(
                        selectedCustomer
                      ) || 'No phone'}
                    </span>
                  </div>

                </div>

                <div className="admin-customer-profile-grid">

                  <div>
                    <span>Status</span>
                    <strong>
                      {customerStatus(
                        selectedCustomer
                      )}
                    </strong>
                  </div>

                  <div>
                    <span>Joined</span>
                    <strong>
                      {formatDate(
                        selectedCustomer.createdAt ||
                          selectedCustomer.registeredAt
                      )}
                    </strong>
                  </div>

                </div>

              </section>

              {/* STATS */}

              <section className="admin-customer-detail-section">

                <div className="admin-customer-detail-title">
                  <span>02</span>
                  <h3>Activity</h3>
                </div>

                <div className="admin-customer-detail-stats">

                  <div>
                    <span>Total Orders</span>
                    <strong>
                      {selectedOrders.length}
                    </strong>
                  </div>

                  <div>
                    <span>Total Spent</span>
                    <strong>
                      {formatCurrency(
                        selectedSpent
                      )}
                    </strong>
                  </div>

                </div>

              </section>

              {/* ORDER HISTORY */}

              <section className="admin-customer-detail-section">

                <div className="admin-customer-detail-title">
                  <span>03</span>
                  <h3>Order History</h3>
                </div>

                <div className="admin-customer-order-history">

                  {selectedOrders.length > 0 ? (
                    selectedOrders.map(
                      (order, index) => (
                        <div
                          className="admin-customer-order-row"
                          key={`${orderId(
                            order
                          )}-${index}`}
                        >
                          <div>
                            <strong>
                              {String(
                                orderId(order)
                              ).startsWith('#')
                                ? orderId(
                                    order
                                  )
                                : `#${orderId(
                                    order
                                  )}`}
                            </strong>

                            <span>
                              {formatDate(
                                orderDate(
                                  order
                                )
                              )}
                            </span>
                          </div>

                          <div>
                            <span>
                              {orderStatus(
                                order
                              )}
                            </span>

                            <strong>
                              {formatCurrency(
                                orderAmount(
                                  order
                                )
                              )}
                            </strong>
                          </div>
                        </div>
                      )
                    )
                  ) : (
                    <p className="admin-customer-no-orders">
                      No orders from this
                      customer yet.
                    </p>
                  )}

                </div>

              </section>

            </div>

          </aside>

        </div>
      )}

      {/* =================================================
          EDIT MODAL
      ================================================= */}

      {editingCustomer && (
        <div
          className="admin-customer-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeEdit()
            }
          }}
        >

          <div className="admin-customer-modal">

            <div className="admin-customer-modal-header">

              <div>
                <p className="admin-page-eyebrow">
                  CUSTOMER MANAGEMENT
                </p>

                <h2>Edit Customer</h2>
              </div>

              <button
                type="button"
                onClick={closeEdit}
              >
                ×
              </button>

            </div>

            <form onSubmit={handleUpdate}>

              <div className="admin-customer-form-field">
                <label>
                  Name <strong>*</strong>
                </label>

                <input
                  value={form.name}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      name: e.target.value,
                    })
                    setError('')
                  }}
                />
              </div>

              <div className="admin-customer-form-field">
                <label>
                  Email <strong>*</strong>
                </label>

                <input
                  type="email"
                  value={form.email}
                  onChange={(e) => {
                    setForm({
                      ...form,
                      email: e.target.value,
                    })
                    setError('')
                  }}
                />
              </div>

              <div className="admin-customer-form-field">
                <label>Phone</label>

                <input
                  value={form.phone}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      phone: e.target.value,
                    })
                  }
                />
              </div>

              <div className="admin-customer-form-field">
                <label>Status</label>

                <select
                  value={form.status}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      status: e.target.value,
                    })
                  }
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>
              </div>

              {error && (
                <div className="admin-customer-form-error">
                  {error}
                </div>
              )}

              <div className="admin-customer-modal-actions">

                <button
                  type="button"
                  className="cancel"
                  onClick={closeEdit}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save"
                >
                  Update Customer
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  )
}

export default Customers