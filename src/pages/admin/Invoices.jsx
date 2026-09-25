import { useMemo, useState } from 'react'

const ORDERS_KEY = 'al-brr-orders'

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

function getInvoiceNumber(order, index = 0) {
  if (order.invoiceNumber) {
    return order.invoiceNumber
  }

  const rawId = String(getOrderId(order))
    .replace(/[^a-zA-Z0-9]/g, '')
    .toUpperCase()

  return `INV-${rawId || String(index + 1).padStart(4, '0')}`
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

function getAddress(order) {
  const address =
    order.shippingAddress ||
    order.shipping ||
    order.address ||
    {}

  if (typeof address === 'string') {
    return address
  }

  return [
    address.address,
    address.addressLine1,
    address.addressLine2,
    address.street,
    address.city,
    address.state,
    address.pincode,
    address.postalCode,
    address.country,
  ]
    .filter(Boolean)
    .join(', ')
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
    'Product'
  )
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

function getSubtotal(order) {
  const direct =
    order.subtotal ??
    order.subTotal

  if (
    direct !== undefined &&
    direct !== null &&
    direct !== ''
  ) {
    return Number(direct) || 0
  }

  return getItems(order).reduce(
    (total, item) =>
      total +
      getItemPrice(item) *
        getItemQuantity(item),
    0
  )
}

function getDiscount(order) {
  return Number(
    order.discount ??
      order.discountAmount ??
      0
  ) || 0
}

function getShipping(order) {
  return Number(
    order.shippingCharge ??
      order.shippingCost ??
      order.deliveryCharge ??
      0
  ) || 0
}

function getTax(order) {
  return Number(
    order.tax ??
      order.taxAmount ??
      order.gst ??
      0
  ) || 0
}

function getTotal(order) {
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

  return (
    getSubtotal(order) -
    getDiscount(order) +
    getShipping(order) +
    getTax(order)
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
    maximumFractionDigits: 2,
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

function normalizeClass(value) {
  return String(value || '')
    .toLowerCase()
    .replace(/\s+/g, '-')
}

function escapeHtml(value) {
  return String(value ?? '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;')
}

function Invoices() {
  const [orders] = useState(loadOrders)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState('all')

  const [selectedInvoice, setSelectedInvoice] =
    useState(null)

  /* =====================================================
     STATS
  ===================================================== */

  const totalInvoices = orders.length

  const paidInvoices = orders.filter(
    (order) =>
      getPaymentStatus(order).toLowerCase() === 'paid'
  ).length

  const pendingInvoices = orders.filter(
    (order) =>
      getPaymentStatus(order).toLowerCase() ===
      'pending'
  ).length

  const totalAmount = orders.reduce(
    (total, order) =>
      total + getTotal(order),
    0
  )

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredInvoices = useMemo(() => {
    const query = search.trim().toLowerCase()

    return orders.filter((order, index) => {
      const invoice = getInvoiceNumber(
        order,
        index
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

      const matchesSearch =
        !query ||
        invoice.includes(query) ||
        orderId.includes(query) ||
        customer.includes(query) ||
        email.includes(query)

      const matchesStatus =
        statusFilter === 'all' ||
        status === statusFilter.toLowerCase()

      return matchesSearch && matchesStatus
    })
  }, [orders, search, statusFilter])

  /* =====================================================
     PRINT / DOWNLOAD PDF
  ===================================================== */

  const printInvoice = (order) => {
    const orderIndex = orders.findIndex(
      (item) =>
        String(getOrderId(item)) ===
        String(getOrderId(order))
    )

    const invoiceNumber = getInvoiceNumber(
      order,
      orderIndex
    )

    const items = getItems(order)

    const itemRows =
      items.length > 0
        ? items
            .map((item) => {
              const quantity =
                getItemQuantity(item)

              const price =
                getItemPrice(item)

              const total =
                price * quantity

              return `
                <tr>
                  <td>${escapeHtml(
                    getItemName(item)
                  )}</td>

                  <td class="center">
                    ${quantity}
                  </td>

                  <td class="right">
                    ${escapeHtml(
                      formatCurrency(price)
                    )}
                  </td>

                  <td class="right">
                    ${escapeHtml(
                      formatCurrency(total)
                    )}
                  </td>
                </tr>
              `
            })
            .join('')
        : `
          <tr>
            <td colspan="4" class="empty">
              No item details available
            </td>
          </tr>
        `

    const invoiceHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>${escapeHtml(
            invoiceNumber
          )}</title>

          <meta charset="UTF-8" />

          <style>
            * {
              box-sizing: border-box;
            }

            body {
              margin: 0;
              padding: 40px;
              background: #ffffff;
              color: #29251f;
              font-family: Arial, sans-serif;
            }

            .invoice {
              width: 100%;
              max-width: 900px;
              margin: 0 auto;
            }

            .top-line {
              height: 4px;
              margin-bottom: 32px;
              background: #b49452;
            }

            .header {
              display: flex;
              justify-content: space-between;
              gap: 30px;
              padding-bottom: 28px;
              border-bottom: 1px solid #ded8ce;
            }

            .brand h1 {
              margin: 0;
              font-family: Georgia, serif;
              font-size: 34px;
              letter-spacing: 4px;
            }

            .brand p {
              margin: 6px 0 0;
              color: #a18142;
              font-size: 10px;
              font-weight: bold;
              letter-spacing: 4px;
            }

            .invoice-title {
              text-align: right;
            }

            .invoice-title h2 {
              margin: 0;
              font-family: Georgia, serif;
              font-size: 34px;
              font-weight: normal;
            }

            .invoice-title p {
              margin: 7px 0 0;
              color: #777067;
              font-size: 12px;
            }

            .info-grid {
              display: grid;
              grid-template-columns: 1fr 1fr;
              gap: 30px;
              margin: 32px 0;
            }

            .label {
              margin-bottom: 8px;
              color: #a18142;
              font-size: 9px;
              font-weight: bold;
              letter-spacing: 1.5px;
              text-transform: uppercase;
            }

            .info-box strong {
              display: block;
              margin-bottom: 5px;
              font-family: Georgia, serif;
              font-size: 18px;
            }

            .info-box p {
              margin: 3px 0;
              color: #625b52;
              font-size: 11px;
              line-height: 1.6;
            }

            table {
              width: 100%;
              border-collapse: collapse;
              margin-top: 25px;
            }

            th {
              padding: 13px;
              border-bottom: 1px solid #cfc7ba;
              background: #f7f4ee;
              color: #756c60;
              font-size: 9px;
              letter-spacing: 1px;
              text-align: left;
              text-transform: uppercase;
            }

            td {
              padding: 14px 13px;
              border-bottom: 1px solid #eee9e1;
              font-size: 11px;
            }

            .right {
              text-align: right;
            }

            .center {
              text-align: center;
            }

            .empty {
              padding: 30px;
              color: #999;
              text-align: center;
            }

            .totals {
              width: 340px;
              margin: 28px 0 0 auto;
            }

            .total-row {
              display: flex;
              justify-content: space-between;
              padding: 8px 0;
              color: #5f584f;
              font-size: 11px;
            }

            .grand-total {
              margin-top: 8px;
              padding: 15px 0;
              border-top: 2px solid #29251f;
              border-bottom: 2px solid #29251f;
              color: #29251f;
              font-family: Georgia, serif;
              font-size: 19px;
              font-weight: bold;
            }

            .payment {
              margin-top: 35px;
              padding: 17px;
              border: 1px solid #ddd4c3;
              background: #faf7ef;
            }

            .payment p {
              margin: 5px 0;
              font-size: 11px;
            }

            .footer {
              margin-top: 45px;
              padding-top: 20px;
              border-top: 1px solid #ded8ce;
              color: #8b8378;
              font-size: 9px;
              line-height: 1.7;
              text-align: center;
            }

            @media print {
              body {
                padding: 0;
              }

              @page {
                size: A4;
                margin: 14mm;
              }
            }
          </style>
        </head>

        <body>

          <div class="invoice">

            <div class="top-line"></div>

            <div class="header">

              <div class="brand">
                <h1>AL BRR</h1>
                <p>PERFUMES</p>
              </div>

              <div class="invoice-title">
                <h2>INVOICE</h2>

                <p>
                  ${escapeHtml(invoiceNumber)}
                </p>

                <p>
                  ${escapeHtml(
                    formatDate(
                      getOrderDate(order)
                    )
                  )}
                </p>
              </div>

            </div>

            <div class="info-grid">

              <div class="info-box">

                <div class="label">
                  Bill To
                </div>

                <strong>
                  ${escapeHtml(
                    getCustomerName(order)
                  )}
                </strong>

                <p>
                  ${escapeHtml(
                    getCustomerEmail(order)
                  )}
                </p>

                <p>
                  ${escapeHtml(
                    getCustomerPhone(order)
                  )}
                </p>

                <p>
                  ${escapeHtml(
                    getAddress(order)
                  )}
                </p>

              </div>

              <div class="info-box">

                <div class="label">
                  Order Details
                </div>

                <p>
                  <strong style="font-size:12px;">
                    Order ID:
                  </strong>
                  ${escapeHtml(
                    getOrderId(order)
                  )}
                </p>

                <p>
                  <strong style="font-size:12px;">
                    Payment:
                  </strong>
                  ${escapeHtml(
                    getPaymentMethod(order)
                  )}
                </p>

                <p>
                  <strong style="font-size:12px;">
                    Status:
                  </strong>
                  ${escapeHtml(
                    getPaymentStatus(order)
                  )}
                </p>

              </div>

            </div>

            <table>

              <thead>
                <tr>
                  <th>Product</th>
                  <th class="center">Qty</th>
                  <th class="right">Price</th>
                  <th class="right">Total</th>
                </tr>
              </thead>

              <tbody>
                ${itemRows}
              </tbody>

            </table>

            <div class="totals">

              <div class="total-row">
                <span>Subtotal</span>

                <strong>
                  ${escapeHtml(
                    formatCurrency(
                      getSubtotal(order)
                    )
                  )}
                </strong>
              </div>

              ${
                getDiscount(order) > 0
                  ? `
                    <div class="total-row">
                      <span>Discount</span>
                      <strong>
                        -${escapeHtml(
                          formatCurrency(
                            getDiscount(order)
                          )
                        )}
                      </strong>
                    </div>
                  `
                  : ''
              }

              ${
                getShipping(order) > 0
                  ? `
                    <div class="total-row">
                      <span>Shipping</span>
                      <strong>
                        ${escapeHtml(
                          formatCurrency(
                            getShipping(order)
                          )
                        )}
                      </strong>
                    </div>
                  `
                  : ''
              }

              ${
                getTax(order) > 0
                  ? `
                    <div class="total-row">
                      <span>GST / Tax</span>
                      <strong>
                        ${escapeHtml(
                          formatCurrency(
                            getTax(order)
                          )
                        )}
                      </strong>
                    </div>
                  `
                  : ''
              }

              <div class="total-row grand-total">
                <span>Total</span>

                <strong>
                  ${escapeHtml(
                    formatCurrency(
                      getTotal(order)
                    )
                  )}
                </strong>
              </div>

            </div>

            <div class="payment">

              <div class="label">
                Payment Information
              </div>

              <p>
                Payment Method:
                <strong>
                  ${escapeHtml(
                    getPaymentMethod(order)
                  )}
                </strong>
              </p>

              <p>
                Payment Status:
                <strong>
                  ${escapeHtml(
                    getPaymentStatus(order)
                  )}
                </strong>
              </p>

            </div>

            <div class="footer">
              Thank you for choosing Al Brr Perfumes.
              <br />
              This invoice was generated for your
              Al Brr order.
            </div>

          </div>

          <script>
            window.onload = function () {
              window.print();
            };
          </script>

        </body>
      </html>
    `

    const printWindow = window.open(
      '',
      '_blank',
      'width=1000,height=800'
    )

    if (!printWindow) {
      window.alert(
        'Please allow pop-ups to print or download the invoice.'
      )
      return
    }

    printWindow.document.open()
    printWindow.document.write(invoiceHtml)
    printWindow.document.close()
  }

  return (
    <div className="admin-invoices-page">

      {/* HEADER */}

      <div className="admin-invoices-header">
        <div>
          <p className="admin-page-eyebrow">
            BILLING MANAGEMENT
          </p>

          <h1>Invoices</h1>

          <p className="admin-page-description">
            Manage customer invoices and billing
            records.
          </p>
        </div>
      </div>

      {/* STATS */}

      <div className="admin-invoice-stats">

        <div className="admin-invoice-stat-card">
          <div className="admin-invoice-stat-icon">
            ▧
          </div>

          <div>
            <span>Total Invoices</span>
            <strong>{totalInvoices}</strong>
            <small>Generated from orders</small>
          </div>
        </div>

        <div className="admin-invoice-stat-card">
          <div className="admin-invoice-stat-icon">
            ✓
          </div>

          <div>
            <span>Paid</span>
            <strong>{paidInvoices}</strong>
            <small>Paid invoices</small>
          </div>
        </div>

        <div className="admin-invoice-stat-card">
          <div className="admin-invoice-stat-icon">
            ◷
          </div>

          <div>
            <span>Pending</span>
            <strong>
              {pendingInvoices}
            </strong>
            <small>Awaiting payment</small>
          </div>
        </div>

        <div className="admin-invoice-stat-card">
          <div className="admin-invoice-stat-icon">
            ₹
          </div>

          <div>
            <span>Total Amount</span>
            <strong>
              {formatCurrency(totalAmount)}
            </strong>
            <small>Invoice value</small>
          </div>
        </div>

      </div>

      {/* PANEL */}

      <section className="admin-invoices-panel">

        <div className="admin-invoices-panel-heading">
          <div>
            <h2>All Invoices</h2>

            <p>
              View, print and download customer
              invoices.
            </p>
          </div>
        </div>

        {/* TOOLBAR */}

        <div className="admin-invoices-toolbar">

          <div className="admin-invoices-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search invoice, order or customer..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />
          </div>

          <select
            className="admin-invoices-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="all">
              All Status
            </option>

            <option value="Paid">
              Paid
            </option>

            <option value="Pending">
              Pending
            </option>

            <option value="Failed">
              Failed
            </option>

            <option value="Refunded">
              Refunded
            </option>

            <option value="Partially Refunded">
              Partially Refunded
            </option>
          </select>

        </div>

        {/* TABLE */}

        <div className="admin-invoices-table-wrap">

          <table className="admin-invoices-table">

            <thead>
              <tr>
                <th>Invoice</th>
                <th>Order ID</th>
                <th>Customer</th>
                <th>Date</th>
                <th>Amount</th>
                <th>Status</th>
                <th className="admin-table-action">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredInvoices.length > 0 ? (
                filteredInvoices.map(
                  (order) => {
                    const originalIndex =
                      orders.findIndex(
                        (item) =>
                          String(
                            getOrderId(item)
                          ) ===
                          String(
                            getOrderId(order)
                          )
                      )

                    const invoiceNumber =
                      getInvoiceNumber(
                        order,
                        originalIndex
                      )

                    const paymentStatus =
                      getPaymentStatus(order)

                    return (
                      <tr
                        key={`${invoiceNumber}-${getOrderId(
                          order
                        )}`}
                      >

                        <td>
                          <button
                            type="button"
                            className="admin-invoice-number"
                            onClick={() =>
                              setSelectedInvoice(
                                order
                              )
                            }
                          >
                            {invoiceNumber}
                          </button>
                        </td>

                        <td>
                          <span className="admin-invoice-order-id">
                            {String(
                              getOrderId(order)
                            ).startsWith('#')
                              ? getOrderId(order)
                              : `#${getOrderId(
                                  order
                                )}`}
                          </span>
                        </td>

                        <td>
                          <div className="admin-invoice-customer">

                            <div className="admin-invoice-customer-avatar">
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
                          <span className="admin-invoice-date">
                            {formatDate(
                              getOrderDate(
                                order
                              )
                            )}
                          </span>
                        </td>

                        <td>
                          <strong className="admin-invoice-amount">
                            {formatCurrency(
                              getTotal(order)
                            )}
                          </strong>
                        </td>

                        <td>
                          <span
                            className={`admin-invoice-status ${normalizeClass(
                              paymentStatus
                            )}`}
                          >
                            <i />
                            {paymentStatus}
                          </span>
                        </td>

                        <td>
                          <div className="admin-invoice-actions">

                            <button
                              type="button"
                              onClick={() =>
                                setSelectedInvoice(
                                  order
                                )
                              }
                            >
                              View
                            </button>

                            <button
                              type="button"
                              className="download"
                              onClick={() =>
                                printInvoice(order)
                              }
                            >
                              Download PDF
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
                    className="admin-invoices-empty"
                  >
                    {orders.length === 0
                      ? 'No invoices yet.'
                      : 'No invoices match your filters.'}
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        <div className="admin-invoices-footer">
          Showing{' '}
          <strong>
            {filteredInvoices.length}
          </strong>{' '}
          of{' '}
          <strong>{orders.length}</strong>{' '}
          invoices
        </div>

      </section>

      {/* =================================================
          INVOICE PREVIEW
      ================================================= */}

      {selectedInvoice && (() => {
        const originalIndex =
          orders.findIndex(
            (item) =>
              String(getOrderId(item)) ===
              String(
                getOrderId(selectedInvoice)
              )
          )

        const invoiceNumber =
          getInvoiceNumber(
            selectedInvoice,
            originalIndex
          )

        const items =
          getItems(selectedInvoice)

        return (
          <div
            className="admin-invoice-overlay"
            onMouseDown={(e) => {
              if (
                e.target === e.currentTarget
              ) {
                setSelectedInvoice(null)
              }
            }}
          >

            <div className="admin-invoice-preview">

              {/* PREVIEW HEADER */}

              <div className="admin-invoice-preview-topbar">

                <div>
                  <span>
                    INVOICE PREVIEW
                  </span>

                  <strong>
                    {invoiceNumber}
                  </strong>
                </div>

                <div className="admin-invoice-preview-actions">

                  <button
                    type="button"
                    className="print"
                    onClick={() =>
                      printInvoice(
                        selectedInvoice
                      )
                    }
                  >
                    Print Invoice
                  </button>

                  <button
                    type="button"
                    className="download"
                    onClick={() =>
                      printInvoice(
                        selectedInvoice
                      )
                    }
                  >
                    Download PDF
                  </button>

                  <button
                    type="button"
                    className="close"
                    onClick={() =>
                      setSelectedInvoice(
                        null
                      )
                    }
                  >
                    ×
                  </button>

                </div>

              </div>

              {/* DOCUMENT */}

              <div className="admin-invoice-document">

                <div className="admin-invoice-document-line" />

                <div className="admin-invoice-document-header">

                  <div className="admin-invoice-brand">
                    <h2>AL BRR</h2>
                    <span>PERFUMES</span>
                  </div>

                  <div className="admin-invoice-heading">
                    <h3>INVOICE</h3>

                    <strong>
                      {invoiceNumber}
                    </strong>

                    <span>
                      {formatDate(
                        getOrderDate(
                          selectedInvoice
                        )
                      )}
                    </span>
                  </div>

                </div>

                {/* BILLING INFO */}

                <div className="admin-invoice-info-grid">

                  <div>
                    <span className="admin-invoice-label">
                      Bill To
                    </span>

                    <strong>
                      {getCustomerName(
                        selectedInvoice
                      )}
                    </strong>

                    <p>
                      {getCustomerEmail(
                        selectedInvoice
                      ) || 'No email'}
                    </p>

                    <p>
                      {getCustomerPhone(
                        selectedInvoice
                      ) || 'No phone'}
                    </p>

                    {getAddress(
                      selectedInvoice
                    ) && (
                      <p>
                        {getAddress(
                          selectedInvoice
                        )}
                      </p>
                    )}
                  </div>

                  <div>
                    <span className="admin-invoice-label">
                      Order Details
                    </span>

                    <p>
                      Order ID
                      <strong>
                        {String(
                          getOrderId(
                            selectedInvoice
                          )
                        ).startsWith('#')
                          ? getOrderId(
                              selectedInvoice
                            )
                          : `#${getOrderId(
                              selectedInvoice
                            )}`}
                      </strong>
                    </p>

                    <p>
                      Payment
                      <strong>
                        {getPaymentMethod(
                          selectedInvoice
                        )}
                      </strong>
                    </p>

                    <p>
                      Status
                      <strong>
                        {getPaymentStatus(
                          selectedInvoice
                        )}
                      </strong>
                    </p>
                  </div>

                </div>

                {/* ITEMS */}

                <div className="admin-invoice-items-wrap">

                  <table className="admin-invoice-items-table">

                    <thead>
                      <tr>
                        <th>Product</th>
                        <th>Qty</th>
                        <th>Price</th>
                        <th>Total</th>
                      </tr>
                    </thead>

                    <tbody>

                      {items.length > 0 ? (
                        items.map(
                          (item, index) => (
                            <tr
                              key={
                                item.id ||
                                item.productId ||
                                index
                              }
                            >
                              <td>
                                {getItemName(
                                  item
                                )}
                              </td>

                              <td>
                                {getItemQuantity(
                                  item
                                )}
                              </td>

                              <td>
                                {formatCurrency(
                                  getItemPrice(
                                    item
                                  )
                                )}
                              </td>

                              <td>
                                {formatCurrency(
                                  getItemPrice(
                                    item
                                  ) *
                                    getItemQuantity(
                                      item
                                    )
                                )}
                              </td>
                            </tr>
                          )
                        )
                      ) : (
                        <tr>
                          <td
                            colSpan="4"
                            className="admin-invoice-no-items"
                          >
                            No item details
                            available.
                          </td>
                        </tr>
                      )}

                    </tbody>

                  </table>

                </div>

                {/* TOTALS */}

                <div className="admin-invoice-totals">

                  <div>
                    <span>Subtotal</span>

                    <strong>
                      {formatCurrency(
                        getSubtotal(
                          selectedInvoice
                        )
                      )}
                    </strong>
                  </div>

                  {getDiscount(
                    selectedInvoice
                  ) > 0 && (
                    <div>
                      <span>Discount</span>

                      <strong>
                        -
                        {formatCurrency(
                          getDiscount(
                            selectedInvoice
                          )
                        )}
                      </strong>
                    </div>
                  )}

                  {getShipping(
                    selectedInvoice
                  ) > 0 && (
                    <div>
                      <span>Shipping</span>

                      <strong>
                        {formatCurrency(
                          getShipping(
                            selectedInvoice
                          )
                        )}
                      </strong>
                    </div>
                  )}

                  {getTax(
                    selectedInvoice
                  ) > 0 && (
                    <div>
                      <span>GST / Tax</span>

                      <strong>
                        {formatCurrency(
                          getTax(
                            selectedInvoice
                          )
                        )}
                      </strong>
                    </div>
                  )}

                  <div className="grand-total">
                    <span>Total</span>

                    <strong>
                      {formatCurrency(
                        getTotal(
                          selectedInvoice
                        )
                      )}
                    </strong>
                  </div>

                </div>

                {/* PAYMENT */}

                <div className="admin-invoice-payment-box">

                  <span className="admin-invoice-label">
                    Payment Information
                  </span>

                  <div>
                    <p>
                      Method
                      <strong>
                        {getPaymentMethod(
                          selectedInvoice
                        )}
                      </strong>
                    </p>

                    <p>
                      Status
                      <strong>
                        {getPaymentStatus(
                          selectedInvoice
                        )}
                      </strong>
                    </p>
                  </div>

                </div>

                <div className="admin-invoice-document-footer">
                  Thank you for choosing Al Brr
                  Perfumes.
                </div>

              </div>

            </div>

          </div>
        )
      })()}

    </div>
  )
}

export default Invoices