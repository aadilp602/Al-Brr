function Dashboard() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Welcome to Al Brr Perfumes Admin Panel
        </p>
      </div>

      {/* Overview Cards */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Sales
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-gray-900">
            ₹0
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Orders
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-gray-900">
            0
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Pending Orders
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-gray-900">
            0
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Low Stock
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-gray-900">
            0
          </h2>
        </div>
      </div>

      {/* Sales Overview */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Sales Overview
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Sales performance will appear here.
          </p>
        </div>

        <div className="flex h-64 items-center justify-center rounded-lg border border-dashed">
          <p className="text-sm text-gray-400">
            Sales Chart
          </p>
        </div>
      </section>

      {/* Recent Orders */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Recent Orders
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Latest customer orders will appear here.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="px-4 py-3 font-medium">
                  Order
                </th>

                <th className="px-4 py-3 font-medium">
                  Customer
                </th>

                <th className="px-4 py-3 font-medium">
                  Amount
                </th>

                <th className="px-4 py-3 font-medium">
                  Status
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  colSpan="4"
                  className="px-4 py-8 text-center text-sm text-gray-400"
                >
                  No orders yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      {/* Low Stock Products */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Low Stock Products
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Products that need inventory attention.
          </p>
        </div>

        <div className="flex min-h-32 items-center justify-center rounded-lg border border-dashed">
          <p className="text-sm text-gray-400">
            No low stock products
          </p>
        </div>
      </section>
    </div>
  )
}

export default Dashboard