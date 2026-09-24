function Users() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">
            Users & Roles
          </h1>

          <p className="mt-1 text-sm text-gray-500">
            Manage admin users and their access roles.
          </p>
        </div>

        <button className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white">
          Add User
        </button>
      </div>

      {/* Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Users
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-gray-900">
            0
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Active Users
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-gray-900">
            0
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Roles
          </p>

          <h2 className="mt-2 text-2xl font-semibold text-gray-900">
            0
          </h2>
        </div>
      </div>

      {/* Users Table */}
      <section className="rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            All Users
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Admin users and their assigned roles.
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
                  Email
                </th>

                <th className="px-6 py-4 font-medium">
                  Role
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
                  colSpan="5"
                  className="px-6 py-12 text-center text-sm text-gray-400"
                >
                  No users yet
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}

export default Users