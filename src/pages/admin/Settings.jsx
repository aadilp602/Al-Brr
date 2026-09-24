function Settings() {
  return (
    <div className="space-y-8">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-semibold text-gray-900">
          Settings
        </h1>

        <p className="mt-1 text-sm text-gray-500">
          Manage store and admin panel settings.
        </p>
      </div>

      {/* Store Settings */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Store Settings
        </h2>

        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium">
              Store Name
            </label>

            <input
              type="text"
              defaultValue="Al Brr Perfumes"
              className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Store Email
            </label>

            <input
              type="email"
              placeholder="Enter store email"
              className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Phone
            </label>

            <input
              type="text"
              placeholder="Enter phone number"
              className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
            />
          </div>

          <div>
            <label className="mb-2 block text-sm font-medium">
              Currency
            </label>

            <select className="w-full rounded-lg border px-4 py-3 text-sm outline-none">
              <option>INR - ₹</option>
            </select>
          </div>
        </div>
      </section>

      {/* Order Settings */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Order Settings
        </h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked />
            <span className="text-sm">
              Allow new customer orders
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked />
            <span className="text-sm">
              Send order notifications
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked />
            <span className="text-sm">
              Enable inventory tracking
            </span>
          </label>
        </div>
      </section>

      {/* Admin Settings */}
      <section className="rounded-xl border bg-white p-6 shadow-sm">
        <h2 className="mb-6 text-lg font-semibold text-gray-900">
          Admin Settings
        </h2>

        <div className="space-y-4">
          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked />
            <span className="text-sm">
              Activity logging
            </span>
          </label>

          <label className="flex items-center gap-3">
            <input type="checkbox" defaultChecked />
            <span className="text-sm">
              Email notifications
            </span>
          </label>
        </div>
      </section>

      {/* Save */}
      <div className="flex justify-end">
        <button className="rounded-lg bg-black px-6 py-3 text-sm font-medium text-white">
          Save Settings
        </button>
      </div>
    </div>
  )
}

export default Settings