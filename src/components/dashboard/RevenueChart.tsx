import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { bagSize: '1kg', revenue: 12500 },
  { bagSize: '5kg', revenue: 28400 },
  { bagSize: '10kg', revenue: 45200 },
  { bagSize: '25kg', revenue: 32100 },
];

export default function RevenueChart() {
  return (
    <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-gray-900 mb-1">Revenue by Bag Size</h3>
        <p className="text-gray-500 text-sm">This month's breakdown</p>
      </div>
      <div className="h-64 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="bagSize" 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <YAxis 
              stroke="#9ca3af"
              style={{ fontSize: '12px' }}
            />
            <Tooltip 
              contentStyle={{
                backgroundColor: 'white',
                border: '1px solid #e5e7eb',
                borderRadius: '8px',
              }}
              formatter={(value: number) => `₹${value.toLocaleString()}`}
            />
            <Bar 
              dataKey="revenue" 
              fill="#0F9D58" 
              radius={[8, 8, 0, 0]}
            />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
