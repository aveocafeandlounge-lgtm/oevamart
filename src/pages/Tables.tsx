import { useState } from 'react'
import { Utensils, Plus, Search, Filter, Users, Clock, Eye, Edit, Trash2, ArrowRight, CheckCircle, XCircle, Coffee } from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function Tables() {
  const { tables, addTable, deleteTable } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newTable, setNewTable] = useState({
    tableNumber: '',
    capacity: 4,
    status: 'available' as 'available' | 'occupied' | 'reserved' | 'cleaning',
    currentOrder: '-',
    server: '-',
    duration: '-',
    amount: 0,
  })

  const statuses = ['All', 'available', 'occupied', 'reserved', 'cleaning']

  const filteredTables = tables.filter(table => {
    const matchesSearch = table.tableNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         table.server.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'All' || table.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const totalTables = tables.length
  const availableTables = tables.filter(t => t.status === 'available').length
  const occupiedTables = tables.filter(t => t.status === 'occupied').length
  const reservedTables = tables.filter(t => t.status === 'reserved').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'available': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'occupied': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      case 'reserved': return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'cleaning': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'available': return <CheckCircle className="w-4 h-4" />
      case 'occupied': return <Coffee className="w-4 h-4" />
      case 'reserved': return <Clock className="w-4 h-4" />
      case 'cleaning': return <XCircle className="w-4 h-4" />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Tables</h1>
          <p className="text-slate-500 dark:text-slate-400">Restaurant floor plan and table management</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold"
        >
          <Plus className="w-5 h-5" />
          Add Table
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Utensils className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Tables</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{totalTables}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Available</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{availableTables}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <Coffee className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Occupied</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{occupiedTables}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Reserved</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{reservedTables}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Floor Plan View */}
      <div className="glass-card p-6">
        <h3 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Floor Plan</h3>
        <div className="grid grid-cols-4 gap-4">
          {tables.map((table) => (
            <div
              key={table.id}
              className={`p-4 rounded-xl border-2 cursor-pointer transition-all ${
                table.status === 'available' 
                  ? 'border-green-300 bg-green-50 dark:bg-green-900/20 hover:border-green-500' 
                  : table.status === 'occupied'
                  ? 'border-red-300 bg-red-50 dark:bg-red-900/20 hover:border-red-500'
                  : table.status === 'reserved'
                  ? 'border-blue-300 bg-blue-50 dark:bg-blue-900/20 hover:border-blue-500'
                  : 'border-orange-300 bg-orange-50 dark:bg-orange-900/20 hover:border-orange-500'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className="font-bold text-slate-800 dark:text-white">{table.tableNumber}</span>
                {getStatusIcon(table.status)}
              </div>
              <div className="flex items-center gap-1 text-sm text-slate-600 dark:text-slate-300">
                <Users className="w-3 h-3" />
                <span>{table.capacity}</span>
              </div>
              {table.status === 'occupied' && (
                <div className="mt-2 text-xs text-slate-500">
                  <p>Order: {table.currentOrder}</p>
                  <p>MVR {table.amount}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Search and Filter */}
      <div className="glass-card p-4">
        <div className="flex gap-4">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
            <input
              type="text"
              placeholder="Search tables..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>
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

      {/* Tables Table */}
      <div className="glass-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Table</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Capacity</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Current Order</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Server</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Duration</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Amount</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTables.map((table) => (
                <tr key={table.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-800 dark:text-white">{table.tableNumber}</span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                      <Users className="w-4 h-4" />
                      <span>{table.capacity}</span>
                    </div>
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 ${getStatusColor(table.status)}`}>
                      {getStatusIcon(table.status)}
                      {table.status.charAt(0).toUpperCase() + table.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{table.currentOrder}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{table.server}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{table.duration}</td>
                  <td className="py-3 px-4 text-slate-800 dark:text-white font-medium">
                    {table.amount > 0 ? `MVR ${table.amount}` : '-'}
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
                        onClick={() => deleteTable(table.id)}
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

      {/* Add Table Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Add Table</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Table Number</label>
                <input 
                  type="text" 
                  value={newTable.tableNumber}
                  onChange={(e) => setNewTable({ ...newTable, tableNumber: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                  placeholder="T-01" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Capacity (Seats)</label>
                <input 
                  type="number" 
                  value={newTable.capacity}
                  onChange={(e) => setNewTable({ ...newTable, capacity: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                  placeholder="4" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Location/Section</label>
                <select 
                  value={newTable.server}
                  onChange={(e) => setNewTable({ ...newTable, server: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option>-</option>
                  <option>Main Dining</option>
                  <option>Outdoor</option>
                  <option>Private Room</option>
                  <option>Bar Area</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Initial Status</label>
                <select 
                  value={newTable.status}
                  onChange={(e) => setNewTable({ ...newTable, status: e.target.value as 'available' | 'occupied' | 'reserved' | 'cleaning' })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="available">Available</option>
                  <option value="occupied">Occupied</option>
                  <option value="reserved">Reserved</option>
                  <option value="cleaning">Cleaning</option>
                </select>
              </div>
              <button 
                onClick={() => {
                  addTable(newTable)
                  setShowAddModal(false)
                  setNewTable({
                    tableNumber: '',
                    capacity: 4,
                    status: 'available',
                    currentOrder: '-',
                    server: '-',
                    duration: '-',
                    amount: 0,
                  })
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold"
              >
                Add Table
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
