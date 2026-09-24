function AddProduct() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Add Product
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Add a new perfume product to your store.
        </p>
      </div>

      {/* Product Information */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Product Information
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Product Name
            </label>

            <input
              type="text"
              placeholder="Enter product name"
              className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              SKU
            </label>

            <input
              type="text"
              placeholder="Enter SKU"
              className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Category
            </label>

            <select className="w-full rounded-lg border px-4 py-3 text-sm outline-none">
              <option>Select category</option>
            </select>
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Brand
            </label>

            <input
              type="text"
              placeholder="Enter brand"
              className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Price
            </label>

            <input
              type="number"
              placeholder="Enter price"
              className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Discount
            </label>

            <input
              type="number"
              placeholder="Enter discount"
              className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Tax / GST
            </label>

            <input
              type="number"
              placeholder="Enter tax percentage"
              className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Size / Volume
            </label>

            <input
              type="text"
              placeholder="e.g. 100ml"
              className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
            />
          </div>
        </div>
      </section>

      {/* Fragrance Details */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Fragrance Details
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Fragrance Family
            </label>

            <input
              type="text"
              placeholder="e.g. Woody, Oriental"
              className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Gender
            </label>

            <select className="w-full rounded-lg border px-4 py-3 text-sm outline-none">
              <option>Select gender</option>
              <option>Men</option>
              <option>Women</option>
              <option>Unisex</option>
            </select>
          </div>
        </div>

        <div className="mt-6">
          <label className="mb-2 block text-sm font-medium">
            Description
          </label>

          <textarea
            rows="5"
            placeholder="Enter product description"
            className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
          />
        </div>
      </section>

      {/* Inventory */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Inventory
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Stock
            </label>

            <input
              type="number"
              placeholder="Enter stock quantity"
              className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Low Stock Threshold
            </label>

            <input
              type="number"
              placeholder="Enter threshold"
              className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
            />
          </div>
        </div>
      </section>

      {/* Product Status */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Product Status
        </h2>

        <div className="grid gap-4 md:grid-cols-2">
          <label className="flex items-center gap-3">
            <input type="checkbox" />
            <span className="text-sm">Active Product</span>
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" />
            <span className="text-sm">Featured Product</span>
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" />
            <span className="text-sm">New Product</span>
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" />
            <span className="text-sm">Best Seller</span>
          </label>
        </div>
      </section>

      {/* Actions */}
      <div className="flex justify-end gap-4">
        <button className="rounded-lg border px-5 py-3 text-sm font-medium">
          Cancel
        </button>

        <button className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white">
          Save Product
        </button>
      </div>
    </div>
  )
}

export default AddProduct