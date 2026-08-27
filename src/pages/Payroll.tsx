import { useState } from 'react'
import { Users, Plus, Search, Filter, DollarSign, Calendar, Eye, Edit, Trash2, ArrowRight, UserCheck, Clock } from 'lucide-react'
import { useStore } from '../context/StoreContext'

export default function Payroll() {
  const { employees, payrollRecords, addEmployee, updateEmployee, deleteEmployee, addPayrollRecord, deletePayrollRecord } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedMonth, setSelectedMonth] = useState('All')
  const [selectedStatus, setSelectedStatus] = useState('All')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showRunPayrollModal, setShowRunPayrollModal] = useState(false)
  const [newEmployee, setNewEmployee] = useState({
    name: '',
    position: '',
    department: '',
    salary: 0,
    status: 'active' as 'active' | 'inactive',
  })
  const [newPayrollRecord, setNewPayrollRecord] = useState({
    employee: '',
    month: new Date().toLocaleString('default', { month: 'long' }),
    year: new Date().getFullYear().toString(),
    basicSalary: 0,
    overtime: 0,
    deductions: 0,
    bonus: 0,
    netSalary: 0,
    status: 'pending' as 'paid' | 'pending',
  })

  const statuses = ['All', 'paid', 'pending']
  const months = ['All', 'January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']

  const filteredRecords = payrollRecords.filter(record => {
    const matchesSearch = record.employee.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesMonth = selectedMonth === 'All' || record.month === selectedMonth
    const matchesStatus = selectedStatus === 'All' || record.status === selectedStatus
    return matchesSearch && matchesMonth && matchesStatus
  })

  const totalPayroll = payrollRecords.reduce((sum, record) => sum + record.netSalary, 0)
  const activeEmployees = employees.filter(e => e.status === 'active').length
  const paidRecords = payrollRecords.filter(r => r.status === 'paid').length
  const pendingRecords = payrollRecords.filter(r => r.status === 'pending').length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Payroll</h1>
          <p className="text-slate-500 dark:text-slate-400">Manage employee salaries and attendance</p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={() => setShowRunPayrollModal(true)}
            className="flex items-center gap-2 px-4 py-2 border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-700"
          >
            <Clock className="w-5 h-5" />
            Run Payroll
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold"
          >
            <Plus className="w-5 h-5" />
            Add Employee
          </button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
              <UserCheck className="w-5 h-5 text-blue-600 dark:text-blue-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Active Employees</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{activeEmployees}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
              <DollarSign className="w-5 h-5 text-green-600 dark:text-green-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Total Payroll</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">MVR {totalPayroll.toLocaleString()}</p>
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
              <p className="text-xl font-bold text-slate-800 dark:text-white">{pendingRecords}</p>
            </div>
          </div>
        </div>
        <div className="glass-card p-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center">
              <Users className="w-5 h-5 text-purple-600 dark:text-purple-400" />
            </div>
            <div>
              <p className="text-sm text-slate-500 dark:text-slate-400">Paid</p>
              <p className="text-xl font-bold text-slate-800 dark:text-white">{paidRecords}</p>
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
              placeholder="Search employees..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
            />
          </div>
          <select
            value={selectedMonth}
            onChange={(e) => setSelectedMonth(e.target.value)}
            className="px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
          >
            {months.map(month => (
              <option key={month} value={month}>{month}</option>
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

      {/* Payroll Records Table */}
      <div className="glass-card">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-700">
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Employee</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Period</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Basic Salary</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Overtime</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Bonus</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Deductions</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Net Salary</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Status</th>
                <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredRecords.map((record) => (
                <tr key={record.id} className="border-b border-slate-100 dark:border-slate-800">
                  <td className="py-3 px-4">
                    <span className="font-medium text-slate-800 dark:text-white">{record.employee}</span>
                  </td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{record.month} {record.year}</td>
                  <td className="py-3 px-4 text-slate-600 dark:text-slate-300">MVR {record.basicSalary.toLocaleString()}</td>
                  <td className="py-3 px-4 text-green-600 dark:text-green-400">+MVR {record.overtime.toLocaleString()}</td>
                  <td className="py-3 px-4 text-green-600 dark:text-green-400">+MVR {record.bonus.toLocaleString()}</td>
                  <td className="py-3 px-4 text-red-600 dark:text-red-400">-MVR {record.deductions.toLocaleString()}</td>
                  <td className="py-3 px-4 text-slate-800 dark:text-white font-bold">MVR {record.netSalary.toLocaleString()}</td>
                  <td className="py-3 px-4">
                    <span className={`px-2 py-1 rounded-full text-xs ${
                      record.status === 'paid' 
                        ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400' 
                        : 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400'
                    }`}>
                      {record.status.charAt(0).toUpperCase() + record.status.slice(1)}
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
                        onClick={() => deletePayrollRecord(record.id)}
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

      {/* Add Employee Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Add Employee</h3>
              <button onClick={() => setShowAddModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Full Name</label>
                <input 
                  type="text" 
                  value={newEmployee.name}
                  onChange={(e) => setNewEmployee({ ...newEmployee, name: e.target.value })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                  placeholder="Enter full name" 
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Position</label>
                  <input 
                    type="text" 
                    value={newEmployee.position}
                    onChange={(e) => setNewEmployee({ ...newEmployee, position: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                    placeholder="Job title" 
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Department</label>
                  <select 
                    value={newEmployee.department}
                    onChange={(e) => setNewEmployee({ ...newEmployee, department: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    <option>Operations</option>
                    <option>Sales</option>
                    <option>Inventory</option>
                    <option>Maintenance</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Basic Salary (MVR)</label>
                <input 
                  type="number" 
                  value={newEmployee.salary}
                  onChange={(e) => setNewEmployee({ ...newEmployee, salary: Number(e.target.value) })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                  placeholder="0.00" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Status</label>
                <select 
                  value={newEmployee.status}
                  onChange={(e) => setNewEmployee({ ...newEmployee, status: e.target.value as 'active' | 'inactive' })}
                  className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                </select>
              </div>
              <button 
                onClick={() => {
                  addEmployee(newEmployee)
                  setShowAddModal(false)
                  setNewEmployee({
                    name: '',
                    position: '',
                    department: '',
                    salary: 0,
                    status: 'active',
                  })
                }}
                className="w-full py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold"
              >
                Add Employee
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Run Payroll Modal */}
      {showRunPayrollModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 w-full max-w-lg">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Run Payroll</h3>
              <button onClick={() => setShowRunPayrollModal(false)} className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg">
                <ArrowRight className="w-5 h-5 rotate-180" />
              </button>
            </div>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Month</label>
                  <select 
                    value={newPayrollRecord.month}
                    onChange={(e) => setNewPayrollRecord({ ...newPayrollRecord, month: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800"
                  >
                    {months.slice(1).map(month => (
                      <option key={month} value={month}>{month}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">Year</label>
                  <input 
                    type="number" 
                    value={newPayrollRecord.year}
                    onChange={(e) => setNewPayrollRecord({ ...newPayrollRecord, year: e.target.value })}
                    className="w-full px-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800" 
                    defaultValue="2024" 
                  />
                </div>
              </div>
              <div className="bg-slate-50 dark:bg-slate-800/50 p-4 rounded-lg">
                <p className="text-sm text-slate-500 dark:text-slate-400 mb-2">Active Employees</p>
                <p className="text-2xl font-bold text-slate-800 dark:text-white">{activeEmployees}</p>
                <p className="text-sm text-slate-500 dark:text-slate-400 mt-4">Estimated Total</p>
                <p className="text-2xl font-bold text-green-600">MVR {employees.filter(e => e.status === 'active').reduce((sum, e) => sum + e.salary, 0).toLocaleString()}</p>
              </div>
              <button 
                onClick={() => {
                  const activeEmployees = employees.filter(e => e.status === 'active')
                  activeEmployees.forEach(emp => {
                    const netSalary = emp.salary + newPayrollRecord.overtime + newPayrollRecord.bonus - newPayrollRecord.deductions
                    addPayrollRecord({
                      ...newPayrollRecord,
                      employee: emp.name,
                      basicSalary: emp.salary,
                      netSalary,
                    })
                  })
                  setShowRunPayrollModal(false)
                  setNewPayrollRecord({
                    employee: '',
                    month: new Date().toLocaleString('default', { month: 'long' }),
                    year: new Date().getFullYear().toString(),
                    basicSalary: 0,
                    overtime: 0,
                    deductions: 0,
                    bonus: 0,
                    netSalary: 0,
                    status: 'pending',
                  })
                }}
                className="w-full py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold"
              >
                Generate Payroll
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
