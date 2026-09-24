function Payments() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Payments
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage customer payment transactions.
        </p>
      </div>

      {/* Payment Overview */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Payments
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            0
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Paid
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            ₹0
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Pending
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            ₹0
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Refunded
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            ₹0
          </h2>
        </div>
      </div>

      {/* Payments Table */}
      <section className="rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Payment Transactions
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View and manage payment transactions.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="px-6 py-4 font-medium">
                  Transaction ID
                </th>

                <th className="px-6 py-4 font-medium">
                  Order ID
                </th>

                <th className="px-6 py-4 font-medium">
                  Customer
                </th>

                <th className="px-6 py-4 font-medium">
                  Amount
                </th>

                <th className="px-6 py-4 font-medium">
                  Method
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
                  No payment transactions yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Payments