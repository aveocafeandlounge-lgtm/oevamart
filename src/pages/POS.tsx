import { useState } from 'react'
import { ShoppingCart, Search, Plus, Minus, Trash2, CreditCard, Wallet, Smartphone, User, Tag, Clock, X, Check, Printer, Share2, MessageCircle } from 'lucide-react'
import { useStore } from '../context/StoreContext'

interface CartItem {
  id: string
  name: string
  price: number
  quantity: number
}

const categories = ['All', 'Beverages', 'Food', 'Snacks', 'Dairy', 'Groceries']

export default function POS() {
  const { products, customers, salesInvoices, addSalesInvoice } = useStore()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [cart, setCart] = useState<CartItem[]>([])
  const [selectedCustomer, setSelectedCustomer] = useState<string>('')
  const [discount, setDiscount] = useState(0)
  const [paymentMethod, setPaymentMethod] = useState<'cash' | 'card' | 'bank'>('cash')
  const [showPaymentModal, setShowPaymentModal] = useState(false)
  const [amountReceived, setAmountReceived] = useState('')
  const [heldOrders, setHeldOrders] = useState<CartItem[][]>([])

  const GST_RATE = 0.06

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === 'All' || product.category === selectedCategory
    return matchesSearch && matchesCategory
  })

  const addToCart = (product: any) => {
    setCart(prevCart => {
      const existingItem = prevCart.find(item => item.id === product.id)
      if (existingItem) {
        return prevCart.map(item =>
          item.id === product.id
            ? { ...item, quantity: Math.min(item.quantity + 1, product.stock) }
            : item
        )
      }
      return [...prevCart, { id: product.id, name: product.name, price: product.sellingPrice, quantity: 1 }]
    })
  }

  const removeFromCart = (productId: string) => {
    setCart(prevCart => prevCart.filter(item => item.id !== productId))
  }

  const updateQuantity = (productId: string, change: number) => {
    setCart(prevCart =>
      prevCart.map(item => {
        if (item.id === productId) {
          const newQuantity = Math.max(1, item.quantity + change)
          const product = products.find(p => p.id === productId)
          return { ...item, quantity: Math.min(newQuantity, product?.stock || newQuantity) }
        }
        return item
      })
    )
  }

  const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
  const discountAmount = subtotal * (discount / 100)
  const afterDiscount = subtotal - discountAmount
  const tax = afterDiscount * GST_RATE
  const total = afterDiscount + tax

  const handlePayment = () => {
    if (cart.length === 0) return
    if (paymentMethod === 'cash' && parseFloat(amountReceived) < total) {
      alert('Insufficient amount received')
      return
    }
    
    const invoiceNumber = `INV-${new Date().getFullYear()}-${String(salesInvoices.length + 1).padStart(3, '0')}`
    addSalesInvoice({
      invoiceNumber,
      customer: selectedCustomer || 'Walk-in',
      date: new Date().toISOString().split('T')[0],
      status: 'completed',
      total,
      paid: total,
      items: cart.length,
      paymentMethod: paymentMethod.charAt(0).toUpperCase() + paymentMethod.slice(1),
    })
    
    alert(`Payment successful! Total: MVR ${total.toFixed(2)}`)
    setCart([])
    setDiscount(0)
    setSelectedCustomer('')
    setAmountReceived('')
    setShowPaymentModal(false)
  }

  const holdOrder = () => {
    if (cart.length === 0) return
    setHeldOrders(prev => [...prev, [...cart]])
    setCart([])
    setDiscount(0)
  }

  const resumeOrder = (index: number) => {
    setCart(heldOrders[index])
    setHeldOrders(prev => prev.filter((_, i) => i !== index))
  }

  const clearCart = () => {
    setCart([])
    setDiscount(0)
    setSelectedCustomer('')
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-800 dark:text-white">Point of Sale</h1>
        <p className="text-slate-500 dark:text-slate-400">Process sales and manage transactions</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Products Section */}
        <div className="lg:col-span-2 space-y-4">
          {/* Search and Filter */}
          <div className="glass-card p-4">
            <div className="flex gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
                <input
                  type="text"
                  placeholder="Search products or scan barcode..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
              >
                {categories.map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Held Orders */}
          {heldOrders.length > 0 && (
            <div className="glass-card p-4">
              <h3 className="font-semibold text-slate-800 dark:text-white mb-3 flex items-center gap-2">
                <Clock className="w-4 h-4" />
                Held Orders ({heldOrders.length})
              </h3>
              <div className="flex gap-2 flex-wrap">
                {heldOrders.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => resumeOrder(index)}
                    className="px-3 py-2 bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-400 rounded-lg text-sm hover:bg-orange-200 dark:hover:bg-orange-900/50"
                  >
                    Resume Order {index + 1}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <div
                key={product.id}
                onClick={() => addToCart(product)}
                className={`glass-card p-4 cursor-pointer hover:scale-105 transition-transform ${
                  product.stock === 0 ? 'opacity-50 cursor-not-allowed' : ''
                }`}
              >
                <div className="aspect-square bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-800 rounded-lg mb-3 flex items-center justify-center">
                  <ShoppingCart className="w-8 h-8 text-slate-400" />
                </div>
                <h3 className="font-medium text-slate-800 dark:text-white text-sm mb-1 line-clamp-2">{product.name}</h3>
                <div className="flex items-center justify-between">
                  <p className="text-blue-600 font-semibold">MVR {product.sellingPrice.toFixed(2)}</p>
                  <p className={`text-xs ${product.stock < 10 ? 'text-red-500' : 'text-slate-500'}`}>
                    {product.stock} left
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Cart Section */}
        <div className="glass-card p-4 h-fit sticky top-4">
          <h2 className="text-lg font-semibold text-slate-800 dark:text-white mb-4">Current Order</h2>
          
          {/* Customer Selection */}
          <div className="mb-4">
            <div className="relative">
              <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
              <select
                value={selectedCustomer}
                onChange={(e) => setSelectedCustomer(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
              >
                <option value="">Walk-in Customer</option>
                {customers.map(customer => (
                  <option key={customer.id} value={customer.name}>{customer.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Cart Items */}
          <div className="space-y-3 mb-4 max-h-64 overflow-y-auto">
            {cart.length === 0 ? (
              <div className="text-center py-8 text-slate-500 dark:text-slate-400">
                <ShoppingCart className="w-12 h-12 mx-auto mb-2 opacity-50" />
                <p>Cart is empty</p>
              </div>
            ) : (
              cart.map((item) => (
                <div key={item.id} className="flex items-center gap-3 p-3 bg-slate-50 dark:bg-slate-800/50 rounded-lg">
                  <div className="flex-1">
                    <p className="font-medium text-slate-800 dark:text-white text-sm">{item.name}</p>
                    <p className="text-xs text-slate-500">MVR {item.price.toFixed(2)} × {item.quantity}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, -1)}
                      className="w-6 h-6 rounded bg-slate-200 dark:bg-slate-700 flex items-center justify-center hover:bg-slate-300 dark:hover:bg-slate-600"
                    >
                      <Minus className="w-3 h-3" />
                    </button>
                    <span className="w-6 text-center text-sm font-medium">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, 1)}
                      className="w-6 h-6 rounded bg-blue-500 text-white flex items-center justify-center hover:bg-blue-600"
                    >
                      <Plus className="w-3 h-3" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.id)}
                    className="text-red-500 hover:text-red-600 p-1"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))
            )}
          </div>

          {/* Discount */}
          {cart.length > 0 && (
            <div className="mb-4">
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <Tag className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                  <input
                    type="number"
                    placeholder="Discount %"
                    value={discount || ''}
                    onChange={(e) => setDiscount(Math.min(100, Math.max(0, parseFloat(e.target.value) || 0)))}
                    className="w-full pl-10 pr-4 py-2 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm"
                    max="100"
                    min="0"
                  />
                </div>
                <button
                  onClick={() => setDiscount(0)}
                  className="px-3 py-2 text-slate-500 hover:text-slate-700 dark:hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          )}

          {/* Totals */}
          {cart.length > 0 && (
            <div className="border-t border-slate-200 dark:border-slate-700 pt-4 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Subtotal</span>
                <span className="text-slate-800 dark:text-white">MVR {subtotal.toFixed(2)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount ({discount}%)</span>
                  <span>-MVR {discountAmount.toFixed(2)}</span>
                </div>
              )}
              <div className="flex justify-between text-sm">
                <span className="text-slate-600 dark:text-slate-400">Tax (6% GST)</span>
                <span className="text-slate-800 dark:text-white">MVR {tax.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-2 border-t border-slate-200 dark:border-slate-700">
                <span className="text-slate-800 dark:text-white">Total</span>
                <span className="text-blue-600">MVR {total.toFixed(2)}</span>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="mt-4 space-y-2">
            <button
              onClick={() => setShowPaymentModal(true)}
              disabled={cart.length === 0}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold disabled:opacity-50 disabled:cursor-not-allowed hover:shadow-lg transition-all"
            >
              <CreditCard className="w-5 h-5" />
              Pay - MVR {total.toFixed(2)}
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                onClick={holdOrder}
                disabled={cart.length === 0}
                className="flex items-center justify-center gap-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-slate-50 dark:hover:bg-slate-700"
              >
                <Clock className="w-4 h-4" />
                Hold
              </button>
              <button
                onClick={clearCart}
                disabled={cart.length === 0}
                className="flex items-center justify-center gap-1 px-3 py-2 border border-red-200 dark:border-red-900 text-red-600 dark:text-red-400 rounded-lg text-sm disabled:opacity-50 disabled:cursor-not-allowed hover:bg-red-50 dark:hover:bg-red-900/20"
              >
                <Trash2 className="w-4 h-4" />
                Clear
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Payment Modal */}
      {showPaymentModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="glass-card p-6 w-full max-w-md">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-bold text-slate-800 dark:text-white">Payment</h3>
              <button
                onClick={() => setShowPaymentModal(false)}
                className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="space-y-4">
              <div className="text-center py-4 bg-slate-50 dark:bg-slate-800/50 rounded-xl">
                <p className="text-sm text-slate-500 dark:text-slate-400">Total Amount</p>
                <p className="text-3xl font-bold text-blue-600">MVR {total.toFixed(2)}</p>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <button
                  onClick={() => setPaymentMethod('cash')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'cash'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Wallet className="w-6 h-6" />
                  <span className="text-sm font-medium">Cash</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('card')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'card'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <CreditCard className="w-6 h-6" />
                  <span className="text-sm font-medium">Card</span>
                </button>
                <button
                  onClick={() => setPaymentMethod('bank')}
                  className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-all ${
                    paymentMethod === 'bank'
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20'
                      : 'border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <Smartphone className="w-6 h-6" />
                  <span className="text-sm font-medium">Bank</span>
                </button>
              </div>

              {paymentMethod === 'cash' && (
                <div>
                  <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
                    Amount Received
                  </label>
                  <input
                    type="number"
                    value={amountReceived}
                    onChange={(e) => setAmountReceived(e.target.value)}
                    placeholder="Enter amount"
                    className="w-full px-4 py-3 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                  {amountReceived && (
                    <div className="mt-2 flex justify-between text-sm">
                      <span className="text-slate-500 dark:text-slate-400">Change:</span>
                      <span className="font-semibold text-green-600">
                        MVR {(parseFloat(amountReceived) - total).toFixed(2)}
                      </span>
                    </div>
                  )}
                </div>
              )}

              <button
                onClick={handlePayment}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all"
              >
                <Check className="w-5 h-5" />
                Complete Payment
              </button>

              <div className="grid grid-cols-3 gap-2 pt-2">
                <button className="flex items-center justify-center gap-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700">
                  <Printer className="w-4 h-4" />
                  Print
                </button>
                <button className="flex items-center justify-center gap-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700">
                  <Share2 className="w-4 h-4" />
                  Email
                </button>
                <button className="flex items-center justify-center gap-1 px-3 py-2 border border-slate-200 dark:border-slate-700 rounded-lg text-sm hover:bg-slate-50 dark:hover:bg-slate-700">
                  <MessageCircle className="w-4 h-4" />
                  WhatsApp
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
