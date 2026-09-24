import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

function EditProduct() {
  const navigate = useNavigate()
  const { id } = useParams()

  const [form, setForm] = useState({
    name: '',
    sku: '',
    category: '',
    brand: 'Al Brr',
    price: '',
    discountPrice: '',
    gst: '',
    size: '',
    fragranceFamily: '',
    gender: '',
    shortDescription: '',
    description: '',
    stock: '',
    lowStockThreshold: '10',
    active: true,
    featured: false,
    newArrival: false,
    bestSeller: false,
  })

  const [image, setImage] = useState('')
  const [imageName, setImageName] = useState('')
  const [errors, setErrors] = useState({})
  const [loading, setLoading] = useState(true)
  const [productFound, setProductFound] = useState(true)

  /* =========================================================
     LOAD PRODUCT
  ========================================================= */

  useEffect(() => {
    try {
      const savedProducts = JSON.parse(
        localStorage.getItem('al-brr-admin-products') || '[]'
      )

      const product = savedProducts.find(
        (item) => String(item.id) === String(id)
      )

      if (!product) {
        setProductFound(false)
        setLoading(false)
        return
      }

      setForm({
        name: product.name || '',
        sku: product.sku || '',
        category: product.category || '',
        brand: product.brand || 'Al Brr',

        price:
          product.price === null ||
          product.price === undefined
            ? ''
            : product.price,

        discountPrice:
          product.discountPrice === null ||
          product.discountPrice === undefined
            ? ''
            : product.discountPrice,

        gst:
          product.gst === null ||
          product.gst === undefined
            ? ''
            : product.gst,

        size: product.size || '',

        fragranceFamily:
          product.fragranceFamily || '',

        gender: product.gender || '',

        shortDescription:
          product.shortDescription || '',

        description:
          product.description || '',

        stock:
          product.stock === null ||
          product.stock === undefined
            ? ''
            : product.stock,

        lowStockThreshold:
          product.lowStockThreshold === null ||
          product.lowStockThreshold === undefined
            ? '10'
            : product.lowStockThreshold,

        active:
          product.active !== undefined
            ? Boolean(product.active)
            : product.status === 'Active',

        featured: Boolean(product.featured),

        newArrival: Boolean(product.newArrival),

        bestSeller: Boolean(product.bestSeller),
      })

      setImage(product.image || '')
      setImageName(product.imageName || '')

      setLoading(false)
    } catch (error) {
      console.error('Unable to load product:', error)

      setProductFound(false)
      setLoading(false)
    }
  }, [id])

  /* =========================================================
     INPUT CHANGE
  ========================================================= */

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target

    setForm((prev) => ({
      ...prev,
      [name]:
        type === 'checkbox'
          ? checked
          : value,
    }))

    setErrors((prev) => ({
      ...prev,
      [name]: '',
    }))
  }

  /* =========================================================
     IMAGE
  ========================================================= */

  const handleImage = (e) => {
    const file = e.target.files?.[0]

    if (!file) return

    if (!file.type.startsWith('image/')) {
      setErrors((prev) => ({
        ...prev,
        image: 'Please select a valid image.',
      }))

      return
    }

    if (file.size > 2 * 1024 * 1024) {
      setErrors((prev) => ({
        ...prev,
        image: 'Image must be smaller than 2MB.',
      }))

      return
    }

    const reader = new FileReader()

    reader.onloadend = () => {
      setImage(reader.result)
      setImageName(file.name)

      setErrors((prev) => ({
        ...prev,
        image: '',
      }))
    }

    reader.readAsDataURL(file)
  }

  const removeImage = () => {
    setImage('')
    setImageName('')
  }

  /* =========================================================
     VALIDATION
  ========================================================= */

  const validate = () => {
    const newErrors = {}

    if (!form.name.trim()) {
      newErrors.name =
        'Product name is required.'
    }

    if (!form.category) {
      newErrors.category =
        'Category is required.'
    }

    if (!form.gender) {
      newErrors.gender =
        'Gender is required.'
    }

    if (
      form.price === '' ||
      Number(form.price) < 0
    ) {
      newErrors.price =
        'Enter a valid price.'
    }

    if (
      form.stock === '' ||
      Number(form.stock) < 0
    ) {
      newErrors.stock =
        'Enter valid stock quantity.'
    }

    if (
      form.discountPrice !== '' &&
      Number(form.discountPrice) < 0
    ) {
      newErrors.discountPrice =
        'Enter a valid discount price.'
    }

    if (
      form.gst !== '' &&
      Number(form.gst) < 0
    ) {
      newErrors.gst =
        'Enter valid GST.'
    }

    setErrors(newErrors)

    return (
      Object.keys(newErrors).length === 0
    )
  }

  /* =========================================================
     UPDATE PRODUCT
  ========================================================= */

  const handleSubmit = (e) => {
    e.preventDefault()

    if (!validate()) return

    try {
      const savedProducts = JSON.parse(
        localStorage.getItem(
          'al-brr-admin-products'
        ) || '[]'
      )

      const productIndex =
        savedProducts.findIndex(
          (item) =>
            String(item.id) === String(id)
        )

      if (productIndex === -1) {
        setErrors({
          save: 'Product could not be found.',
        })

        return
      }

      const oldProduct =
        savedProducts[productIndex]

      const updatedProduct = {
        ...oldProduct,

        name: form.name.trim(),

        sku:
          form.sku.trim() ||
          oldProduct.sku ||
          `AB-${Date.now()
            .toString()
            .slice(-6)}`,

        category: form.category,

        brand:
          form.brand.trim() || 'Al Brr',

        price: Number(form.price),

        discountPrice:
          form.discountPrice === ''
            ? null
            : Number(form.discountPrice),

        gst:
          form.gst === ''
            ? null
            : Number(form.gst),

        size: form.size.trim(),

        fragranceFamily:
          form.fragranceFamily.trim(),

        gender: form.gender,

        shortDescription:
          form.shortDescription.trim(),

        description:
          form.description.trim(),

        stock: Number(form.stock),

        lowStockThreshold:
          form.lowStockThreshold === ''
            ? 10
            : Number(
                form.lowStockThreshold
              ),

        active: form.active,

        status:
          form.active
            ? 'Active'
            : 'Inactive',

        featured: form.featured,

        newArrival:
          form.newArrival,

        bestSeller:
          form.bestSeller,

        image,

        imageName,

        updatedAt:
          new Date().toISOString(),
      }

      const updatedProducts = [
        ...savedProducts,
      ]

      updatedProducts[productIndex] =
        updatedProduct

      localStorage.setItem(
        'al-brr-admin-products',
        JSON.stringify(updatedProducts)
      )

      navigate('/admin/products')
    } catch (error) {
      console.error(
        'Unable to update product:',
        error
      )

      setErrors({
        save:
          'Product could not be updated. Try again.',
      })
    }
  }

  /* =========================================================
     LOADING
  ========================================================= */

  if (loading) {
    return (
      <div className="admin-add-product-page">
        <section className="admin-add-section">
          <p>Loading product...</p>
        </section>
      </div>
    )
  }

  /* =========================================================
     PRODUCT NOT FOUND
  ========================================================= */

  if (!productFound) {
    return (
      <div className="admin-add-product-page">

        <div className="admin-add-product-header">
          <div>
            <p className="admin-page-eyebrow">
              PRODUCT MANAGEMENT
            </p>

            <h1>Product Not Found</h1>

            <p className="admin-page-description">
              This product could not be found.
            </p>
          </div>
        </div>

        <section className="admin-add-section">

          <p
            style={{
              marginBottom: '20px',
              color: '#777',
            }}
          >
            The product may have been deleted
            or the URL is incorrect.
          </p>

          <button
            type="button"
            className="admin-add-save-btn"
            onClick={() =>
              navigate('/admin/products')
            }
          >
            Back to Products
          </button>

        </section>

      </div>
    )
  }

  return (
    <div className="admin-add-product-page">

      {/* ================= HEADER ================= */}

      <div className="admin-add-product-header">

        <div>

          <button
            type="button"
            className="admin-add-back"
            onClick={() =>
              navigate('/admin/products')
            }
          >
            ← Products
          </button>

          <p className="admin-page-eyebrow">
            PRODUCT MANAGEMENT
          </p>

          <h1>Edit Product</h1>

          <p className="admin-page-description">
            Update product information,
            pricing and inventory.
          </p>

        </div>


        <div className="admin-add-header-actions">

          <button
            type="button"
            className="admin-add-cancel-btn"
            onClick={() =>
              navigate('/admin/products')
            }
          >
            Cancel
          </button>

          <button
            type="submit"
            form="edit-product-form"
            className="admin-add-save-btn"
          >
            Update Product
          </button>

        </div>

      </div>


      {/* ================= FORM ================= */}

      <form
        id="edit-product-form"
        onSubmit={handleSubmit}
        className="admin-add-product-layout"
      >

        {/* ================= LEFT ================= */}

        <div className="admin-add-product-main">


          {/* BASIC INFORMATION */}

          <section className="admin-add-section">

            <div className="admin-add-section-heading">

              <span>01</span>

              <div>
                <h2>
                  Basic Information
                </h2>

                <p>
                  Update the main product
                  information.
                </p>
              </div>

            </div>


            <div className="admin-add-fields">

              <div className="admin-add-field full">

                <label>
                  Product Name
                  <strong>*</strong>
                </label>

                <input
                  type="text"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="Product name"
                />

                {errors.name && (
                  <small className="admin-field-error">
                    {errors.name}
                  </small>
                )}

              </div>


              <div className="admin-add-field">

                <label>SKU</label>

                <input
                  type="text"
                  name="sku"
                  value={form.sku}
                  onChange={handleChange}
                  placeholder="e.g. AB-NR-007"
                />

              </div>


              <div className="admin-add-field">

                <label>Brand</label>

                <input
                  type="text"
                  name="brand"
                  value={form.brand}
                  onChange={handleChange}
                  placeholder="Al Brr"
                />

              </div>


              <div className="admin-add-field">

                <label>
                  Category
                  <strong>*</strong>
                </label>

                <select
                  name="category"
                  value={form.category}
                  onChange={handleChange}
                >
                  <option value="">
                    Select category
                  </option>

                  <option value="Noir">
                    Noir
                  </option>

                  <option value="Rouge">
                    Rouge
                  </option>
                </select>

                {errors.category && (
                  <small className="admin-field-error">
                    {errors.category}
                  </small>
                )}

              </div>


              <div className="admin-add-field">

                <label>
                  Gender
                  <strong>*</strong>
                </label>

                <select
                  name="gender"
                  value={form.gender}
                  onChange={handleChange}
                >
                  <option value="">
                    Select gender
                  </option>

                  <option value="Men">
                    Men
                  </option>

                  <option value="Women">
                    Women
                  </option>

                  <option value="Unisex">
                    Unisex
                  </option>
                </select>

                {errors.gender && (
                  <small className="admin-field-error">
                    {errors.gender}
                  </small>
                )}

              </div>


              <div className="admin-add-field full">

                <label>
                  Short Description
                  <span>Optional</span>
                </label>

                <input
                  type="text"
                  name="shortDescription"
                  value={
                    form.shortDescription
                  }
                  onChange={handleChange}
                  placeholder="Short product summary"
                />

              </div>


              <div className="admin-add-field full">

                <label>
                  Description
                  <span>Optional</span>
                </label>

                <textarea
                  name="description"
                  value={form.description}
                  onChange={handleChange}
                  rows="6"
                  placeholder="Product description..."
                />

              </div>

            </div>

          </section>


          {/* ================= PRICING ================= */}

          <section className="admin-add-section">

            <div className="admin-add-section-heading">

              <span>02</span>

              <div>
                <h2>Pricing</h2>

                <p>
                  Update product pricing
                  and tax.
                </p>
              </div>

            </div>


            <div className="admin-add-fields three">

              <div className="admin-add-field">

                <label>
                  Price
                  <strong>*</strong>
                </label>

                <div className="admin-price-input">

                  <span>₹</span>

                  <input
                    type="number"
                    name="price"
                    value={form.price}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="599"
                  />

                </div>

                {errors.price && (
                  <small className="admin-field-error">
                    {errors.price}
                  </small>
                )}

              </div>


              <div className="admin-add-field">

                <label>
                  Discount Price
                  <span>Optional</span>
                </label>

                <div className="admin-price-input">

                  <span>₹</span>

                  <input
                    type="number"
                    name="discountPrice"
                    value={
                      form.discountPrice
                    }
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="499"
                  />

                </div>

                {errors.discountPrice && (
                  <small className="admin-field-error">
                    {errors.discountPrice}
                  </small>
                )}

              </div>


              <div className="admin-add-field">

                <label>
                  GST
                  <span>Optional</span>
                </label>

                <div className="admin-price-input">

                  <input
                    type="number"
                    name="gst"
                    value={form.gst}
                    onChange={handleChange}
                    min="0"
                    step="0.01"
                    placeholder="18"
                  />

                  <span>%</span>

                </div>

                {errors.gst && (
                  <small className="admin-field-error">
                    {errors.gst}
                  </small>
                )}

              </div>

            </div>

          </section>


          {/* ================= FRAGRANCE DETAILS ================= */}

          <section className="admin-add-section">

            <div className="admin-add-section-heading">

              <span>03</span>

              <div>
                <h2>
                  Fragrance Details
                </h2>

                <p>
                  Update perfume
                  specifications.
                </p>
              </div>

            </div>


            <div className="admin-add-fields">

              <div className="admin-add-field">

                <label>
                  Size / Volume
                </label>

                <input
                  type="text"
                  name="size"
                  value={form.size}
                  onChange={handleChange}
                  placeholder="e.g. 50ml"
                />

              </div>


              <div className="admin-add-field">

                <label>
                  Fragrance Family
                </label>

                <input
                  type="text"
                  name="fragranceFamily"
                  value={
                    form.fragranceFamily
                  }
                  onChange={handleChange}
                  placeholder="e.g. Woody, Oriental"
                />

              </div>

            </div>

          </section>


          {/* ================= INVENTORY ================= */}

          <section className="admin-add-section">

            <div className="admin-add-section-heading">

              <span>04</span>

              <div>
                <h2>Inventory</h2>

                <p>
                  Update stock quantity and
                  threshold.
                </p>
              </div>

            </div>


            <div className="admin-add-fields">

              <div className="admin-add-field">

                <label>
                  Stock Quantity
                  <strong>*</strong>
                </label>

                <input
                  type="number"
                  name="stock"
                  value={form.stock}
                  onChange={handleChange}
                  min="0"
                  step="1"
                  placeholder="50"
                />

                {errors.stock && (
                  <small className="admin-field-error">
                    {errors.stock}
                  </small>
                )}

              </div>


              <div className="admin-add-field">

                <label>
                  Low Stock Threshold
                </label>

                <input
                  type="number"
                  name="lowStockThreshold"
                  value={
                    form.lowStockThreshold
                  }
                  onChange={handleChange}
                  min="0"
                  step="1"
                  placeholder="10"
                />

              </div>

            </div>

          </section>

        </div>


        {/* ================= RIGHT SIDE ================= */}

        <aside className="admin-add-product-side">


          {/* PRODUCT IMAGE */}

          <section className="admin-add-section">

            <div className="admin-add-side-heading">

              <h2>Product Image</h2>

              <p>
                Replace or remove the
                current product image.
              </p>

            </div>


            {!image ? (

              <label className="admin-product-upload">

                <input
                  type="file"
                  accept="image/png,image/jpeg,image/webp"
                  onChange={handleImage}
                />

                <div className="admin-upload-icon">
                  +
                </div>

                <strong>
                  Upload Image
                </strong>

                <span>
                  PNG, JPG or WEBP
                </span>

                <small>
                  Maximum 2MB
                </small>

              </label>

            ) : (

              <div className="admin-image-preview">

                <img
                  src={image}
                  alt={form.name}
                />

                <div>

                  <span>
                    {imageName ||
                      'Product image'}
                  </span>

                  <button
                    type="button"
                    onClick={removeImage}
                  >
                    Remove
                  </button>

                </div>

              </div>

            )}


            {errors.image && (
              <small className="admin-field-error">
                {errors.image}
              </small>
            )}

          </section>


          {/* ================= STATUS ================= */}

          <section className="admin-add-section">

            <div className="admin-add-side-heading">

              <h2>Product Status</h2>

              <p>
                Control product visibility
                and labels.
              </p>

            </div>


            <div className="admin-product-switches">

              <label>

                <div>
                  <strong>
                    Active Product
                  </strong>

                  <span>
                    Available in the store
                  </span>
                </div>

                <input
                  type="checkbox"
                  name="active"
                  checked={form.active}
                  onChange={handleChange}
                />

              </label>


              <label>

                <div>
                  <strong>
                    Featured
                  </strong>

                  <span>
                    Highlight this product
                  </span>
                </div>

                <input
                  type="checkbox"
                  name="featured"
                  checked={form.featured}
                  onChange={handleChange}
                />

              </label>


              <label>

                <div>
                  <strong>
                    New Arrival
                  </strong>

                  <span>
                    Mark as new product
                  </span>
                </div>

                <input
                  type="checkbox"
                  name="newArrival"
                  checked={
                    form.newArrival
                  }
                  onChange={handleChange}
                />

              </label>


              <label>

                <div>
                  <strong>
                    Best Seller
                  </strong>

                  <span>
                    Mark as best seller
                  </span>
                </div>

                <input
                  type="checkbox"
                  name="bestSeller"
                  checked={
                    form.bestSeller
                  }
                  onChange={handleChange}
                />

              </label>

            </div>

          </section>


          {/* ================= PREVIEW ================= */}

          <section className="admin-add-section admin-product-summary">

            <p className="admin-page-eyebrow">
              LIVE PREVIEW
            </p>


            {image && (
              <div className="admin-summary-image">

                <img
                  src={image}
                  alt={form.name}
                />

              </div>
            )}


            <h3>
              {form.name ||
                'Product Name'}
            </h3>


            <span>
              {form.category ||
                'Collection'}

              {' · '}

              {form.gender ||
                'Gender'}
            </span>


            {form.shortDescription && (
              <p>
                {form.shortDescription}
              </p>
            )}


            <strong>
              ₹{form.price || '0'}
            </strong>

          </section>

        </aside>


        {/* ================= SAVE ERROR ================= */}

        {errors.save && (
          <div className="admin-save-error">
            {errors.save}
          </div>
        )}


        {/* ================= BOTTOM ACTIONS ================= */}

        <div className="admin-add-bottom-actions">

          <button
            type="button"
            className="admin-add-cancel-btn"
            onClick={() =>
              navigate('/admin/products')
            }
          >
            Cancel
          </button>


          <button
            type="submit"
            className="admin-add-save-btn"
          >
            Update Product
          </button>

        </div>

      </form>

    </div>
  )
}

export default EditProduct