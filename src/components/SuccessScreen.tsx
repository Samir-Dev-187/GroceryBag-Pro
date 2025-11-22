import { CheckCircle2 } from 'lucide-react';
import { Button } from './ui/button';

interface SuccessScreenProps {
  type: 'purchase' | 'sale' | 'transaction';
  data: {
    id?: string;
    date?: string;
    name?: string;
    amount?: number;
    transactionType?: string;
    mode?: string;
  };
  onAddAnother: () => void;
  onGoToDashboard: () => void;
}

export default function SuccessScreen({ type, data, onAddAnother, onGoToDashboard }: SuccessScreenProps) {
  const titles = {
    purchase: 'Purchase Submitted Successfully',
    sale: 'Sale Submitted Successfully',
    transaction: 'Transaction Added Successfully',
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-emerald-50 via-green-50 to-teal-50 flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-3xl shadow-2xl p-8 lg:p-10 text-center">
          {/* Success Icon */}
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <CheckCircle2 className="w-12 h-12 text-green-600" />
          </div>

          {/* Title */}
          <h1 className="text-gray-900 mb-2">{titles[type]}</h1>
          <p className="text-gray-500 mb-8">Your {type} has been recorded successfully</p>

          {/* Details Card */}
          <div className="bg-gray-50 rounded-2xl p-6 mb-8 text-left">
            {type === 'purchase' && (
              <>
                <div className="mb-4">
                  <div className="text-gray-500 text-sm mb-1">Purchase ID</div>
                  <div className="text-gray-900">{data.id}</div>
                </div>
                <div className="mb-4">
                  <div className="text-gray-500 text-sm mb-1">Date</div>
                  <div className="text-gray-900">{data.date}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Supplier</div>
                  <div className="text-gray-900">{data.name}</div>
                </div>
              </>
            )}

            {type === 'sale' && (
              <>
                <div className="mb-4">
                  <div className="text-gray-500 text-sm mb-1">Sale ID</div>
                  <div className="text-gray-900">{data.id}</div>
                </div>
                <div className="mb-4">
                  <div className="text-gray-500 text-sm mb-1">Date</div>
                  <div className="text-gray-900">{data.date}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Customer</div>
                  <div className="text-gray-900">{data.name}</div>
                </div>
              </>
            )}

            {type === 'transaction' && (
              <>
                <div className="mb-4">
                  <div className="text-gray-500 text-sm mb-1">Amount</div>
                  <div className="text-gray-900 text-xl">₹{data.amount?.toLocaleString()}</div>
                </div>
                <div className="mb-4">
                  <div className="text-gray-500 text-sm mb-1">Type</div>
                  <div className="text-gray-900 capitalize">{data.transactionType}</div>
                </div>
                <div className="mb-4">
                  <div className="text-gray-500 text-sm mb-1">Mode</div>
                  <div className="text-gray-900 capitalize">{data.mode}</div>
                </div>
                <div>
                  <div className="text-gray-500 text-sm mb-1">Date</div>
                  <div className="text-gray-900">{data.date}</div>
                </div>
              </>
            )}
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button
              onClick={onAddAnother}
              className="w-full h-12 bg-gradient-to-r from-[#0F9D58] to-[#0d8a4d] hover:from-[#0d8a4d] hover:to-[#0b7a43] text-white rounded-xl shadow-lg"
            >
              Add Another {type === 'purchase' ? 'Purchase' : type === 'sale' ? 'Sale' : 'Transaction'}
            </Button>
            <Button
              onClick={onGoToDashboard}
              variant="outline"
              className="w-full h-12 rounded-xl"
            >
              Go to Dashboard
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
