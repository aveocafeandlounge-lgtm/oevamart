import { Package, Plus, Search, Filter } from 'lucide-react'

export default function Products() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Products</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage your product inventory</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold">
          <Plus className="w-5 h-5" />
          Add Product
        </button>
      </div>

      <div className="glass-card p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search products..."
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg">
            <Filter className="w-4 h-4" />
            Filter
          </button>
        </div>
      </div>

      <div className="glass-card">
        <table className="w-full">
          <thead>
            <tr className="border-b border-slate-200 dark:border-slate-700">
              <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Product</th>
              <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">SKU</th>
              <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Stock</th>
              <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Price</th>
              <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Status</th>
            </tr>
          </thead>
          <tbody>
            {[1, 2, 3, 4, 5].map((i) => (
              <tr key={i} className="border-b border-slate-100 dark:border-slate-800">
                <td className="py-3 px-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-slate-100 dark:bg-slate-700 flex items-center justify-center">
                      <Package className="w-5 h-5 text-slate-400" />
                    </div>
                    <span className="font-medium text-slate-800 dark:text-white">Product {i}</span>
                  </div>
                </td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-300">SKU-{String(i).padStart(4, '0')}</td>
                <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{i * 10}</td>
                <td className="py-3 px-4 text-slate-800 dark:text-white font-medium">MVR {(i * 100).toFixed(2)}</td>
                <td className="py-3 px-4">
                  <span className="px-2 py-1 rounded-full bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400 text-xs">
                    In Stock
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
}
