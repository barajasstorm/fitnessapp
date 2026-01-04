import { useState, useMemo } from 'react';
import type { DailyEntry } from '../types';
import { formatDisplayDate, getMoodEmoji } from '../utils/helpers';

interface HistoryProps {
  entries: DailyEntry[];
  onUpdateEntry: (entry: DailyEntry) => void;
}

interface GroupedEntries {
  weekStart: string;
  weekLabel: string;
  entries: DailyEntry[];
}

export const History: React.FC<HistoryProps> = ({ entries, onUpdateEntry }) => {
  const [selectedEntry, setSelectedEntry] = useState<DailyEntry | null>(null);
  const [editWeight, setEditWeight] = useState('');
  const [editWaist, setEditWaist] = useState('');
  const [editDidTrain, setEditDidTrain] = useState(false);
  const [editGymType, setEditGymType] = useState<'strength' | 'cardio' | 'mixed'>('strength');
  const [editGymDuration, setEditGymDuration] = useState('');
  const [editGymIntensity, setEditGymIntensity] = useState<1 | 2 | 3 | 4 | 5>(3);
  const [editSteps, setEditSteps] = useState('');
  const [editMovementLevel, setEditMovementLevel] = useState<'low' | 'medium' | 'high'>('medium');
  const [editSleepHours, setEditSleepHours] = useState('');
  const [editMood, setEditMood] = useState<1 | 2 | 3 | 4 | 5 | undefined>(undefined);
  const [editNotes, setEditNotes] = useState('');

  const groupedEntries = useMemo(() => {
    const groups: { [key: string]: GroupedEntries } = {};

    entries.forEach(entry => {
      const entryDate = new Date(entry.date + 'T00:00:00');
      const weekStart = new Date(entryDate);
      weekStart.setDate(weekStart.getDate() - weekStart.getDay());
      const weekKey = weekStart.toISOString().split('T')[0];

      if (!groups[weekKey]) {
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        const weekLabel = `${weekStart.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })} - ${weekEnd.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}`;
        
        groups[weekKey] = {
          weekStart: weekKey,
          weekLabel,
          entries: [],
        };
      }

      groups[weekKey].entries.push(entry);
    });

    // Sort entries within each week by date descending
    Object.values(groups).forEach(group => {
      group.entries.sort((a, b) => b.date.localeCompare(a.date));
    });

    // Convert to array and sort by week descending
    return Object.values(groups).sort((a, b) => b.weekStart.localeCompare(a.weekStart));
  }, [entries]);

  const openEditModal = (entry: DailyEntry) => {
    setSelectedEntry(entry);
    setEditWeight(entry.weightKg?.toString() || '');
    setEditWaist(entry.waistCm?.toString() || '');
    setEditDidTrain(entry.gymSession?.didTrain || false);
    setEditGymType(entry.gymSession?.type || 'strength');
    setEditGymDuration(entry.gymSession?.durationMin?.toString() || '');
    setEditGymIntensity(entry.gymSession?.intensity || 3);
    setEditSteps(entry.steps?.toString() || '');
    setEditMovementLevel(entry.movementLevel || 'medium');
    setEditSleepHours(entry.sleepHours?.toString() || '');
    setEditMood(entry.mood);
    setEditNotes(entry.notes || '');
  };

  const closeModal = () => {
    setSelectedEntry(null);
  };

  const handleSave = () => {
    if (!selectedEntry) return;

    const updatedEntry: DailyEntry = {
      ...selectedEntry,
      weightKg: editWeight ? parseFloat(editWeight) : undefined,
      waistCm: editWaist ? parseFloat(editWaist) : undefined,
      mood: editMood,
      sleepHours: editSleepHours ? parseFloat(editSleepHours) : undefined,
      steps: editSteps ? parseInt(editSteps, 10) : undefined,
      movementLevel: !editSteps ? editMovementLevel : undefined,
      gymSession: {
        didTrain: editDidTrain,
        type: editDidTrain ? editGymType : undefined,
        durationMin: editDidTrain && editGymDuration ? parseInt(editGymDuration, 10) : undefined,
        intensity: editDidTrain ? editGymIntensity : undefined,
      },
      notes: editNotes || undefined,
    };

    onUpdateEntry(updatedEntry);
    closeModal();
  };

  return (
    <div className="max-w-2xl mx-auto p-4 pb-24 space-y-4">
      <h1 className="text-2xl font-bold text-gray-900">History</h1>

      {groupedEntries.length === 0 ? (
        <div className="bg-white rounded-2xl shadow-sm p-8 text-center text-gray-500">
          No entries yet. Start logging on the Today tab!
        </div>
      ) : (
        <div className="space-y-6">
          {groupedEntries.map((group) => (
            <div key={group.weekStart}>
              <h2 className="text-sm font-semibold text-gray-600 mb-2">{group.weekLabel}</h2>
              <div className="bg-white rounded-2xl shadow-sm divide-y divide-gray-100">
                {group.entries.map((entry) => (
                  <button
                    key={entry.id}
                    onClick={() => openEditModal(entry)}
                    className="w-full px-4 py-3 hover:bg-gray-50 transition-colors text-left"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="font-medium text-gray-900">
                          {formatDisplayDate(entry.date)}
                        </div>
                        <div className="flex items-center gap-3 mt-1 text-sm text-gray-600">
                          {entry.weightKg && (
                            <span className="font-semibold">{entry.weightKg.toFixed(1)} kg</span>
                          )}
                          {entry.gymSession?.didTrain && (
                            <span className="flex items-center gap-1">
                              <span className="text-green-600">✓</span>
                              {entry.gymSession.type}
                            </span>
                          )}
                          {!entry.gymSession?.didTrain && <span className="text-gray-400">No gym</span>}
                          <span>{getMoodEmoji(entry.mood)}</span>
                        </div>
                      </div>
                      <div className="text-gray-400">›</div>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Edit Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b px-5 py-4 flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">
                {formatDisplayDate(selectedEntry.date)}
              </h3>
              <button
                onClick={closeModal}
                className="text-gray-500 hover:text-gray-700 text-2xl leading-none"
              >
                ×
              </button>
            </div>

            <div className="p-5 space-y-4">
              {/* Weight & Waist */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Weight (kg)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editWeight}
                    onChange={(e) => setEditWeight(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Waist (cm)</label>
                  <input
                    type="number"
                    step="0.1"
                    value={editWaist}
                    onChange={(e) => setEditWaist(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Gym Section */}
              <div className="border-t pt-4">
                <div className="flex items-center mb-3">
                  <input
                    type="checkbox"
                    id="editDidTrain"
                    checked={editDidTrain}
                    onChange={(e) => setEditDidTrain(e.target.checked)}
                    className="w-5 h-5 text-blue-600 rounded focus:ring-2 focus:ring-blue-500"
                  />
                  <label htmlFor="editDidTrain" className="ml-2 text-sm font-medium text-gray-700">
                    Did you train?
                  </label>
                </div>

                {editDidTrain && (
                  <div className="space-y-3 pl-7">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">Type</label>
                      <select
                        value={editGymType}
                        onChange={(e) => setEditGymType(e.target.value as 'strength' | 'cardio' | 'mixed')}
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
                          value={editGymDuration}
                          onChange={(e) => setEditGymDuration(e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                      </div>
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Intensity</label>
                        <select
                          value={editGymIntensity}
                          onChange={(e) => setEditGymIntensity(parseInt(e.target.value) as 1 | 2 | 3 | 4 | 5)}
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
                <input
                  type="number"
                  value={editSteps}
                  onChange={(e) => setEditSteps(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent mb-2"
                  placeholder="Steps"
                />
                <select
                  value={editMovementLevel}
                  onChange={(e) => setEditMovementLevel(e.target.value as 'low' | 'medium' | 'high')}
                  disabled={!!editSteps}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent disabled:bg-gray-100"
                >
                  <option value="low">Low Activity</option>
                  <option value="medium">Medium Activity</option>
                  <option value="high">High Activity</option>
                </select>
              </div>

              {/* Sleep */}
              <div className="border-t pt-4">
                <label className="block text-sm font-medium text-gray-700 mb-1">Sleep (hours)</label>
                <input
                  type="number"
                  step="0.5"
                  value={editSleepHours}
                  onChange={(e) => setEditSleepHours(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                      onClick={() => setEditMood(m as 1 | 2 | 3 | 4 | 5)}
                      className={`flex-1 py-2 rounded-lg text-2xl transition-all ${
                        editMood === m
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
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
                />
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 pt-4">
                <button
                  onClick={closeModal}
                  className="flex-1 bg-gray-200 text-gray-800 py-3 rounded-lg font-medium hover:bg-gray-300 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSave}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Save
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

