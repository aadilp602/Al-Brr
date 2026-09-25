import { useMemo, useState } from 'react'

const STORAGE_KEY = 'al-brr-coupons'

const EMPTY_FORM = {
  code: '',
  description: '',
  discountType: 'percentage',
  discountValue: '',
  minimumOrder: '',
  maximumDiscount: '',
  usageLimit: '',
  startDate: '',
  endDate: '',
  status: 'Active',
}

function loadCoupons() {
  try {
    const data = JSON.parse(
      localStorage.getItem(STORAGE_KEY) || '[]'
    )

    return Array.isArray(data) ? data : []
  } catch {
    return []
  }
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

  const date = new Date(`${value}T00:00:00`)

  if (Number.isNaN(date.getTime())) {
    return value
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date)
}

function getCouponStatus(coupon) {
  if (coupon.status === 'Inactive') {
    return 'Inactive'
  }

  if (coupon.endDate) {
    const endDate = new Date(
      `${coupon.endDate}T23:59:59`
    )

    if (
      !Number.isNaN(endDate.getTime()) &&
      endDate.getTime() < Date.now()
    ) {
      return 'Expired'
    }
  }

  if (coupon.startDate) {
    const startDate = new Date(
      `${coupon.startDate}T00:00:00`
    )

    if (
      !Number.isNaN(startDate.getTime()) &&
      startDate.getTime() > Date.now()
    ) {
      return 'Scheduled'
    }
  }

  if (
    Number(coupon.usageLimit) > 0 &&
    Number(coupon.usedCount || 0) >=
      Number(coupon.usageLimit)
  ) {
    return 'Limit Reached'
  }

  return 'Active'
}

function statusClass(status) {
  return status
    .toLowerCase()
    .replace(/\s+/g, '-')
}

