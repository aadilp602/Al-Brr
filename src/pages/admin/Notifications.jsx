function Notifications() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Notifications
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage admin and store notifications.
        </p>
      </div>

      {/* Notification Overview */}
      <div className="grid gap-6 md:grid-cols-3">
        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Total Notifications
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            0
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Unread
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            0
          </h2>
        </div>

        <div className="rounded-xl border bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Read
          </p>

          <h2 className="mt-2 text-2xl font-semibold">
            0
          </h2>
        </div>
      </div>

      {/* Notifications List */}
      <section className="rounded-xl border bg-white shadow-sm">
        <div className="border-b p-6">
          <h2 className="text-lg font-semibold text-gray-900">
            All Notifications
          </h2>

          <p className="mt-1 text-sm text-gray-500">
            Recent system and store notifications.
          </p>
        </div>

        <div className="p-6">
          <div className="flex min-h-40 items-center justify-center rounded-lg border border-dashed">
            <p className="text-sm text-gray-400">
              No notifications yet
            </p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Notifications