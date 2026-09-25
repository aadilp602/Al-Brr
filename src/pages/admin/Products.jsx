import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

/* =========================================================
   STORAGE KEY
========================================================= */

const STORAGE_KEY = 'al-brr-admin-products'

/* =========================================================
   ORIGINAL AL BRR PRODUCTS
========================================================= */

const defaultProducts = [
  {
    id: 'al-durrat',
    name: 'Al-Durrat',
    sku: 'AB-NR-001',
    category: 'Noir',
    brand: 'Al Brr',
    gender: 'Men',
    price: 599,
    discountPrice: null,
    gst: null,
    size: '',
    fragranceFamily: '',
    shortDescription: '',
    description: '',
    stock: 42,
    lowStockThreshold: 10,
    active: true,
    status: 'Active',
    featured: false,
    newArrival: false,
    bestSeller: false,
    image: '',
    imageName: '',
  },

  {
    id: 'gen-z7',
    name: 'Gen-Z7',
    sku: 'AB-NR-002',
    category: 'Noir',
    brand: 'Al Brr',
    gender: 'Men',
    price: 599,
    discountPrice: null,
    gst: null,
    size: '',
    fragranceFamily: '',
    shortDescription: '',
    description: '',
    stock: 28,
    lowStockThreshold: 10,
    active: true,
    status: 'Active',
    featured: false,
    newArrival: false,
    bestSeller: false,
    image: '',
    imageName: '',
  },

  {
    id: 'alfa-Men',
    name: 'Alfa-Men',
    sku: 'AB-NR-003',
    category: 'Noir',
    brand: 'Al Brr',
    gender: 'Men',
    price: 599,
    discountPrice: null,
    gst: null,
    size: '',
    fragranceFamily: '',
    shortDescription: '',
    description: '',
    stock: 8,
    lowStockThreshold: 10,
    active: true,
    status: 'Active',
    featured: false,
    newArrival: false,
    bestSeller: false,
    image: '',
    imageName: '',
  },

  {
    id: 'al-avriq',
    name: 'Al-Avriq',
    sku: 'AB-RG-001',
    category: 'Rouge',
    brand: 'Al Brr',
    gender: 'Women',
    price: 599,
    discountPrice: null,
    gst: null,
    size: '',
    fragranceFamily: '',
    shortDescription: '',
    description: '',
    stock: 24,
    lowStockThreshold: 10,
    active: true,
    status: 'Active',
    featured: false,
    newArrival: false,
    bestSeller: false,
    image: '',
    imageName: '',
  },

  {
    id: 'saji-oudh',
    name: 'Saji Oudh',
    sku: 'AB-RG-002',
    category: 'Rouge',
    brand: 'Al Brr',
    gender: 'Unisex',
    price: 599,
    discountPrice: null,
    gst: null,
    size: '',
    fragranceFamily: '',
    shortDescription: '',
    description: '',
    stock: 5,
    lowStockThreshold: 10,
    active: true,
    status: 'Active',
    featured: false,
    newArrival: false,
    bestSeller: false,
    image: '',
    imageName: '',
  },

  {
    id: 'lucky-girl',
    name: 'Lucky Girl',
    sku: 'AB-RG-003',
    category: 'Rouge',
    brand: 'Al Brr',
    gender: 'Women',
    price: 599,
    discountPrice: null,
    gst: null,
    size: '',
    fragranceFamily: '',
    shortDescription: '',
    description: '',
    stock: 0,
    lowStockThreshold: 10,
    active: false,
    status: 'Inactive',
    featured: false,
    newArrival: false,
    bestSeller: false,
    image: '',
    imageName: '',
  },
]

/* =========================================================
   READ + SEED PRODUCTS
========================================================= */

