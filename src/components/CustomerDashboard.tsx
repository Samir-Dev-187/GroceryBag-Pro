import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  User, Phone, Calendar, Package, DollarSign, TrendingUp, 
  AlertTriangle, Download, Headphones, MessageCircle, Mail,
  ChevronRight, Filter, Home, Clock, BarChart3, LogOut, ShoppingBag, Check
} from 'lucide-react';
import { Button } from './ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

interface CustomerDashboardProps {
  onLogout: () => void;
}

// Mock customer data
const customerData = {
  id: 'CU-RAK11-4829-14',
  name: 'Rajesh Kumar',
  phone: '+91 98765 43210',
  email: 'rajesh.kumar@example.com',
  age: 35,
  joinedDate: '2024-01-15',
  totalOrders: 28,
  outstanding: 18920,
  status: 'Active',
  lastPayment: {
    amount: 5000,
    date: '2024-11-12',
  },
  purchases: [
    { id: 'S-145', date: '2024-11-15', items: '50 units • 10kg bags', amount: 8500, paid: 0, status: 'Due' },
    { id: 'S-132', date: '2024-11-10', items: '30 units • 5kg bags', amount: 10420, paid: 0, status: 'Due' },
    { id: 'S-118', date: '2024-11-05', items: '20 units • 10kg bags', amount: 5600, paid: 5600, status: 'Paid' },
    { id: 'S-095', date: '2024-10-28', items: '45 units • 5kg bags', amount: 12750, paid: 12750, status: 'Paid' },
    { id: 'S-082', date: '2024-10-20', items: '35 units • 1kg bags', amount: 7200, paid: 7200, status: 'Paid' },
    { id: 'S-067', date: '2024-10-10', items: '60 units • 10kg bags', amount: 15800, paid: 10000, status: 'Partial Paid' },
  ],
  payments: [
    { date: '2024-11-12', amount: 5000, mode: 'Cash', saleId: 'S-118' },
    { date: '2024-10-28', amount: 12750, mode: 'Online', saleId: 'S-095' },
    { date: '2024-10-20', amount: 7200, mode: 'Cash', saleId: 'S-082' },
    { date: '2024-10-15', amount: 10000, mode: 'Online', saleId: 'S-067' },
  ],
  alerts: [
    { type: 'warning', title: 'High Outstanding Balance', message: 'Your outstanding balance is ₹18,920', date: '2024-11-15' },
    { type: 'info', title: 'Payment Reminder', message: 'Payment due for order #S-145', date: '2024-11-14' },
  ],
};

// Chart data
const usageTrends = [
  { month: 'Jul', units: 45 },
  { month: 'Aug', units: 52 },
  { month: 'Sep', units: 48 },
  { month: 'Oct', units: 65 },
  { month: 'Nov', units: 58 },
];

const bagSizeBreakdown = [
  { size: '1kg', count: 85 },
  { size: '5kg', count: 120 },
  { size: '10kg', count: 145 },
  { size: '25kg', count: 35 },
];

