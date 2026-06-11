import { 
  LineChart, Line, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer, Cell 
} from 'recharts';
import type { HistoryItem } from '../hooks/useHistory';

interface HealthChartsProps {
  data: HistoryItem[];
}

const HealthCharts = ({ data }: HealthChartsProps) => {
  // Take last 7 days and reverse for chronological order in chart
  const chartData = [...data].slice(0, 7).reverse().map(item => ({
    date: item.date.split('-').slice(1).join('/'),
    water: item.health?.water_intake || 0,
    weight: item.health?.weight || null,
  }));

  if (chartData.length === 0) return null;

  return (
    <div className="space-y-8 mb-10">
      {/* Water Intake Chart */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-blue-50">
        <h3 className="text-sm font-bold text-gray-500 mb-4 flex items-center">
          <span className="w-1.5 h-4 bg-blue-400 rounded-full mr-2"></span>
          최근 물 섭취량 (ml)
        </h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f9ff" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }} 
              />
              <Tooltip 
                cursor={{ fill: '#f1f5f9' }}
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Bar dataKey="water" radius={[4, 4, 0, 0]}>
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.water >= 2000 ? '#3b82f6' : '#93c5fd'} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Weight Trend Chart */}
      <div className="bg-white rounded-3xl p-6 shadow-sm border border-pink-50">
        <h3 className="text-sm font-bold text-gray-500 mb-4 flex items-center">
          <span className="w-1.5 h-4 bg-pink-400 rounded-full mr-2"></span>
          몸무게 변화 (kg)
        </h3>
        <div className="h-48 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#fff1f2" />
              <XAxis 
                dataKey="date" 
                axisLine={false} 
                tickLine={false} 
                tick={{ fontSize: 10, fill: '#94a3b8' }} 
              />
              <YAxis 
                hide 
                domain={['dataMin - 1', 'dataMax + 1']} 
              />
              <Tooltip 
                contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#ec4899" 
                strokeWidth={3} 
                dot={{ r: 4, fill: '#ec4899', strokeWidth: 2, stroke: '#fff' }}
                activeDot={{ r: 6, strokeWidth: 0 }}
                connectNulls
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
};

export default HealthCharts;