function getInitialProducts() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)

    /*
      No storage exists yet:
      create the original six products.
    */
    if (raw === null) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaultProducts)
      )

      return defaultProducts
    }

    const saved = JSON.parse(raw)

    if (!Array.isArray(saved)) {
      localStorage.setItem(
        STORAGE_KEY,
        JSON.stringify(defaultProducts)
      )

      return defaultProducts
    }

    /*
      Existing products must remain untouched.

      Add an original product only when its ID has never
      existed in storage.

      Deleted default products are tracked separately so
      they are not recreated after refresh.
    */

    const deletedDefaults = JSON.parse(
      localStorage.getItem(
        'al-brr-deleted-default-products'
      ) || '[]'
    )

    const deletedIds = Array.isArray(deletedDefaults)
      ? deletedDefaults
      : []

    const existingIds = new Set(
      saved.map((product) => String(product.id))
    )

    const missingDefaults = defaultProducts.filter(
      (product) =>
        !existingIds.has(String(product.id)) &&
        !deletedIds.includes(String(product.id))
    )

    if (missingDefaults.length === 0) {
      return saved
    }

    const mergedProducts = [
      ...saved,
      ...missingDefaults,
    ]

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(mergedProducts)
    )

    return mergedProducts
  } catch (error) {
    console.error(
      'Unable to load products:',
      error
    )

    return defaultProducts
  }
}

/* =========================================================
   STOCK BADGE
========================================================= */

function StockBadge({ product }) {
  const stock = Number(product.stock) || 0

  const threshold =
    product.lowStockThreshold === '' ||
    product.lowStockThreshold === null ||
    product.lowStockThreshold === undefined
      ? 10
      : Number(product.lowStockThreshold)

  if (stock === 0) {
    return (
      <span className="admin-product-badge out-stock">
        Out of Stock
      </span>
    )
  }

  if (stock <= threshold) {
    return (
      <span className="admin-product-badge low-stock">
        Low Stock
      </span>
    )
  }

  return (
    <span className="admin-product-badge in-stock">
      In Stock
    </span>
  )
}

/* =========================================================
   PRODUCTS PAGE
========================================================= */

