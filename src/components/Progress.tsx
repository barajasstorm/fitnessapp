import { useMemo } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import type { DailyEntry, UserSettings } from '../types';

interface ProgressProps {
  settings: UserSettings;
  entries: DailyEntry[];
}

export const Progress: React.FC<ProgressProps> = ({ settings, entries }) => {
  // Prepare chart data
  const chartData = useMemo(() => {
    const entriesWithWeight = entries
      .filter(e => e.weightKg)
      .sort((a, b) => a.date.localeCompare(b.date));

    if (entriesWithWeight.length === 0) return [];

    // Calculate 7-day rolling average
    const data = entriesWithWeight.map((entry, index) => {
      const last7 = entriesWithWeight
        .slice(Math.max(0, index - 6), index + 1)
        .map(e => e.weightKg!);
      const avg7day = last7.reduce((sum, w) => sum + w, 0) / last7.length;

      return {
        date: entry.date,
        displayDate: new Date(entry.date + 'T00:00:00').toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
        weight: entry.weightKg,
        avg7day: parseFloat(avg7day.toFixed(1)),
      };
    });

    return data;
  }, [entries]);

  // Calculate stats
  const currentWeight = entries.find(e => e.weightKg)?.weightKg || settings.startWeightKg;
  const totalChange = currentWeight - settings.startWeightKg;
  const remaining = currentWeight - settings.goalWeightKg;

  // Calculate average weekly loss
  const entriesWithWeight = entries.filter(e => e.weightKg).sort((a, b) => a.date.localeCompare(b.date));
  let avgWeeklyLoss = 0;
  let weeksToGoal = 0;

  if (entriesWithWeight.length >= 2) {
    const firstEntry = entriesWithWeight[0];
    const lastEntry = entriesWithWeight[entriesWithWeight.length - 1];
    const firstDate = new Date(firstEntry.date + 'T00:00:00');
    const lastDate = new Date(lastEntry.date + 'T00:00:00');
    const daysDiff = (lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24);
    const weeksDiff = daysDiff / 7;
    
    if (weeksDiff > 0) {
      const weightDiff = firstEntry.weightKg! - lastEntry.weightKg!;
      avgWeeklyLoss = weightDiff / weeksDiff;
      
      if (avgWeeklyLoss > 0) {
        weeksToGoal = remaining / avgWeeklyLoss;
      }
    }
  }

  // Calculate gym vs non-gym weeks
  const weeklyStats = useMemo(() => {
    const weeks: { [key: string]: { entries: DailyEntry[]; gymSessions: number } } = {};
    
    entries.forEach(entry => {
      const entryDate = new Date(entry.date + 'T00:00:00');
      const weekStart = new Date(entryDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];
      
      if (!weeks[weekKey]) {
        weeks[weekKey] = { entries: [], gymSessions: 0 };
      }
      
      weeks[weekKey].entries.push(entry);
      if (entry.gymSession?.didTrain) {
        weeks[weekKey].gymSessions++;
      }
    });

    const gymWeeks: number[] = [];
    const nonGymWeeks: number[] = [];

    Object.values(weeks).forEach(week => {
      const weights = week.entries.filter(e => e.weightKg).map(e => e.weightKg!);
      if (weights.length >= 2) {
        const weekChange = weights[0] - weights[weights.length - 1];
        if (week.gymSessions >= 3) {
          gymWeeks.push(weekChange);
        } else {
          nonGymWeeks.push(weekChange);
        }
      }
    });

    return {
      gymWeeks,
      nonGymWeeks,
      avgGymWeekLoss: gymWeeks.length > 0 ? gymWeeks.reduce((a, b) => a + b, 0) / gymWeeks.length : 0,
      avgNonGymWeekLoss: nonGymWeeks.length > 0 ? nonGymWeeks.reduce((a, b) => a + b, 0) / nonGymWeeks.length : 0,
    };
  }, [entries]);

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">Progress</h1>

      {/* Summary Stats */}
      <div className="bg-white rounded-2xl shadow-sm p-5 space-y-3">
        <h2 className="text-lg font-semibold text-gray-900 mb-3">Summary</h2>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Start Weight</div>
            <div className="text-2xl font-bold text-gray-900">{settings.startWeightKg.toFixed(1)} kg</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Current Weight</div>
            <div className="text-2xl font-bold text-blue-600">{currentWeight.toFixed(1)} kg</div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">Total Change</div>
            <div className={`text-2xl font-bold ${totalChange < 0 ? 'text-green-600' : 'text-gray-900'}`}>
              {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(1)} kg
            </div>
          </div>
          <div>
            <div className="text-xs text-gray-500 uppercase tracking-wide">To Goal</div>
            <div className="text-2xl font-bold text-gray-900">{remaining.toFixed(1)} kg</div>
          </div>
        </div>

        {avgWeeklyLoss > 0 && (
          <div className="pt-3 border-t">
            <div className="text-xs text-gray-500 uppercase tracking-wide">Average Weekly Loss</div>
            <div className="text-lg font-semibold text-gray-900">{avgWeeklyLoss.toFixed(2)} kg/week</div>
            <div className="text-sm text-gray-600 mt-1">
              Est. {weeksToGoal.toFixed(0)} weeks to goal
            </div>
          </div>
        )}
      </div>

      {/* Chart */}
      {chartData.length > 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Weight Trend</h2>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData} margin={{ top: 5, right: 10, left: -20, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis 
                dataKey="displayDate" 
                tick={{ fontSize: 12 }}
                stroke="#999"
              />
              <YAxis 
                domain={['dataMin - 2', 'dataMax + 2']}
                tick={{ fontSize: 12 }}
                stroke="#999"
              />
              <Tooltip 
                contentStyle={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #e5e7eb',
                  borderRadius: '8px',
                  fontSize: '14px'
                }}
              />
              <Legend wrapperStyle={{ fontSize: '14px' }} />
              <Line 
                type="monotone" 
                dataKey="weight" 
                stroke="#3b82f6" 
                strokeWidth={2}
                dot={{ r: 4 }}
                name="Daily Weight"
              />
              <Line 
                type="monotone" 
                dataKey="avg7day" 
                stroke="#10b981" 
                strokeWidth={2}
                strokeDasharray="5 5"
                dot={false}
                name="7-Day Average"
              />
            </LineChart>
          </ResponsiveContainer>
        </div>
      ) : (
        <div className="bg-white rounded-2xl shadow-sm p-5 text-center text-gray-500">
          Start logging your weight to see progress charts
        </div>
      )}

      {/* Habit Insights */}
      {(weeklyStats.gymWeeks.length > 0 || weeklyStats.nonGymWeeks.length > 0) && (
        <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl p-5">
          <h2 className="text-lg font-semibold text-gray-900 mb-3">Habit Insights</h2>
          <div className="space-y-2 text-sm">
            {weeklyStats.gymWeeks.length > 0 && (
              <div>
                <span className="font-medium">Weeks with ≥3 gym sessions:</span>{' '}
                <span className={weeklyStats.avgGymWeekLoss > 0 ? 'text-green-700 font-semibold' : 'text-gray-700'}>
                  {weeklyStats.avgGymWeekLoss >= 0 ? '+' : ''}{weeklyStats.avgGymWeekLoss.toFixed(2)} kg avg
                </span>
              </div>
            )}
            {weeklyStats.nonGymWeeks.length > 0 && (
              <div>
                <span className="font-medium">Other weeks:</span>{' '}
                <span className={weeklyStats.avgNonGymWeekLoss > 0 ? 'text-green-700 font-semibold' : 'text-gray-700'}>
                  {weeklyStats.avgNonGymWeekLoss >= 0 ? '+' : ''}{weeklyStats.avgNonGymWeekLoss.toFixed(2)} kg avg
                </span>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

