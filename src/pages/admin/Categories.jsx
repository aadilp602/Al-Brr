import { useMemo, useState } from 'react'

const CATEGORY_STORAGE_KEY = 'al-brr-admin-categories'
const PRODUCT_STORAGE_KEY = 'al-brr-admin-products'

/* =========================================================
   DEFAULT CATEGORIES
========================================================= */

const defaultCategories = [
  {
    id: 'noir',
    name: 'Noir',
    description:
      'Bold, deep and sophisticated fragrances from the Noir collection.',
    status: 'Active',
    createdAt: new Date().toISOString(),
  },
  {
    id: 'rouge',
    name: 'Rouge',
    description:
      'Elegant, expressive and captivating fragrances from the Rouge collection.',
    status: 'Active',
    createdAt: new Date().toISOString(),
  },
]

/* =========================================================
   LOAD CATEGORIES
========================================================= */

function getInitialCategories() {
  try {
    const raw = localStorage.getItem(CATEGORY_STORAGE_KEY)

    if (raw === null) {
      localStorage.setItem(
        CATEGORY_STORAGE_KEY,
        JSON.stringify(defaultCategories)
      )

      return defaultCategories
    }

    const saved = JSON.parse(raw)

    return Array.isArray(saved)
      ? saved
      : defaultCategories
  } catch (error) {
    console.error('Unable to load categories:', error)
    return defaultCategories
  }
}

/* =========================================================
   LOAD PRODUCTS
========================================================= */

function getProducts() {
  try {
    const products = JSON.parse(
      localStorage.getItem(PRODUCT_STORAGE_KEY) || '[]'
    )

    return Array.isArray(products) ? products : []
  } catch (error) {
    console.error('Unable to load products:', error)
    return []
  }
}

/* =========================================================
   CATEGORIES PAGE
========================================================= */

