import { Download, TrendingUp, ShoppingBag, DollarSign, Users } from 'lucide-react';
import { Button } from './ui/button';
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

const monthlyData = [
  { month: 'Jul', revenue: 85000, profit: 18700 },
  { month: 'Aug', revenue: 92000, profit: 20240 },
  { month: 'Sep', revenue: 88000, profit: 19360 },
  { month: 'Oct', revenue: 105000, profit: 23100 },
  { month: 'Nov', revenue: 118000, profit: 25960 },
];

const bagDistribution = [
  { name: '1kg', value: 450, color: '#0F9D58' },
  { name: '5kg', value: 780, color: '#34A853' },
  { name: '10kg', value: 1245, color: '#7CB342' },
  { name: '25kg', value: 372, color: '#9CCC65' },
];

const topBags = [
  { size: '10kg', units: 1245, revenue: 218750 },
  { size: '5kg', units: 780, revenue: 140400 },
  { size: '1kg', units: 450, revenue: 45000 },
  { size: '25kg', units: 372, revenue: 92780 },
];

interface ReportsProps {
  userRole: 'admin' | 'user';
}

export default function Reports({ userRole }: ReportsProps) {
  const handleExport = (format: 'pdf' | 'excel') => {
    alert(`Exporting report to ${format.toUpperCase()}...`);
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20 lg:pb-8">
      <div className="max-w-7xl mx-auto p-4 lg:p-8">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-gray-900 mb-2">Reports & Analytics</h1>
            <p className="text-gray-500">Detailed business insights and trends</p>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => handleExport('pdf')}
              className="rounded-xl"
            >
              <Download className="w-4 h-4 mr-2" />
              PDF
            </Button>
            <Button
              variant="outline"
              onClick={() => handleExport('excel')}
              className="rounded-xl"
            >
              <Download className="w-4 h-4 mr-2" />
              Excel
            </Button>
          </div>
        </div>

        {/* Monthly Summary */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-green-50 rounded-xl flex items-center justify-center">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="text-gray-500 text-sm mb-1">Total Revenue</div>
            <div className="text-gray-900">₹3,45,280</div>
            <div className="text-green-600 text-xs mt-1">+22.5% vs last month</div>
          </div>

          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <ShoppingBag className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="text-gray-500 text-sm mb-1">Units Sold</div>
            <div className="text-gray-900">2,847</div>
            <div className="text-blue-600 text-xs mt-1">+18.3% vs last month</div>
          </div>

          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-purple-50 rounded-xl flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="text-gray-500 text-sm mb-1">Profit Margin</div>
            <div className="text-gray-900">22.5%</div>
            <div className="text-purple-600 text-xs mt-1">+1.2% vs last month</div>
          </div>

          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-orange-50 rounded-xl flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
            </div>
            <div className="text-gray-500 text-sm mb-1">Active Customers</div>
            <div className="text-gray-900">48</div>
            <div className="text-orange-600 text-xs mt-1">+6 new customers</div>
          </div>
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
          {/* Revenue Trend */}
          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm">
            <h3 className="text-gray-900 mb-4">Revenue & Profit Trend</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={monthlyData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis dataKey="month" stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <YAxis stroke="#9ca3af" style={{ fontSize: '12px' }} />
                  <Tooltip
                    contentStyle={{
                      backgroundColor: 'white',
                      border: '1px solid #e5e7eb',
                      borderRadius: '8px',
                    }}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="revenue"
                    stroke="#0F9D58"
                    strokeWidth={3}
                    name="Revenue"
                  />
                  <Line
                    type="monotone"
                    dataKey="profit"
                    stroke="#34A853"
                    strokeWidth={3}
                    name="Profit"
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Bag Size Distribution */}
          <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm">
            <h3 className="text-gray-900 mb-4">Bag Size Distribution</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={bagDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={100}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {bagDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Best Selling Products */}
        <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm mb-6">
          <h3 className="text-gray-900 mb-4">Best Selling Bag Sizes</h3>
          <div className="space-y-3">
            {topBags.map((bag, index) => (
              <div key={bag.size} className="flex items-center gap-4">
                <div className="flex items-center justify-center w-8 h-8 rounded-full bg-[#0F9D58] text-white flex-shrink-0">
                  {index + 1}
                </div>
                <div className="flex-1">
                  <div className="text-gray-900 mb-1">{bag.size} Bags</div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-[#0F9D58] h-2 rounded-full"
                      style={{ width: `${(bag.units / topBags[0].units) * 100}%` }}
                    />
                  </div>
                </div>
                <div className="text-right flex-shrink-0">
                  <div className="text-gray-900 text-sm">{bag.units} units</div>
                  <div className="text-gray-500 text-xs">₹{bag.revenue.toLocaleString()}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Key Insights */}
        <div className="bg-gradient-to-br from-[#0F9D58] to-[#0d8a4d] rounded-2xl p-6 text-white">
          <h3 className="mb-4">Key Insights - November 2024</h3>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-white/80 text-sm mb-2">Top Performer</div>
              <div className="mb-1">10kg Bags</div>
              <div className="text-white/80 text-xs">1,245 units sold • ₹2,18,750 revenue</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-white/80 text-sm mb-2">Best Customer</div>
              <div className="mb-1">Rajesh Kumar</div>
              <div className="text-white/80 text-xs">₹45,200 total purchases this month</div>
            </div>
            <div className="bg-white/10 rounded-xl p-4">
              <div className="text-white/80 text-sm mb-2">Growth Rate</div>
              <div className="mb-1">+22.5%</div>
              <div className="text-white/80 text-xs">Compared to October 2024</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}