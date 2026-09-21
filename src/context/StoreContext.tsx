import { createContext, useContext, useState, useEffect } from 'react'
import type { ReactNode } from 'react'
import { db } from '../firebase'
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  addDoc 
} from 'firebase/firestore'

// Types for all entities
interface Product {
  id: string
  name: string
  sku: string
  category: string
  stock: number
  minStock: number
  maxStock: number
  costPrice: number
  sellingPrice: number
  warehouse: string
  status: 'in_stock' | 'low_stock' | 'out_of_stock'
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  balance: number
  totalPurchases: number
  lastPurchase: string
  status: 'active' | 'inactive'
}

interface Supplier {
  id: string
  name: string
  email: string
  phone: string
  address: string
  balance: number
  totalPurchases: number
  lastOrder: string
  status: 'active' | 'inactive'
}

interface SalesInvoice {
  id: string
  invoiceNumber: string
  customer: string
  date: string
  status: 'completed' | 'pending' | 'cancelled'
  total: number
  paid: number
  items: number
  paymentMethod: string
}

interface PurchaseOrder {
  id: string
  orderNumber: string
  supplier: string
  date: string
  expectedDate: string
  status: 'received' | 'pending' | 'ordered'
  total: number
  items: number
  warehouse: string
}

interface JournalEntry {
  id: string
  entryNumber: string
  date: string
  description: string
  debit: number
  credit: number
  status: 'posted' | 'draft'
}

interface Expense {
  id: string
  expenseNumber: string
  category: string
  description: string
  amount: number
  date: string
  paymentMethod: string
  status: 'paid' | 'pending'
}

interface BankAccount {
  id: string
  accountName: string
  accountNumber: string
  bankName: string
  balance: number
  type: string
}

interface Transaction {
  id: string
  accountId: string
  type: 'credit' | 'debit'
  amount: number
  description: string
  date: string
}

interface Employee {
  id: string
  name: string
  position: string
  department: string
  salary: number
  status: 'active' | 'inactive'
}

interface PayrollRecord {
  id: string
  employee: string
  month: string
  year: string
  basicSalary: number
  overtime: number
  deductions: number
  bonus: number
  netSalary: number
  status: 'paid' | 'pending'
}

interface Lead {
  id: string
  name: string
  company: string
  email: string
  phone: string
  status: 'new' | 'contacted' | 'qualified' | 'converted' | 'lost'
  source: string
  value: number
  lastContact: string
}

interface Table {
  id: string
  tableNumber: string
  capacity: number
  status: 'available' | 'occupied' | 'reserved' | 'cleaning'
  currentOrder: string
  server: string
  duration: string
  amount: number
}

interface AppSettings {
  businessName: string
  businessAddress: string
  businessPhone: string
  businessEmail: string
  currency: string
  taxRate: string
  language: string
  timezone: string
  darkMode: boolean
  accentColor: string
  emailNotifications: boolean
  smsNotifications: boolean
  pushNotifications: boolean
  twoFactorAuth: boolean
}

interface StoreContextType {
  // Products
  products: Product[]
  addProduct: (product: Omit<Product, 'id'>) => void
  updateProduct: (id: string, product: Partial<Product>) => void
  deleteProduct: (id: string) => void
  
  // Customers
  customers: Customer[]
  addCustomer: (customer: Omit<Customer, 'id'>) => void
  updateCustomer: (id: string, customer: Partial<Customer>) => void
  deleteCustomer: (id: string) => void
  
  // Suppliers
  suppliers: Supplier[]
  addSupplier: (supplier: Omit<Supplier, 'id'>) => void
  updateSupplier: (id: string, supplier: Partial<Supplier>) => void
  deleteSupplier: (id: string) => void
  
  // Sales
  salesInvoices: SalesInvoice[]
  addSalesInvoice: (invoice: Omit<SalesInvoice, 'id'>) => void
  updateSalesInvoice: (id: string, invoice: Partial<SalesInvoice>) => void
  deleteSalesInvoice: (id: string) => void
  
  // Purchases
  purchaseOrders: PurchaseOrder[]
  addPurchaseOrder: (order: Omit<PurchaseOrder, 'id'>) => void
  updatePurchaseOrder: (id: string, order: Partial<PurchaseOrder>) => void
  deletePurchaseOrder: (id: string) => void
  
  // Accounting
  journalEntries: JournalEntry[]
  addJournalEntry: (entry: Omit<JournalEntry, 'id'>) => void
  updateJournalEntry: (id: string, entry: Partial<JournalEntry>) => void
  deleteJournalEntry: (id: string) => void
  
