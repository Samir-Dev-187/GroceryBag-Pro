import { AlertTriangle, AlertCircle, Info } from 'lucide-react';
import { Alert } from '../types';

interface AlertsPanelProps {
  onAlertClick: (alert: Alert) => void;
}

const alerts: Alert[] = [
  {
    id: 'A-001',
    type: 'spike',
    severity: 'high',
    title: '10kg bag sales spike detected',
    description: 'Sales increased by +180% compared to last week. This unusual pattern may indicate bulk orders or seasonal demand.',
    timestamp: '2 hours ago',
    relatedRecords: [
      { type: 'sale', id: 'S-145', details: '250 units • ₹45,000' },
      { type: 'sale', id: 'S-148', details: '180 units • ₹32,400' },
    ],
  },
  {
    id: 'A-002',
    type: 'missing',
    severity: 'medium',
    title: 'Missing invoice photo',
    description: 'Purchase #P-123 from ABC Wholesalers is missing invoice documentation. Please upload the invoice photo for record keeping.',
    timestamp: '5 hours ago',
    relatedRecords: [
      { type: 'purchase', id: 'P-123', details: 'ABC Wholesalers • ₹18,500' },
    ],
  },
  {
    id: 'A-003',
    type: 'drop',
    severity: 'medium',
    title: 'Unusually low purchases this week',
    description: 'Purchase activity is 45% lower than average. Review inventory levels to ensure adequate stock.',
    timestamp: '1 day ago',
    relatedRecords: [],
  },
  {
    id: 'A-004',
    type: 'high_due',
    severity: 'high',
    title: 'Customer outstanding exceeds ₹15,000',
    description: 'Rajesh Kumar has an outstanding balance of ₹18,920 which exceeds the credit limit.',
    timestamp: '2 days ago',
    relatedRecords: [
      { type: 'sale', id: 'S-132', details: '₹8,500 due' },
      { type: 'sale', id: 'S-128', details: '₹10,420 due' },
    ],
  },
];

const severityConfig = {
  high: {
    icon: AlertTriangle,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
  },
  medium: {
    icon: AlertCircle,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    borderColor: 'border-orange-200',
  },
  low: {
    icon: Info,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
  },
};

export default function AlertsPanel({ onAlertClick }: AlertsPanelProps) {
  return (
    <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <div>
          <h3 className="text-gray-900 mb-1">Alerts</h3>
          <p className="text-gray-500 text-sm">Important notifications</p>
        </div>
        <div className="w-6 h-6 bg-red-100 rounded-full flex items-center justify-center">
          <span className="text-red-600 text-xs">{alerts.length}</span>
        </div>
      </div>

      <div className="space-y-3">
        {alerts.map((alert) => {
          const config = severityConfig[alert.severity];
          const Icon = config.icon;

          return (
            <div
              key={alert.id}
              onClick={() => onAlertClick(alert)}
              className={`p-3 rounded-xl border ${config.borderColor} ${config.bgColor} cursor-pointer hover:shadow-md transition-all`}
            >
              <div className="flex items-start gap-3">
                <div className={`w-8 h-8 rounded-lg bg-white flex items-center justify-center flex-shrink-0`}>
                  <Icon className={`w-4 h-4 ${config.color}`} />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="text-gray-900 text-sm mb-1">{alert.title}</div>
                  <div className="text-gray-500 text-xs">{alert.timestamp}</div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
