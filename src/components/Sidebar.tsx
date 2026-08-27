import { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { 
  LayoutDashboard, 
  ShoppingCart, 
  Package, 
  Warehouse, 
  ShoppingCart as ShoppingCartCart, 
  Users, 
  Truck, 
  Book, 
  DollarSign, 
  Landmark, 
  UserCheck, 
  Heart, 
  BarChart3, 
  Utensils, 
  Settings, 
  LogOut, 
  X,
  ChevronRight,
  ChevronDown
} from 'lucide-react'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
}

const menuItems = [
  {
    category: 'Main',
    items: [
      { name: 'Dashboard', icon: LayoutDashboard, path: '/dashboard' },
      { name: 'POS', icon: ShoppingCart, path: '/pos' },
    ]
  },
  {
    category: 'Inventory',
    items: [
      { name: 'Products', icon: Package, path: '/products' },
      { name: 'Inventory', icon: Warehouse, path: '/inventory' },
      { name: 'Purchases', icon: ShoppingCartCart, path: '/purchases' },
    ]
  },
  {
    category: 'Sales',
    items: [
      { name: 'Sales', icon: ShoppingCart, path: '/sales' },
      { name: 'Customers', icon: Users, path: '/customers' },
      { name: 'Suppliers', icon: Truck, path: '/suppliers' },
    ]
  },
  {
    category: 'Finance',
    items: [
      { name: 'Accounting', icon: Book, path: '/accounting' },
      { name: 'Expenses', icon: DollarSign, path: '/expenses' },
      { name: 'Banking', icon: Landmark, path: '/banking' },
    ]
  },
  {
    category: 'HR',
    items: [
      { name: 'Payroll', icon: UserCheck, path: '/payroll' },
      { name: 'CRM', icon: Heart, path: '/crm' },
    ]
  },
  {
    category: 'Reports',
    items: [
      { name: 'Reports', icon: BarChart3, path: '/reports' },
    ]
  },
  {
    category: 'Restaurant',
    items: [
      { name: 'Tables', icon: Utensils, path: '/tables' },
    ]
  },
  {
    category: 'System',
    items: [
      { name: 'Settings', icon: Settings, path: '/settings' },
    ]
  },
]

export default function Sidebar({ isOpen, onToggle }: SidebarProps) {
  const location = useLocation()
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set(['Main']))

  const toggleCategory = (category: string) => {
    setExpandedCategories(prev => {
      const newSet = new Set(prev)
      if (newSet.has(category)) {
        newSet.delete(category)
      } else {
        newSet.add(category)
      }
      return newSet
    })
  }

  return (
    <>
      {/* Mobile overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/50 z-40 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <aside className={`
        fixed top-0 left-0 z-50 h-full w-72 glass border-r border-white/20 dark:border-slate-700/20
        transform transition-transform duration-300 ease-in-out
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
        lg:translate-x-0
      `}>
        {/* Header */}
        <div className="p-6 border-b border-slate-200 dark:border-slate-700">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center overflow-hidden">
                <img src="/logo.jpg" alt="OEVA Mart Logo" className="w-8 h-8 object-contain" />
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  OEVA Mart
                </h1>
                <p className="text-xs text-slate-500 dark:text-slate-400">Enterprise Retail</p>
              </div>
            </div>
            <button 
              onClick={onToggle}
              className="lg:hidden p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto p-4 space-y-6">
          {menuItems.map((section) => (
            <div key={section.category}>
              <button
                onClick={() => toggleCategory(section.category)}
                className="flex items-center justify-between w-full px-3 py-2 text-sm font-semibold text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white"
              >
                <span>{section.category}</span>
                {expandedCategories.has(section.category) ? (
                  <ChevronDown className="w-4 h-4" />
                ) : (
                  <ChevronRight className="w-4 h-4" />
                )}
              </button>
              
              {expandedCategories.has(section.category) && (
                <div className="mt-2 space-y-1">
                  {section.items.map((item) => {
                    const isActive = location.pathname === item.path
                    return (
                      <Link
                        key={item.path}
                        to={item.path}
                        onClick={() => {
                          if (window.innerWidth < 1024) onToggle()
                        }}
                        className={`
                          flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all
                          ${isActive 
                            ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg' 
                            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700'
                          }
                        `}
                      >
                        <item.icon className="w-4 h-4" />
                        <span>{item.name}</span>
                      </Link>
                    )
                  })}
                </div>
              )}
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-700">
          <button className="flex items-center gap-3 w-full px-3 py-2.5 rounded-lg text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
            <LogOut className="w-4 h-4" />
            <span>Logout</span>
          </button>
        </div>
      </aside>
    </>
  )
}