  // Expenses
  expenses: Expense[]
  addExpense: (expense: Omit<Expense, 'id'>) => void
  updateExpense: (id: string, expense: Partial<Expense>) => void
  deleteExpense: (id: string) => void
  
  // Banking
  bankAccounts: BankAccount[]
  transactions: Transaction[]
  addBankAccount: (account: Omit<BankAccount, 'id'>) => void
  updateBankAccount: (id: string, account: Partial<BankAccount>) => void
  deleteBankAccount: (id: string) => void
  addTransaction: (transaction: Omit<Transaction, 'id'>) => void
  updateTransaction: (id: string, transaction: Partial<Transaction>) => void
  deleteTransaction: (id: string) => void
  
  // Payroll
  employees: Employee[]
  payrollRecords: PayrollRecord[]
  addEmployee: (employee: Omit<Employee, 'id'>) => void
  updateEmployee: (id: string, employee: Partial<Employee>) => void
  deleteEmployee: (id: string) => void
  addPayrollRecord: (record: Omit<PayrollRecord, 'id'>) => void
  updatePayrollRecord: (id: string, record: Partial<PayrollRecord>) => void
  deletePayrollRecord: (id: string) => void
  
  // CRM
  leads: Lead[]
  addLead: (lead: Omit<Lead, 'id'>) => void
  updateLead: (id: string, lead: Partial<Lead>) => void
  deleteLead: (id: string) => void
  
  // Tables
  tables: Table[]
  addTable: (table: Omit<Table, 'id'>) => void
  updateTable: (id: string, table: Partial<Table>) => void
  deleteTable: (id: string) => void
  
  // Settings
  settings: AppSettings
  updateSettings: (settings: Partial<AppSettings>) => void
  
  // Theme
  darkMode: boolean
  toggleDarkMode: () => void
  accentColor: string
  setAccentColor: (color: string) => void
}

const StoreContext = createContext<StoreContextType | undefined>(undefined)

// Initial dummy data
const initialProducts: Product[] = [
  { id: '1', name: 'Coca Cola 330ml', sku: 'SKU-0001', category: 'Beverages', stock: 150, minStock: 20, maxStock: 200, costPrice: 15, sellingPrice: 25, warehouse: 'Main Warehouse', status: 'in_stock' },
  { id: '2', name: 'Mineral Water 500ml', sku: 'SKU-0002', category: 'Beverages', stock: 200, minStock: 30, maxStock: 300, costPrice: 8, sellingPrice: 15, warehouse: 'Main Warehouse', status: 'in_stock' },
  { id: '3', name: 'Snickers Bar', sku: 'SKU-0003', category: 'Snacks', stock: 10, minStock: 15, maxStock: 50, costPrice: 10, sellingPrice: 20, warehouse: 'Main Warehouse', status: 'low_stock' },
  { id: '4', name: 'Lays Classic', sku: 'SKU-0004', category: 'Snacks', stock: 0, minStock: 20, maxStock: 100, costPrice: 12, sellingPrice: 25, warehouse: 'Main Warehouse', status: 'out_of_stock' },
  { id: '5', name: 'Bread Sliced', sku: 'SKU-0005', category: 'Bakery', stock: 25, minStock: 10, maxStock: 50, costPrice: 8, sellingPrice: 15, warehouse: 'Main Warehouse', status: 'in_stock' },
]

const initialCustomers: Customer[] = [
  { id: '1', name: 'Ahmed Mohamed', email: 'ahmed@email.com', phone: '+960 123-4567', address: 'Male, Maldives', balance: 500, totalPurchases: 15000, lastPurchase: '2024-01-15', status: 'active' },
  { id: '2', name: 'Fatima Ali', email: 'fatima@email.com', phone: '+960 234-5678', address: 'Hulhumale, Maldives', balance: 0, totalPurchases: 8500, lastPurchase: '2024-01-14', status: 'active' },
  { id: '3', name: 'Ibrahim Hassan', email: 'ibrahim@email.com', phone: '+960 345-6789', address: 'Male, Maldives', balance: 1200, totalPurchases: 22000, lastPurchase: '2024-01-10', status: 'inactive' },
]

