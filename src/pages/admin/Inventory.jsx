function Inventory() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Inventory
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage product stock and inventory movements.
        </p>
      </div>

      {/* Inventory Overview */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Products
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            0
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Stock
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            0
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Low Stock
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            0
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Out of Stock
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            0
          </h2>
        </div>
      </div>

      {/* Stock Table */}
      <section className="rounded-xl border bg-white shadow-sm">
        <div className="flex flex-col justify-between gap-4 border-b p-6 md:flex-row md:items-center">
          <div>
            <h2 className="text-lg font-semibold text-gray-900">
              Stock Overview
            </h2>

            <p className="mt-1 text-sm text-gray-500">
              Current inventory of all products.
            </p>
          </div>

          <button className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white">
            Stock In
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="px-6 py-4 font-medium">
                  Product
                </th>

                <th className="px-6 py-4 font-medium">
                  SKU
                </th>

                <th className="px-6 py-4 font-medium">
                  Current Stock
                </th>

                <th className="px-6 py-4 font-medium">
                  Threshold
                </th>

                <th className="px-6 py-4 font-medium">
                  Status
                </th>

                <th className="px-6 py-4 font-medium">
                  Actions
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  colSpan="6"
                  className="px-6 py-12 text-center text-sm text-gray-400"
                >
                  No inventory data yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Stock History */}
      <section className="rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Stock History
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Recent inventory movements will appear here.
          </p>
        </div>

        <div className="p-6">
          <p className="text-center text-sm text-gray-400">
            No stock history yet
          </p>
        </div>
      </section>
    </div>
  )
}

export default Inventory