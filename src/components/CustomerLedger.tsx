import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Phone, DollarSign, ChevronRight } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

const customers = [
  {
    id: '1',
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    outstanding: 18920,
    sales: [
      { id: 'S-145', date: '2024-11-15', items: '50 units • 10kg', amount: 8500, paid: 0 },
      { id: 'S-132', date: '2024-11-10', items: '30 units • 5kg', amount: 10420, paid: 0 },
    ],
    payments: [
      { date: '2024-11-05', amount: 5000, mode: 'cash' as const },
      { date: '2024-10-28', amount: 8000, mode: 'online' as const },
    ],
  },
  {
    id: '2',
    name: 'Priya Sharma',
    phone: '+91 98765 43211',
    outstanding: 12450,
    sales: [
      { id: 'S-142', date: '2024-11-14', items: '40 units • 10kg', amount: 12450, paid: 0 },
    ],
    payments: [
      { date: '2024-11-01', amount: 10000, mode: 'online' as const },
    ],
  },
  {
    id: '3',
    name: 'Amit Patel',
    phone: '+91 98765 43212',
    outstanding: 8300,
    sales: [
      { id: 'S-138', date: '2024-11-12', items: '25 units • 5kg', amount: 8300, paid: 0 },
    ],
    payments: [
      { date: '2024-10-30', amount: 6000, mode: 'cash' as const },
    ],
  },
];

interface CustomerLedgerProps {
  userRole: 'admin' | 'user';
}

export default function CustomerLedger({ userRole }: CustomerLedgerProps) {
  const navigate = useNavigate();
  const { customerId } = useParams();
  const [isPaymentDialogOpen, setIsPaymentDialogOpen] = useState(false);
  const [paymentAmount, setPaymentAmount] = useState('');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'online'>('cash');

  const selectedCustomer = customerId 
    ? customers.find((c) => c.id === customerId)
    : null;

  const handleRecordPayment = () => {
    alert(`Payment of ₹${paymentAmount} recorded successfully!`);
    setIsPaymentDialogOpen(false);
    setPaymentAmount('');
  };

  if (selectedCustomer) {
    // Single Customer View
    return (
      <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
        <div className="max-w-4xl mx-auto p-4 lg:p-8">
          {/* Header */}
          <div className="flex items-center gap-4 mb-6">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate('/customer-ledger')}
              className="rounded-full"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <div className="flex-1">
              <h1 className="text-gray-900">{selectedCustomer.name}</h1>
              <p className="text-gray-500 text-sm flex items-center gap-2">
                <Phone className="w-4 h-4" />
                {selectedCustomer.phone}
              </p>
            </div>
            <Dialog open={isPaymentDialogOpen} onOpenChange={setIsPaymentDialogOpen}>
              <DialogTrigger asChild>
                <Button 
                  className="bg-[#0F9D58] hover:bg-[#0d8a4d] rounded-xl"
                  disabled={userRole === 'user'}
                >
                  Record Payment
                </Button>
              </DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Record Payment</DialogTitle>
                </DialogHeader>
                <div className="space-y-4 pt-4">
                  <div>
                    <Label htmlFor="amount">Amount</Label>
                    <Input
                      id="amount"
                      type="number"
                      placeholder="0.00"
                      value={paymentAmount}
                      onChange={(e) => setPaymentAmount(e.target.value)}
                      className="mt-1.5 h-12"
                    />
                  </div>
                  <div>
                    <Label htmlFor="payment-mode">Payment Mode</Label>
                    <Select value={paymentMode} onValueChange={(value: 'cash' | 'online') => setPaymentMode(value)}>
                      <SelectTrigger className="mt-1.5 h-12">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="cash">Cash</SelectItem>
                        <SelectItem value="online">Online</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <Button
                    onClick={handleRecordPayment}
                    className="w-full h-12 bg-[#0F9D58] hover:bg-[#0d8a4d] rounded-xl"
                  >
                    Save Payment
                  </Button>
                </div>
              </DialogContent>
            </Dialog>
          </div>

          {/* Outstanding Card */}
          <div className="bg-gradient-to-br from-orange-500 to-orange-600 rounded-2xl p-6 mb-6 text-white shadow-lg">
            <div className="text-white/80 mb-2">Total Outstanding</div>
            <div className="text-3xl mb-4">₹{selectedCustomer.outstanding.toLocaleString()}</div>
            <div className="flex items-center gap-2 text-white/90 text-sm">
              <DollarSign className="w-4 h-4" />
              {selectedCustomer.sales.length} unpaid sales
            </div>
          </div>

          {/* Sales History */}
          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm mb-6">
            <h3 className="text-gray-900 mb-4">Sales History</h3>
            <div className="space-y-3">
              {selectedCustomer.sales.map((sale) => (
                <div
                  key={sale.id}
                  className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                >
                  <div>
                    <div className="text-gray-900 text-sm mb-1">Sale #{sale.id}</div>
                    <div className="text-gray-500 text-xs">{sale.items}</div>
                    <div className="text-gray-400 text-xs mt-1">{sale.date}</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900 text-sm mb-1">₹{sale.amount.toLocaleString()}</div>
                    <div className="text-orange-600 text-xs">Unpaid</div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Payment History */}
          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm">
            <h3 className="text-gray-900 mb-4">Payment History</h3>
            <div className="space-y-3">
              {selectedCustomer.payments.map((payment, index) => (
                <div key={index} className="flex items-center gap-4">
                  <div className="w-10 h-10 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0">
                    <DollarSign className="w-5 h-5 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <div className="text-gray-900 text-sm">₹{payment.amount.toLocaleString()}</div>
                    <div className="text-gray-500 text-xs">
                      {payment.mode === 'cash' ? 'Cash' : 'Online'} • {payment.date}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Customer List View
  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <div className="max-w-6xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-gray-900 mb-2">Customer Ledger</h1>
          <p className="text-gray-500">Manage customer accounts and outstanding balances</p>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm">
            <div className="text-gray-500 text-sm mb-1">Total Customers</div>
            <div className="text-gray-900">{customers.length}</div>
          </div>
          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm">
            <div className="text-gray-500 text-sm mb-1">Total Outstanding</div>
            <div className="text-orange-600">
              ₹{customers.reduce((sum, c) => sum + c.outstanding, 0).toLocaleString()}
            </div>
          </div>
          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm">
            <div className="text-gray-500 text-sm mb-1">Customers with Dues</div>
            <div className="text-gray-900">{customers.filter((c) => c.outstanding > 0).length}</div>
          </div>
        </div>

        {/* Customer List */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm">
          <h3 className="text-gray-900 mb-4">All Customers</h3>
          <div className="space-y-3">
            {customers.map((customer) => (
              <div
                key={customer.id}
                onClick={() => navigate(`/customer-ledger/${customer.id}`)}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 bg-[#0F9D58] rounded-full flex items-center justify-center flex-shrink-0 text-white">
                  {customer.name.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-gray-900 mb-1">{customer.name}</div>
                  <div className="text-gray-500 text-xs flex items-center gap-2">
                    <Phone className="w-3 h-3" />
                    {customer.phone}
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  {customer.outstanding > 0 ? (
                    <>
                      <div className="text-orange-600 text-sm mb-1">
                        ₹{customer.outstanding.toLocaleString()}
                      </div>
                      <div className="text-orange-500 text-xs">Outstanding</div>
                    </>
                  ) : (
                    <>
                      <div className="text-green-600 text-sm mb-1">Clear</div>
                      <div className="text-green-500 text-xs">No Dues</div>
                    </>
                  )}
                </div>
                <ChevronRight className="w-5 h-5 text-gray-400 flex-shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}