const initialSuppliers: Supplier[] = [
  { id: '1', name: 'Maldives Food Supply', email: 'supply@food.com', phone: '+960 999-8888', address: 'Male, Maldives', balance: 5000, totalPurchases: 150000, lastOrder: '2024-01-15', status: 'active' },
  { id: '2', name: 'Beverage Distributors', email: 'beverage@dist.com', phone: '+960 777-6666', address: 'Hulhumale, Maldives', balance: 0, totalPurchases: 75000, lastOrder: '2024-01-12', status: 'active' },
]

const initialSalesInvoices: SalesInvoice[] = [
  { id: '1', invoiceNumber: 'INV-2024-001', customer: 'Ahmed Mohamed', date: '2024-01-15', status: 'completed', total: 450, paid: 450, items: 5, paymentMethod: 'Cash' },
  { id: '2', invoiceNumber: 'INV-2024-002', customer: 'Fatima Ali', date: '2024-01-14', status: 'completed', total: 280, paid: 280, items: 3, paymentMethod: 'Card' },
  { id: '3', invoiceNumber: 'INV-2024-003', customer: 'Ibrahim Hassan', date: '2024-01-13', status: 'pending', total: 650, paid: 0, items: 8, paymentMethod: 'Bank Transfer' },
]

const initialPurchaseOrders: PurchaseOrder[] = [
  { id: '1', orderNumber: 'PO-2024-001', supplier: 'Maldives Food Supply', date: '2024-01-15', expectedDate: '2024-01-20', status: 'received', total: 15000, items: 50, warehouse: 'Main Warehouse' },
  { id: '2', orderNumber: 'PO-2024-002', supplier: 'Beverage Distributors', date: '2024-01-14', expectedDate: '2024-01-18', status: 'pending', total: 8000, items: 30, warehouse: 'Main Warehouse' },
]

const initialJournalEntries: JournalEntry[] = [
  { id: '1', entryNumber: 'JE-2024-001', date: '2024-01-15', description: 'Sales Revenue', debit: 0, credit: 450, status: 'posted' },
  { id: '2', entryNumber: 'JE-2024-002', date: '2024-01-15', description: 'Cash Received', debit: 450, credit: 0, status: 'posted' },
  { id: '3', entryNumber: 'JE-2024-003', date: '2024-01-14', description: 'Inventory Purchase', debit: 15000, credit: 0, status: 'draft' },
]

const initialExpenses: Expense[] = [
  { id: '1', expenseNumber: 'EXP-2024-001', category: 'Utilities', description: 'Electricity Bill', amount: 2500, date: '2024-01-15', paymentMethod: 'Bank Transfer', status: 'paid' },
  { id: '2', expenseNumber: 'EXP-2024-002', category: 'Rent', description: 'Office Rent', amount: 10000, date: '2024-01-10', paymentMethod: 'Bank Transfer', status: 'paid' },
  { id: '3', expenseNumber: 'EXP-2024-003', category: 'Supplies', description: 'Office Supplies', amount: 500, date: '2024-01-12', paymentMethod: 'Cash', status: 'pending' },
]

const initialBankAccounts: BankAccount[] = [
  { id: '1', accountName: 'Main Operating Account', accountNumber: '1234-5678-9012', bankName: 'Bank of Maldives', balance: 150000, type: 'Checking' },
  { id: '2', accountName: 'Petty Cash', accountNumber: 'N/A', bankName: 'Cash', balance: 5000, type: 'Cash' },
]

const initialTransactions: Transaction[] = [
  { id: '1', accountId: '1', type: 'credit', amount: 450, description: 'Sales Payment', date: '2024-01-15' },
  { id: '2', accountId: '1', type: 'debit', amount: 2500, description: 'Electricity Bill', date: '2024-01-15' },
  { id: '3', accountId: '1', type: 'debit', amount: 10000, description: 'Office Rent', date: '2024-01-10' },
]

const initialEmployees: Employee[] = [
  { id: '1', name: 'Ahmed Mohamed', position: 'Manager', department: 'Operations', salary: 15000, status: 'active' },
  { id: '2', name: 'Fatima Ali', position: 'Cashier', department: 'Sales', salary: 8000, status: 'active' },
  { id: '3', name: 'Ibrahim Hassan', position: 'Stock Clerk', department: 'Inventory', salary: 7500, status: 'active' },
  { id: '4', name: 'Aisha Ahmed', position: 'Supervisor', department: 'Operations', salary: 12000, status: 'active' },
]

