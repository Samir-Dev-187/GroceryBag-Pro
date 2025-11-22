import { User, Phone, Mail, Calendar, Package, DollarSign, Check, LogOut } from 'lucide-react';
import { Button } from './ui/button';

interface CustomerProfileProps {
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
};

export default function CustomerProfile({ onLogout }: CustomerProfileProps) {
  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <div className="max-w-4xl mx-auto p-4 lg:p-8">
        <div className="mb-6">
          <h1 className="text-gray-900 mb-2">My Profile</h1>
          <p className="text-gray-500">View your account information</p>
        </div>

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
                    <div className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs ${
                      customerData.status === 'Active' 
                        ? 'bg-green-100 text-green-700' 
                        : 'bg-gray-100 text-gray-700'
                    }`}>
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
      </div>
    </div>
  );
}
