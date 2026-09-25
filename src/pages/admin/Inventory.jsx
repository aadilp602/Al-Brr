import { useMemo, useState } from 'react'

const PRODUCT_STORAGE_KEY = 'al-brr-admin-products'
const HISTORY_STORAGE_KEY = 'al-brr-inventory-history'

/* =========================================================
   HELPERS
========================================================= */

function loadProducts() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(PRODUCT_STORAGE_KEY) || '[]'
    )

    return Array.isArray(saved) ? saved : []
  } catch (error) {
    console.error('Unable to load inventory:', error)
    return []
  }
}

function loadHistory() {
  try {
    const saved = JSON.parse(
      localStorage.getItem(HISTORY_STORAGE_KEY) || '[]'
    )

    return Array.isArray(saved) ? saved : []
  } catch (error) {
    console.error('Unable to load stock history:', error)
    return []
  }
}

function getThreshold(product) {
  if (
    product.lowStockThreshold === '' ||
    product.lowStockThreshold === null ||
    product.lowStockThreshold === undefined
  ) {
    return 10
  }

  return Number(product.lowStockThreshold)
}

function getStockStatus(product) {
  const stock = Number(product.stock) || 0
  const threshold = getThreshold(product)

  if (stock <= 0) return 'Out of Stock'
  if (stock <= threshold) return 'Low Stock'

  return 'In Stock'
}

/* =========================================================
   INVENTORY
========================================================= */