export default function CustomerDashboard({ onLogout }: CustomerDashboardProps) {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'dashboard' | 'history' | 'payments' | 'analytics' | 'support' | 'profile'>('dashboard');
  const [filterMonth, setFilterMonth] = useState('all');
  const [filterStatus, setFilterStatus] = useState('all');

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 sticky top-0 z-20 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-amber-600 rounded-xl flex items-center justify-center shadow-lg">
              <ShoppingBag className="w-6 h-6 text-white" />
            </div>
            <div>
              <div className="text-gray-900">GroceryBag Pro</div>
              <div className="text-gray-500 text-xs">Customer Portal</div>
            </div>
          </div>
          <Button
            onClick={onLogout}
            variant="ghost"
            size="icon"
            className="rounded-full text-gray-600 hover:text-gray-900 lg:hidden"
          >
            <LogOut className="w-5 h-5" />
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto p-4 lg:p-8 pb-24 lg:pb-8">
        {activeTab === 'dashboard' && (
          <div className="space-y-6">
            {/* Recent Orders Card */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm">
              <h2 className="text-gray-900 mb-4">Recent Orders</h2>
              <div className="space-y-3">
                {customerData.purchases.slice(0, 5).map((purchase) => (
                  <div key={purchase.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-900">Order #{purchase.id}</span>
                        <div className={`px-2 py-0.5 rounded-full text-xs ${
                          purchase.status === 'Paid' 
                            ? 'bg-green-100 text-green-700' 
                            : purchase.status === 'Partial Paid'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {purchase.status}
                        </div>
                      </div>
                      <div className="text-gray-500 text-sm mb-1">{purchase.items}</div>
                      <div className="text-gray-400 text-xs">{purchase.date}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-gray-900 mb-1">₹{purchase.amount.toLocaleString()}</div>
                      {purchase.paid < purchase.amount && (
                        <div className="text-red-600 text-xs">Due: ₹{(purchase.amount - purchase.paid).toLocaleString()}</div>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>

            {/* 2. Outstanding Payment Summary */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm">
              <h2 className="text-gray-900 mb-6">Outstanding Payment Summary</h2>
              <div className="bg-gradient-to-br from-red-500 to-red-600 rounded-2xl p-6 text-white mb-4">
                <div className="text-white/80 text-sm mb-2">Current Outstanding Balance</div>
                <div className="text-3xl mb-4">₹{customerData.outstanding.toLocaleString()}</div>
                <div className="flex items-center justify-between text-sm">
                  <div>
                    <div className="text-white/80">Last Payment</div>
                    <div className="text-white">₹{customerData.lastPayment.amount.toLocaleString()}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-white/80">Payment Date</div>
                    <div className="text-white">{customerData.lastPayment.date}</div>
                  </div>
                </div>
              </div>
              <button className="text-orange-600 text-sm hover:underline">
                View Payment History →
              </button>
            </div>

            {/* Customer-Specific Alerts */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm">
              <h2 className="text-gray-900 mb-4">Recent Alerts</h2>
              <div className="space-y-3">
                {customerData.alerts.map((alert, index) => (
                  <div
                    key={index}
                    className={`p-4 rounded-2xl flex items-start gap-3 ${
                      alert.type === 'warning' 
                        ? 'bg-red-50 border border-red-100' 
                        : 'bg-blue-50 border border-blue-100'
                    }`}
                  >
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${
                      alert.type === 'warning' ? 'bg-red-100' : 'bg-blue-100'
                    }`}>
                      <AlertTriangle className={`w-5 h-5 ${
                        alert.type === 'warning' ? 'text-red-600' : 'text-blue-600'
                      }`} />
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-900 mb-1">{alert.title}</div>
                      <div className="text-gray-600 text-sm mb-2">{alert.message}</div>
                      <div className="text-gray-400 text-xs">{alert.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="space-y-6">
            {/* 4. Full Purchase / Order History */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-gray-900">Purchase History</h2>
                <div className="flex items-center gap-2">
                  <Select value={filterMonth} onValueChange={setFilterMonth}>
                    <SelectTrigger className="w-32 h-9 rounded-xl">
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Months</SelectItem>
                      <SelectItem value="nov">November</SelectItem>
                      <SelectItem value="oct">October</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-32 h-9 rounded-xl">
                      <SelectValue placeholder="Status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="due">Due</SelectItem>
                      <SelectItem value="partial">Partial</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-3 max-h-[600px] overflow-y-auto">
                {customerData.purchases.map((purchase) => (
                  <div key={purchase.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer">
                    <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Package className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-gray-900">Order #{purchase.id}</span>
                        <div className={`px-2 py-0.5 rounded-full text-xs ${
                          purchase.status === 'Paid' 
                            ? 'bg-green-100 text-green-700' 
                            : purchase.status === 'Partial Paid'
                            ? 'bg-yellow-100 text-yellow-700'
                            : 'bg-red-100 text-red-700'
                        }`}>
                          {purchase.status}
                        </div>
                      </div>
                      <div className="text-gray-500 text-sm mb-1">{purchase.items}</div>
                      <div className="text-gray-400 text-xs">{purchase.date}</div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <div className="text-gray-900 mb-1">₹{purchase.amount.toLocaleString()}</div>
                      {purchase.paid < purchase.amount && (
                        <div className="text-red-600 text-xs">Due: ₹{(purchase.amount - purchase.paid).toLocaleString()}</div>
                      )}
                    </div>
                    <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'payments' && (
          <div className="space-y-6">
            {/* 5. Payment History */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm">
              <h2 className="text-gray-900 mb-6">Payment History</h2>
              <div className="space-y-3">
                {customerData.payments.map((payment, index) => (
                  <div key={index} className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl">
                    <div className="w-12 h-12 bg-green-50 rounded-xl flex items-center justify-center flex-shrink-0">
                      <DollarSign className="w-6 h-6 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-gray-900 mb-1">₹{payment.amount.toLocaleString()}</div>
                      <div className="text-gray-500 text-sm">{payment.mode} • Order #{payment.saleId}</div>
                      <div className="text-gray-400 text-xs">{payment.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Export & Download Section */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm">
              <h2 className="text-gray-900 mb-6">Export & Download</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <button className="flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-gray-900 text-sm text-center">Complete History<br />(Excel)</div>
                </button>
                <button className="flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-gray-900 text-sm text-center">Monthly Statement<br />(PDF)</div>
                </button>
                <button className="flex flex-col items-center justify-center gap-3 p-6 bg-gradient-to-br from-orange-50 to-orange-100 rounded-2xl hover:from-orange-100 hover:to-orange-200 transition-all">
                  <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center">
                    <Download className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-gray-900 text-sm text-center">Dues Summary<br />(PDF)</div>
                </button>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'analytics' && (
          <div className="space-y-6">
            {/* 6. Bag Usage Analytics */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm">
              <h2 className="text-gray-900 mb-6">Bag Usage Trends</h2>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={usageTrends}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Line type="monotone" dataKey="units" stroke="#f97316" strokeWidth={3} />
                </LineChart>
              </ResponsiveContainer>
            </div>

            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm">
              <h2 className="text-gray-900 mb-6">Bag Size Breakdown</h2>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={bagSizeBreakdown}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="size" stroke="#9ca3af" />
                  <YAxis stroke="#9ca3af" />
                  <Tooltip />
                  <Bar dataKey="count" fill="#f97316" radius={[8, 8, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}

        {activeTab === 'support' && (
          <div className="space-y-6">
            {/* Support / Contact */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm">
              <h2 className="text-gray-900 mb-6">Support & Contact</h2>
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
                <button className="flex items-center gap-4 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-gray-900">Call Store</div>
                    <div className="text-gray-600 text-sm">+91 12345 67890</div>
                  </div>
                </button>
                <button className="flex items-center gap-4 p-4 bg-gradient-to-br from-green-50 to-green-100 rounded-2xl hover:from-green-100 hover:to-green-200 transition-all">
                  <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <MessageCircle className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-gray-900">WhatsApp</div>
                    <div className="text-gray-600 text-sm">Quick Support</div>
                  </div>
                </button>
                <button className="flex items-center gap-4 p-4 bg-gradient-to-br from-blue-50 to-blue-100 rounded-2xl hover:from-blue-100 hover:to-blue-200 transition-all">
                  <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-6 h-6 text-white" />
                  </div>
                  <div className="text-left">
                    <div className="text-gray-900">Email</div>
                    <div className="text-gray-600 text-sm">support@grocerybag.com</div>
                  </div>
                </button>
              </div>
            </div>

            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm">
              <Button
                onClick={onLogout}
                className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}

        {activeTab === 'profile' && (
          <div className="space-y-6">
            {/* Profile Card */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm">
              <div className="flex items-start gap-4 mb-6">
                <div className="w-20 h-20 bg-gradient-to-br from-orange-500 to-amber-600 rounded-2xl flex items-center justify-center shadow-lg flex-shrink-0">
                  <User className="w-10 h-10 text-white" />
                </div>
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <div>
                      <h2 className="text-gray-900 mb-2">{customerData.name}</h2>
                      <div
                        className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                          customerData.status === 'Active'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-gray-100 text-gray-700'
                        }`}
                      >
                        <Check className="w-3 h-3" />
                        {customerData.status}
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Info Grid */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                {/* Customer ID */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-purple-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-purple-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-500 text-xs">Customer ID</div>
                    <div className="text-gray-900 text-sm">{customerData.id}</div>
                  </div>
                </div>

                {/* Phone Number */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Phone className="w-5 h-5 text-blue-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-500 text-xs">Phone Number</div>
                    <div className="text-gray-900 text-sm">{customerData.phone}</div>
                  </div>
                </div>

                {/* Email */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-green-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Mail className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-500 text-xs">Email Address</div>
                    <div className="text-gray-900 text-sm">{customerData.email}</div>
                  </div>
                </div>

                {/* Age */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-orange-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <User className="w-5 h-5 text-orange-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-500 text-xs">Age</div>
                    <div className="text-gray-900 text-sm">{customerData.age} years</div>
                  </div>
                </div>

                {/* Joined Date */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-indigo-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Calendar className="w-5 h-5 text-indigo-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-500 text-xs">Joined Date</div>
                    <div className="text-gray-900 text-sm">{customerData.joinedDate}</div>
                  </div>
                </div>

                {/* Total Orders */}
                <div className="flex items-center gap-3 p-4 bg-gray-50 rounded-2xl">
                  <div className="w-10 h-10 bg-teal-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <Package className="w-5 h-5 text-teal-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-500 text-xs">Total Orders</div>
                    <div className="text-gray-900 text-xl">{customerData.totalOrders}</div>
                  </div>
                </div>

                {/* Outstanding Amount */}
                <div className="flex items-center gap-3 p-4 bg-red-50 rounded-2xl border border-red-100 lg:col-span-2">
                  <div className="w-10 h-10 bg-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-red-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-red-600 text-xs">Outstanding Amount</div>
                    <div className="text-red-700 text-xl">₹{customerData.outstanding.toLocaleString()}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Logout Card */}
            <div className="bg-white rounded-3xl p-6 lg:p-8 shadow-sm">
              <h2 className="text-gray-900 mb-4">Sign Out</h2>
              <p className="text-gray-500 text-sm mb-4">
                You will need to log in again to access your account
              </p>
              <Button
                onClick={onLogout}
                className="w-full h-12 bg-gradient-to-r from-red-500 to-red-600 hover:from-red-600 hover:to-red-700 text-white rounded-xl shadow-lg"
              >
                <LogOut className="w-5 h-5 mr-2" />
                Logout
              </Button>
            </div>
          </div>
        )}
      </div>

      {/* Mobile Bottom Navigation */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
        <div className="flex items-center justify-around px-4 py-3">
          <button
            onClick={() => setActiveTab('dashboard')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'dashboard' ? 'text-orange-600' : 'text-gray-400'
            }`}
          >
            <Home className="w-6 h-6" />
            <span className="text-xs">Home</span>
          </button>
          <button
            onClick={() => setActiveTab('history')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'history' ? 'text-orange-600' : 'text-gray-400'
            }`}
          >
            <Clock className="w-6 h-6" />
            <span className="text-xs">History</span>
          </button>
          <button
            onClick={() => setActiveTab('payments')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'payments' ? 'text-orange-600' : 'text-gray-400'
            }`}
          >
            <DollarSign className="w-6 h-6" />
            <span className="text-xs">Payments</span>
          </button>
          <button
            onClick={() => setActiveTab('analytics')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'analytics' ? 'text-orange-600' : 'text-gray-400'
            }`}
          >
            <BarChart3 className="w-6 h-6" />
            <span className="text-xs">Analytics</span>
          </button>
          <button
            onClick={() => setActiveTab('support')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'support' ? 'text-orange-600' : 'text-gray-400'
            }`}
          >
            <Headphones className="w-6 h-6" />
            <span className="text-xs">Support</span>
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`flex flex-col items-center gap-1 ${
              activeTab === 'profile' ? 'text-orange-600' : 'text-gray-400'
            }`}
          >
            <User className="w-6 h-6" />
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
}