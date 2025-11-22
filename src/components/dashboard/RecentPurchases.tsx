import { useNavigate } from 'react-router-dom';
import { FileText, ChevronRight } from 'lucide-react';
import { ImageWithFallback } from '../figma/ImageWithFallback';

const purchases = [
  {
    id: 'P-001',
    supplier: 'ABC Wholesalers',
    items: '120 units • 5kg, 10kg',
    date: 'Nov 15, 2024',
    amount: '₹18,500',
    hasInvoice: true,
  },
  {
    id: 'P-002',
    supplier: 'XYZ Distributors',
    items: '85 units • 1kg, 5kg',
    date: 'Nov 14, 2024',
    amount: '₹12,300',
    hasInvoice: true,
  },
  {
    id: 'P-003',
    supplier: 'Quality Bags Co.',
    items: '200 units • 10kg, 25kg',
    date: 'Nov 13, 2024',
    amount: '₹28,900',
    hasInvoice: false,
  },
];

export default function RecentPurchases() {
  const navigate = useNavigate();

  return (
    <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-gray-900 mb-1">Recent Purchases</h3>
          <p className="text-gray-500 text-sm">Latest inventory additions</p>
        </div>
        <button 
          onClick={() => navigate('/view-all-purchases')}
          className="text-[#0F9D58] text-sm hover:underline"
        >
          View All
        </button>
      </div>

      <div className="space-y-3">
        {purchases.map((purchase) => (
          <div
            key={purchase.id}
            className="flex items-center gap-3 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer"
          >
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0 ${
              purchase.hasInvoice ? 'bg-green-50' : 'bg-orange-50'
            }`}>
              <FileText className={`w-6 h-6 ${
                purchase.hasInvoice ? 'text-green-600' : 'text-orange-600'
              }`} />
            </div>

            <div className="flex-1 min-w-0">
              <div className="text-gray-900 text-sm mb-0.5">{purchase.supplier}</div>
              <div className="text-gray-500 text-xs">{purchase.items}</div>
              <div className="text-gray-400 text-xs mt-0.5">{purchase.date}</div>
            </div>

            <div className="text-right flex-shrink-0">
              <div className="text-gray-900 text-sm mb-1">{purchase.amount}</div>
              <ChevronRight className="w-4 h-4 text-gray-400 ml-auto" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
