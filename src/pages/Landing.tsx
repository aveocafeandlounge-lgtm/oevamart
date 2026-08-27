import { useState } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Download, Moon, Sun, Check, Store, Users, Package, TrendingUp, Shield, Zap, Globe, CreditCard, FileText, BarChart, Settings, Printer, Mail, MessageSquare, Warehouse, Utensils, Book, Heart, UserCheck, DollarSign, Receipt, ArrowRight, Search, Bell, LogIn } from 'lucide-react'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

export default function Landing() {
  const [darkMode, setDarkMode] = useState(false)

  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    document.documentElement.classList.toggle('dark')
  }

  const plans = [
    {
      id: 'starter',
      name: 'OEVA Mart STARTER',
      price: 'MVR 20,000',
      description: 'One-Time Setup & Lifetime License for Single Business',
      color: 'from-green-400 to-emerald-600',
      icon: Store,
      idealFor: ['Small Retail Shops', 'Cafés', 'Small Restaurants', 'Boutiques', 'Pharmacies', 'Hardware Shops', 'Grocery Stores'],
      features: {
        business: ['1 Business', '1 Store', 'Up to 5 Users'],
        pos: ['Modern POS', 'Barcode Support', 'QR Code Support', 'Product Search', 'Categories', 'Cash Payments', 'Bank Transfer Payments', 'Credit Sales', 'Discounts', 'GST', 'Receipt Printing', 'PDF Receipt', 'Email Receipt', 'WhatsApp Receipt'],
        inventory: ['Products', 'Categories', 'Stock Management', 'Stock Alerts', 'Purchase Orders', 'Sales', 'Returns'],
        customers: ['Customer Profiles', 'Purchase History', 'Credit Balance'],
        suppliers: ['Supplier Management', 'Purchase History'],
        expenses: ['Expense Tracking', 'Custom Categories'],
        reports: ['Sales Reports', 'Inventory Reports', 'Expense Reports', 'Profit Report'],
        settings: ['Company Profile', 'Logo', 'Receipt Template', 'GST', 'Currency (MVR)']
      },
      paymentPlan: [
        { phase: 'Phase 1 – Project Confirmation & Development Starts', percentage: '40%', amount: 'MVR 8,000' },
        { phase: 'Phase 2 – System Completion & Client Testing', percentage: '40%', amount: 'MVR 8,000' },
        { phase: 'Phase 3 – Final Delivery, Installation & Training', percentage: '20%', amount: 'MVR 4,000' }
      ]
    },
    {
      id: 'business',
      name: 'OEVA Mart BUSINESS',
      price: 'MVR 35,000',
      description: 'Designed for growing businesses',
      color: 'from-blue-400 to-blue-600',
      icon: TrendingUp,
      idealFor: ['Supermarkets', 'Multi-Department Stores', 'Restaurants', 'Fashion Stores', 'Hardware Stores', 'Wholesale Businesses'],
      features: {
        business: ['Multi Store (Up to 5 Stores)', 'Warehouse', 'Stock Transfer', 'Stock Adjustment'],
        restaurant: ['Restaurant Module', 'Restaurant Floor Plan', 'Table Management', 'Merge Tables', 'Split Tables', 'Kitchen Display', 'Order Management'],
        accounting: ['General Ledger', 'Journal Entries', 'Chart of Accounts', 'Cash Book', 'Bank Book', 'Trial Balance', 'Profit & Loss', 'Balance Sheet', 'Cash Flow'],
        crm: ['Loyalty Points', 'Membership', 'Birthday Reminder', 'Customer Notes', 'Marketing Lists'],
        employees: ['Employee Profiles', 'Attendance', 'Leave Tracking'],
        reports: ['Financial Reports', 'Customer Reports', 'Supplier Reports', 'Dashboard Analytics'],
        export: ['PDF', 'Excel', 'CSV'],
        notifications: ['Low Stock', 'Expiry Alerts', 'Outstanding Payments']
      },
      paymentPlan: [
        { phase: 'Phase 1 – Project Confirmation & Development Starts', percentage: '40%', amount: 'MVR 14,000' },
        { phase: 'Phase 2 – System Completion & Client Testing', percentage: '40%', amount: 'MVR 14,000' },
        { phase: 'Phase 3 – Final Delivery, Installation & Training', percentage: '20%', amount: 'MVR 7,000' }
      ]
    },
    {
      id: 'enterprise',
      name: 'OEVA Mart ENTERPRISE',
      price: 'MVR 60,000',
      description: 'Designed for large companies with multiple locations',
      color: 'from-purple-400 to-purple-600',
      icon: Globe,
      idealFor: ['Large Retail Chains', 'Multi-Branch Supermarkets', 'Importers & Wholesalers', 'Hotel Retail Stores', 'Enterprise Businesses'],
      features: {
        unlimited: ['Unlimited Businesses', 'Branches', 'Warehouses', 'Employees', 'Products', 'Customers', 'Suppliers'],
        advancedInventory: ['Batch Tracking', 'Serial Numbers', 'Expiry Tracking', 'Stock Valuation', 'Physical Count', 'Damaged Stock', 'Lost Stock'],
        advancedAccounting: ['Bank Reconciliation', 'Recurring Transactions', 'Fiscal Year Closing', 'Opening Balances', 'Advanced Journal Entries'],
        payroll: ['Salary', 'Allowances', 'Deductions', 'Overtime', 'Payslips'],
        permissions: ['Super Admin', 'Business Owner', 'Manager', 'Cashier', 'Accountant', 'Inventory Manager', 'Storekeeper', 'Employee', 'Auditor'],
        dashboard: ['Advanced Analytics', 'Multiple Business Dashboard', 'Multi Branch Reports', 'Executive KPI Dashboard'],
        api: ['REST API', 'Mobile App Ready', 'AI Module Ready']
      },
      paymentPlan: [
        { phase: 'Phase 1 – Project Confirmation & Development Starts', percentage: '40%', amount: 'MVR 24,000' },
        { phase: 'Phase 2 – System Completion & Client Testing', percentage: '40%', amount: 'MVR 24,000' },
        { phase: 'Phase 3 – Final Delivery, Installation, Data Migration & Training', percentage: '20%', amount: 'MVR 12,000' }
      ]
    }
  ]

  const exportToPDF = async (planId: string) => {
    const element = document.getElementById(`plan-${planId}`)
    if (!element) return

    const canvas = await html2canvas(element, { scale: 2, useCORS: true })
    const imgData = canvas.toDataURL('image/png')
    
    const pdf = new jsPDF('p', 'mm', 'a4')
    const imgWidth = 210
    const pageHeight = 297
    const imgHeight = (canvas.height * imgWidth) / canvas.width
    let heightLeft = imgHeight
    let position = 0

    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pageHeight

    while (heightLeft > 0) {
      position = heightLeft - imgHeight
      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight
    }

    const plan = plans.find(p => p.id === planId)
    pdf.save(`OEVA-Mart-${plan?.name.replace(/\s+/g, '-')}.pdf`)
  }

  const exportAllToPDF = async () => {
    const pdf = new jsPDF('p', 'mm', 'a4')
    
    for (const plan of plans) {
      const element = document.getElementById(`plan-${plan.id}`)
      if (!element) continue

      const canvas = await html2canvas(element, { scale: 2, useCORS: true })
      const imgData = canvas.toDataURL('image/png')
      
      const imgWidth = 210
      const pageHeight = 297
      const imgHeight = (canvas.height * imgWidth) / canvas.width
      let heightLeft = imgHeight
      let position = 0

      pdf.addPage()
      pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
      heightLeft -= pageHeight

      while (heightLeft > 0) {
        position = heightLeft - imgHeight
        pdf.addPage()
        pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
        heightLeft -= pageHeight
      }
    }

    pdf.deletePage(1)
    pdf.save('OEVA-Mart-All-Plans.pdf')
  }

  const FeatureIcon = ({ name }: { name: string }) => {
    const icons: Record<string, any> = {
      'Modern POS': Zap,
      'Barcode Support': Package,
      'QR Code Support': Package,
      'Product Search': Search,
      'Categories': Package,
      'Cash Payments': DollarSign,
      'Bank Transfer Payments': CreditCard,
      'Credit Sales': CreditCard,
      'Discounts': DollarSign,
      'GST': Receipt,
      'Receipt Printing': Printer,
      'PDF Receipt': FileText,
      'Email Receipt': Mail,
      'WhatsApp Receipt': MessageSquare,
      'Products': Package,
      'Stock Management': Warehouse,
      'Stock Alerts': Bell,
      'Purchase Orders': FileText,
      'Sales': TrendingUp,
      'Returns': ArrowRight,
      'Customer Profiles': Users,
      'Purchase History': FileText,
      'Credit Balance': DollarSign,
      'Supplier Management': Users,
      'Expense Tracking': DollarSign,
      'Sales Reports': BarChart,
      'Inventory Reports': Package,
      'Expense Reports': DollarSign,
      'Profit Report': TrendingUp,
      'Company Profile': Settings,
      'Logo': Settings,
      'Receipt Template': FileText,
      'Currency (MVR)': DollarSign,
      'Warehouse': Warehouse,
      'Stock Transfer': ArrowRight,
      'Stock Adjustment': Settings,
      'Restaurant Module': Utensils,
      'Restaurant Floor Plan': Store,
      'Table Management': Store,
      'Merge Tables': Store,
      'Split Tables': Store,
      'Kitchen Display': Utensils,
      'Order Management': FileText,
      'General Ledger': Book,
      'Journal Entries': FileText,
      'Chart of Accounts': BarChart,
      'Cash Book': Book,
      'Bank Book': Book,
      'Trial Balance': BarChart,
      'Profit & Loss': TrendingUp,
      'Balance Sheet': BarChart,
      'Cash Flow': TrendingUp,
      'Loyalty Points': Heart,
      'Membership': UserCheck,
      'Birthday Reminder': Heart,
      'Customer Notes': FileText,
      'Marketing Lists': Users,
      'Employee Profiles': UserCheck,
      'Attendance': UserCheck,
      'Leave Tracking': FileText,
      'Financial Reports': BarChart,
      'Customer Reports': Users,
      'Supplier Reports': Users,
      'Dashboard Analytics': BarChart,
      'PDF': FileText,
      'Excel': FileText,
      'CSV': FileText,
      'Low Stock': Package,
      'Expiry Alerts': Bell,
      'Outstanding Payments': DollarSign,
      'Batch Tracking': Package,
      'Serial Numbers': Package,
      'Expiry Tracking': Package,
      'Stock Valuation': BarChart,
      'Physical Count': Package,
      'Damaged Stock': Package,
      'Lost Stock': Package,
      'Bank Reconciliation': Book,
      'Recurring Transactions': FileText,
      'Fiscal Year Closing': FileText,
      'Opening Balances': DollarSign,
      'Advanced Journal Entries': FileText,
      'Salary': DollarSign,
      'Allowances': DollarSign,
      'Deductions': DollarSign,
      'Overtime': UserCheck,
      'Payslips': FileText,
      'Super Admin': Shield,
      'Business Owner': Shield,
      'Manager': Shield,
      'Cashier': UserCheck,
      'Accountant': Book,
      'Inventory Manager': Package,
      'Storekeeper': Warehouse,
      'Employee': UserCheck,
      'Auditor': Shield,
      'Advanced Analytics': BarChart,
      'Multiple Business Dashboard': BarChart,
      'Multi Branch Reports': BarChart,
      'Executive KPI Dashboard': BarChart,
      'REST API': Globe,
      'Mobile App Ready': Globe,
      'AI Module Ready': Zap,
      'Unlimited Businesses': Globe,
      'Branches': Store,
      'Warehouses': Warehouse,
      'Employees': Users,
      'Suppliers': Users
    }
    
    const Icon = icons[name] || Check
    return <Icon className="w-4 h-4" />
  }

  return (
    <div className="min-h-screen">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-white/20 dark:border-slate-700/20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="flex items-center gap-3"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
              <img src="/logo.jpg" alt="OEVA Mart Logo" className="w-8 h-8 object-contain" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                OEVA Mart
              </h1>
              <p className="text-xs text-slate-500 dark:text-slate-400">Enterprise Retail Management</p>
            </div>
          </motion.div>
          
          <motion.button
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            onClick={toggleDarkMode}
            className="p-2 rounded-xl glass-card hover:scale-105 transition-transform"
          >
            {darkMode ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-slate-600" />}
          </motion.button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent">
              OEVA Mart
            </h2>
            <p className="text-xl md:text-2xl text-slate-600 dark:text-slate-300 mb-4">
              Complete Enterprise Retail Management System
            </p>
            <p className="text-slate-500 dark:text-slate-400 mb-8 max-w-2xl mx-auto">
              Transform your business with our comprehensive POS solution. From small retail shops to large enterprise chains, 
              OEVA Mart scales with your needs.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold shadow-lg shadow-blue-500/25 hover:shadow-blue-500/40 transition-all"
              >
                <LogIn className="w-5 h-5" />
                Get Started
              </Link>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={exportAllToPDF}
                className="inline-flex items-center gap-2 px-6 py-3 border-2 border-blue-500 text-blue-600 dark:text-blue-400 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all"
              >
                <Download className="w-5 h-5" />
                Download Plans (PDF)
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Plans Section */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto space-y-16">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.id}
              id={`plan-${plan.id}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.2 }}
              className="glass-card p-8"
            >
              {/* Plan Header */}
              <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6 mb-8">
                <div className="flex items-center gap-4">
                  <div className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${plan.color} flex items-center justify-center shadow-lg`}>
                    <plan.icon className="w-8 h-8 text-white" />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold text-slate-800 dark:text-white">{plan.name}</h3>
                    <p className="text-slate-500 dark:text-slate-400">{plan.description}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    {plan.price}
                  </p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">One-Time Payment</p>
                </div>
              </div>

              {/* Ideal For */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-3">Ideal For</h4>
                <div className="flex flex-wrap gap-2">
                  {plan.idealFor.map((item) => (
                    <span key={item} className="px-3 py-1 rounded-full bg-gradient-to-r from-blue-100 to-purple-100 dark:from-blue-900/30 dark:to-purple-900/30 text-blue-700 dark:text-blue-300 text-sm font-medium">
                      {item}
                    </span>
                  ))}
                </div>
              </div>

              {/* Features */}
              <div className="mb-8 space-y-6">
                {Object.entries(plan.features).map(([category, features]) => (
                  <div key={category}>
                    <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-3 capitalize">
                      {category.replace(/([A-Z])/g, ' $1').trim()}
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {features.map((feature) => (
                        <div key={feature} className="flex items-center gap-2 text-slate-600 dark:text-slate-300">
                          <div className="w-5 h-5 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center flex-shrink-0">
                            <FeatureIcon name={feature} />
                          </div>
                          <span className="text-sm">{feature}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Payment Plan */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Payment Plan</h4>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-slate-200 dark:border-slate-700">
                        <th className="text-left py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Payment Stage</th>
                        <th className="text-center py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Percentage</th>
                        <th className="text-right py-3 px-4 text-slate-600 dark:text-slate-300 font-semibold">Amount</th>
                      </tr>
                    </thead>
                    <tbody>
                      {plan.paymentPlan.map((payment, idx) => (
                        <tr key={idx} className="border-b border-slate-100 dark:border-slate-800 last:border-0">
                          <td className="py-3 px-4 text-slate-700 dark:text-slate-200">{payment.phase}</td>
                          <td className="py-3 px-4 text-center">
                            <span className="inline-block px-3 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 font-semibold">
                              {payment.percentage}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-right font-semibold text-slate-800 dark:text-white">{payment.amount}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Export Button */}
              <div className="flex justify-end">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => exportToPDF(plan.id)}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-lg font-medium shadow-md hover:shadow-lg transition-all"
                >
                  <Download className="w-4 h-4" />
                  Export to PDF
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Payment Terms */}
      <section className="py-16 px-4">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-card p-8"
          >
            <h3 className="text-2xl font-bold text-slate-800 dark:text-white mb-6">Payment Terms</h3>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-blue-600 dark:text-blue-400 font-bold">1</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">Phase 1</p>
                  <p className="text-slate-600 dark:text-slate-300">Payable upon quotation acceptance and before development begins.</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-purple-100 dark:bg-purple-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-purple-600 dark:text-purple-400 font-bold">2</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">Phase 2</p>
                  <p className="text-slate-600 dark:text-slate-300">Payable once the system is feature-complete and available for client testing (User Acceptance Testing).</p>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-pink-100 dark:bg-pink-900/30 flex items-center justify-center flex-shrink-0 mt-1">
                  <span className="text-pink-600 dark:text-pink-400 font-bold">3</span>
                </div>
                <div>
                  <p className="font-semibold text-slate-800 dark:text-white">Phase 3</p>
                  <p className="text-slate-600 dark:text-slate-300">Payable before final deployment, installation, training, and project handover.</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t border-slate-200 dark:border-slate-700">
        <div className="max-w-7xl mx-auto text-center text-slate-500 dark:text-slate-400">
          <p>&copy; 2024 OEVA Mart. All rights reserved.</p>
          <p className="text-sm mt-2">Built for Maldives Businesses</p>
        </div>
      </footer>
    </div>
  )
}
