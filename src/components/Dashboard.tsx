import { useState } from 'react';
import { DollarSign, Wallet, AlertCircle, TrendingUp } from 'lucide-react';
import SummaryCard from './dashboard/SummaryCard';
import UnitsChart from './dashboard/UnitsChart';
import RevenueChart from './dashboard/RevenueChart';
import RecentPurchases from './dashboard/RecentPurchases';
import AlertsPanel from './dashboard/AlertsPanel';
import AlertDetailDrawer from './AlertDetailDrawer';
import { Alert } from './types';

interface DashboardProps {
  userRole: 'admin' | 'user';
}

export default function Dashboard({ userRole }: DashboardProps) {
  const [selectedAlert, setSelectedAlert] = useState<Alert | null>(null);

  const summaryData = [
    {
      icon: DollarSign,
      label: 'Cash Balance',
      value: '₹45,280',
      change: '+12.5%',
      isPositive: true,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
    },
    {
      icon: Wallet,
      label: 'Online Balance',
      value: '₹32,450',
      change: '+8.2%',
      isPositive: true,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
    },
    {
      icon: AlertCircle,
      label: 'Total Outstanding',
      value: '₹18,920',
      change: '-3.1%',
      isPositive: true,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
    },
    {
      icon: TrendingUp,
      label: 'Units Sold This Month',
      value: '2,847',
      change: '+24.3%',
      isPositive: true,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      {/* Mobile Layout */}
      <div className="lg:hidden">
        <div className="p-4 space-y-4">
          {/* Summary Cards */}
          <div className="grid grid-cols-2 gap-3">
            {summaryData.map((data, index) => (
              <SummaryCard key={index} {...data} />
            ))}
          </div>

          {/* Alerts Panel - High Priority on Mobile */}
          <AlertsPanel onAlertClick={setSelectedAlert} />

          {/* Charts */}
          <div className="space-y-4">
            <UnitsChart />
            <RevenueChart />
          </div>

          {/* Recent Purchases */}
          <RecentPurchases />
        </div>
      </div>

      {/* Desktop Layout */}
      <div className="hidden lg:block">
        <div className="p-8 space-y-6">
          <div>
            <h1 className="text-gray-900 mb-2">Dashboard</h1>
            <p className="text-gray-500">Welcome back! Here's your business overview.</p>
          </div>

          {/* Summary Cards */}
          <div className="grid grid-cols-4 gap-6">
            {summaryData.map((data, index) => (
              <SummaryCard key={index} {...data} />
            ))}
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-3 gap-6">
            {/* Left Column - Charts */}
            <div className="col-span-2 space-y-6">
              <UnitsChart />
              <RevenueChart />
              <RecentPurchases />
            </div>

            {/* Right Column - Alerts */}
            <div className="col-span-1">
              <AlertsPanel onAlertClick={setSelectedAlert} />
            </div>
          </div>
        </div>
      </div>

      {/* Alert Detail Drawer */}
      {selectedAlert && (
        <AlertDetailDrawer
          alert={selectedAlert}
          onClose={() => setSelectedAlert(null)}
        />
      )}
    </div>
  );
}