import { useMemo, useState } from 'react'

const ORDERS_KEY = 'al-brr-orders'
const PRODUCTS_KEY = 'al-brr-admin-products'
const USERS_KEY = 'al-brr-users'

function loadArray(key) {
  try {
    const data = JSON.parse(
      localStorage.getItem(key) || '[]'
    )

    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
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

function getOrderAmount(order) {
  const direct =
    order.total ??
    order.totalAmount ??
    order.grandTotal ??
    order.amount ??
    order.orderTotal

  if (
    direct !== undefined &&
    direct !== null &&
    direct !== ''
  ) {
    return Number(direct) || 0
  }

  const items =
    order.items ||
    order.cartItems ||
    order.products ||
    []

  if (!Array.isArray(items)) return 0

  return items.reduce((total, item) => {
    const price = Number(
      item.price ??
        item.product?.price ??
        0
    )

    const quantity = Number(
      item.quantity ??
        item.qty ??
        1
    )

    return total + price * quantity
  }, 0)
}

function getItems(order) {
  const items =
    order.items ||
    order.cartItems ||
    order.products ||
    []

  return Array.isArray(items) ? items : []
}

function getItemName(item) {
  return (
    item.name ||
    item.productName ||
    item.product?.name ||
    'Unknown Product'
  )
}

function getItemQuantity(item) {
  return (
    Number(
      item.quantity ??
        item.qty ??
        1
    ) || 1
  )
}

function getItemPrice(item) {
  return (
    Number(
      item.price ??
        item.product?.price ??
        0
    ) || 0
  )
}

function getOrderStatus(order) {
  return order.status || 'Pending'
}

function getPaymentStatus(order) {
  return (
    order.paymentStatus ||
    order.payment?.status ||
    'Pending'
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

function getOrderId(order) {
  return (
    order.orderId ||
    order.id ||
    order._id ||
    '—'
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

function toInputDate(date) {
  const year = date.getFullYear()
  const month = String(
    date.getMonth() + 1
  ).padStart(2, '0')
  const day = String(
    date.getDate()
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function startOfDay(date) {
  const result = new Date(date)
  result.setHours(0, 0, 0, 0)
  return result
}

function endOfDay(date) {
  const result = new Date(date)
  result.setHours(23, 59, 59, 999)
  return result
}

function getRange(type) {
  const now = new Date()

  if (type === 'daily') {
    return {
      from: toInputDate(now),
      to: toInputDate(now),
    }
  }

  if (type === 'weekly') {
    const start = new Date(now)
    start.setDate(
      now.getDate() - 6
    )

    return {
      from: toInputDate(start),
      to: toInputDate(now),
    }
  }

  if (type === 'monthly') {
    const start = new Date(
      now.getFullYear(),
      now.getMonth(),
      1
    )

    return {
      from: toInputDate(start),
      to: toInputDate(now),
    }
  }

  if (type === 'yearly') {
    const start = new Date(
      now.getFullYear(),
      0,
      1
    )

    return {
      from: toInputDate(start),
      to: toInputDate(now),
    }
  }

  return {
    from: '',
    to: '',
  }
}

function Reports() {
  const [orders] = useState(() =>
    loadArray(ORDERS_KEY)
  )

  const [products] = useState(() =>
    loadArray(PRODUCTS_KEY)
  )

  const [users] = useState(() =>
    loadArray(USERS_KEY)
  )

  const [period, setPeriod] =
    useState('monthly')

  const initialRange =
    getRange('monthly')

  const [fromDate, setFromDate] =
    useState(initialRange.from)

  const [toDate, setToDate] =
    useState(initialRange.to)

  const [appliedFrom, setAppliedFrom] =
    useState(initialRange.from)

  const [appliedTo, setAppliedTo] =
    useState(initialRange.to)

  const [reportType, setReportType] =
    useState('sales')

  /* =====================================================
     DATE RANGE
  ===================================================== */

  const changePeriod = (value) => {
    setPeriod(value)

    if (value === 'custom') {
      return
    }

    const range = getRange(value)

    setFromDate(range.from)
    setToDate(range.to)
    setAppliedFrom(range.from)
    setAppliedTo(range.to)
  }

  const generateReport = () => {
    if (
      fromDate &&
      toDate &&
      new Date(fromDate) >
        new Date(toDate)
    ) {
      window.alert(
        '"From" date cannot be after "To" date.'
      )
      return
    }

    setAppliedFrom(fromDate)
    setAppliedTo(toDate)
  }

  /* =====================================================
     FILTER ORDERS
  ===================================================== */

  const filteredOrders = useMemo(() => {
    return orders.filter((order) => {
      const rawDate =
        getOrderDate(order)

      if (!rawDate) {
        return (
          !appliedFrom &&
          !appliedTo
        )
      }

      const orderDate =
        new Date(rawDate)

      if (
        Number.isNaN(
          orderDate.getTime()
        )
      ) {
        return false
      }

      if (appliedFrom) {
        const from = startOfDay(
          new Date(
            `${appliedFrom}T00:00:00`
          )
        )

        if (orderDate < from) {
          return false
        }
      }

      if (appliedTo) {
        const to = endOfDay(
          new Date(
            `${appliedTo}T00:00:00`
          )
        )

        if (orderDate > to) {
          return false
        }
      }

      return true
    })
  }, [
    orders,
    appliedFrom,
    appliedTo,
  ])

  /* =====================================================
     SUMMARY
  ===================================================== */

  const totalRevenue =
    filteredOrders.reduce(
      (total, order) =>
        total +
        getOrderAmount(order),
      0
    )

  const paidRevenue =
    filteredOrders.reduce(
      (total, order) => {
        return getPaymentStatus(
          order
        ).toLowerCase() === 'paid'
          ? total +
              getOrderAmount(order)
          : total
      },
      0
    )

  const totalOrders =
    filteredOrders.length

  const productsSold =
    filteredOrders.reduce(
      (total, order) => {
        return (
          total +
          getItems(order).reduce(
            (sum, item) =>
              sum +
              getItemQuantity(item),
            0
          )
        )
      },
      0
    )

  const uniqueCustomers =
    new Set(
      filteredOrders
        .map((order) =>
          getCustomerEmail(order)
            .trim()
            .toLowerCase()
        )
        .filter(Boolean)
    ).size

  const averageOrderValue =
    totalOrders > 0
      ? totalRevenue / totalOrders
      : 0

  /* =====================================================
     PRODUCT REPORT
  ===================================================== */

  const productPerformance =
    useMemo(() => {
      const map = {}

      filteredOrders.forEach(
        (order) => {
          getItems(order).forEach(
            (item) => {
              const name =
                getItemName(item)

              const quantity =
                getItemQuantity(item)

              const price =
                getItemPrice(item)

              if (!map[name]) {
                map[name] = {
                  name,
                  quantity: 0,
                  revenue: 0,
                }
              }

              map[name].quantity +=
                quantity

              map[name].revenue +=
                price * quantity
            }
          )
        }
      )

      return Object.values(map).sort(
        (a, b) =>
          b.quantity - a.quantity
      )
    }, [filteredOrders])

  /* =====================================================
     ORDER STATUS REPORT
  ===================================================== */

  const orderStatusReport =
    useMemo(() => {
      const map = {}

      filteredOrders.forEach(
        (order) => {
          const status =
            getOrderStatus(order)

          if (!map[status]) {
            map[status] = {
              status,
              count: 0,
              amount: 0,
            }
          }

          map[status].count += 1

          map[status].amount +=
            getOrderAmount(order)
        }
      )

      return Object.values(map).sort(
        (a, b) =>
          b.count - a.count
      )
    }, [filteredOrders])

  /* =====================================================
     PAYMENT REPORT
  ===================================================== */

  const paymentReport =
    useMemo(() => {
      const map = {}

      filteredOrders.forEach(
        (order) => {
          const status =
            getPaymentStatus(order)

          if (!map[status]) {
            map[status] = {
              status,
              count: 0,
              amount: 0,
            }
          }

          map[status].count += 1

          map[status].amount +=
            getOrderAmount(order)
        }
      )

      return Object.values(map).sort(
        (a, b) =>
          b.count - a.count
      )
    }, [filteredOrders])

  /* =====================================================
     CUSTOMER REPORT
  ===================================================== */

  const customerReport =
    useMemo(() => {
      const map = {}

      filteredOrders.forEach(
        (order) => {
          const email =
            getCustomerEmail(order)
              .trim()
              .toLowerCase()

          const name =
            getCustomerName(order)

          const key =
            email ||
            `guest-${name}`

          if (!map[key]) {
            map[key] = {
              name,
              email:
                email ||
                'Guest customer',
              orders: 0,
              spent: 0,
            }
          }

          map[key].orders += 1

          map[key].spent +=
            getOrderAmount(order)
        }
      )

      return Object.values(map).sort(
        (a, b) =>
          b.spent - a.spent
      )
    }, [filteredOrders])

  /* =====================================================
     INVENTORY
  ===================================================== */

  const inventoryReport =
    useMemo(() => {
      return [...products]
        .map((product) => {
          const stock =
            Number(
              product.stock || 0
            )

          const threshold =
            Number(
              product.lowStockThreshold ??
                10
            )

          let stockStatus =
            'In Stock'

          if (stock <= 0) {
            stockStatus =
              'Out of Stock'
          } else if (
            stock <= threshold
          ) {
            stockStatus =
              'Low Stock'
          }

          return {
            id: product.id,
            name:
              product.name ||
              'Product',
            sku:
              product.sku || '—',
            category:
              product.category ||
              '—',
            stock,
            threshold,
            status: stockStatus,
          }
        })
        .sort(
          (a, b) =>
            a.stock - b.stock
        )
    }, [products])

  /* =====================================================
     CSV EXPORT
  ===================================================== */

  const escapeCsv = (value) => {
    const stringValue =
      String(value ?? '')

    return `"${stringValue.replace(
      /"/g,
      '""'
    )}"`
  }

  const downloadCsv = (
    filename,
    rows
  ) => {
    if (!rows.length) {
      window.alert(
        'No report data available to export.'
      )
      return
    }

    const csv = rows
      .map((row) =>
        row
          .map(escapeCsv)
          .join(',')
      )
      .join('\n')

    const blob = new Blob(
      [`\uFEFF${csv}`],
      {
        type: 'text/csv;charset=utf-8;',
      }
    )

    const url =
      URL.createObjectURL(blob)

    const link =
      document.createElement('a')

    link.href = url
    link.download = filename

    document.body.appendChild(link)
    link.click()
    link.remove()

    URL.revokeObjectURL(url)
  }

  const exportReport = () => {
    const suffix = `${appliedFrom || 'all'}-${appliedTo || 'all'}`

    if (reportType === 'sales') {
      downloadCsv(
        `al-brr-sales-report-${suffix}.csv`,
        [
          [
            'Order ID',
            'Date',
            'Customer',
            'Payment Status',
            'Order Status',
            'Amount',
          ],
          ...filteredOrders.map(
            (order) => [
              getOrderId(order),
              formatDate(
                getOrderDate(order)
              ),
              getCustomerName(order),
              getPaymentStatus(order),
              getOrderStatus(order),
              getOrderAmount(order),
            ]
          ),
        ]
      )

      return
    }

    if (reportType === 'products') {
      downloadCsv(
        `al-brr-product-report-${suffix}.csv`,
        [
          [
            'Product',
            'Units Sold',
            'Revenue',
          ],
          ...productPerformance.map(
            (item) => [
              item.name,
              item.quantity,
              item.revenue,
            ]
          ),
        ]
      )

      return
    }

    if (reportType === 'inventory') {
      downloadCsv(
        'al-brr-inventory-report.csv',
        [
          [
            'Product',
            'SKU',
            'Category',
            'Stock',
            'Low Stock Threshold',
            'Status',
          ],
          ...inventoryReport.map(
            (item) => [
              item.name,
              item.sku,
              item.category,
              item.stock,
              item.threshold,
              item.status,
            ]
          ),
        ]
      )

      return
    }

    if (reportType === 'orders') {
      downloadCsv(
        `al-brr-order-report-${suffix}.csv`,
        [
          [
            'Status',
            'Orders',
            'Amount',
          ],
          ...orderStatusReport.map(
            (item) => [
              item.status,
              item.count,
              item.amount,
            ]
          ),
        ]
      )

      return
    }

    downloadCsv(
      `al-brr-customer-report-${suffix}.csv`,
      [
        [
          'Customer',
          'Email',
          'Orders',
          'Total Spent',
        ],
        ...customerReport.map(
          (item) => [
            item.name,
            item.email,
            item.orders,
            item.spent,
          ]
        ),
      ]
    )
  }

  const reportTypes = [
    {
      id: 'sales',
      icon: '₹',
      title: 'Sales Report',
      description:
        'Revenue and sales performance.',
    },
    {
      id: 'products',
      icon: '◇',
      title: 'Product Report',
      description:
        'Product sales and performance.',
    },
    {
      id: 'inventory',
      icon: '▤',
      title: 'Inventory Report',
      description:
        'Stock and inventory analysis.',
    },
    {
      id: 'orders',
      icon: '□',
      title: 'Order Report',
      description:
        'Order status and trends.',
    },
    {
      id: 'customers',
      icon: '♙',
      title: 'Customer Report',
      description:
        'Customer activity and spending.',
    },
  ]

  return (
    <div className="admin-reports-page">

      {/* HEADER */}

      <div className="admin-reports-header">

        <div>
          <p className="admin-page-eyebrow">
            BUSINESS ANALYTICS
          </p>

          <h1>Reports</h1>

          <p className="admin-page-description">
            Analyze sales, products,
            inventory, orders and customer
            performance.
          </p>
        </div>

        <button
          type="button"
          className="admin-report-export-btn"
          onClick={exportReport}
        >
          ↓ Export CSV
        </button>

      </div>

      {/* DATE FILTER */}

      <section className="admin-report-filter-panel">

        <div className="admin-report-periods">

          {[
            ['daily', 'Daily'],
            ['weekly', 'Weekly'],
            ['monthly', 'Monthly'],
            ['yearly', 'Yearly'],
            ['custom', 'Custom'],
          ].map(([value, label]) => (
            <button
              type="button"
              key={value}
              className={
                period === value
                  ? 'active'
                  : ''
              }
              onClick={() =>
                changePeriod(value)
              }
            >
              {label}
            </button>
          ))}

        </div>

        <div className="admin-report-date-fields">

          <div>
            <label>From</label>

            <input
              type="date"
              value={fromDate}
              onChange={(e) => {
                setPeriod('custom')
                setFromDate(
                  e.target.value
                )
              }}
            />
          </div>

          <div>
            <label>To</label>

            <input
              type="date"
              value={toDate}
              onChange={(e) => {
                setPeriod('custom')
                setToDate(
                  e.target.value
                )
              }}
            />
          </div>

          <button
            type="button"
            onClick={generateReport}
          >
            Generate Report
          </button>

        </div>

      </section>

      {/* SUMMARY */}

      <div className="admin-report-summary">

        <div className="admin-report-summary-card">
          <span>Total Revenue</span>

          <strong>
            {formatCurrency(
              totalRevenue
            )}
          </strong>

          <small>
            {totalOrders} orders
          </small>
        </div>

        <div className="admin-report-summary-card">
          <span>Paid Revenue</span>

          <strong>
            {formatCurrency(
              paidRevenue
            )}
          </strong>

          <small>
            Confirmed payments
          </small>
        </div>

        <div className="admin-report-summary-card">
          <span>Products Sold</span>

          <strong>
            {productsSold}
          </strong>

          <small>
            Units in selected period
          </small>
        </div>

        <div className="admin-report-summary-card">
          <span>Customers</span>

          <strong>
            {uniqueCustomers}
          </strong>

          <small>
            {users.length} registered total
          </small>
        </div>

        <div className="admin-report-summary-card">
          <span>Avg. Order Value</span>

          <strong>
            {formatCurrency(
              averageOrderValue
            )}
          </strong>

          <small>
            Per order
          </small>
        </div>

      </div>

      {/* REPORT TYPES */}

      <div className="admin-report-types">

        {reportTypes.map((item) => (
          <button
            type="button"
            key={item.id}
            className={`admin-report-type-card ${
              reportType === item.id
                ? 'active'
                : ''
            }`}
            onClick={() =>
              setReportType(item.id)
            }
          >

            <div className="admin-report-type-icon">
              {item.icon}
            </div>

            <div>
              <h3>{item.title}</h3>

              <p>
                {item.description}
              </p>
            </div>

          </button>
        ))}

      </div>

      {/* =================================================
          SALES REPORT
      ================================================= */}

      {reportType === 'sales' && (
        <section className="admin-report-results">

          <div className="admin-report-results-header">
            <div>
              <p className="admin-page-eyebrow">
                SALES PERFORMANCE
              </p>

              <h2>Sales Report</h2>

              <span>
                {formatDate(
                  appliedFrom
                )}{' '}
                —{' '}
                {formatDate(
                  appliedTo
                )}
              </span>
            </div>
          </div>

          <div className="admin-report-two-columns">

            <div className="admin-report-breakdown-card">

              <h3>
                Payment Breakdown
              </h3>

              {paymentReport.length >
              0 ? (
                paymentReport.map(
                  (item) => {
                    const percentage =
                      totalOrders > 0
                        ? Math.round(
                            (item.count /
                              totalOrders) *
                              100
                          )
                        : 0

                    return (
                      <div
                        className="admin-report-progress-item"
                        key={
                          item.status
                        }
                      >

                        <div className="admin-report-progress-info">
                          <span>
                            {
                              item.status
                            }
                          </span>

                          <strong>
                            {item.count}{' '}
                            orders
                          </strong>
                        </div>

                        <div className="admin-report-progress-track">
                          <i
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>

                        <small>
                          {formatCurrency(
                            item.amount
                          )}
                        </small>

                      </div>
                    )
                  }
                )
              ) : (
                <div className="admin-report-empty-small">
                  No payment data
                  available.
                </div>
              )}

            </div>

            <div className="admin-report-breakdown-card">

              <h3>
                Order Breakdown
              </h3>

              {orderStatusReport.length >
              0 ? (
                orderStatusReport.map(
                  (item) => {
                    const percentage =
                      totalOrders > 0
                        ? Math.round(
                            (item.count /
                              totalOrders) *
                              100
                          )
                        : 0

                    return (
                      <div
                        className="admin-report-progress-item"
                        key={
                          item.status
                        }
                      >

                        <div className="admin-report-progress-info">
                          <span>
                            {
                              item.status
                            }
                          </span>

                          <strong>
                            {item.count}{' '}
                            orders
                          </strong>
                        </div>

                        <div className="admin-report-progress-track">
                          <i
                            style={{
                              width: `${percentage}%`,
                            }}
                          />
                        </div>

                        <small>
                          {formatCurrency(
                            item.amount
                          )}
                        </small>

                      </div>
                    )
                  }
                )
              ) : (
                <div className="admin-report-empty-small">
                  No order data
                  available.
                </div>
              )}

            </div>

          </div>

          <div className="admin-report-table-wrap">

            <table className="admin-report-table">

              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Date</th>
                  <th>Customer</th>
                  <th>Order Status</th>
                  <th>Payment</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>

                {filteredOrders.length >
                0 ? (
                  filteredOrders.map(
                    (order, index) => (
                      <tr
                        key={`${getOrderId(
                          order
                        )}-${index}`}
                      >
                        <td>
                          <strong>
                            {String(
                              getOrderId(
                                order
                              )
                            ).startsWith(
                              '#'
                            )
                              ? getOrderId(
                                  order
                                )
                              : `#${getOrderId(
                                  order
                                )}`}
                          </strong>
                        </td>

                        <td>
                          {formatDate(
                            getOrderDate(
                              order
                            )
                          )}
                        </td>

                        <td>
                          {getCustomerName(
                            order
                          )}
                        </td>

                        <td>
                          <span className="admin-report-status">
                            {getOrderStatus(
                              order
                            )}
                          </span>
                        </td>

                        <td>
                          {getPaymentStatus(
                            order
                          )}
                        </td>

                        <td>
                          <strong>
                            {formatCurrency(
                              getOrderAmount(
                                order
                              )
                            )}
                          </strong>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="admin-report-empty"
                    >
                      No sales found for
                      this period.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </section>
      )}

      {/* =================================================
          PRODUCT REPORT
      ================================================= */}

      {reportType ===
        'products' && (
        <section className="admin-report-results">

          <div className="admin-report-results-header">
            <div>
              <p className="admin-page-eyebrow">
                PRODUCT PERFORMANCE
              </p>

              <h2>
                Product Report
              </h2>

              <span>
                Best selling products in
                selected period
              </span>
            </div>
          </div>

          <div className="admin-report-table-wrap">

            <table className="admin-report-table">

              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Product</th>
                  <th>Units Sold</th>
                  <th>Revenue</th>
                </tr>
              </thead>

              <tbody>

                {productPerformance.length >
                0 ? (
                  productPerformance.map(
                    (item, index) => (
                      <tr
                        key={item.name}
                      >
                        <td>
                          <span className="admin-report-rank">
                            {index + 1}
                          </span>
                        </td>

                        <td>
                          <strong>
                            {item.name}
                          </strong>
                        </td>

                        <td>
                          {item.quantity}
                        </td>

                        <td>
                          <strong>
                            {formatCurrency(
                              item.revenue
                            )}
                          </strong>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="admin-report-empty"
                    >
                      No product sales
                      found.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </section>
      )}

      {/* =================================================
          INVENTORY REPORT
      ================================================= */}

      {reportType ===
        'inventory' && (
        <section className="admin-report-results">

          <div className="admin-report-results-header">
            <div>
              <p className="admin-page-eyebrow">
                STOCK ANALYSIS
              </p>

              <h2>
                Inventory Report
              </h2>

              <span>
                Current admin product
                inventory
              </span>
            </div>
          </div>

          <div className="admin-report-table-wrap">

            <table className="admin-report-table">

              <thead>
                <tr>
                  <th>Product</th>
                  <th>SKU</th>
                  <th>Category</th>
                  <th>Stock</th>
                  <th>Threshold</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>

                {inventoryReport.length >
                0 ? (
                  inventoryReport.map(
                    (item, index) => (
                      <tr
                        key={
                          item.id ||
                          index
                        }
                      >
                        <td>
                          <strong>
                            {item.name}
                          </strong>
                        </td>

                        <td>
                          {item.sku}
                        </td>

                        <td>
                          {
                            item.category
                          }
                        </td>

                        <td>
                          <strong>
                            {item.stock}
                          </strong>
                        </td>

                        <td>
                          {
                            item.threshold
                          }
                        </td>

                        <td>
                          <span
                            className={`admin-report-stock-status ${item.status
                              .toLowerCase()
                              .replace(
                                /\s+/g,
                                '-'
                              )}`}
                          >
                            {item.status}
                          </span>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="6"
                      className="admin-report-empty"
                    >
                      No inventory data
                      available.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </section>
      )}

      {/* =================================================
          ORDER REPORT
      ================================================= */}

      {reportType === 'orders' && (
        <section className="admin-report-results">

          <div className="admin-report-results-header">
            <div>
              <p className="admin-page-eyebrow">
                ORDER ANALYSIS
              </p>

              <h2>
                Order Report
              </h2>

              <span>
                Order status performance
              </span>
            </div>
          </div>

          <div className="admin-report-status-grid">

            {orderStatusReport.length >
            0 ? (
              orderStatusReport.map(
                (item) => (
                  <div
                    className="admin-report-status-card"
                    key={item.status}
                  >
                    <span>
                      {item.status}
                    </span>

                    <strong>
                      {item.count}
                    </strong>

                    <small>
                      {formatCurrency(
                        item.amount
                      )}
                    </small>
                  </div>
                )
              )
            ) : (
              <div className="admin-report-empty-card">
                No order data available
                for this period.
              </div>
            )}

          </div>

        </section>
      )}

      {/* =================================================
          CUSTOMER REPORT
      ================================================= */}

      {reportType ===
        'customers' && (
        <section className="admin-report-results">

          <div className="admin-report-results-header">
            <div>
              <p className="admin-page-eyebrow">
                CUSTOMER ANALYSIS
              </p>

              <h2>
                Customer Report
              </h2>

              <span>
                Customer orders and
                spending
              </span>
            </div>
          </div>

          <div className="admin-report-table-wrap">

            <table className="admin-report-table">

              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Email</th>
                  <th>Orders</th>
                  <th>Total Spent</th>
                </tr>
              </thead>

              <tbody>

                {customerReport.length >
                0 ? (
                  customerReport.map(
                    (customer, index) => (
                      <tr
                        key={`${customer.email}-${index}`}
                      >
                        <td>
                          <strong>
                            {
                              customer.name
                            }
                          </strong>
                        </td>

                        <td>
                          {
                            customer.email
                          }
                        </td>

                        <td>
                          {
                            customer.orders
                          }
                        </td>

                        <td>
                          <strong>
                            {formatCurrency(
                              customer.spent
                            )}
                          </strong>
                        </td>
                      </tr>
                    )
                  )
                ) : (
                  <tr>
                    <td
                      colSpan="4"
                      className="admin-report-empty"
                    >
                      No customer activity
                      found.
                    </td>
                  </tr>
                )}

              </tbody>

            </table>

          </div>

        </section>
      )}

    </div>
  )
}

export default Reports