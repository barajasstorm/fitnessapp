import { useState } from 'react';
import type { DailyEntry, UserSettings } from '../types';
import { getTodayString, generateId, formatDisplayDate } from '../utils/helpers';

interface TodayProps {
  settings: UserSettings;
  entries: DailyEntry[];
  onSaveEntry: (entry: DailyEntry) => void;
}

export const Today: React.FC<TodayProps> = ({ settings, entries, onSaveEntry }) => {
  const todayDate = getTodayString();
  const existingEntry = entries.find(e => e.date === todayDate);

  const [weight, setWeight] = useState(existingEntry?.weightKg?.toString() || '');
  const [waist, setWaist] = useState(existingEntry?.waistCm?.toString() || '');
  const [didTrain, setDidTrain] = useState(existingEntry?.gymSession?.didTrain || false);
  const [gymType, setGymType] = useState<'strength' | 'cardio' | 'mixed'>(existingEntry?.gymSession?.type || 'strength');
  const [gymDuration, setGymDuration] = useState(existingEntry?.gymSession?.durationMin?.toString() || '');
  const [gymIntensity, setGymIntensity] = useState<1 | 2 | 3 | 4 | 5>(existingEntry?.gymSession?.intensity || 3);
  const [steps, setSteps] = useState(existingEntry?.steps?.toString() || '');
  const [movementLevel, setMovementLevel] = useState<'low' | 'medium' | 'high'>(existingEntry?.movementLevel || 'medium');
  const [sleepHours, setSleepHours] = useState(existingEntry?.sleepHours?.toString() || '');
  const [mood, setMood] = useState<1 | 2 | 3 | 4 | 5 | undefined>(existingEntry?.mood);
  const [notes, setNotes] = useState(existingEntry?.notes || '');
  const [showToast, setShowToast] = useState(false);

  const currentWeight = entries[0]?.weightKg;
  const totalChange = currentWeight ? currentWeight - settings.startWeightKg : settings.startWeightKg - settings.startWeightKg;
  const totalToLose = settings.startWeightKg - settings.goalWeightKg;
  const percentComplete = totalToLose > 0 ? Math.max(0, Math.min(100, (Math.abs(totalChange) / totalToLose) * 100)) : 0;

  // Calculate this week's stats
  const today = new Date();
  const weekAgo = new Date(today);
  weekAgo.setDate(weekAgo.getDate() - 7);
  const thisWeekEntries = entries.filter(e => {
    const entryDate = new Date(e.date + 'T00:00:00');
    return entryDate >= weekAgo && entryDate <= today;
  });
  const gymSessionsThisWeek = thisWeekEntries.filter(e => e.gymSession?.didTrain).length;
  const avgWeightThisWeek = thisWeekEntries.filter(e => e.weightKg).reduce((sum, e) => sum + (e.weightKg || 0), 0) / (thisWeekEntries.filter(e => e.weightKg).length || 1);

  const handleSave = () => {
    const entry: DailyEntry = {
      id: existingEntry?.id || generateId(),
      date: todayDate,
      weightKg: weight ? parseFloat(weight) : undefined,
      waistCm: waist ? parseFloat(waist) : undefined,
      mood,
      sleepHours: sleepHours ? parseFloat(sleepHours) : undefined,
      steps: steps ? parseInt(steps, 10) : undefined,
      movementLevel: !steps ? movementLevel : undefined,
      gymSession: {
        didTrain,
        type: didTrain ? gymType : undefined,
        durationMin: didTrain && gymDuration ? parseInt(gymDuration, 10) : undefined,
        intensity: didTrain ? gymIntensity : undefined,
      },
      notes: notes || undefined,
    };

    onSaveEntry(entry);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24 space-y-4">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h1 className="text-xl font-bold text-gray-900 mb-1">
          {formatDisplayDate(todayDate)}
        </h1>
        <div className="text-sm text-gray-600 space-y-1">
          <div>
            <span className="font-semibold">Current:</span> {currentWeight?.toFixed(1) || '—'} kg · 
            <span className="font-semibold ml-1">Start:</span> {settings.startWeightKg.toFixed(1)} kg · 
            <span className="font-semibold ml-1">Goal:</span> {settings.goalWeightKg.toFixed(1)} kg
          </div>
          <div>
            <span className="font-semibold">Total change:</span> {totalChange >= 0 ? '+' : ''}{totalChange.toFixed(1)} kg 
            ({percentComplete.toFixed(0)}% of the way)
          </div>
        </div>
      </div>

      {/* This Week Summary */}
      <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-2xl p-5">
        <h2 className="text-sm font-semibold text-gray-700 mb-2">This Week</h2>
        <div className="text-sm text-gray-600">
          <div>{gymSessionsThisWeek} gym session{gymSessionsThisWeek !== 1 ? 's' : ''}</div>
          {thisWeekEntries.filter(e => e.weightKg).length > 0 && (
            <div>Avg weight: {avgWeightThisWeek.toFixed(1)} kg</div>
          )}
        </div>
      </div>

      {/* Entry Form */}
      <div className="bg-white rounded-2xl shadow-sm p-5 space-y-5">
        <h2 className="text-lg font-bold text-gray-900">Log Today's Entry</h2>

        {/* Weight & Waist */}
        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
            <input
              type="number"
              step="0.1"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 98.5"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Waist (cm)</label>
            <input
              type="number"
              step="0.1"
              value={waist}
              onChange={(e) => setWaist(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Optional"
            />
          </div>
        </div>

        {/* Gym Section */}
        <div className="border-t pt-4">
          <div className="flex items-center mb-3">
            <input
              type="checkbox"
              id="didTrain"
              checked={didTrain}
              onChange={(e) => setDidTrain(e.target.checked)}
              className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
            />
            <label htmlFor="didTrain" className="ml-2 text-sm font-medium text-gray-700">
              Did you train today?
            </label>
          </div>

          {didTrain && (
            <div className="space-y-3 pl-7">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                <select
                  value={gymType}
                  onChange={(e) => setGymType(e.target.value as 'strength' | 'cardio' | 'mixed')}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="strength">Strength</option>
                  <option value="cardio">Cardio</option>
                  <option value="mixed">Mixed</option>
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Duration (min)</label>
                  <input
                    type="number"
                    value={gymDuration}
                    onChange={(e) => setGymDuration(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., 60"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Intensity</label>
                  <select
                    value={gymIntensity}
                    onChange={(e) => setGymIntensity(parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="1">1 - Very Light</option>
                    <option value="2">2 - Light</option>
                    <option value="3">3 - Moderate</option>
                    <option value="4">4 - Hard</option>
                    <option value="5">5 - Very Hard</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Movement */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Movement</label>
          <div className="space-y-2">
            <input
              type="number"
              value={steps}
              onChange={(e) => setSteps(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Steps (e.g., 10000)"
            />
            <div className="text-xs text-gray-500 text-center">OR</div>
            <select
              value={movementLevel}
              onChange={(e) => setMovementLevel(e.target.value as 'low' | 'medium' | 'high')}
              disabled={!!steps}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
            >
              <option value="low">Low Activity</option>
              <option value="medium">Medium Activity</option>
              <option value="high">High Activity</option>
            </select>
          </div>
        </div>

        {/* Sleep */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Sleep (hours)</label>
          <input
            type="number"
            step="0.5"
            value={sleepHours}
            onChange={(e) => setSleepHours(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            placeholder="e.g., 7.5"
          />
        </div>

        {/* Mood */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-2">Mood</label>
          <div className="flex justify-between gap-2">
            {[1, 2, 3, 4, 5].map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMood(m as 1 | 2 | 3 | 4 | 5)}
                className={`flex-1 py-2 rounded-lg text-2xl transition-all ${
                  mood === m
                    ? 'bg-blue-100 ring-2 ring-blue-500 scale-110'
                    : 'bg-gray-100 hover:bg-gray-200'
                }`}
              >
                {['😢', '😕', '😐', '🙂', '😄'][m - 1]}
              </button>
            ))}
          </div>
        </div>

        {/* Notes */}
        <div className="border-t pt-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
          <textarea
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            rows={3}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
            placeholder="Any observations or thoughts..."
          />
        </div>

        {/* Save Button */}
        <button
          onClick={handleSave}
          className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
        >
          Save Entry
        </button>
      </div>

      {/* Toast Notification */}
      {showToast && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-fade-in">
          ✓ Saved for today
        </div>
      )}
    </div>
  );
};

