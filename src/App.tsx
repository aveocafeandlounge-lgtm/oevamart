import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { StoreProvider } from './context/StoreContext'
import Landing from './pages/Landing'
import MainLayout from './layouts/MainLayout'
import Dashboard from './pages/Dashboard'
import POS from './pages/POS'
import Products from './pages/Products'
import Inventory from './pages/Inventory'
import Purchases from './pages/Purchases'
import Sales from './pages/Sales'
import Customers from './pages/Customers'
import Suppliers from './pages/Suppliers'
import Accounting from './pages/Accounting'
import Expenses from './pages/Expenses'
import Banking from './pages/Banking'
import Payroll from './pages/Payroll'
import CRM from './pages/CRM'
import Reports from './pages/Reports'
import Tables from './pages/Tables'
import Settings from './pages/Settings'
import Login from './pages/Login'

function App() {
  return (
    <StoreProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/login" element={<Login />} />
          <Route path="/" element={<MainLayout />}>
            <Route path="dashboard" element={<Dashboard />} />
            <Route path="pos" element={<POS />} />
            <Route path="products" element={<Products />} />
            <Route path="inventory" element={<Inventory />} />
            <Route path="purchases" element={<Purchases />} />
            <Route path="sales" element={<Sales />} />
            <Route path="customers" element={<Customers />} />
            <Route path="suppliers" element={<Suppliers />} />
            <Route path="accounting" element={<Accounting />} />
            <Route path="expenses" element={<Expenses />} />
            <Route path="banking" element={<Banking />} />
            <Route path="payroll" element={<Payroll />} />
            <Route path="crm" element={<CRM />} />
            <Route path="reports" element={<Reports />} />
            <Route path="tables" element={<Tables />} />
            <Route path="settings" element={<Settings />} />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </StoreProvider>
  )
}

export default App
