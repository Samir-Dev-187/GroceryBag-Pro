import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, Trash2, Upload, ArrowLeft, UserPlus } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Textarea } from './ui/textarea';
import AddSupplierModal from './AddSupplierModal';
import SuccessScreen from './SuccessScreen';

interface PurchaseItem {
  id: string;
  bagSize: string;
  units: string;
  pricePerUnit: string;
}

export default function AddPurchase() {
  const navigate = useNavigate();
  const [showSuccess, setShowSuccess] = useState(false);
  const [showAddSupplier, setShowAddSupplier] = useState(false);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [supplierId, setSupplierId] = useState('');
  const [supplier, setSupplier] = useState('');
  const [items, setItems] = useState<PurchaseItem[]>([
    { id: '1', bagSize: '', units: '', pricePerUnit: '' },
  ]);
  const [notes, setNotes] = useState('');
  const [invoicePhoto, setInvoicePhoto] = useState<File | null>(null);
  const [purchaseId, setPurchaseId] = useState('');

  const addItem = () => {
    setItems([...items, { id: Date.now().toString(), bagSize: '', units: '', pricePerUnit: '' }]);
  };

  const removeItem = (id: string) => {
    if (items.length > 1) {
      setItems(items.filter((item) => item.id !== id));
    }
  };

  const updateItem = (id: string, field: keyof PurchaseItem, value: string) => {
    setItems(items.map((item) => (item.id === id ? { ...item, [field]: value } : item)));
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const units = parseFloat(item.units) || 0;
      const price = parseFloat(item.pricePerUnit) || 0;
      return total + units * price;
    }, 0);
  };

  const handleSave = () => {
    // Generate purchase ID
    const generatedId = `P-${Date.now().toString().slice(-6)}`;
    setPurchaseId(generatedId);
    setShowSuccess(true);
  };

  const handleAddAnother = () => {
    setShowSuccess(false);
    setSupplierId('');
    setSupplier('');
    setItems([{ id: '1', bagSize: '', units: '', pricePerUnit: '' }]);
    setNotes('');
    setInvoicePhoto(null);
    setDate(new Date().toISOString().split('T')[0]);
  };

  const handleSupplierCreated = (supplierData: { id: string; name: string; phone: string; email: string }) => {
    setSupplierId(supplierData.id);
    setSupplier(supplierData.name);
    setShowAddSupplier(false);
  };

  if (showSuccess) {
    return (
      <SuccessScreen
        type="purchase"
        data={{
          id: purchaseId,
          date: date,
          name: supplier,
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
            <h1 className="text-gray-900">Add Purchase</h1>
            <p className="text-gray-500 text-sm">Record a new purchase transaction</p>
          </div>
        </div>

        {/* Add Supplier Button */}
        <div className="mb-6">
          <Button
            onClick={() => setShowAddSupplier(true)}
            variant="outline"
            className="rounded-xl h-11"
          >
            <UserPlus className="w-4 h-4 mr-2" />
            Add Supplier
          </Button>
        </div>

        {/* Form */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm space-y-6">
          {/* Supplier ID */}
          <div>
            <Label htmlFor="supplierId">Supplier ID</Label>
            <Input
              id="supplierId"
              placeholder="Enter supplier ID (e.g., SUP-001)"
              value={supplierId}
              onChange={(e) => setSupplierId(e.target.value)}
              className="mt-1.5 h-12"
            />
          </div>

          {/* Date and Supplier */}
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
              <Label htmlFor="supplier">Supplier Name</Label>
              <Input
                id="supplier"
                placeholder="Enter supplier name"
                value={supplier}
                onChange={(e) => setSupplier(e.target.value)}
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
          <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
            <span className="text-gray-700">Total Amount</span>
            <span className="text-gray-900 text-xl">₹{calculateTotal().toLocaleString()}</span>
          </div>

          {/* Invoice Photo */}
          <div>
            <Label htmlFor="invoice">Invoice Photo (Optional)</Label>
            <div className="mt-1.5">
              <label className="flex items-center justify-center h-32 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-[#0F9D58] transition-colors">
                <input
                  id="invoice"
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => setInvoicePhoto(e.target.files?.[0] || null)}
                />
                <div className="text-center">
                  <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                  <div className="text-gray-600 text-sm">
                    {invoicePhoto ? invoicePhoto.name : 'Click to upload invoice'}
                  </div>
                </div>
              </label>
            </div>
          </div>

          {/* Notes */}
          <div>
            <Label htmlFor="notes">Notes (Optional)</Label>
            <Textarea
              id="notes"
              placeholder="Add any additional notes..."
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="mt-1.5 min-h-[100px]"
            />
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
              Save Purchase
            </Button>
          </div>
        </div>
      </div>

      {/* Add Supplier Modal */}
      <AddSupplierModal
        open={showAddSupplier}
        onClose={() => setShowAddSupplier(false)}
        onSuccess={handleSupplierCreated}
      />
    </div>
  );
}