function Categories() {
  const [categories, setCategories] =
    useState(getInitialCategories)

  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')

  const [modalOpen, setModalOpen] = useState(false)
  const [editingCategory, setEditingCategory] = useState(null)

  const [form, setForm] = useState({
    name: '',
    description: '',
    status: 'Active',
  })

  const [errors, setErrors] = useState({})

  const products = getProducts()

  /* =======================================================
     SAVE CATEGORIES
  ======================================================= */

  const saveCategories = (updatedCategories) => {
    setCategories(updatedCategories)

    localStorage.setItem(
      CATEGORY_STORAGE_KEY,
      JSON.stringify(updatedCategories)
    )
  }

  /* =======================================================
     PRODUCT COUNT
  ======================================================= */

  const getProductCount = (categoryName) => {
    return products.filter(
      (product) =>
        String(product.category || '').toLowerCase() ===
        String(categoryName || '').toLowerCase()
    ).length
  }

  /* =======================================================
     SUMMARY
  ======================================================= */

  const totalCategories = categories.length

  const activeCategories = categories.filter(
    (category) => category.status === 'Active'
  ).length

  const inactiveCategories = categories.filter(
    (category) => category.status === 'Inactive'
  ).length

  const totalAssignedProducts = categories.reduce(
    (total, category) =>
      total + getProductCount(category.name),
    0
  )

  /* =======================================================
     FILTER
  ======================================================= */

  const filteredCategories = useMemo(() => {
    const searchValue = search.trim().toLowerCase()

    return categories.filter((category) => {
      const name = String(category.name || '').toLowerCase()

      const description = String(
        category.description || ''
      ).toLowerCase()

      const categoryStatus = String(
        category.status || ''
      ).toLowerCase()

      const matchesSearch =
        !searchValue ||
        name.includes(searchValue) ||
        description.includes(searchValue)

      const matchesStatus =
        statusFilter === 'all' ||
        categoryStatus === statusFilter

      return matchesSearch && matchesStatus
    })
  }, [categories, search, statusFilter])

  /* =======================================================
     OPEN ADD MODAL
  ======================================================= */

  const openAddModal = () => {
    setEditingCategory(null)

    setForm({
      name: '',
      description: '',
      status: 'Active',
    })

    setErrors({})
    setModalOpen(true)
  }

  /* =======================================================
     OPEN EDIT MODAL
  ======================================================= */

  const openEditModal = (category) => {
    setEditingCategory(category)

    setForm({
      name: category.name || '',
      description: category.description || '',
      status: category.status || 'Active',
    })

    setErrors({})
    setModalOpen(true)
  }

  /* =======================================================
     CLOSE MODAL
  ======================================================= */

  const closeModal = () => {
    setModalOpen(false)
    setEditingCategory(null)
    setErrors({})
  }

  /* =======================================================
     FORM CHANGE
  ======================================================= */

  const handleChange = (e) => {
    const { name, value } = e.target

    setForm((prev) => ({
      ...prev,
      [name]: value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  /* =======================================================
     ADD / UPDATE CATEGORY
  ======================================================= */

  const handleSubmit = (e) => {
    e.preventDefault()

    const categoryName = form.name.trim()

    if (!categoryName) {
      setErrors({
        name: 'Category name is required.',
      })

      return
    }

    const duplicate = categories.some(
      (category) =>
        category.name.toLowerCase() ===
          categoryName.toLowerCase() &&
        category.id !== editingCategory?.id
    )

    if (duplicate) {
      setErrors({
        name: 'This category already exists.',
      })

      return
    }

    if (editingCategory) {
      const oldName = editingCategory.name

      const updatedCategories = categories.map((category) =>
        category.id === editingCategory.id
          ? {
              ...category,
              name: categoryName,
              description: form.description.trim(),
              status: form.status,
              updatedAt: new Date().toISOString(),
            }
          : category
      )

      /*
        If category name changes,
        update products using the old category.
      */

      if (
        oldName.toLowerCase() !==
        categoryName.toLowerCase()
      ) {
        const currentProducts = getProducts()

        const updatedProducts = currentProducts.map((product) =>
          String(product.category || '').toLowerCase() ===
          oldName.toLowerCase()
            ? {
                ...product,
                category: categoryName,
                updatedAt: new Date().toISOString(),
              }
            : product
        )

        localStorage.setItem(
          PRODUCT_STORAGE_KEY,
          JSON.stringify(updatedProducts)
        )
      }

      saveCategories(updatedCategories)
    } else {
      const slug =
        categoryName
          .toLowerCase()
          .trim()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/^-+|-+$/g, '') || 'category'

      const newCategory = {
        id: `${slug}-${Date.now()}`,
        name: categoryName,
        description: form.description.trim(),
        status: form.status,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      }

      saveCategories([
        newCategory,
        ...categories,
      ])
    }

    closeModal()
  }

  /* =======================================================
     STATUS TOGGLE
  ======================================================= */

  const toggleStatus = (category) => {
    const updatedCategories = categories.map((item) =>
      item.id === category.id
        ? {
            ...item,
            status:
              item.status === 'Active'
                ? 'Inactive'
                : 'Active',
            updatedAt: new Date().toISOString(),
          }
        : item
    )

    saveCategories(updatedCategories)
  }

  /* =======================================================
     DELETE CATEGORY
  ======================================================= */

  const handleDelete = (category) => {
    const productCount = getProductCount(category.name)

    if (productCount > 0) {
      window.alert(
        `"${category.name}" has ${productCount} product${
          productCount === 1 ? '' : 's'
        }. Move or delete those products before deleting this category.`
      )

      return
    }

    const confirmed = window.confirm(
      `Delete category "${category.name}"?`
    )

    if (!confirmed) return

    const updatedCategories = categories.filter(
      (item) => item.id !== category.id
    )

    saveCategories(updatedCategories)
  }

  return (
    <div className="admin-categories-page">

      {/* ================= HEADER ================= */}

      <div className="admin-categories-header">

        <div>
          <p className="admin-page-eyebrow">
            CATALOGUE MANAGEMENT
          </p>

          <h1>Categories</h1>

          <p className="admin-page-description">
            Organize and manage your perfume collections.
          </p>
        </div>

        <button
          type="button"
          className="admin-add-category-btn"
          onClick={openAddModal}
        >
          <span>＋</span>
          Add Category
        </button>

      </div>

      {/* ================= STATS ================= */}

      <div className="admin-category-stats">

        <div className="admin-category-stat-card">
          <div className="admin-category-stat-icon">
            ▦
          </div>

          <div>
            <span>Total Categories</span>
            <strong>{totalCategories}</strong>
            <small>All collections</small>
          </div>
        </div>

        <div className="admin-category-stat-card">
          <div className="admin-category-stat-icon">
            ✓
          </div>

          <div>
            <span>Active</span>
            <strong>{activeCategories}</strong>
            <small>Visible categories</small>
          </div>
        </div>

        <div className="admin-category-stat-card">
          <div className="admin-category-stat-icon">
            ○
          </div>

          <div>
            <span>Inactive</span>
            <strong>{inactiveCategories}</strong>
            <small>Hidden categories</small>
          </div>
        </div>

        <div className="admin-category-stat-card">
          <div className="admin-category-stat-icon">
            ◇
          </div>

          <div>
            <span>Products</span>
            <strong>{totalAssignedProducts}</strong>
            <small>Assigned products</small>
          </div>
        </div>

      </div>

      {/* ================= PANEL ================= */}

      <section className="admin-categories-panel">

        {/* TOOLBAR */}

        <div className="admin-categories-toolbar">

          <div className="admin-categories-search">
            <span>⌕</span>

            <input
              type="text"
              placeholder="Search categories..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          <select
            className="admin-category-filter"
            value={statusFilter}
            onChange={(e) =>
              setStatusFilter(e.target.value)
            }
          >
            <option value="all">
              All Status
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

        <div className="admin-categories-table-wrap">

          <table className="admin-categories-table">

            <thead>
              <tr>
                <th>Category</th>
                <th>Description</th>
                <th>Products</th>
                <th>Status</th>
                <th className="admin-table-action">
                  Action
                </th>
              </tr>
            </thead>

            <tbody>

              {filteredCategories.length > 0 ? (
                filteredCategories.map((category) => {

                  const productCount =
                    getProductCount(category.name)

                  return (
                    <tr key={category.id}>

                      {/* CATEGORY */}

                      <td>
                        <div className="admin-category-name">

                          <div className="admin-category-icon">
                            {category.name
                              .charAt(0)
                              .toUpperCase()}
                          </div>

                          <div>
                            <strong>
                              {category.name}
                            </strong>

                            <span>
                              Al Brr Collection
                            </span>
                          </div>

                        </div>
                      </td>

                      {/* DESCRIPTION */}

                      <td>
                        <p className="admin-category-description">
                          {category.description ||
                            'No description added.'}
                        </p>
                      </td>

                      {/* PRODUCTS */}

                      <td>
                        <span className="admin-category-product-count">
                          {productCount}
                        </span>
                      </td>

                      {/* STATUS */}

                      <td>
                        <button
                          type="button"
                          className={`admin-category-status ${
                            category.status === 'Active'
                              ? 'active'
                              : 'inactive'
                          }`}
                          onClick={() =>
                            toggleStatus(category)
                          }
                          title="Change status"
                        >
                          <i />
                          {category.status}
                        </button>
                      </td>

                      {/* ACTION */}

                      <td>
                        <div className="admin-category-actions">

                          <button
                            type="button"
                            title="Edit"
                            onClick={() =>
                              openEditModal(category)
                            }
                          >
                            ✎
                          </button>

                          <button
                            type="button"
                            className="delete"
                            title="Delete"
                            onClick={() =>
                              handleDelete(category)
                            }
                          >
                            ×
                          </button>

                        </div>
                      </td>

                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td
                    colSpan="5"
                    className="admin-category-empty"
                  >
                    No categories found.
                  </td>
                </tr>
              )}

            </tbody>

          </table>

        </div>

        {/* FOOTER */}

        <div className="admin-categories-footer">
          <p>
            Showing{' '}
            <strong>
              {filteredCategories.length}
            </strong>{' '}
            of{' '}
            <strong>
              {categories.length}
            </strong>{' '}
            categories
          </p>
        </div>

      </section>

      {/* =================================================
          ADD / EDIT MODAL
      ================================================= */}

      {modalOpen && (
        <div
          className="admin-category-modal-overlay"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              closeModal()
            }
          }}
        >

          <div className="admin-category-modal">

            {/* MODAL HEADER */}

            <div className="admin-category-modal-header">

              <div>
                <p className="admin-page-eyebrow">
                  CATEGORY MANAGEMENT
                </p>

                <h2>
                  {editingCategory
                    ? 'Edit Category'
                    : 'Add Category'}
                </h2>
              </div>

              <button
                type="button"
                className="admin-category-modal-close"
                onClick={closeModal}
              >
                ×
              </button>

            </div>

            {/* FORM */}

            <form onSubmit={handleSubmit}>

              <div className="admin-category-form-field">

                <label>
                  Category Name
                  <strong>*</strong>
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="e.g. Noir"
                  autoFocus
                />

                {errors.name && (
                  <small className="admin-field-error">
                    {errors.name}
                  </small>
                )}

              </div>

              <div className="admin-category-form-field">

                <label>
                  Description
                  <span>Optional</span>
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  placeholder="Describe this collection..."
                  rows="5"
                />

              </div>

              <div className="admin-category-form-field">

                <label>
                  Status
                </label>

                <select
                  name="status"
                  value={form.status}
                  onChange={handleChange}
                >
                  <option value="Active">
                    Active
                  </option>

                  <option value="Inactive">
                    Inactive
                  </option>
                </select>

              </div>

              {/* ACTIONS */}

              <div className="admin-category-modal-actions">

                <button
                  type="button"
                  className="admin-category-cancel-btn"
                  onClick={closeModal}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="admin-category-save-btn"
                >
                  {editingCategory
                    ? 'Update Category'
                    : 'Add Category'}
                </button>

              </div>

            </form>

          </div>

        </div>
      )}

    </div>
  )
}

export default Categories