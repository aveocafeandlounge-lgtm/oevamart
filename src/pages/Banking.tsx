import { useState } from 'react'
import { CreditCard, Wallet, Smartphone, Plus, Search, Filter, ArrowRight, Eye, Edit, Trash2, Landmark, TrendingUp, TrendingDown } from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function Banking() {
  const { bankAccounts, transactions, addBankAccount, addTransaction, deleteTransaction } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedAccount, setSelectedAccount] = useState('All')
  const [showAddAccountModal, setShowAddAccountModal] = useState(false)
  const [showAddTransactionModal, setShowAddTransactionModal] = useState(false)
  const [newAccount, setNewAccount] = useState({
    accountName: '',
    accountNumber: '',
    bankName: '',
    balance: 0,
    currency: 'MVR',
    type: 'checking' as 'checking' | 'savings' | 'credit',
  })
  const [newTransaction, setNewTransaction] = useState({
    accountId: '',
    description: '',
    amount: 0,
    type: 'credit' as 'credit' | 'debit',
    date: new Date().toISOString().split('T')[0],
  })

  const accounts = ['All', ...bankAccounts.map(a => a.accountName)]

  const filteredTransactions = transactions.filter(transaction => {
    const account = bankAccounts.find(a => a.id === transaction.accountId)
    const accountName = account?.accountName || ''
    const matchesSearch = transaction.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesAccount = selectedAccount === 'All' || accountName === selectedAccount
    return matchesSearch && matchesAccount
  })

  const totalBalance = bankAccounts.reduce((sum, account) => sum + account.balance, 0)
  const totalCredits = transactions.filter(t => t.type === 'credit').reduce((sum, t) => sum + t.amount, 0)
  const totalDebits = Math.abs(transactions.filter(t => t.type === 'debit').reduce((sum, t) => sum + t.amount, 0))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Banking</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage bank accounts and transactions</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowAddTransactionModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <Plus className="w-5 h-5" />
            Transaction
          </button>
          <button
            onClick={() => setShowAddAccountModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add Account
          </button>
        </div>
      </div>

      {/* Account Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {bankAccounts.map((account) => (
          <div key={account.id} className="glass-card p-6 bg-gradient-to-br from-blue-500 to-purple-600 text-white">
            <div className="flex items-center justify-between mb-4">
              <Landmark className="w-8 h-8 opacity-80" />
              <span className="text-sm opacity-80">{account.type}</span>
            </div>
            <p className="text-2xl font-bold mb-1">MVR {account.balance.toLocaleString()}</p>
            <p className="text-sm opacity-80 mb-4">{account.accountName}</p>
            <div className="flex justify-between text-sm opacity-80">
              <span>{account.bankName}</span>
              <span>{account.accountNumber}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <Wallet className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Balance</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">MVR {totalBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <TrendingUp className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Credits</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">MVR {totalCredits.toLocaleString()}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
              <TrendingDown className="w-5 h-5 text-red-600 dark:text-red-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Debits</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">MVR {totalDebits.toLocaleString()}</p>
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
              placeholder="Search transactions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>
          <select
            value={selectedAccount}
            onChange={(e) => setSelectedAccount(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          >
            {accounts.map(acc => (
              <option key={acc} value={acc}>{acc}</option>
            ))}
          </select>
          <button className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-lg">
            <Filter className="w-4 h-4" />
            More Filters
          </button>
        </div>
      </div>

      {/* Transactions Table */}
      <div className="glass-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Account</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Description</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Amount</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Balance</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Date</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredTransactions.map((transaction) => {
                const account = bankAccounts.find(a => a.id === transaction.accountId)
                return (
                  <tr key={transaction.id} className="border-b border-slate-100 dark:border-slate-800">
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{account?.accountName || 'Unknown'}</td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{transaction.description}</td>
                    <td className="py-3 px-4">
                      <span className={`font-medium ${transaction.type === 'credit' ? 'text-green-600' : 'text-red-600'}`}>
                        {transaction.type === 'credit' ? '+' : '-'}MVR {Math.abs(transaction.amount).toLocaleString()}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{transaction.date}</td>
                    <td className="py-3 px-4">
                      <div className="flex gap-2">
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                          <Eye className="w-4 h-4 text-slate-500" />
                        </button>
                        <button className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded">
                          <Edit className="w-4 h-4 text-slate-500" />
                        </button>
                        <button 
                          onClick={() => deleteTransaction(transaction.id)}
                          className="p-1 hover:bg-slate-100 dark:hover:bg-slate-700 rounded"
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </button>
                      </div>
                    </td>
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Account Modal */}
      {showAddAccountModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Add Bank Account</h3>
              <button onClick={() => setShowAddAccountModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Account Name</label>
                <input 
                  type="text" 
                  value={newAccount.accountName}
                  onChange={(e) => setNewAccount({ ...newAccount, accountName: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                  placeholder="Enter account name" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Bank Name</label>
                <input 
                  type="text" 
                  value={newAccount.bankName}
                  onChange={(e) => setNewAccount({ ...newAccount, bankName: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                  placeholder="Enter bank name" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Account Number</label>
                <input 
                  type="text" 
                  value={newAccount.accountNumber}
                  onChange={(e) => setNewAccount({ ...newAccount, accountNumber: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                  placeholder="1234-5678-9012" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Account Type</label>
                  <select 
                    value={newAccount.type}
                    onChange={(e) => setNewAccount({ ...newAccount, type: e.target.value as 'checking' | 'savings' | 'credit' })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="checking">Checking</option>
                    <option value="savings">Savings</option>
                    <option value="credit">Credit</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Currency</label>
                  <select 
                    value={newAccount.currency}
                    onChange={(e) => setNewAccount({ ...newAccount, currency: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="MVR">MVR</option>
                    <option value="USD">USD</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Opening Balance</label>
                <input 
                  type="number" 
                  value={newAccount.balance}
                  onChange={(e) => setNewAccount({ ...newAccount, balance: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                  placeholder="0.00" 
                />
              </div>
              <button 
                onClick={() => {
                  addBankAccount(newAccount)
                  setShowAddAccountModal(false)
                  setNewAccount({
                    accountName: '',
                    accountNumber: '',
                    bankName: '',
                    balance: 0,
                    currency: 'MVR',
                    type: 'checking',
                  })
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold"
              >
                Add Account
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Transaction Modal */}
      {showAddTransactionModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Add Transaction</h3>
              <button onClick={() => setShowAddTransactionModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Account</label>
                <select 
                  value={newTransaction.accountId}
                  onChange={(e) => setNewTransaction({ ...newTransaction, accountId: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  {bankAccounts.map(acc => (
                    <option key={acc.id} value={acc.id}>{acc.accountName}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Description</label>
                <input 
                  type="text" 
                  value={newTransaction.description}
                  onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                  placeholder="Enter description" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Amount (MVR)</label>
                  <input 
                    type="number" 
                    value={newTransaction.amount}
                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: Number(e.target.value) })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                    placeholder="0.00" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Type</label>
                  <select 
                    value={newTransaction.type}
                    onChange={(e) => setNewTransaction({ ...newTransaction, type: e.target.value as 'credit' | 'debit' })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option value="credit">Credit (Deposit)</option>
                    <option value="debit">Debit (Withdrawal)</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Date</label>
                <input 
                  type="date" 
                  value={newTransaction.date}
                  onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                />
              </div>
              <button 
                onClick={() => {
                  addTransaction(newTransaction)
                  setShowAddTransactionModal(false)
                  setNewTransaction({
                    accountId: '',
                    description: '',
                    amount: 0,
                    type: 'credit',
                    date: new Date().toISOString().split('T')[0],
                  })
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold"
              >
                Add Transaction
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