function Coupons() {
  const [coupons, setCoupons] =
    useState(loadCoupons)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] =
    useState('all')

  const [showModal, setShowModal] =
    useState(false)

  const [editingCoupon, setEditingCoupon] =
    useState(null)

  const [form, setForm] =
    useState(EMPTY_FORM)

  const [error, setError] = useState('')

  /* =====================================================
     SAVE
  ===================================================== */

  const saveCoupons = (updated) => {
    setCoupons(updated)

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updated)
    )
  }

  /* =====================================================
     STATS
  ===================================================== */

  const totalCoupons = coupons.length

  const activeCoupons = coupons.filter(
    (coupon) =>
      getCouponStatus(coupon) === 'Active'
  ).length

  const totalUsed = coupons.reduce(
    (total, coupon) =>
      total + Number(coupon.usedCount || 0),
    0
  )

  const totalDiscount = coupons.reduce(
    (total, coupon) =>
      total +
      Number(coupon.totalDiscount || 0),
    0
  )

  /* =====================================================
     FILTER
  ===================================================== */

  const filteredCoupons = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase()

    return coupons.filter((coupon) => {
      const status =
        getCouponStatus(coupon)

      const matchesSearch =
        !query ||
        coupon.code
          ?.toLowerCase()
          .includes(query) ||
        coupon.description
          ?.toLowerCase()
          .includes(query)

      const matchesStatus =
        statusFilter === 'all' ||
        status.toLowerCase() ===
          statusFilter.toLowerCase()

      return (
        matchesSearch &&
        matchesStatus
      )
    })
  }, [coupons, search, statusFilter])

  /* =====================================================
     MODAL
  ===================================================== */

  const openAddModal = () => {
    setEditingCoupon(null)
    setForm(EMPTY_FORM)
    setError('')
    setShowModal(true)
  }

  const openEditModal = (coupon) => {
    setEditingCoupon(coupon)

    setForm({
      code: coupon.code || '',
      description:
        coupon.description || '',
      discountType:
        coupon.discountType ||
        'percentage',
      discountValue:
        coupon.discountValue ?? '',
      minimumOrder:
        coupon.minimumOrder ?? '',
      maximumDiscount:
        coupon.maximumDiscount ?? '',
      usageLimit:
        coupon.usageLimit ?? '',
      startDate:
        coupon.startDate || '',
      endDate:
        coupon.endDate || '',
      status:
        coupon.status || 'Active',
    })

    setError('')
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditingCoupon(null)
    setForm(EMPTY_FORM)
    setError('')
  }

  /* =====================================================
     FORM CHANGE
  ===================================================== */

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((current) => ({
      ...current,
      [name]:
        name === 'code'
          ? value.toUpperCase()
          : value,
    }))

    setError('')
  }

  /* =====================================================
     SUBMIT
  ===================================================== */

  const handleSubmit = (e) => {
    e.preventDefault()

    const code = form.code
      .trim()
      .toUpperCase()

    const discountValue = Number(
      form.discountValue
    )

    if (!code) {
      setError(
        'Coupon code is required.'
      )
      return
    }

    if (
      !form.discountValue ||
      discountValue <= 0
    ) {
      setError(
        'Enter a valid discount value.'
      )
      return
    }

    if (
      form.discountType ===
        'percentage' &&
      discountValue > 100
    ) {
      setError(
        'Percentage discount cannot be more than 100%.'
      )
      return
    }

    if (
      form.minimumOrder &&
      Number(form.minimumOrder) < 0
    ) {
      setError(
        'Minimum order cannot be negative.'
      )
      return
    }

    if (
      form.maximumDiscount &&
      Number(form.maximumDiscount) < 0
    ) {
      setError(
        'Maximum discount cannot be negative.'
      )
      return
    }

    if (
      form.usageLimit &&
      Number(form.usageLimit) < 1
    ) {
      setError(
        'Usage limit must be at least 1.'
      )
      return
    }

    if (
      form.startDate &&
      form.endDate &&
      new Date(form.endDate) <
        new Date(form.startDate)
    ) {
      setError(
        'End date cannot be before start date.'
      )
      return
    }

    const duplicate = coupons.some(
      (coupon) =>
        coupon.code
          ?.toUpperCase() === code &&
        coupon.id !==
          editingCoupon?.id
    )

    if (duplicate) {
      setError(
        'This coupon code already exists.'
      )
      return
    }

    const now =
      new Date().toISOString()

    if (editingCoupon) {
      const updated = coupons.map(
        (coupon) =>
          coupon.id ===
          editingCoupon.id
            ? {
                ...coupon,
                code,
                description:
                  form.description.trim(),
                discountType:
                  form.discountType,
                discountValue,
                minimumOrder:
                  Number(
                    form.minimumOrder
                  ) || 0,
                maximumDiscount:
                  Number(
                    form.maximumDiscount
                  ) || 0,
                usageLimit:
                  Number(
                    form.usageLimit
                  ) || 0,
                startDate:
                  form.startDate,
                endDate:
                  form.endDate,
                status:
                  form.status,
                updatedAt: now,
              }
            : coupon
      )

      saveCoupons(updated)
    } else {
      const coupon = {
        id: `coupon-${Date.now()}`,
        code,
        description:
          form.description.trim(),
        discountType:
          form.discountType,
        discountValue,
        minimumOrder:
          Number(
            form.minimumOrder
          ) || 0,
        maximumDiscount:
          Number(
            form.maximumDiscount
          ) || 0,
        usageLimit:
          Number(
            form.usageLimit
          ) || 0,
        usedCount: 0,
        totalDiscount: 0,
        startDate:
          form.startDate,
        endDate:
          form.endDate,
        status:
          form.status,
        createdAt: now,
        updatedAt: now,
      }

      saveCoupons([
        coupon,
        ...coupons,
      ])
    }

    closeModal()
  }

  /* =====================================================
     STATUS
  ===================================================== */

  const toggleCouponStatus = (
    coupon
  ) => {
    const updated = coupons.map(
      (item) =>
        item.id === coupon.id
          ? {
              ...item,
              status:
                item.status ===
                'Inactive'
                  ? 'Active'
                  : 'Inactive',
              updatedAt:
                new Date().toISOString(),
            }
          : item
    )

    saveCoupons(updated)
  }

  /* =====================================================
     DELETE
  ===================================================== */

  const deleteCoupon = (coupon) => {
    const confirmed =
      window.confirm(
        `Delete coupon "${coupon.code}"?`
      )

    if (!confirmed) return

    saveCoupons(
      coupons.filter(
        (item) =>
          item.id !== coupon.id
      )
    )
  }

  return (
    <div className="admin-coupons-page">

      {/* HEADER */}

      <div className="admin-coupons-header">

        <div>
          <p className="admin-page-eyebrow">
            PROMOTION MANAGEMENT
          </p>

          <h1>
            Discounts & Coupons
          </h1>

          <p className="admin-page-description">
            Create and manage promotional
            discounts and coupon codes.
          </p>
        </div>

        <button
          type="button"
          className="admin-add-coupon-btn"
          onClick={openAddModal}
        >
          <span>+</span>
          Add Coupon
        </button>

      </div>

      {/* STATS */}

      <div className="admin-coupon-stats">

        <div className="admin-coupon-stat-card">

          <div className="admin-coupon-stat-icon">
            %
          </div>

          <div>
            <span>Total Coupons</span>
            <strong>
              {totalCoupons}
            </strong>
            <small>
              Created coupons
            </small>
          </div>

        </div>

        <div className="admin-coupon-stat-card">

          <div className="admin-coupon-stat-icon">
            ✓
          </div>

          <div>
            <span>Active</span>
            <strong>
              {activeCoupons}
            </strong>
            <small>
              Available coupons
            </small>
          </div>

        </div>

        <div className="admin-coupon-stat-card">

          <div className="admin-coupon-stat-icon">
            ↗
          </div>

          <div>
            <span>Used</span>
            <strong>
              {totalUsed}
            </strong>
            <small>
              Total redemptions
            </small>
          </div>

        </div>

        <div className="admin-coupon-stat-card">

          <div className="admin-coupon-stat-icon">
            ₹
          </div>

          <div>
            <span>
              Total Discount
            </span>

            <strong>
              {formatCurrency(
                totalDiscount
              )}
            </strong>

            <small>
              Discount given
            </small>
          </div>

        </div>

      </div>

      {/* PANEL */}

      <section className="admin-coupons-panel">

        <div className="admin-coupons-panel-heading">

          <div>
            <h2>All Coupons</h2>

            <p>
              View and manage promotional
              coupon codes.
            </p>
          </div>

        </div>

        {/* TOOLBAR */}

        <div className="admin-coupons-toolbar">

          <div className="admin-coupons-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search coupon code..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          <select
            className="admin-coupons-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(
                e.target.value
              )
            }
          >
            <option value="all">
              All Status
            </option>

            <option value="Active">
              Active
            </option>

            <option value="Inactive">
              Inactive
            </option>

            <option value="Scheduled">
              Scheduled
            </option>

            <option value="Expired">
              Expired
            </option>

            <option value="Limit Reached">
              Limit Reached
            </option>

          </select>

        </div>

        {/* TABLE */}

        <div className="admin-coupons-table-wrap">

          <table className="admin-coupons-table">

            <thead>
              <tr>
                <th>Coupon</th>
                <th>Discount</th>
                <th>Minimum Order</th>
                <th>Valid From</th>
                <th>Valid Until</th>
                <th>Usage</th>
                <th>Status</th>
                <th className="admin-table-action">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredCoupons.length >
              0 ? (
                filteredCoupons.map(
                  (coupon) => {
                    const status =
                      getCouponStatus(
                        coupon
                      )

                    return (
                      <tr
                        key={
                          coupon.id
                        }
                      >

                        <td>
                          <div className="admin-coupon-code-cell">

                            <div className="admin-coupon-ticket-icon">
                              %
                            </div>

                            <div>
                              <strong>
                                {
                                  coupon.code
                                }
                              </strong>

                              <span>
                                {coupon.description ||
                                  'Promotional coupon'}
                              </span>
                            </div>

                          </div>
                        </td>

                        <td>
                          <strong className="admin-coupon-discount">

                            {coupon.discountType ===
                            'percentage'
                              ? `${coupon.discountValue}%`
                              : formatCurrency(
                                  coupon.discountValue
                                )}

                          </strong>

                          <span className="admin-coupon-discount-type">

                            {coupon.discountType ===
                            'percentage'
                              ? 'Percentage'
                              : 'Fixed Amount'}

                          </span>
                        </td>

                        <td>
                          <span className="admin-coupon-minimum">

                            {Number(
                              coupon.minimumOrder
                            ) > 0
                              ? formatCurrency(
                                  coupon.minimumOrder
                                )
                              : 'No minimum'}

                          </span>
                        </td>

                        <td>
                          <span className="admin-coupon-date">
                            {formatDate(
                              coupon.startDate
                            )}
                          </span>
                        </td>

                        <td>
                          <span className="admin-coupon-date">
                            {formatDate(
                              coupon.endDate
                            )}
                          </span>
                        </td>

                        <td>
                          <div className="admin-coupon-usage">

                            <strong>
                              {Number(
                                coupon.usedCount ||
                                  0
                              )}
                            </strong>

                            <span>
                              /
                              {Number(
                                coupon.usageLimit
                              ) > 0
                                ? coupon.usageLimit
                                : '∞'}
                            </span>

                          </div>
                        </td>

                        <td>
                          <button
                            type="button"
                            className={`admin-coupon-status ${statusClass(
                              status
                            )}`}
                            onClick={() =>
                              toggleCouponStatus(
                                coupon
                              )
                            }
                            disabled={
                              status ===
                                'Expired' ||
                              status ===
                                'Limit Reached'
                            }
                          >
                            <i />
                            {status}
                          </button>
                        </td>

                        <td>
                          <div className="admin-coupon-actions">

                            <button
                              type="button"
                              onClick={() =>
                                openEditModal(
                                  coupon
                                )
                              }
                            >
                              Edit
                            </button>

                            <button
                              type="button"
                              className="delete"
                              onClick={() =>
                                deleteCoupon(
                                  coupon
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
                    colSpan="8"
                    className="admin-coupons-empty"
                  >
                    {coupons.length ===
                    0
                      ? 'No coupons yet. Create your first coupon.'
                      : 'No coupons match your filters.'}
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        <div className="admin-coupons-footer">
          Showing{' '}
          <strong>
            {filteredCoupons.length}
          </strong>{' '}
          of{' '}
          <strong>
            {coupons.length}
          </strong>{' '}
          coupons
        </div>

      </section>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {showModal && (
        <div
          className="admin-coupon-modal-overlay"
          onMouseDown={(e) => {
            if (
              e.target ===
              e.currentTarget
            ) {
              closeModal()
            }
          }}
        >

          <div className="admin-coupon-modal">

            <div className="admin-coupon-modal-header">

              <div>
                <p className="admin-page-eyebrow">
                  {editingCoupon
                    ? 'UPDATE PROMOTION'
                    : 'CREATE PROMOTION'}
                </p>

                <h2>
                  {editingCoupon
                    ? 'Edit Coupon'
                    : 'Add Coupon'}
                </h2>
              </div>

              <button
                type="button"
                onClick={
                  closeModal
                }
              >
                ×
              </button>

            </div>

            <form
              onSubmit={
                handleSubmit
              }
            >

              {/* CODE */}

              <div className="admin-coupon-field admin-coupon-field-full">

                <label>
                  Coupon Code
                  <strong>*</strong>
                </label>

                <input
                  type="text"
                  name="code"
                  placeholder="e.g. ALBRR20"
                  value={form.code}
                  onChange={
                    handleChange
                  }
                  maxLength="30"
                />

              </div>

              {/* DESCRIPTION */}

              <div className="admin-coupon-field admin-coupon-field-full">

                <label>
                  Description
                </label>

                <input
                  type="text"
                  name="description"
                  placeholder="e.g. 20% off on your order"
                  value={
                    form.description
                  }
                  onChange={
                    handleChange
                  }
                />

              </div>

              <div className="admin-coupon-form-grid">

                {/* TYPE */}

                <div className="admin-coupon-field">

                  <label>
                    Discount Type
                  </label>

                  <select
                    name="discountType"
                    value={
                      form.discountType
                    }
                    onChange={
                      handleChange
                    }
                  >
                    <option value="percentage">
                      Percentage
                    </option>

                    <option value="fixed">
                      Fixed Amount
                    </option>
                  </select>

                </div>

                {/* VALUE */}

                <div className="admin-coupon-field">

                  <label>
                    Discount Value
                    <strong>*</strong>
                  </label>

                  <div className="admin-coupon-input-addon">

                    <span>
                      {form.discountType ===
                      'percentage'
                        ? '%'
                        : '₹'}
                    </span>

                    <input
                      type="number"
                      name="discountValue"
                      min="0"
                      step="0.01"
                      placeholder="0"
                      value={
                        form.discountValue
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                </div>

                {/* MINIMUM */}

                <div className="admin-coupon-field">

                  <label>
                    Minimum Order
                  </label>

                  <div className="admin-coupon-input-addon">

                    <span>₹</span>

                    <input
                      type="number"
                      name="minimumOrder"
                      min="0"
                      placeholder="0"
                      value={
                        form.minimumOrder
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                </div>

                {/* MAX DISCOUNT */}

                <div className="admin-coupon-field">

                  <label>
                    Max Discount
                  </label>

                  <div className="admin-coupon-input-addon">

                    <span>₹</span>

                    <input
                      type="number"
                      name="maximumDiscount"
                      min="0"
                      placeholder="No limit"
                      value={
                        form.maximumDiscount
                      }
                      onChange={
                        handleChange
                      }
                    />

                  </div>

                </div>

                {/* USAGE */}

                <div className="admin-coupon-field">

                  <label>
                    Usage Limit
                  </label>

                  <input
                    type="number"
                    name="usageLimit"
                    min="1"
                    placeholder="Unlimited"
                    value={
                      form.usageLimit
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* STATUS */}

                <div className="admin-coupon-field">

                  <label>Status</label>

                  <select
                    name="status"
                    value={
                      form.status
                    }
                    onChange={
                      handleChange
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

                {/* START */}

                <div className="admin-coupon-field">

                  <label>
                    Start Date
                  </label>

                  <input
                    type="date"
                    name="startDate"
                    value={
                      form.startDate
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

                {/* END */}

                <div className="admin-coupon-field">

                  <label>
                    End Date
                  </label>

                  <input
                    type="date"
                    name="endDate"
                    value={
                      form.endDate
                    }
                    onChange={
                      handleChange
                    }
                  />

                </div>

              </div>

              {form.discountType ===
                'percentage' &&
                form.maximumDiscount && (
                  <div className="admin-coupon-note">
                    Percentage discount will
                    be capped at{' '}
                    <strong>
                      {formatCurrency(
                        form.maximumDiscount
                      )}
                    </strong>
                    .
                  </div>
                )}

              {error && (
                <div className="admin-coupon-error">
                  {error}
                </div>
              )}

              <div className="admin-coupon-modal-actions">

                <button
                  type="button"
                  className="cancel"
                  onClick={
                    closeModal
                  }
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="save"
                >
                  {editingCoupon
                    ? 'Update Coupon'
                    : 'Create Coupon'}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  )
}

export default Coupons