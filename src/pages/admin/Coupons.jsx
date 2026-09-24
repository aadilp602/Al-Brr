function Coupons() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Discounts & Coupons
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Create and manage promotional discounts and coupons.
          </p>
        </div>

        <button className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white">
          Add Coupon
        </button>
      </div>

      {/* Coupon Overview */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Coupons
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            0
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Active
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            0
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Used
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            0
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Discount
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            ₹0
          </h2>
        </div>
      </div>

      {/* Coupons Table */}
      <section className="rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            All Coupons
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            View and manage discount coupons.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="px-6 py-4 font-medium">
                  Coupon
                </th>

                <th className="px-6 py-4 font-medium">
                  Discount
                </th>

                <th className="px-6 py-4 font-medium">
                  Valid From
                </th>

                <th className="px-6 py-4 font-medium">
                  Valid Until
                </th>

                <th className="px-6 py-4 font-medium">
                  Usage
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
                  No coupons yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Coupons