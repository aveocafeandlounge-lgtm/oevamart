import { 
  DollarSign, 
  TrendingUp, 
  TrendingDown, 
  Package, 
  Users, 
  ShoppingCart,
  AlertTriangle,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function Dashboard() {
  const { salesInvoices, products, expenses, customers } = useStore()
  
  // Calculate stats from global state
  const totalSales = salesInvoices.reduce((sum, inv) => sum + inv.total, 0)
  const totalExpenses = expenses.reduce((sum, exp) => sum + exp.amount, 0)
  const inventoryValue = products.reduce((sum, prod) => sum + (prod.stock * prod.costPrice), 0)
  const lowStockItems = products.filter(prod => prod.stock <= prod.minStock).slice(0, 4)
  const recentTransactions = salesInvoices.slice(-4).reverse()

  const stats = [
    {
      title: "Total Sales",
      value: `MVR ${totalSales.toLocaleString()}`,
      change: "+12.5%",
      trend: "up",
      icon: DollarSign,
      color: "from-green-400 to-emerald-600"
    },
    {
      title: "Total Orders",
      value: salesInvoices.length.toString(),
      change: "+8.2%",
      trend: "up",
      icon: TrendingUp,
      color: "from-blue-400 to-blue-600"
    },
    {
      title: "Profit",
      value: `MVR ${(totalSales - totalExpenses).toLocaleString()}`,
      change: "+15.3%",
      trend: "up",
      icon: DollarSign,
      color: "from-purple-400 to-purple-600"
    },
    {
      title: "Expenses",
      value: `MVR ${totalExpenses.toLocaleString()}`,
      change: "-3.2%",
      trend: "down",
      icon: TrendingDown,
      color: "from-red-400 to-red-600"
    },
    {
      title: "Inventory Value",
      value: `MVR ${inventoryValue.toLocaleString()}`,
      change: "+5.1%",
      trend: "up",
      icon: Package,
      color: "from-orange-400 to-orange-600"
    },
    {
      title: "Customers",
      value: customers.length.toString(),
      change: "+23",
      trend: "up",
      icon: Users,
      color: "from-pink-400 to-pink-600"
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Dashboard</h1>
        <p className="text-slate-500 dark:text-slate-400">Overview of your business performance</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {stats.map((stat, index) => (
          <div key={index} className="glass-card p-6">
            <div className="flex items-center justify-between mb-4">
              <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <div className={`flex items-center gap-1 text-sm font-medium ${
                stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.trend === 'up' ? (
                  <ArrowUpRight className="w-4 h-4" />
                ) : (
                  <ArrowDownRight className="w-4 h-4" />
                )}
                {stat.change}
              </div>
            </div>
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-1">{stat.value}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">{stat.title}</p>
          </div>
        ))}
      </div>

      {/* Alerts */}
      <div className="glass-card p-6 border-l-4 border-red-500">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full bg-red-100 dark:bg-red-900/30 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-5 h-5 text-red-600 dark:text-red-400" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-slate-800 dark:text-white mb-2">Low Stock Alert</h3>
            <div className="space-y-2">
              {lowStockItems.map((item, index) => (
                <div key={index} className="flex items-center justify-between text-sm">
                  <span className="text-slate-600 dark:text-slate-300">{item.name}</span>
                  <span className="text-red-600 font-medium">{item.stock} / {item.minStock} min</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Recent Transactions */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Recent Transactions</h3>
        <div className="space-y-3">
          {recentTransactions.map((transaction, index) => (
            <div key={index} className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800/50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                  <ShoppingCart className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-medium text-slate-800 dark:text-white">{transaction.customer}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{transaction.invoiceNumber} • {transaction.date}</p>
                </div>
              </div>
              <div className="text-right">
                <p className="font-semibold text-slate-800 dark:text-white">MVR {transaction.total.toLocaleString()}</p>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  transaction.status === 'completed' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                    : 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400'
                }`}>
                  {transaction.status}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
