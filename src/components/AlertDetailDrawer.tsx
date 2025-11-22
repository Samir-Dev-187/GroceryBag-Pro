import { X, AlertTriangle, AlertCircle, Info, CheckCircle } from 'lucide-react';
import { Alert } from './types';
import { Button } from './ui/button';

interface AlertDetailDrawerProps {
  alert: Alert;
  onClose: () => void;
}

const severityConfig = {
  high: {
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    label: 'High Priority',
  },
  medium: {
    icon: AlertCircle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
    label: 'Medium Priority',
  },
  low: {
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    label: 'Low Priority',
  },
};

export default function AlertDetailDrawer({ alert, onClose }: AlertDetailDrawerProps) {
  const config = severityConfig[alert.severity];
  const Icon = config.icon;

  return (
    <>
      {/* Overlay */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 lg:bg-black/30"
        onClick={onClose}
      />

      {/* Drawer */}
      <div className="fixed inset-x-0 bottom-0 lg:right-0 lg:left-auto lg:top-0 lg:w-[480px] bg-white z-50 rounded-t-3xl lg:rounded-none shadow-2xl animate-slide-up lg:animate-slide-left">
        <div className="flex flex-col h-full max-h-[85vh] lg:max-h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="text-gray-900">Alert Details</h2>
            <Button
              variant="ghost"
              size="icon"
              onClick={onClose}
              className="rounded-full"
            >
              <X className="w-5 h-5" />
            </Button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {/* Alert Header */}
            <div className={`p-4 rounded-2xl border ${config.borderColor} ${config.bgColor}`}>
              <div className="flex items-start gap-3">
                <div className={`w-10 h-10 rounded-xl bg-white flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-5 h-5 ${config.color}`} />
                </div>
                <div className="flex-1">
                  <div className={`text-xs ${config.color} mb-1`}>{config.label}</div>
                  <h3 className="text-gray-900 mb-2">{alert.title}</h3>
                  <div className="text-gray-500 text-sm">{alert.timestamp}</div>
                </div>
              </div>
            </div>

            {/* Explanation */}
            <div>
              <h4 className="text-gray-900 mb-2">Explanation</h4>
              <p className="text-gray-600 leading-relaxed">{alert.description}</p>
            </div>

            {/* Related Records */}
            {alert.relatedRecords && alert.relatedRecords.length > 0 && (
              <div>
                <h4 className="text-gray-900 mb-3">Related Records</h4>
                <div className="space-y-2">
                  {alert.relatedRecords.map((record) => (
                    <div
                      key={record.id}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-xl"
                    >
                      <div>
                        <div className="text-gray-900 text-sm mb-0.5">
                          {record.type === 'purchase' ? 'Purchase' : 'Sale'} #{record.id}
                        </div>
                        <div className="text-gray-500 text-xs">{record.details}</div>
                      </div>
                      <Button variant="ghost" size="sm" className="text-[#0F9D58]">
                        Open
                      </Button>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Recommendations */}
            <div className="bg-blue-50 border border-blue-200 rounded-2xl p-4">
              <div className="flex items-start gap-3">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div>
                  <h4 className="text-gray-900 text-sm mb-2">Recommended Actions</h4>
                  <ul className="text-gray-600 text-sm space-y-1 list-disc list-inside">
                    {alert.type === 'spike' && (
                      <>
                        <li>Review inventory levels for 10kg bags</li>
                        <li>Contact supplier for restocking</li>
                        <li>Analyze customer demand patterns</li>
                      </>
                    )}
                    {alert.type === 'missing' && (
                      <>
                        <li>Upload invoice photo immediately</li>
                        <li>Contact supplier for invoice copy</li>
                        <li>Update purchase record</li>
                      </>
                    )}
                    {alert.type === 'drop' && (
                      <>
                        <li>Check inventory stock levels</li>
                        <li>Review upcoming order requirements</li>
                        <li>Plan purchases for next week</li>
                      </>
                    )}
                    {alert.type === 'high_due' && (
                      <>
                        <li>Contact customer for payment</li>
                        <li>Review credit terms</li>
                        <li>Consider payment reminders</li>
                      </>
                    )}
                  </ul>
                </div>
              </div>
            </div>
          </div>

          {/* Footer */}
          <div className="p-6 border-t border-gray-200 space-y-3">
            <Button className="w-full h-12 bg-[#0F9D58] hover:bg-[#0d8a4d] rounded-xl">
              <CheckCircle className="w-5 h-5 mr-2" />
              Resolve Alert
            </Button>
            <Button variant="outline" className="w-full h-12 rounded-xl" onClick={onClose}>
              Dismiss
            </Button>
          </div>
        </div>
      </div>
    </>
  );
}