function Inventory() {
  const [products, setProducts] = useState(loadProducts)
  const [history, setHistory] = useState(loadHistory)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [modalOpen, setModalOpen] = useState(false)
  const [selectedProduct, setSelectedProduct] = useState(null)

  const [adjustmentType, setAdjustmentType] = useState('add')
  const [quantity, setQuantity] = useState('')
  const [reason, setReason] = useState('')
  const [error, setError] = useState('')

  /* =======================================================
     SAVE PRODUCTS
  ======================================================= */

  const saveProducts = (updatedProducts) => {
    setProducts(updatedProducts)

    localStorage.setItem(
      PRODUCT_STORAGE_KEY,
      JSON.stringify(updatedProducts)
    )
  }

  /* =======================================================
     SAVE HISTORY
  ======================================================= */

  const saveHistory = (updatedHistory) => {
    setHistory(updatedHistory)

    localStorage.setItem(
      HISTORY_STORAGE_KEY,
      JSON.stringify(updatedHistory)
    )
  }

  /* =======================================================
     SUMMARY
  ======================================================= */

  const totalProducts = products.length

  const totalStock = products.reduce(
    (total, product) =>
      total + (Number(product.stock) || 0),
    0
  )

  const lowStock = products.filter(
    (product) => getStockStatus(product) === 'Low Stock'
  ).length

  const outOfStock = products.filter(
    (product) => getStockStatus(product) === 'Out of Stock'
  ).length

  /* =======================================================
     FILTER PRODUCTS
  ======================================================= */

  const filteredProducts = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return products.filter((product) => {
      const matchesSearch =
        !searchValue ||
        String(product.name || '')
          .toLowerCase()
          .includes(searchValue) ||
        String(product.sku || '')
          .toLowerCase()
          .includes(searchValue) ||
        String(product.category || '')
          .toLowerCase()
          .includes(searchValue)

      const currentStatus = getStockStatus(product)

      let matchesStatus = true

      if (statusFilter === 'in-stock') {
        matchesStatus = currentStatus === 'In Stock'
      }

      if (statusFilter === 'low-stock') {
        matchesStatus = currentStatus === 'Low Stock'
      }

      if (statusFilter === 'out-of-stock') {
        matchesStatus = currentStatus === 'Out of Stock'
      }

      return matchesSearch && matchesStatus
    })
  }, [products, search, statusFilter])

  /* =======================================================
     OPEN STOCK MODAL
  ======================================================= */

  const openStockModal = (product, type = 'add') => {
    setSelectedProduct(product)
    setAdjustmentType(type)
    setQuantity('')
    setReason('')
    setError('')
    setModalOpen(true)
  }

  /* =======================================================
     CLOSE STOCK MODAL
  ======================================================= */

  const closeStockModal = () => {
    setModalOpen(false)
    setSelectedProduct(null)
    setQuantity('')
    setReason('')
    setError('')
  }

  /* =======================================================
     ADJUST STOCK
  ======================================================= */

  const handleStockAdjustment = (e) => {
    e.preventDefault()

    if (!selectedProduct) return

    const amount = Number(quantity)

    if (!Number.isInteger(amount) || amount <= 0) {
      setError('Enter a valid whole-number quantity greater than 0.')
      return
    }

    const oldStock = Number(selectedProduct.stock) || 0

    let newStock = oldStock

    if (adjustmentType === 'add') {
      newStock = oldStock + amount
    }

    if (adjustmentType === 'remove') {
      if (amount > oldStock) {
        setError(
          `Only ${oldStock} unit${
            oldStock === 1 ? '' : 's'
          } available in stock.`
        )
        return
      }

      newStock = oldStock - amount
    }

    const updatedProducts = products.map((product) =>
      product.id === selectedProduct.id
        ? {
            ...product,
            stock: newStock,
            updatedAt: new Date().toISOString(),
          }
        : product
    )

    saveProducts(updatedProducts)

    const historyItem = {
      id: `stock-${Date.now()}`,
      productId: selectedProduct.id,
      productName: selectedProduct.name,
      sku: selectedProduct.sku || '—',
      type: adjustmentType,
      quantity: amount,
      previousStock: oldStock,
      newStock,
      reason:
        reason.trim() ||
        (adjustmentType === 'add'
          ? 'Stock added'
          : 'Stock removed'),
      createdAt: new Date().toISOString(),
    }

    saveHistory([
      historyItem,
      ...history,
    ])

    closeStockModal()
  }

  /* =======================================================
     CLEAR HISTORY
  ======================================================= */

  const handleClearHistory = () => {
    if (history.length === 0) return

    const confirmed = window.confirm(
      'Clear all inventory stock history?'
    )

    if (!confirmed) return

    saveHistory([])
  }

  /* =======================================================
     DATE FORMAT
  ======================================================= */

  const formatDate = (date) => {
    if (!date) return '—'

    return new Intl.DateTimeFormat('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    }).format(new Date(date))
  }

  return (
    <div className="admin-inventory-page">

      {/* ================= HEADER ================= */}

      <div className="admin-inventory-header">

        <div>
          <p className="admin-page-eyebrow">
            STOCK MANAGEMENT
          </p>

          <h1>Inventory</h1>

          <p className="admin-page-description">
            Monitor product stock and manage inventory
            movements.
          </p>
        </div>

      </div>

      {/* ================= STATS ================= */}

      <div className="admin-inventory-stats">

        <div className="admin-inventory-stat-card">

          <div className="admin-inventory-stat-icon">
            ◇
          </div>

          <div>
            <span>Total Products</span>
            <strong>{totalProducts}</strong>
            <small>Inventory products</small>
          </div>

        </div>

        <div className="admin-inventory-stat-card">

          <div className="admin-inventory-stat-icon">
            ▤
          </div>

          <div>
            <span>Total Stock</span>
            <strong>{totalStock}</strong>
            <small>Units available</small>
          </div>

        </div>

        <div className="admin-inventory-stat-card">

          <div className="admin-inventory-stat-icon">
            !
          </div>

          <div>
            <span>Low Stock</span>
            <strong>{lowStock}</strong>
            <small>Needs attention</small>
          </div>

        </div>

        <div className="admin-inventory-stat-card">

          <div className="admin-inventory-stat-icon">
            ×
          </div>

          <div>
            <span>Out of Stock</span>
            <strong>{outOfStock}</strong>
            <small>Unavailable products</small>
          </div>

        </div>

      </div>

      {/* =================================================
          STOCK OVERVIEW
      ================================================= */}

      <section className="admin-inventory-panel">

        <div className="admin-inventory-panel-heading">

          <div>
            <h2>Stock Overview</h2>

            <p>
              Current inventory levels for all products.
            </p>
          </div>

        </div>

        {/* ================= TOOLBAR ================= */}

        <div className="admin-inventory-toolbar">

          <div className="admin-inventory-search">

            <span>⌕</span>

            <input
              type="text"
              placeholder="Search product, SKU or category..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
            />

          </div>

          <select
            className="admin-inventory-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="all">
              All Stock
            </option>

            <option value="in-stock">
              In Stock
            </option>

            <option value="low-stock">
              Low Stock
            </option>

            <option value="out-of-stock">
              Out of Stock
            </option>

          </select>

        </div>

        {/* ================= TABLE ================= */}

        <div className="admin-inventory-table-wrap">

          <table className="admin-inventory-table">

            <thead>
              <tr>
                <th>Product</th>
                <th>SKU</th>
                <th>Category</th>
                <th>Current Stock</th>
                <th>Threshold</th>
                <th>Status</th>
                <th className="admin-table-action">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredProducts.length > 0 ? (
                filteredProducts.map((product) => {
                  const status =
                    getStockStatus(product)

                  return (
                    <tr key={product.id}>

                      {/* PRODUCT */}

                      <td>

                        <div className="admin-inventory-product">

                          <div className="admin-inventory-product-image">

                            {product.image ? (
                              <img
                                src={product.image}
                                alt={product.name}
                              />
                            ) : (
                              <span>
                                {product.name
                                  ?.charAt(0)
                                  ?.toUpperCase() || 'A'}
                              </span>
                            )}

                          </div>

                          <div>
                            <strong>
                              {product.name}
                            </strong>

                            <small>
                              {product.gender || '—'}
                            </small>
                          </div>

                        </div>

                      </td>

                      {/* SKU */}

                      <td>
                        <span className="admin-inventory-sku">
                          {product.sku || '—'}
                        </span>
                      </td>

                      {/* CATEGORY */}

                      <td>
                        {product.category || '—'}
                      </td>

                      {/* STOCK */}

                      <td>
                        <strong className="admin-current-stock">
                          {Number(product.stock) || 0}
                        </strong>
                      </td>

                      {/* THRESHOLD */}

                      <td>
                        {getThreshold(product)}
                      </td>

                      {/* STATUS */}

                      <td>
                        <span
                          className={`admin-stock-status ${
                            status === 'In Stock'
                              ? 'in-stock'
                              : status === 'Low Stock'
                              ? 'low-stock'
                              : 'out-stock'
                          }`}
                        >
                          <i />
                          {status}
                        </span>
                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="admin-inventory-actions">

                          <button
                            type="button"
                            className="stock-in"
                            onClick={() =>
                              openStockModal(
                                product,
                                'add'
                              )
                            }
                          >
                            + Stock
                          </button>

                          <button
                            type="button"
                            className="stock-out"
                            disabled={
                              Number(product.stock) <= 0
                            }
                            onClick={() =>
                              openStockModal(
                                product,
                                'remove'
                              )
                            }
                          >
                            − Stock
                          </button>

                        </div>

                      </td>

                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="admin-inventory-empty"
                  >
                    No inventory products found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        <div className="admin-inventory-footer">
          Showing{' '}
          <strong>
            {filteredProducts.length}
          </strong>{' '}
          of{' '}
          <strong>
            {products.length}
          </strong>{' '}
          products
        </div>

      </section>

      {/* =================================================
          STOCK HISTORY
      ================================================= */}

      <section className="admin-stock-history-panel">

        <div className="admin-stock-history-header">

          <div>
            <p className="admin-page-eyebrow">
              INVENTORY ACTIVITY
            </p>

            <h2>Stock History</h2>

            <p>
              Recent manual inventory adjustments.
            </p>
          </div>

          {history.length > 0 && (
            <button
              type="button"
              className="admin-clear-history-btn"
              onClick={handleClearHistory}
            >
              Clear History
            </button>
          )}

        </div>

        <div className="admin-stock-history-table-wrap">

          <table className="admin-stock-history-table">

            <thead>
              <tr>
                <th>Date</th>
                <th>Product</th>
                <th>SKU</th>
                <th>Movement</th>
                <th>Previous</th>
                <th>New Stock</th>
                <th>Reason</th>
              </tr>
            </thead>

            <tbody>

              {history.length > 0 ? (
                history.slice(0, 20).map((item) => (
                  <tr key={item.id}>

                    <td>
                      <span className="admin-history-date">
                        {formatDate(item.createdAt)}
                      </span>
                    </td>

                    <td>
                      <strong>
                        {item.productName}
                      </strong>
                    </td>

                    <td>
                      {item.sku}
                    </td>

                    <td>
                      <span
                        className={`admin-stock-movement ${
                          item.type === 'add'
                            ? 'stock-added'
                            : 'stock-removed'
                        }`}
                      >
                        {item.type === 'add'
                          ? `+${item.quantity}`
                          : `-${item.quantity}`}
                      </span>
                    </td>

                    <td>
                      {item.previousStock}
                    </td>

                    <td>
                      <strong>
                        {item.newStock}
                      </strong>
                    </td>

                    <td>
                      <span className="admin-history-reason">
                        {item.reason}
                      </span>
                    </td>

                  </tr>
                ))
              ) : (
                <tr>
                  <td
                    colSpan="7"
                    className="admin-inventory-empty"
                  >
                    No stock history yet.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

      </section>

      {/* =================================================
          STOCK ADJUSTMENT MODAL
      ================================================= */}

      {modalOpen && selectedProduct && (

        <div
          className="admin-stock-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeStockModal()
            }
          }}
        >

          <div className="admin-stock-modal">

            {/* HEADER */}

            <div className="admin-stock-modal-header">

              <div>

                <p className="admin-page-eyebrow">
                  INVENTORY ADJUSTMENT
                </p>

                <h2>
                  {adjustmentType === 'add'
                    ? 'Stock In'
                    : 'Stock Out'}
                </h2>

              </div>

              <button
                type="button"
                className="admin-stock-modal-close"
                onClick={closeStockModal}
              >
                ×
              </button>

            </div>

            {/* PRODUCT INFO */}

            <div className="admin-stock-modal-product">

              <div className="admin-stock-modal-product-icon">

                {selectedProduct.image ? (
                  <img
                    src={selectedProduct.image}
                    alt={selectedProduct.name}
                  />
                ) : (
                  <span>
                    {selectedProduct.name
                      ?.charAt(0)
                      ?.toUpperCase()}
                  </span>
                )}

              </div>

              <div>
                <strong>
                  {selectedProduct.name}
                </strong>

                <span>
                  {selectedProduct.sku || 'No SKU'}
                </span>
              </div>

              <div className="admin-stock-modal-current">

                <span>Current Stock</span>

                <strong>
                  {Number(selectedProduct.stock) || 0}
                </strong>

              </div>

            </div>

            {/* FORM */}

            <form onSubmit={handleStockAdjustment}>

              <div className="admin-stock-type-selector">

                <button
                  type="button"
                  className={
                    adjustmentType === 'add'
                      ? 'active'
                      : ''
                  }
                  onClick={() => {
                    setAdjustmentType('add')
                    setError('')
                  }}
                >
                  + Stock In
                </button>

                <button
                  type="button"
                  className={
                    adjustmentType === 'remove'
                      ? 'active remove'
                      : ''
                  }
                  onClick={() => {
                    setAdjustmentType('remove')
                    setError('')
                  }}
                >
                  − Stock Out
                </button>

              </div>

              {/* QUANTITY */}

              <div className="admin-stock-form-field">

                <label>
                  Quantity
                  <strong>*</strong>
                </label>

                <input
                  type="number"
                  min="1"
                  step="1"
                  value={quantity}
                  onChange={(e) => {
                    setQuantity(e.target.value)
                    setError('')
                  }}
                  placeholder="Enter quantity"
                  autoFocus
                />

              </div>

              {/* REASON */}

              <div className="admin-stock-form-field">

                <label>
                  Reason
                  <span>Optional</span>
                </label>

                <textarea
                  rows="3"
                  value={reason}
                  onChange={(e) =>
                    setReason(e.target.value)
                  }
                  placeholder={
                    adjustmentType === 'add'
                      ? 'e.g. New stock received'
                      : 'e.g. Damaged item / manual adjustment'
                  }
                />

              </div>

              {/* PREVIEW */}

              {quantity &&
                Number(quantity) > 0 && (
                  <div className="admin-stock-preview">

                    <span>
                      Stock after adjustment
                    </span>

                    <strong>
                      {adjustmentType === 'add'
                        ? (Number(
                            selectedProduct.stock
                          ) || 0) +
                          Number(quantity)
                        : Math.max(
                            0,
                            (Number(
                              selectedProduct.stock
                            ) || 0) -
                              Number(quantity)
                          )}
                    </strong>

                  </div>
                )}

              {/* ERROR */}

              {error && (
                <div className="admin-stock-error">
                  {error}
                </div>
              )}

              {/* ACTIONS */}

              <div className="admin-stock-modal-actions">

                <button
                  type="button"
                  className="admin-stock-cancel-btn"
                  onClick={closeStockModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className={`admin-stock-save-btn ${
                    adjustmentType === 'remove'
                      ? 'remove'
                      : ''
                  }`}
                >
                  {adjustmentType === 'add'
                    ? 'Add Stock'
                    : 'Remove Stock'}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  )
}

export default Inventory