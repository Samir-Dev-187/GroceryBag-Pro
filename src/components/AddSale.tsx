import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import SuccessScreen from './SuccessScreen';

interface SaleItem {
  id: string;
  bagSize: string;
  units: string;
  pricePerUnit: string;
}

export default function AddSale() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [customerId, setCustomerId] = useState('');
  const [customer, setCustomer] = useState('');
  const [items, setItems] = useState<SaleItem[]>([
    { id: '1', bagSize: '', units: '', pricePerUnit: '' },
  ]);
  const [paymentReceived, setPaymentReceived] = useState('');
  const [paymentMode, setPaymentMode] = useState<'cash' | 'online'>('cash');
  const [saleId, setSaleId] = useState('');

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), bagSize: '', units: '', pricePerUnit: '' }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof SaleItem, value: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const units = parseFloat(item.units) || 0;
      const price = parseFloat(item.pricePerUnit) || 0;
      return total + units * price;
    }, 0);
  };

  const calculateDue = () => {
    const total = calculateTotal();
    const paid = parseFloat(paymentReceived) || 0;
    return total - paid;
  };

  const handleSave = () => {
    // Generate sale ID
    const generatedId = `S-${Date.now().toString().slice(-6)}`;
    setSaleId(generatedId);
    setShowSuccess(true);
  };

  const handleAddAnother = () => {
    setShowSuccess(false);
    setCustomerId('');
    setCustomer('');
    setItems([{ id: '1', bagSize: '', units: '', pricePerUnit: '' }]);
    setPaymentReceived('');
    setPaymentMode('cash');
    setDate(new Date().toISOString().split('T')[0]);
  };



  if (showSuccess) {
    return (
      <SuccessScreen
        type="sale"
        data={{
          id: saleId,
          date: date,
          name: customer,
        }}
        onAddAnother={handleAddAnother}
        onGoToDashboard={() => navigate('/')}
      />
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <div className="max-w-4xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate('/')}
            className="rounded-full"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-gray-900">Add Sale</h1>
            <p className="text-gray-500 text-sm">Record a new sale transaction</p>
          </div>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm space-y-6">
          {/* Customer ID */}
          <div>
            <Label htmlFor="customerId">Customer ID</Label>
            <Input
              id="customerId"
              placeholder="Enter customer ID (e.g., CUST-001)"
              value={customerId}
              onChange={(e) => setCustomerId(e.target.value)}
              className="mt-1.5 h-12"
            />
          </div>

          {/* Date and Customer */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <div>
              <Label htmlFor="date">Date</Label>
              <Input
                id="date"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="mt-1.5 h-12"
              />
            </div>
            <div>
              <Label htmlFor="customer">Customer Name</Label>
              <Input
                id="customer"
                placeholder="Enter customer name"
                value={customer}
                onChange={(e) => setCustomer(e.target.value)}
                className="mt-1.5 h-12"
              />
            </div>
          </div>

          {/* Items */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <Label>Items</Label>
              <Button
                onClick={addItem}
                variant="outline"
                size="sm"
                className="rounded-xl"
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Item
              </Button>
            </div>

            <div className="space-y-3">
              {items.map((item) => (
                <div key={item.id} className="grid grid-cols-1 lg:grid-cols-4 gap-3 p-4 bg-gray-50 rounded-xl">
                  <div>
                    <Label className="text-xs text-gray-600">Bag Size</Label>
                    <Select
                      value={item.bagSize}
                      onValueChange={(value) => updateItem(item.id, 'bagSize', value)}
                    >
                      <SelectTrigger className="mt-1 h-10">
                        <SelectValue placeholder="Select" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1kg">1 kg</SelectItem>
                        <SelectItem value="5kg">5 kg</SelectItem>
                        <SelectItem value="10kg">10 kg</SelectItem>
                        <SelectItem value="25kg">25 kg</SelectItem>
                        <SelectItem value="50kg">50 kg</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-600">Units</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={item.units}
                      onChange={(e) => updateItem(item.id, 'units', e.target.value)}
                      className="mt-1 h-10"
                    />
                  </div>

                  <div>
                    <Label className="text-xs text-gray-600">Price/Unit</Label>
                    <Input
                      type="number"
                      placeholder="0"
                      value={item.pricePerUnit}
                      onChange={(e) => updateItem(item.id, 'pricePerUnit', e.target.value)}
                      className="mt-1 h-10"
                    />
                  </div>

                  <div className="flex items-end">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => removeItem(item.id)}
                      disabled={items.length === 1}
                      className="h-10 w-10 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4 text-red-600" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Total */}
          <div className="space-y-3 p-4 bg-gray-50 rounded-xl">
            <div className="flex items-center justify-between">
              <span className="text-gray-700">Total Amount</span>
              <span className="text-gray-900 text-xl">₹{calculateTotal().toLocaleString()}</span>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-3">
              <div>
                <Label htmlFor="payment" className="text-sm">Payment Received</Label>
                <Input
                  id="payment"
                  type="number"
                  placeholder="0"
                  value={paymentReceived}
                  onChange={(e) => setPaymentReceived(e.target.value)}
                  className="mt-1 h-10"
                />
              </div>
              <div>
                <Label htmlFor="mode" className="text-sm">Payment Mode</Label>
                <Select value={paymentMode} onValueChange={(value: 'cash' | 'online') => setPaymentMode(value)}>
                  <SelectTrigger className="mt-1 h-10">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="cash">Cash</SelectItem>
                    <SelectItem value="online">Online</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="flex items-center justify-between pt-2 border-t border-gray-200">
              <span className="text-red-600">Due Amount</span>
              <span className="text-red-700 text-xl">₹{calculateDue().toLocaleString()}</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              onClick={() => navigate('/')}
              className="flex-1 h-12 rounded-xl"
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              className="flex-1 h-12 bg-gradient-to-r from-[#0F9D58] to-[#0d8a4d] hover:from-[#0d8a4d] hover:to-[#0b7a43] text-white rounded-xl shadow-lg"
            >
              Save Sale
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