const initialPayrollRecords: PayrollRecord[] = [
  { id: '1', employee: 'Ahmed Mohamed', month: 'January', year: '2024', basicSalary: 15000, overtime: 2000, deductions: 500, bonus: 1000, netSalary: 17500, status: 'paid' },
  { id: '2', employee: 'Fatima Ali', month: 'January', year: '2024', basicSalary: 8000, overtime: 500, deductions: 200, bonus: 500, netSalary: 8800, status: 'paid' },
  { id: '3', employee: 'Ibrahim Hassan', month: 'January', year: '2024', basicSalary: 7500, overtime: 0, deductions: 150, bonus: 0, netSalary: 7350, status: 'pending' },
]

const initialLeads: Lead[] = [
  { id: '1', name: 'Ahmed Mohamed', company: 'Maldives Resorts', email: 'ahmed@resorts.com', phone: '+960 123-4567', status: 'qualified', source: 'Website', value: 50000, lastContact: '2024-01-15' },
  { id: '2', name: 'Fatima Ali', company: 'Island Tours', email: 'fatima@tours.com', phone: '+960 234-5678', status: 'new', source: 'Referral', value: 25000, lastContact: '2024-01-14' },
  { id: '3', name: 'Ibrahim Hassan', company: 'Dive Center', email: 'ibrahim@dive.com', phone: '+960 345-6789', status: 'contacted', source: 'Trade Show', value: 35000, lastContact: '2024-01-13' },
]

const initialTables: Table[] = [
  { id: '1', tableNumber: 'T-01', capacity: 2, status: 'occupied', currentOrder: 'ORD-2024-001', server: 'Ahmed', duration: '45 min', amount: 450 },
  { id: '2', tableNumber: 'T-02', capacity: 4, status: 'available', currentOrder: '-', server: '-', duration: '-', amount: 0 },
  { id: '3', tableNumber: 'T-03', capacity: 6, status: 'reserved', currentOrder: 'RES-2024-001', server: 'Fatima', duration: '-', amount: 0 },
  { id: '4', tableNumber: 'T-04', capacity: 2, status: 'occupied', currentOrder: 'ORD-2024-002', server: 'Ibrahim', duration: '30 min', amount: 280 },
  { id: '5', tableNumber: 'T-05', capacity: 4, status: 'cleaning', currentOrder: '-', server: '-', duration: '-', amount: 0 },
  { id: '6', tableNumber: 'T-06', capacity: 8, status: 'available', currentOrder: '-', server: '-', duration: '-', amount: 0 },
  { id: '7', tableNumber: 'T-07', capacity: 2, status: 'occupied', currentOrder: 'ORD-2024-003', server: 'Aisha', duration: '60 min', amount: 650 },
  { id: '8', tableNumber: 'T-08', capacity: 4, status: 'available', currentOrder: '-', server: '-', duration: '-', amount: 0 },
]

const initialSettings: AppSettings = {
  businessName: 'OEVA Mart',
  businessAddress: 'Male, Maldives',
  businessPhone: '+960 123-4567',
  businessEmail: 'info@oevamart.com',
  currency: 'MVR',
  taxRate: '6',
  language: 'en',
  timezone: 'Indian/Maldives',
  darkMode: false,
  accentColor: 'blue',
  emailNotifications: true,
  smsNotifications: false,
  pushNotifications: true,
  twoFactorAuth: false,
}

// Helper function to generate ID
const generateId = () => Math.random().toString(36).substr(2, 9)

// Helper to load data from Firestore
const loadFromFirestore = async (collectionName: string, defaultValue: any) => {
  try {
    const querySnapshot = await getDocs(collection(db, collectionName))
    const data: any[] = []
    querySnapshot.forEach((doc) => {
      data.push({ id: doc.id, ...doc.data() })
    })
    return data.length > 0 ? data : defaultValue
  } catch (error) {
    console.error(`Error loading from Firestore (${collectionName}):`, error)
    return defaultValue
  }
}

// Helper to save single document to Firestore
const saveToFirestore = async (collectionName: string, data: any) => {
  try {
    // If data is an array, save each item as a separate document
    if (Array.isArray(data)) {
      for (const item of data) {
        if (item.id) {
          await setDoc(doc(db, collectionName, item.id), item)
        } else {
          await addDoc(collection(db, collectionName), item)
        }
      }
    } else {
      // Single object
      if (data.id) {
        await setDoc(doc(db, collectionName, data.id), data)
      } else {
        await addDoc(collection(db, collectionName), data)
      }
    }
  } catch (error) {
    console.error(`Error saving to Firestore (${collectionName}):`, error)
  }
}

