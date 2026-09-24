import { Link } from 'react-router-dom'

function Products() {
    return (
        <div className="space-y-8">
            {/* Page Header */}
            <div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
                <div>
                    <h1 className="text-2xl font-semibold text-gray-900">
                        Products
                    </h1>

                    <p className="mt-1 text-sm text-gray-500">
                        Manage your perfume products.
                    </p>
                </div>

                <Link
                    to="/admin/products/add"
                    className="rounded-lg bg-black px-5 py-3 text-sm font-medium text-white"
                >
                    Add Product
                </Link>
            </div>

            {/* Search */}
            <div className="rounded-xl border bg-white p-6 shadow-sm">
                <input
                    type="text"
                    placeholder="Search products..."
                    className="w-full rounded-lg border px-4 py-3 text-sm outline-none"
                />
            </div>

            {/* Products Table */}
            <section className="rounded-xl border bg-white shadow-sm">
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
                                    Category
                                </th>

                                <th className="px-6 py-4 font-medium">
                                    Price
                                </th>

                                <th className="px-6 py-4 font-medium">
                                    Stock
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
                                    No products yet
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>
        </div>
    )
}

export default Products