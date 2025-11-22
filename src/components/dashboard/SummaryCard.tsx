import { LucideIcon } from 'lucide-react';

interface SummaryCardProps {
  icon: LucideIcon;
  label: string;
  value: string;
  change: string;
  isPositive: boolean;
  color: string;
  bgColor: string;
}

export default function SummaryCard({
  icon: Icon,
  label,
  value,
  change,
  isPositive,
  color,
  bgColor,
}: SummaryCardProps) {
  return (
    <div className="bg-white rounded-2xl p-4 lg:p-6 shadow-sm hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-3">
        <div className={`w-10 h-10 lg:w-12 lg:h-12 ${bgColor} rounded-xl flex items-center justify-center`}>
          <Icon className={`w-5 h-5 lg:w-6 lg:h-6 ${color}`} />
        </div>
        <div className={`text-xs lg:text-sm px-2 py-1 rounded-full ${
          isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'
        }`}>
          {change}
        </div>
      </div>
      <div className="text-gray-500 text-sm mb-1">{label}</div>
      <div className="text-gray-900">{value}</div>
    </div>
  );
}