function Products() {
  const navigate = useNavigate()

  const [products, setProducts] =
    useState(getInitialProducts)

  const [search, setSearch] =
    useState('')

  const [category, setCategory] =
    useState('all')

  const [status, setStatus] =
    useState('all')

  /* =======================================================
     SUMMARY COUNTS
  ======================================================= */

  const totalProducts = products.length

  const inStock = products.filter(
    (product) => {
      const stock =
        Number(product.stock) || 0

      const threshold =
        product.lowStockThreshold === '' ||
        product.lowStockThreshold === null ||
        product.lowStockThreshold === undefined
          ? 10
          : Number(
              product.lowStockThreshold
            )

      return stock > threshold
    }
  ).length

  const lowStock = products.filter(
    (product) => {
      const stock =
        Number(product.stock) || 0

      const threshold =
        product.lowStockThreshold === '' ||
        product.lowStockThreshold === null ||
        product.lowStockThreshold === undefined
          ? 10
          : Number(
              product.lowStockThreshold
            )

      return (
        stock > 0 &&
        stock <= threshold
      )
    }
  ).length

  const outOfStock = products.filter(
    (product) =>
      Number(product.stock) === 0
  ).length

  /* =======================================================
     FILTER PRODUCTS
  ======================================================= */

  const filteredProducts = useMemo(
    () => {
      const searchValue =
        search
          .trim()
          .toLowerCase()

      return products.filter(
        (product) => {
          const productName =
            String(
              product.name || ''
            ).toLowerCase()

          const productSku =
            String(
              product.sku || ''
            ).toLowerCase()

          const productCategory =
            String(
              product.category || ''
            ).toLowerCase()

          const productGender =
            String(
              product.gender || ''
            ).toLowerCase()

          const productStatus =
            String(
              product.status || ''
            ).toLowerCase()

          const matchesSearch =
            !searchValue ||
            productName.includes(
              searchValue
            ) ||
            productSku.includes(
              searchValue
            ) ||
            productCategory.includes(
              searchValue
            ) ||
            productGender.includes(
              searchValue
            )

          const matchesCategory =
            category === 'all' ||
            productCategory === category

          const matchesStatus =
            status === 'all' ||
            productStatus === status

          return (
            matchesSearch &&
            matchesCategory &&
            matchesStatus
          )
        }
      )
    },
    [
      products,
      search,
      category,
      status,
    ]
  )

  /* =======================================================
     EDIT PRODUCT
  ======================================================= */

  const handleEdit = (product) => {
    navigate(
      `/admin/products/edit/${product.id}`
    )
  }

  /* =======================================================
     VIEW PRODUCT
  ======================================================= */

  const handleView = (product) => {
    const availability =
      Number(product.stock) === 0
        ? 'Out of Stock'
        : Number(product.stock) <=
            Number(
              product.lowStockThreshold ??
                10
            )
          ? 'Low Stock'
          : 'In Stock'

    window.alert(
      `${product.name}

SKU: ${product.sku || '-'}
Category: ${product.category || '-'}
Gender: ${product.gender || '-'}
Price: ₹${product.price ?? 0}
Stock: ${product.stock ?? 0}
Availability: ${availability}
Status: ${product.status || '-'}`
    )
  }

  /* =======================================================
     DELETE PRODUCT
  ======================================================= */

  const handleDelete = (product) => {
    const confirmed =
      window.confirm(
        `Delete "${product.name}"?`
      )

    if (!confirmed) return

    const updatedProducts =
      products.filter(
        (item) =>
          String(item.id) !==
          String(product.id)
      )

    setProducts(updatedProducts)

    localStorage.setItem(
      STORAGE_KEY,
      JSON.stringify(updatedProducts)
    )

    /*
      If one of the original six products is deleted,
      remember that deletion so it doesn't get seeded
      again after refresh.
    */

    const isOriginalProduct =
      defaultProducts.some(
        (item) =>
          String(item.id) ===
          String(product.id)
      )

    if (isOriginalProduct) {
      try {
        const existingDeleted =
          JSON.parse(
            localStorage.getItem(
              'al-brr-deleted-default-products'
            ) || '[]'
          )

        const deletedIds =
          Array.isArray(
            existingDeleted
          )
            ? existingDeleted
            : []

        if (
          !deletedIds.includes(
            String(product.id)
          )
        ) {
          localStorage.setItem(
            'al-brr-deleted-default-products',
            JSON.stringify([
              ...deletedIds,
              String(product.id),
            ])
          )
        }
      } catch (error) {
        console.error(
          'Unable to remember deleted product:',
          error
        )
      }
    }
  }

  return (
    <div className="admin-products-page">

      {/* ================= PAGE HEADER ================= */}

      <div className="admin-products-header">

        <div>

          <p className="admin-page-eyebrow">
            PRODUCT MANAGEMENT
          </p>

          <h1>
            Products
          </h1>

          <p className="admin-page-description">
            Manage your fragrance
            catalogue, pricing and
            inventory.
          </p>

        </div>

        <Link
          to="/admin/products/add"
          className="admin-add-product-btn"
        >
          <span>
            ＋
          </span>

          Add Product
        </Link>

      </div>

      {/* ================= SUMMARY CARDS ================= */}

      <div className="admin-product-stats">

        {/* TOTAL */}

        <div className="admin-product-stat-card">

          <div className="admin-product-stat-icon">
            ◇
          </div>

          <div>

            <span>
              Total Products
            </span>

            <strong>
              {totalProducts}
            </strong>

            <small>
              All fragrances
            </small>

          </div>

        </div>

        {/* IN STOCK */}

        <div className="admin-product-stat-card">

          <div className="admin-product-stat-icon">
            ✓
          </div>

          <div>

            <span>
              In Stock
            </span>

            <strong>
              {inStock}
            </strong>

            <small>
              Ready to sell
            </small>

          </div>

        </div>

        {/* LOW STOCK */}

        <div className="admin-product-stat-card">

          <div className="admin-product-stat-icon">
            !
          </div>

          <div>

            <span>
              Low Stock
            </span>

            <strong>
              {lowStock}
            </strong>

            <small>
              Needs attention
            </small>

          </div>

        </div>

        {/* OUT OF STOCK */}

        <div className="admin-product-stat-card">

          <div className="admin-product-stat-icon">
            ×
          </div>

          <div>

            <span>
              Out of Stock
            </span>

            <strong>
              {outOfStock}
            </strong>

            <small>
              Unavailable
            </small>

          </div>

        </div>

      </div>

      {/* ================= PRODUCTS PANEL ================= */}

      <section className="admin-products-panel">

        {/* ================= TOOLBAR ================= */}

        <div className="admin-products-toolbar">

          {/* SEARCH */}

          <div className="admin-products-search">

            <span>
              ⌕
            </span>

            <input
              type="text"
              placeholder="Search products, SKU..."
              value={search}
              onChange={(e) =>
                setSearch(
                  e.target.value
                )
              }
            />

          </div>

          {/* FILTERS */}

          <div className="admin-products-filters">

            <select
              value={category}
              onChange={(e) =>
                setCategory(
                  e.target.value
                )
              }
            >

              <option value="all">
                All Categories
              </option>

              <option value="noir">
                Noir
              </option>

              <option value="rouge">
                Rouge
              </option>

            </select>

            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value
                )
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

        </div>

        {/* ================= TABLE ================= */}

        <div className="admin-products-table-wrap">

          <table className="admin-products-table">

            <thead>

              <tr>

                <th>
                  Product
                </th>

                <th>
                  SKU
                </th>

                <th>
                  Category
                </th>

                <th>
                  Price
                </th>

                <th>
                  Stock
                </th>

                <th>
                  Availability
                </th>

                <th>
                  Status
                </th>

                <th className="admin-table-action">
                  Action
                </th>

              </tr>

            </thead>

            <tbody>

              {filteredProducts.length >
              0 ? (

                filteredProducts.map(
                  (product) => (

                    <tr
                      key={
                        product.id
                      }
                    >

                      {/* PRODUCT */}

                      <td>

                        <div className="admin-product-info">

                          {product.image ? (

                            <div className="admin-product-thumb">

                              <img
                                src={
                                  product.image
                                }
                                alt={
                                  product.name
                                }
                                style={{
                                  width:
                                    '100%',
                                  height:
                                    '100%',
                                  objectFit:
                                    'cover',
                                }}
                              />

                            </div>

                          ) : (

                            <div className="admin-product-thumb">
                              AB
                            </div>

                          )}

                          <div>

                            <strong>
                              {
                                product.name
                              }
                            </strong>

                            <span>
                              {
                                product.gender
                              }
                            </span>

                          </div>

                        </div>

                      </td>

                      {/* SKU */}

                      <td>

                        <span className="admin-product-sku">
                          {product.sku ||
                            '-'}
                        </span>

                      </td>

                      {/* CATEGORY */}

                      <td>
                        {product.category ||
                          '-'}
                      </td>

                      {/* PRICE */}

                      <td>

                        <strong className="admin-product-price">

                          ₹
                          {product.price ??
                            0}

                        </strong>

                      </td>

                      {/* STOCK */}

                      <td>

                        <strong>
                          {product.stock ??
                            0}
                        </strong>

                      </td>

                      {/* AVAILABILITY */}

                      <td>

                        <StockBadge
                          product={
                            product
                          }
                        />

                      </td>

                      {/* STATUS */}

                      <td>

                        <span
                          className={`admin-product-status ${
                            product.status ===
                            'Active'
                              ? 'active'
                              : 'inactive'
                          }`}
                        >

                          <i />

                          {product.status ||
                            'Inactive'}

                        </span>

                      </td>

                      {/* ACTIONS */}

                      <td>

                        <div className="admin-product-actions">

                          {/* VIEW */}

                          <button
                            type="button"
                            title="View"
                            onClick={() =>
                              handleView(
                                product
                              )
                            }
                          >
                            ◉
                          </button>

                          {/* EDIT */}

                          <button
                            type="button"
                            title="Edit"
                            onClick={() =>
                              handleEdit(
                                product
                              )
                            }
                          >
                            ✎
                          </button>

                          {/* DELETE */}

                          <button
                            type="button"
                            className="delete"
                            title="Delete"
                            onClick={() =>
                              handleDelete(
                                product
                              )
                            }
                          >
                            ×
                          </button>

                        </div>

                      </td>

                    </tr>

                  )
                )

              ) : (

                <tr>

                  <td
                    colSpan="8"
                    style={{
                      textAlign:
                        'center',
                      padding:
                        '55px 20px',
                      color:
                        '#958c7e',
                    }}
                  >
                    No products found.
                  </td>

                </tr>

              )}

            </tbody>

          </table>

        </div>

        {/* ================= TABLE FOOTER ================= */}

        <div className="admin-products-footer">

          <p>

            Showing{' '}

            <strong>
              {
                filteredProducts.length
              }
            </strong>

            {' '}of{' '}

            <strong>
              {products.length}
            </strong>

            {' '}products

          </p>

          <div className="admin-products-pagination">

            <button
              type="button"
            >
              ‹
            </button>

            <button
              type="button"
              className="active"
            >
              1
            </button>

            <button
              type="button"
            >
              ›
            </button>

          </div>

        </div>

      </section>

    </div>
  )
}

export default Products