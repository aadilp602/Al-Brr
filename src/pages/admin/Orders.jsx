function Orders() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Orders
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage customer orders and order status.
        </p>
      </div>

      {/* Order Overview */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Orders
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            0
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Pending
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            0
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Processing
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            0
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Delivered
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            0
          </h2>
        </div>
      </div>

      {/* Orders Table */}
      <section className="rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            All Orders
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View and manage customer orders.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="px-6 py-4 font-medium">
                  Order ID
                </th>

                <th className="px-6 py-4 font-medium">
                  Customer
                </th>

                <th className="px-6 py-4 font-medium">
                  Date
                </th>

                <th className="px-6 py-4 font-medium">
                  Amount
                </th>

                <th className="px-6 py-4 font-medium">
                  Payment
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
                  colSpan="7"
                  className="px-6 py-12 text-center text-sm text-gray-400"
                >
                  No orders yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Orders