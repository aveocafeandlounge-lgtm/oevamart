import { useState } from 'react'
import { Plus, Search, Filter, DollarSign, ArrowRight, Eye, Edit, Trash2, Download, Clock, CheckCircle, XCircle, FileText } from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function Sales() {
  const { salesInvoices, customers, addSalesInvoice, deleteSalesInvoice } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [selectedInvoice, setSelectedInvoice] = useState<any>(null)
  const [newInvoice, setNewInvoice] = useState({
    invoiceNumber: '',
    customer: '',
    date: new Date().toISOString().split('T')[0],
    status: 'completed' as 'completed' | 'pending' | 'cancelled',
    total: 0,
    paid: 0,
    items: 0,
    paymentMethod: 'Cash',
  })

  const statuses = ['All', 'completed', 'pending', 'cancelled']

  const filteredInvoices = salesInvoices.filter(invoice => {
    const matchesSearch = invoice.invoiceNumber.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         invoice.customer.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = selectedStatus === 'All' || invoice.status === selectedStatus
    return matchesSearch && matchesStatus
  })

  const totalSales = salesInvoices.reduce((sum, invoice) => sum + invoice.total, 0)
  const pendingInvoices = salesInvoices.filter(i => i.status === 'pending').length
  const completedInvoices = salesInvoices.filter(i => i.status === 'completed').length

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
      case 'completed': return 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
      case 'cancelled': return 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
      default: return 'bg-slate-100 text-slate-700'
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'pending': return <Clock className="w-4 h-4" />
      case 'completed': return <CheckCircle className="w-4 h-4" />
      case 'cancelled': return <XCircle className="w-4 h-4" />
      default: return null
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Sales</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage sales invoices and quotations</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold"
        >
          <Plus className="w-5 h-5" />
          New Invoice
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Invoices</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{salesInvoices.length}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Sales</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">MVR {totalSales.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <CheckCircle className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Completed</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{completedInvoices}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-orange-100 dark:bg-orange-900/30 flex items-center justify-center">
              <Clock className="w-5 h-5 text-orange-600 dark:text-orange-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Pending</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{pendingInvoices}</p>
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
              placeholder="Search invoices or customers..."
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

      {/* Sales Invoices Table */}
      <div className="glass-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Invoice #</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Customer</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Date</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Items</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Total</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Paid</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Payment</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredInvoices.map((invoice) => (
                <tr key={invoice.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-800 dark:text-white">{invoice.invoiceNumber}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{invoice.customer}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{invoice.date}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{invoice.items}</td>
                  <td className="py-3 px-4 text-slate-800 dark:text-white font-medium">MVR {invoice.total.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-800 dark:text-white font-medium">MVR {invoice.paid.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{invoice.paymentMethod}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs flex items-center gap-1 w-fit ${getStatusColor(invoice.status)}`}>
                      {getStatusIcon(invoice.status)}
                      {invoice.status.charAt(0).toUpperCase() + invoice.status.slice(1)}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex gap-2">
                      <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                        <Eye className="w-4 h-4 text-slate-500" />
                      </button>
                      {invoice.status === 'pending' && (
                        <button 
                          onClick={() => { setSelectedInvoice(invoice); setShowPaymentModal(true) }}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                        >
                          <DollarSign className="w-4 h-4 text-green-500" />
                        </button>
                      )}
                      <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                        <Download className="w-4 h-4 text-slate-500" />
                      </button>
                      <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                        <Edit className="w-4 h-4 text-slate-500" />
                      </button>
                      <button 
                        onClick={() => deleteSalesInvoice(invoice.id)}
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

      {/* Add Invoice Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">New Sales Invoice</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Customer</label>
                  <select 
                    value={newInvoice.customer}
                    onChange={(e) => setNewInvoice({ ...newInvoice, customer: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {customers.map(customer => (
                      <option key={customer.id} value={customer.name}>{customer.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Invoice Date</label>
                  <input 
                    type="date" 
                    value={newInvoice.date}
                    onChange={(e) => setNewInvoice({ ...newInvoice, date: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Payment Method</label>
                  <select 
                    value={newInvoice.paymentMethod}
                    onChange={(e) => setNewInvoice({ ...newInvoice, paymentMethod: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option>Cash</option>
                    <option>Card</option>
                    <option>Bank Transfer</option>
                    <option>Credit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Due Date</label>
                  <input type="date" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" />
                </div>
              </div>
              
              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <h4 className="font-semibold text-slate-800 dark:text-white mb-3">Invoice Items</h4>
                <div className="space-y-2">
                  <div className="grid grid-cols-12 gap-2 text-sm text-slate-500 dark:text-slate-400">
                    <div className="col-span-4">Product</div>
                    <div className="col-span-2">Qty</div>
                    <div className="col-span-2">Price</div>
                    <div className="col-span-2">Total</div>
                    <div className="col-span-2"></div>
                  </div>
                  {[1, 2].map((i) => (
                    <div key={i} className="grid grid-cols-12 gap-2">
                      <div className="col-span-4">
                        <input type="text" placeholder="Product name" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
                      </div>
                      <div className="col-span-2">
                        <input type="number" placeholder="0" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
                      </div>
                      <div className="col-span-2">
                        <input type="number" placeholder="0.00" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" />
                      </div>
                      <div className="col-span-2">
                        <input type="text" placeholder="0.00" className="w-full px-3 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm" readOnly />
                      </div>
                      <div className="col-span-2">
                        <button className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
                <button className="mt-2 flex items-center gap-2 text-blue-600 hover:text-blue-700 text-sm">
                  <Plus className="w-4 h-4" />
                  Add Item
                </button>
              </div>

              <div className="border-t border-slate-200 dark:border-slate-700 pt-4">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-slate-800 dark:text-white">Total</span>
                  <span className="text-blue-600">MVR 0.00</span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Notes</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" rows={3} placeholder="Add notes..." />
              </div>

              <button 
                onClick={() => {
                  const invoiceNumber = `INV-${new Date().getFullYear()}-${String(salesInvoices.length + 1).padStart(3, '0')}`
                  addSalesInvoice({ ...newInvoice, invoiceNumber })
                  setShowAddModal(false)
                  setNewInvoice({
                    invoiceNumber: '',
                    customer: '',
                    date: new Date().toISOString().split('T')[0],
                    status: 'pending',
                    total: 0,
                    paid: 0,
                    items: 0,
                    paymentMethod: 'Cash',
                  })
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold"
              >
                Create Invoice
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Payment Modal */}
      {showPaymentModal && selectedInvoice && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Record Payment</h3>
              <button onClick={() => setShowPaymentModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400">Invoice Number</p>
                <p className="font-semibold text-slate-800 dark:text-white">{selectedInvoice.invoiceNumber}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">Customer</p>
                <p className="font-semibold text-slate-800 dark:text-white">{selectedInvoice.customer}</p>
                <div className="mt-2 flex justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Total Amount</span>
                  <span className="font-semibold text-slate-800 dark:text-white">MVR {selectedInvoice.total.toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Already Paid</span>
                  <span className="font-semibold text-green-600">MVR {selectedInvoice.paid.toLocaleString()}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200 dark:border-slate-700 pt-2 mt-2">
                  <span className="text-sm text-slate-500 dark:text-slate-400">Remaining</span>
                  <span className="font-semibold text-orange-600">MVR {(selectedInvoice.total - selectedInvoice.paid).toLocaleString()}</span>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Payment Amount</label>
                <input type="number" className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" placeholder="Enter amount" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Payment Method</label>
                <select className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800">
                  <option>Cash</option>
                  <option>Card</option>
                  <option>Bank Transfer</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Notes</label>
                <textarea className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" rows={2} placeholder="Add notes..." />
              </div>
              <button className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold">
                Record Payment
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
