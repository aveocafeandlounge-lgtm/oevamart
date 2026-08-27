import { useState } from 'react'
import { Plus, Search, Filter, FileText, TrendingUp, TrendingDown, ArrowRight, BookOpen, Eye, Edit, Trash2 } from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function Accounting() {
  const { journalEntries, addJournalEntry, deleteJournalEntry } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [newEntry, setNewEntry] = useState({
    entryNumber: '',
    date: new Date().toISOString().split('T')[0],
    description: '',
    debit: 0,
    credit: 0,
    status: 'draft' as 'posted' | 'draft',
  })

  const statuses = ['All', 'posted', 'draft']

  const filteredEntries = journalEntries.filter(entry => {
    const matchesSearch = entry.entryNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         entry.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'All' || entry.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const totalDebit = journalEntries.reduce((sum, entry) => sum + entry.debit, 0)
  const totalCredit = journalEntries.reduce((sum, entry) => sum + entry.credit, 0)
  const draftEntries = journalEntries.filter(e => e.status === 'draft').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Accounting</h1>
          <p className="text-slate-500 dark:text-slate-400">General ledger, journal entries, and financial reports</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold"
        >
          <Plus className="w-5 h-5" />
          New Entry
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Entries</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{journalEntries.length}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Credit</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">MVR {totalCredit.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Debit</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">MVR {totalDebit.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Draft</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{draftEntries}</p>
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
              placeholder="Search entries..."
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

      {/* Journal Entries Table */}
      <div className="glass-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Entry #</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Date</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Description</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Debit</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Credit</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredEntries.map((entry) => (
                <tr key={entry.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-800 dark:text-white">{entry.entryNumber}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{entry.date}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{entry.description}</td>
                  <td className="py-3 px-4">
                    {entry.debit > 0 ? (
                      <span className="font-medium text-red-600">MVR {entry.debit.toLocaleString()}</span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    {entry.credit > 0 ? (
                      <span className="font-medium text-green-600">MVR {entry.credit.toLocaleString()}</span>
                    ) : (
                      <span className="text-slate-400">-</span>
                    )}
                  </td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      entry.status === 'posted' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      {entry.status.charAt(0).toUpperCase() + entry.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                        <Eye className="w-4 h-4 text-slate-500" />
                      </button>
                      {entry.status === 'draft' && (
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                          <Edit className="w-4 h-4 text-slate-500" />
                        </button>
                      )}
                      <button 
                        onClick={() => deleteJournalEntry(entry.id)}
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

      {/* Add Entry Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">New Journal Entry</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Entry Date</label>
                  <input 
                    type="date" 
                    value={newEntry.date}
                    onChange={(e) => setNewEntry({ ...newEntry, date: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Reference</label>
                  <input type="text" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" placeholder="INV-001" />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                <input 
                  type="text" 
                  value={newEntry.description}
                  onChange={(e) => setNewEntry({ ...newEntry, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                  placeholder="Enter description" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Debit Account</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <option>Cash</option>
                    <option>Accounts Receivable</option>
                    <option>Inventory</option>
                    <option>Expenses</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Credit Account</label>
                  <select className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                    <option>Sales Revenue</option>
                    <option>Accounts Payable</option>
                    <option>Bank</option>
                    <option>Capital</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Debit Amount (MVR)</label>
                  <input 
                    type="number" 
                    value={newEntry.debit}
                    onChange={(e) => setNewEntry({ ...newEntry, debit: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                    placeholder="0.00" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Credit Amount (MVR)</label>
                  <input 
                    type="number" 
                    value={newEntry.credit}
                    onChange={(e) => setNewEntry({ ...newEntry, credit: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                    placeholder="0.00" 
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
                <select 
                  value={newEntry.status}
                  onChange={(e) => setNewEntry({ ...newEntry, status: e.target.value as 'posted' | 'draft' })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option>draft</option>
                  <option>posted</option>
                </select>
              </div>
              <button 
                onClick={() => {
                  const entryNumber = `JE-${new Date().getFullYear()}-${String(journalEntries.length + 1).padStart(3, '0')}`
                  addJournalEntry({ ...newEntry, entryNumber })
                  setShowAddModal(false)
                  setNewEntry({
                    entryNumber: '',
                    date: new Date().toISOString().split('T')[0],
                    description: '',
                    debit: 0,
                    credit: 0,
                    status: 'draft',
                  })
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold"
              >
                Create Entry
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
