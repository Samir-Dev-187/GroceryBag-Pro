import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const data = [
  { date: 'Nov 1', units: 65 },
  { date: 'Nov 5', units: 78 },
  { date: 'Nov 10', units: 92 },
  { date: 'Nov 15', units: 85 },
  { date: 'Nov 20', units: 110 },
  { date: 'Nov 25', units: 125 },
  { date: 'Nov 30', units: 142 },
];

export default function UnitsChart() {
  return (
    <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm">
      <div className="mb-4">
        <h3 className="text-gray-900 mb-1">Units Sold</h3>
        <p className="text-gray-500 text-sm">Last 30 days performance</p>
      </div>
      <div className="h-64 lg:h-80">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="date" 
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
            />
            <Line 
              type="monotone" 
              dataKey="units" 
              stroke="#0F9D58" 
              strokeWidth={3}
              dot={{ fill: '#0F9D58', r: 4 }}
            />
          </LineChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
