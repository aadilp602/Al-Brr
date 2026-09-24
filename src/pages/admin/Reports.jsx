function Reports() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Reports
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          View sales, product, inventory, order and customer reports.
        </p>
      </div>

      {/* Date Range */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="flex flex-col gap-4 md:flex-row md:items-end">
          <div>
            <label className="mb-2 block text-sm font-medium">
              From
            </label>

            <input
              type="date"
              className="rounded-lg border px-4 py-3 text-sm"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              To
            </label>

            <input
              type="date"
              className="rounded-lg border px-4 py-3 text-sm"
            />
          </div>

          <button className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white">
            Generate Report
          </button>
        </div>
      </section>

      {/* Report Types */}
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-5">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">
            Sales Report
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Revenue and sales performance.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">
            Product Report
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Product sales and performance.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">
            Inventory Report
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Stock and inventory analysis.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">
            Order Report
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Order status and order trends.
          </p>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <h2 className="font-semibold text-gray-900">
            Customer Report
          </h2>

          <p className="mt-2 text-sm text-gray-500">
            Customer activity and spending.
          </p>
        </div>
      </div>

      {/* Report Results */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="text-lg font-semibold text-gray-900">
          Report Results
        </h2>

        <div className="mt-6 flex h-64 items-center justify-center rounded-lg border border-dashed">
          <p className="text-sm text-gray-400">
            Report data will appear here
          </p>
        </div>
      </section>
    </div>
  )
}

export default Reports