
import React, { useMemo } from 'react';
import { 
  LineChart, 
  Line, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { WorkoutEntry } from '../types';

interface DashboardProps {
  entries: WorkoutEntry[];
}

const Dashboard: React.FC<DashboardProps> = ({ entries }) => {
  // Aggregate data for weight chart (Unique dates to avoid messy charts)
  const chartData = useMemo(() => {
    const dataMap = new Map<string, number>();
    entries.forEach(e => {
      // If multiple entries on same day, use the recorded bodyWeight (should be consistent)
      dataMap.set(e.date, e.bodyWeight);
    });
    
    return Array.from(dataMap.entries())
      .map(([date, weight]) => ({ date, weight }))
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
  }, [entries]);

  if (entries.length === 0) {
    return (
      <div className="bg-[#111111] p-8 rounded-2xl border border-dashed border-gray-800 text-center">
        <p className="text-gray-500">Aún no tienes registros. ¡Comienza a entrenar!</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Weight Chart Section */}
      <div className="bg-[#111111] p-6 rounded-2xl border border-gray-800">
        <h3 className="text-[#39FF14] font-sporty text-lg mb-6 flex items-center gap-2">
          EVOLUCIÓN PESO CORPORAL
        </h3>
        <div className="h-64 w-full">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#222" />
              <XAxis 
                dataKey="date" 
                stroke="#666" 
                fontSize={10} 
                tickFormatter={(val) => val.split('-').slice(1).join('/')}
              />
              <YAxis stroke="#666" fontSize={10} domain={['auto', 'auto']} />
              <Tooltip 
                contentStyle={{ backgroundColor: '#000', border: '1px solid #39FF14', color: '#fff' }}
                itemStyle={{ color: '#39FF14' }}
              />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#39FF14" 
                strokeWidth={3}
                dot={{ fill: '#39FF14', r: 4 }}
                activeDot={{ r: 6, stroke: '#fff', strokeWidth: 2 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* History List */}
      <div className="bg-[#111111] p-6 rounded-2xl border border-gray-800">
        <h3 className="text-[#39FF14] font-sporty text-lg mb-4">ÚLTIMOS ENTRENAMIENTOS</h3>
        <div className="space-y-3">
          {entries.slice().reverse().slice(0, 10).map((entry) => (
            <div key={entry.id} className="bg-[#1a1a1a] p-4 rounded-xl border-l-4 border-[#39FF14] flex justify-between items-center">
              <div>
                <p className="text-xs text-gray-500">{entry.date}</p>
                <p className="font-bold text-white text-sm">{entry.exercise}</p>
                <p className="text-[10px] text-[#39FF14] uppercase font-bold">{entry.muscleGroup}</p>
              </div>
              <div className="text-right">
                <p className="text-xl font-sporty text-white">{entry.weightLifted}<span className="text-[10px] ml-1">KG</span></p>
                <p className="text-[10px] text-gray-600">BW: {entry.bodyWeight}kg</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
