function ActivityLogs() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Activity Logs
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Track admin and system activities.
        </p>
      </div>

      {/* Filters */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <div className="grid gap-4 md:grid-cols-3">
          <input
            type="text"
            placeholder="Search activity..."
            className="rounded-lg border px-4 py-3 text-sm outline-none"
          />

          <select className="rounded-lg border px-4 py-3 text-sm outline-none">
            <option>All Users</option>
          </select>

          <select className="rounded-lg border px-4 py-3 text-sm outline-none">
            <option>All Activities</option>
            <option>Login</option>
            <option>Product</option>
            <option>Order</option>
            <option>Inventory</option>
            <option>Settings</option>
          </select>
        </div>
      </section>

      {/* Activity Table */}
      <section className="rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            Activity History
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Recent admin and system activities.
          </p>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b text-sm text-gray-500">
                <th className="px-6 py-4 font-medium">
                  User
                </th>

                <th className="px-6 py-4 font-medium">
                  Activity
                </th>

                <th className="px-6 py-4 font-medium">
                  Description
                </th>

                <th className="px-6 py-4 font-medium">
                  Date
                </th>

                <th className="px-6 py-4 font-medium">
                  IP Address
                </th>
              </tr>
            </thead>

            <tbody>
              <tr>
                <td
                  colSpan="5"
                  className="px-6 py-12 text-center text-sm text-gray-400"
                >
                  No activity logs yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default ActivityLogs