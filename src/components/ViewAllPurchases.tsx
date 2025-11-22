import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Package, Search, Filter } from 'lucide-react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';

interface Purchase {
  id: string;
  date: string;
  supplier: string;
  supplierId: string;
  items: { bagSize: string; units: number; pricePerUnit: number }[];
  total: number;
  invoicePhoto?: string;
  notes?: string;
}

// Mock data
const mockPurchases: Purchase[] = [
  {
    id: 'P-145678',
    date: '2024-11-15',
    supplier: 'Rajesh Traders',
    supplierId: 'RAT11-4829-14',
    items: [
      { bagSize: '10kg', units: 50, pricePerUnit: 170 },
      { bagSize: '5kg', units: 30, pricePerUnit: 87 },
    ],
    total: 11110,
    notes: 'Quality checked',
  },
  {
    id: 'P-145234',
    date: '2024-11-12',
    supplier: 'Amit Suppliers',
    supplierId: 'AMS11-2341-92',
    items: [
      { bagSize: '25kg', units: 20, pricePerUnit: 420 },
    ],
    total: 8400,
  },
  {
    id: 'P-144892',
    date: '2024-11-08',
    supplier: 'Sharma Trading Co',
    supplierId: 'SHT11-7654-23',
    items: [
      { bagSize: '1kg', units: 100, pricePerUnit: 18 },
      { bagSize: '5kg', units: 60, pricePerUnit: 88 },
    ],
    total: 7080,
  },
];

export default function ViewAllPurchases() {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterMonth, setFilterMonth] = useState('all');
  const [selectedPurchase, setSelectedPurchase] = useState<Purchase | null>(null);

  const filteredPurchases = mockPurchases.filter(purchase => {
    const matchesSearch = purchase.supplier.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         purchase.id.toLowerCase().includes(searchTerm.toLowerCase());
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <div className="max-w-6xl mx-auto p-4 lg:p-8">
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
            <h1 className="text-gray-900">All Purchases</h1>
            <p className="text-gray-500 text-sm">View and manage all purchase records</p>
          </div>
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl p-4 shadow-sm mb-6">
          <div className="flex flex-col lg:flex-row gap-3">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <Input
                placeholder="Search by supplier or purchase ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-11"
              />
            </div>
            <Select value={filterMonth} onValueChange={setFilterMonth}>
              <SelectTrigger className="w-full lg:w-48 h-11">
                <SelectValue placeholder="Filter by month" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Months</SelectItem>
                <SelectItem value="nov">November 2024</SelectItem>
                <SelectItem value="oct">October 2024</SelectItem>
                <SelectItem value="sep">September 2024</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Purchases List */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm">
          <div className="space-y-3">
            {filteredPurchases.map((purchase) => (
              <div
                key={purchase.id}
                onClick={() => setSelectedPurchase(purchase)}
                className="flex items-center gap-4 p-4 bg-gray-50 rounded-2xl hover:bg-gray-100 transition-colors cursor-pointer"
              >
                <div className="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Package className="w-6 h-6 text-blue-600" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-gray-900">Purchase #{purchase.id}</span>
                  </div>
                  <div className="text-gray-500 text-sm mb-1">{purchase.supplier}</div>
                  <div className="text-gray-400 text-xs">
                    {purchase.date} • {purchase.items.reduce((sum, item) => sum + item.units, 0)} units
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-gray-900 mb-1">₹{purchase.total.toLocaleString()}</div>
                  <div className="text-green-600 text-xs">Completed</div>
                </div>
              </div>
            ))}
          </div>

          {filteredPurchases.length === 0 && (
            <div className="text-center py-12">
              <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="w-8 h-8 text-gray-400" />
              </div>
              <p className="text-gray-500">No purchases found</p>
            </div>
          )}
        </div>
      </div>

      {/* Purchase Details Modal */}
      <Dialog open={!!selectedPurchase} onOpenChange={() => setSelectedPurchase(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Purchase Details</DialogTitle>
          </DialogHeader>
          {selectedPurchase && (
            <div className="space-y-4">
              {/* Header Info */}
              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-2xl">
                <div>
                  <div className="text-gray-500 text-sm mb-1">Purchase ID</div>
                  <div className="text-gray-900">{selectedPurchase.id}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Date</div>
                  <div className="text-gray-900">{selectedPurchase.date}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Supplier</div>
                  <div className="text-gray-900">{selectedPurchase.supplier}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Supplier ID</div>
                  <div className="text-gray-900">{selectedPurchase.supplierId}</div>
                </div>
              </div>

              {/* Items */}
              <div>
                <div className="text-gray-900 mb-3">Items Purchased</div>
                <div className="space-y-2">
                  {selectedPurchase.items.map((item, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
                      <div>
                        <div className="text-gray-900">{item.bagSize} Bags</div>
                        <div className="text-gray-500 text-sm">
                          {item.units} units × ₹{item.pricePerUnit}
                        </div>
                      </div>
                      <div className="text-gray-900">
                        ₹{(item.units * item.pricePerUnit).toLocaleString()}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Total */}
              <div className="flex items-center justify-between p-4 bg-green-50 rounded-xl border border-green-100">
                <span className="text-gray-700">Total Amount</span>
                <span className="text-gray-900 text-xl">₹{selectedPurchase.total.toLocaleString()}</span>
              </div>

              {/* Notes */}
              {selectedPurchase.notes && (
                <div className="p-4 bg-blue-50 rounded-xl">
                  <div className="text-gray-500 text-sm mb-1">Notes</div>
                  <div className="text-gray-900">{selectedPurchase.notes}</div>
                </div>
              )}

              {/* Invoice Photo */}
              {selectedPurchase.invoicePhoto && (
                <div>
                  <div className="text-gray-900 mb-2">Invoice Photo</div>
                  <img
                    src={selectedPurchase.invoicePhoto}
                    alt="Invoice"
                    className="w-full h-64 object-cover rounded-xl"
                  />
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