export function StoreProvider({ children }: { children: ReactNode }) {
  // Load data from Firestore or use initial data
  const [products, setProducts] = useState<Product[]>(initialProducts)
  const [customers, setCustomers] = useState<Customer[]>(initialCustomers)
  const [suppliers, setSuppliers] = useState<Supplier[]>(initialSuppliers)
  const [salesInvoices, setSalesInvoices] = useState<SalesInvoice[]>(initialSalesInvoices)
  const [purchaseOrders, setPurchaseOrders] = useState<PurchaseOrder[]>(initialPurchaseOrders)
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>(initialJournalEntries)
  const [expenses, setExpenses] = useState<Expense[]>(initialExpenses)
  const [bankAccounts, setBankAccounts] = useState<BankAccount[]>(initialBankAccounts)
  const [transactions, setTransactions] = useState<Transaction[]>(initialTransactions)
  const [employees, setEmployees] = useState<Employee[]>(initialEmployees)
  const [payrollRecords, setPayrollRecords] = useState<PayrollRecord[]>(initialPayrollRecords)
  const [leads, setLeads] = useState<Lead[]>(initialLeads)
  const [tables, setTables] = useState<Table[]>(initialTables)
  const [settings, setSettingsState] = useState<AppSettings>(initialSettings)
  
  const [darkMode, setDarkMode] = useState(false)
  const [accentColor, setAccentColorState] = useState('blue')
  const [loading, setLoading] = useState(true)

  // Load data from Firestore on mount
  useEffect(() => {
    const loadData = async () => {
      try {
        const [
          productsData,
          customersData,
          suppliersData,
          salesInvoicesData,
          purchaseOrdersData,
          journalEntriesData,
          expensesData,
          bankAccountsData,
          transactionsData,
          employeesData,
          payrollRecordsData,
          leadsData,
          tablesData,
          settingsData
        ] = await Promise.all([
          loadFromFirestore('products', initialProducts),
          loadFromFirestore('customers', initialCustomers),
          loadFromFirestore('suppliers', initialSuppliers),
          loadFromFirestore('salesInvoices', initialSalesInvoices),
          loadFromFirestore('purchaseOrders', initialPurchaseOrders),
          loadFromFirestore('journalEntries', initialJournalEntries),
          loadFromFirestore('expenses', initialExpenses),
          loadFromFirestore('bankAccounts', initialBankAccounts),
          loadFromFirestore('transactions', initialTransactions),
          loadFromFirestore('employees', initialEmployees),
          loadFromFirestore('payrollRecords', initialPayrollRecords),
          loadFromFirestore('leads', initialLeads),
          loadFromFirestore('tables', initialTables),
          loadFromFirestore('settings', initialSettings)
        ])

        setProducts(productsData)
        setCustomers(customersData)
        setSuppliers(suppliersData)
        setSalesInvoices(salesInvoicesData)
        setPurchaseOrders(purchaseOrdersData)
        setJournalEntries(journalEntriesData)
        setExpenses(expensesData)
        setBankAccounts(bankAccountsData)
        setTransactions(transactionsData)
        setEmployees(employeesData)
        setPayrollRecords(payrollRecordsData)
        setLeads(leadsData)
        setTables(tablesData)
        setSettingsState(settingsData)
        
        // Load theme settings
        const darkModeData = await loadFromFirestore('theme', { darkMode: false })
        const accentColorData = await loadFromFirestore('theme', { accentColor: 'blue' })
        setDarkMode(darkModeData.darkMode || false)
        setAccentColorState(accentColorData.accentColor || 'blue')
        
        setLoading(false)
      } catch (error) {
        console.error('Error loading data from Firestore:', error)
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Save to Firestore whenever data changes
  useEffect(() => { 
    if (!loading) saveToFirestore('products', products) 
  }, [products, loading])
  useEffect(() => { 
    if (!loading) saveToFirestore('customers', customers) 
  }, [customers, loading])
  useEffect(() => { 
    if (!loading) saveToFirestore('suppliers', suppliers) 
  }, [suppliers, loading])
  useEffect(() => { 
    if (!loading) saveToFirestore('salesInvoices', salesInvoices) 
  }, [salesInvoices, loading])
  useEffect(() => { 
    if (!loading) saveToFirestore('purchaseOrders', purchaseOrders) 
  }, [purchaseOrders, loading])
  useEffect(() => { 
    if (!loading) saveToFirestore('journalEntries', journalEntries) 
  }, [journalEntries, loading])
  useEffect(() => { 
    if (!loading) saveToFirestore('expenses', expenses) 
  }, [expenses, loading])
  useEffect(() => { 
    if (!loading) saveToFirestore('bankAccounts', bankAccounts) 
  }, [bankAccounts, loading])
  useEffect(() => { 
    if (!loading) saveToFirestore('transactions', transactions) 
  }, [transactions, loading])
  useEffect(() => { 
    if (!loading) saveToFirestore('employees', employees) 
  }, [employees, loading])
  useEffect(() => { 
    if (!loading) saveToFirestore('payrollRecords', payrollRecords) 
  }, [payrollRecords, loading])
  useEffect(() => { 
    if (!loading) saveToFirestore('leads', leads) 
  }, [leads, loading])
  useEffect(() => { 
    if (!loading) saveToFirestore('tables', tables) 
  }, [tables, loading])
  useEffect(() => { 
    if (!loading) saveToFirestore('settings', settings) 
  }, [settings, loading])
  useEffect(() => { 
    if (!loading) saveToFirestore('theme', { darkMode, accentColor }) 
  }, [darkMode, accentColor, loading])

  // Apply dark mode to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }, [darkMode])

  // CRUD operations for Products
  const addProduct = (product: Omit<Product, 'id'>) => {
    const newProduct = { ...product, id: generateId() }
    // Auto-set stock status based on stock level
    if (newProduct.stock === 0) {
      newProduct.status = 'out_of_stock'
    } else if (newProduct.stock <= newProduct.minStock) {
      newProduct.status = 'low_stock'
    } else {
      newProduct.status = 'in_stock'
    }
    setProducts([...products, newProduct])
  }

  const updateProduct = (id: string, updatedProduct: Partial<Product>) => {
    setProducts(products.map(p => {
      if (p.id === id) {
        const updated = { ...p, ...updatedProduct }
        // Auto-update stock status based on stock level
        if (updated.stock === 0) {
          updated.status = 'out_of_stock'
        } else if (updated.stock <= updated.minStock) {
          updated.status = 'low_stock'
        } else {
          updated.status = 'in_stock'
        }
        return updated
      }
      return p
    }))
  }

  const deleteProduct = (id: string) => {
    setProducts(products.filter(p => p.id !== id))
  }

  // CRUD operations for Customers
  const addCustomer = (customer: Omit<Customer, 'id'>) => {
    const newCustomer = { ...customer, id: generateId() }
    setCustomers([...customers, newCustomer])
  }

  const updateCustomer = (id: string, updatedCustomer: Partial<Customer>) => {
    setCustomers(customers.map(c => c.id === id ? { ...c, ...updatedCustomer } : c))
  }

  const deleteCustomer = (id: string) => {
    setCustomers(customers.filter(c => c.id !== id))
  }

  // CRUD operations for Suppliers
  const addSupplier = (supplier: Omit<Supplier, 'id'>) => {
    const newSupplier = { ...supplier, id: generateId() }
    setSuppliers([...suppliers, newSupplier])
  }

  const updateSupplier = (id: string, updatedSupplier: Partial<Supplier>) => {
    setSuppliers(suppliers.map(s => s.id === id ? { ...s, ...updatedSupplier } : s))
  }

  const deleteSupplier = (id: string) => {
    setSuppliers(suppliers.filter(s => s.id !== id))
  }

  // CRUD operations for Sales
  const addSalesInvoice = (invoice: Omit<SalesInvoice, 'id'>) => {
    const newInvoice = { ...invoice, id: generateId() }
    setSalesInvoices([...salesInvoices, newInvoice])
    
    // Update customer's total purchases and last purchase date
    const customer = customers.find(c => c.name === invoice.customer)
    if (customer) {
      updateCustomer(customer.id, {
        totalPurchases: customer.totalPurchases + invoice.total,
        lastPurchase: invoice.date,
      })
    }
    
    // Create automatic journal entry for sales revenue
    addJournalEntry({
      entryNumber: `JE-${new Date().getFullYear()}-${String(journalEntries.length + 1).padStart(3, '0')}`,
      date: invoice.date,
      description: `Sales Invoice ${invoice.invoiceNumber} - ${invoice.customer}`,
      debit: 0,
      credit: invoice.total,
      status: 'posted',
    })
    
    // Note: Product stock reduction would need product details in the invoice
    // This is a simplified version - in a real app, the invoice would contain line items
  }

  const updateSalesInvoice = (id: string, updatedInvoice: Partial<SalesInvoice>) => {
    setSalesInvoices(salesInvoices.map(i => i.id === id ? { ...i, ...updatedInvoice } : i))
  }

  const deleteSalesInvoice = (id: string) => {
    setSalesInvoices(salesInvoices.filter(i => i.id !== id))
  }

  // CRUD operations for Purchases
  const addPurchaseOrder = (order: Omit<PurchaseOrder, 'id'>) => {
    const newOrder = { ...order, id: generateId() }
    setPurchaseOrders([...purchaseOrders, newOrder])
    
    // Update supplier's total purchases and last order date
    const supplier = suppliers.find(s => s.name === order.supplier)
    if (supplier) {
      updateSupplier(supplier.id, {
        totalPurchases: supplier.totalPurchases + order.total,
        lastOrder: order.date,
      })
    }
    
    // Create automatic journal entry for purchase
    addJournalEntry({
      entryNumber: `JE-${new Date().getFullYear()}-${String(journalEntries.length + 1).padStart(3, '0')}`,
      date: order.date,
      description: `Purchase Order ${order.orderNumber} - ${order.supplier}`,
      debit: order.total,
      credit: 0,
      status: 'posted',
    })
    
    // Note: Product stock increase would need product details in the order
    // This is a simplified version - in a real app, the order would contain line items
  }

  const updatePurchaseOrder = (id: string, updatedOrder: Partial<PurchaseOrder>) => {
    setPurchaseOrders(purchaseOrders.map(o => o.id === id ? { ...o, ...updatedOrder } : o))
  }

  const deletePurchaseOrder = (id: string) => {
    setPurchaseOrders(purchaseOrders.filter(o => o.id !== id))
  }

  // CRUD operations for Accounting
  const addJournalEntry = (entry: Omit<JournalEntry, 'id'>) => {
    const newEntry = { ...entry, id: generateId() }
    setJournalEntries([...journalEntries, newEntry])
  }

  const updateJournalEntry = (id: string, updatedEntry: Partial<JournalEntry>) => {
    setJournalEntries(journalEntries.map(e => e.id === id ? { ...e, ...updatedEntry } : e))
  }

  const deleteJournalEntry = (id: string) => {
    setJournalEntries(journalEntries.filter(e => e.id !== id))
  }

  // CRUD operations for Expenses
  const addExpense = (expense: Omit<Expense, 'id'>) => {
    const newExpense = { ...expense, id: generateId() }
    setExpenses([...expenses, newExpense])
    
    // Create automatic journal entry for expense
    addJournalEntry({
      entryNumber: `JE-${new Date().getFullYear()}-${String(journalEntries.length + 1).padStart(3, '0')}`,
      date: expense.date,
      description: `Expense: ${expense.description} (${expense.category})`,
      debit: expense.amount,
      credit: 0,
      status: 'posted',
    })
  }

  const updateExpense = (id: string, updatedExpense: Partial<Expense>) => {
    setExpenses(expenses.map(e => e.id === id ? { ...e, ...updatedExpense } : e))
  }

  const deleteExpense = (id: string) => {
    setExpenses(expenses.filter(e => e.id !== id))
  }

  // CRUD operations for Banking
  const addBankAccount = (account: Omit<BankAccount, 'id'>) => {
    const newAccount = { ...account, id: generateId() }
    setBankAccounts([...bankAccounts, newAccount])
  }

  const updateBankAccount = (id: string, updatedAccount: Partial<BankAccount>) => {
    setBankAccounts(bankAccounts.map(a => a.id === id ? { ...a, ...updatedAccount } : a))
  }

  const deleteBankAccount = (id: string) => {
    setBankAccounts(bankAccounts.filter(a => a.id !== id))
  }

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = { ...transaction, id: generateId() }
    setTransactions([...transactions, newTransaction])
    
    // Update bank account balance based on transaction type
    const account = bankAccounts.find(a => a.id === transaction.accountId)
    if (account) {
      const balanceChange = transaction.type === 'credit' ? transaction.amount : -transaction.amount
      updateBankAccount(account.id, {
        balance: account.balance + balanceChange,
      })
    }
  }

  const updateTransaction = (id: string, updatedTransaction: Partial<Transaction>) => {
    setTransactions(transactions.map(t => t.id === id ? { ...t, ...updatedTransaction } : t))
  }

  const deleteTransaction = (id: string) => {
    const transaction = transactions.find(t => t.id === id)
    if (transaction) {
      // Reverse the balance change when deleting a transaction
      const account = bankAccounts.find(a => a.id === transaction.accountId)
      if (account) {
        const balanceChange = transaction.type === 'credit' ? -transaction.amount : transaction.amount
        updateBankAccount(account.id, {
          balance: account.balance + balanceChange,
        })
      }
    }
    setTransactions(transactions.filter(t => t.id !== id))
  }

  // CRUD operations for Payroll
  const addEmployee = (employee: Omit<Employee, 'id'>) => {
    const newEmployee = { ...employee, id: generateId() }
    setEmployees([...employees, newEmployee])
  }

  const updateEmployee = (id: string, updatedEmployee: Partial<Employee>) => {
    setEmployees(employees.map(e => e.id === id ? { ...e, ...updatedEmployee } : e))
  }

  const deleteEmployee = (id: string) => {
    setEmployees(employees.filter(e => e.id !== id))
  }

  const addPayrollRecord = (record: Omit<PayrollRecord, 'id'>) => {
    const newRecord = { ...record, id: generateId() }
    setPayrollRecords([...payrollRecords, newRecord])
    
    // Create automatic journal entry for payroll expense
    addJournalEntry({
      entryNumber: `JE-${new Date().getFullYear()}-${String(journalEntries.length + 1).padStart(3, '0')}`,
      date: newRecord.year + '-' + newRecord.month + '-01',
      description: `Payroll for ${newRecord.month} ${newRecord.year} - ${newRecord.employee}`,
      debit: newRecord.netSalary,
      credit: 0,
      status: 'posted',
    })
  }

  const updatePayrollRecord = (id: string, updatedRecord: Partial<PayrollRecord>) => {
    setPayrollRecords(payrollRecords.map(r => r.id === id ? { ...r, ...updatedRecord } : r))
  }

  const deletePayrollRecord = (id: string) => {
    setPayrollRecords(payrollRecords.filter(r => r.id !== id))
  }

  // CRUD operations for CRM
  const addLead = (lead: Omit<Lead, 'id'>) => {
    const newLead = { ...lead, id: generateId() }
    setLeads([...leads, newLead])
  }

  const updateLead = (id: string, updatedLead: Partial<Lead>) => {
    setLeads(leads.map(l => l.id === id ? { ...l, ...updatedLead } : l))
  }

  const deleteLead = (id: string) => {
    setLeads(leads.filter(l => l.id !== id))
  }

  // CRUD operations for Tables
  const addTable = (table: Omit<Table, 'id'>) => {
    const newTable = { ...table, id: generateId() }
    setTables([...tables, newTable])
  }

  const updateTable = (id: string, updatedTable: Partial<Table>) => {
    setTables(tables.map(t => t.id === id ? { ...t, ...updatedTable } : t))
  }

  const deleteTable = (id: string) => {
    setTables(tables.filter(t => t.id !== id))
  }

  // Settings operations
  const updateSettings = (updatedSettings: Partial<AppSettings>) => {
    setSettingsState({ ...settings, ...updatedSettings })
  }

  // Theme operations
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
    setSettingsState({ ...settings, darkMode: !darkMode })
  }

  const setAccentColor = (color: string) => {
    setAccentColorState(color)
    setSettingsState({ ...settings, accentColor: color })
  }

  const value: StoreContextType = {
    products, addProduct, updateProduct, deleteProduct,
    customers, addCustomer, updateCustomer, deleteCustomer,
    suppliers, addSupplier, updateSupplier, deleteSupplier,
    salesInvoices, addSalesInvoice, updateSalesInvoice, deleteSalesInvoice,
    purchaseOrders, addPurchaseOrder, updatePurchaseOrder, deletePurchaseOrder,
    journalEntries, addJournalEntry, updateJournalEntry, deleteJournalEntry,
    expenses, addExpense, updateExpense, deleteExpense,
    bankAccounts, transactions, addBankAccount, updateBankAccount, deleteBankAccount,
    addTransaction, updateTransaction, deleteTransaction,
    employees, payrollRecords, addEmployee, updateEmployee, deleteEmployee,
    addPayrollRecord, updatePayrollRecord, deletePayrollRecord,
    leads, addLead, updateLead, deleteLead,
    tables, addTable, updateTable, deleteTable,
    settings, updateSettings,
    darkMode, toggleDarkMode, accentColor, setAccentColor,
  }

  return <StoreContext.Provider value={value}>{children}</StoreContext.Provider>
}

export function useStore() {
  const context = useContext(StoreContext)
  if (context === undefined) {
    throw new Error('useStore must be used within a StoreProvider')
  }
  return context
}
