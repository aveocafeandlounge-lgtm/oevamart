import { useState } from 'react'
import { Receipt, Plus, Search, Filter, DollarSign, Calendar, ArrowRight, Eye, Edit, Trash2, Building2 } from 'lucide-react'
import { useStore } from '../context/StoreContext'

const expenseCategories = ['Utilities', 'Rent', 'Salaries', 'Supplies', 'Marketing', 'Maintenance', 'Travel', 'Other']

export default function Expenses() {
  const { expenses, addExpense, deleteExpense } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newExpense, setNewExpense] = useState({
    expenseNumber: '',
    category: '',
    description: '',
    amount: 0,
    date: new Date().toISOString().split('T')[0],
    status: 'paid' as 'paid' | 'pending',
    paymentMethod: 'Cash',
  })

  const statuses = ['All', 'paid', 'pending']
  const categories = ['All', ...expenseCategories]

  const filteredExpenses = expenses.filter(expense => {
    const matchesSearch = expense.expenseNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         expense.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || expense.category === selectedCategory
    const matchesStatus = selectedStatus === 'All' || expense.status === selectedStatus
    return matchesSearch && matchesCategory && matchesStatus
  })

  const totalExpenses = expenses.reduce((sum, expense) => sum + expense.amount, 0)
  const paidExpenses = expenses.filter(e => e.status === 'paid').length
  const pendingExpenses = expenses.filter(e => e.status === 'pending').length
  const thisMonthExpenses = expenses.filter(e => e.date.startsWith('2024-01')).reduce((sum, e) => sum + e.amount, 0)

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
      case 'paid': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Expenses</h1>
          <p className="text-slate-500 dark:text-slate-400">Track and manage business expenses</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add Expense
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Receipt className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Expenses</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">MVR {totalExpenses.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">This Month</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">MVR {thisMonthExpenses.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Calendar className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{pendingExpenses}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Building2 className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Paid</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{paidExpenses}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="glass-card p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search expenses..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>
          <select
            value={selectedCategory}
            onChange={(e) => setSelectedCategory(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          >
            {statuses.map(status => (
              <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Expenses Table */}
      <div className="glass-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Expense #</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Category</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Description</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Amount</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Date</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Payment</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredExpenses.map((expense) => (
                <tr key={expense.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-800 dark:text-white">{expense.expenseNumber}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{expense.category}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{expense.description}</td>
                  <td className="py-3 px-4 text-slate-800 dark:text-white font-medium">MVR {expense.amount.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{expense.date}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{expense.paymentMethod}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(expense.status)}`}>
                      {expense.status.charAt(0).toUpperCase() + expense.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                        <Eye className="w-4 h-4 text-slate-500" />
                      </button>
                      <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                        <Edit className="w-4 h-4 text-slate-500" />
                      </button>
                      <button 
                        onClick={() => deleteExpense(expense.id)}
                        className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                      >
                        <Trash2 className="w-4 h-4 text-red-500" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Expense Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Add Expense</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Category</label>
                  <select 
                    value={newExpense.category}
                    onChange={(e) => setNewExpense({ ...newExpense, category: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {expenseCategories.map(cat => (
                      <option key={cat} value={cat}>{cat}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date</label>
                  <input 
                    type="date" 
                    value={newExpense.date}
                    onChange={(e) => setNewExpense({ ...newExpense, date: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                <input 
                  type="text" 
                  value={newExpense.description}
                  onChange={(e) => setNewExpense({ ...newExpense, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                  placeholder="Enter description" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Amount (MVR)</label>
                  <input 
                    type="number" 
                    value={newExpense.amount}
                    onChange={(e) => setNewExpense({ ...newExpense, amount: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                    placeholder="0.00" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Payment Method</label>
                  <select 
                    value={newExpense.paymentMethod}
                    onChange={(e) => setNewExpense({ ...newExpense, paymentMethod: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option>Cash</option>
                    <option>Card</option>
                    <option>Bank Transfer</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
                <select 
                  value={newExpense.status}
                  onChange={(e) => setNewExpense({ ...newExpense, status: e.target.value as 'paid' | 'pending' })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="pending">Pending</option>
                  <option value="paid">Paid</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Notes</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" rows={3} placeholder="Add notes..." />
              </div>
              <button 
                onClick={() => {
                  const expenseNumber = `EXP-${new Date().getFullYear()}-${String(expenses.length + 1).padStart(3, '0')}`
                  addExpense({ ...newExpense, expenseNumber })
                  setShowAddModal(false)
                  setNewExpense({
                    expenseNumber: '',
                    category: '',
                    description: '',
                    amount: 0,
                    date: new Date().toISOString().split('T')[0],
                    status: 'pending',
                    paymentMethod: 'Cash',
                  })
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold"
              >
                Add Expense
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
