import { useState } from 'react';
import type { UserSettings } from '../types';

interface OnboardingProps {
  onComplete: (settings: UserSettings) => void;
}

export const Onboarding: React.FC<OnboardingProps> = ({ onComplete }) => {
  const [startWeight, setStartWeight] = useState('');
  const [goalWeight, setGoalWeight] = useState('');
  const [targetWeeklyLoss, setTargetWeeklyLoss] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const startWeightNum = parseFloat(startWeight);
    const goalWeightNum = parseFloat(goalWeight);
    
    if (isNaN(startWeightNum) || isNaN(goalWeightNum)) {
      alert('Please enter valid numbers for weights');
      return;
    }
    
    if (goalWeightNum >= startWeightNum) {
      alert('Goal weight should be less than start weight');
      return;
    }
    
    const settings: UserSettings = {
      startWeightKg: startWeightNum,
      goalWeightKg: goalWeightNum,
      targetWeeklyLossKg: targetWeeklyLoss ? parseFloat(targetWeeklyLoss) : undefined,
      createdAt: new Date().toISOString(),
    };
    
    onComplete(settings);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">⚖️</h1>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Weight Tracker</h2>
          <p className="text-gray-600">Let's set up your weight loss journey</p>
        </div>

        <form onSubmit={handleSubmit} className="bg-white rounded-2xl shadow-lg p-6 space-y-5">
          <div>
            <label htmlFor="startWeight" className="block text-sm font-medium text-gray-700 mb-1">
              Current Weight (kg) *
            </label>
            <input
              type="number"
              id="startWeight"
              step="0.1"
              value={startWeight}
              onChange={(e) => setStartWeight(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 100.0"
              required
            />
          </div>

          <div>
            <label htmlFor="goalWeight" className="block text-sm font-medium text-gray-700 mb-1">
              Goal Weight (kg) *
            </label>
            <input
              type="number"
              id="goalWeight"
              step="0.1"
              value={goalWeight}
              onChange={(e) => setGoalWeight(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 75.0"
              required
            />
          </div>

          <div>
            <label htmlFor="targetWeeklyLoss" className="block text-sm font-medium text-gray-700 mb-1">
              Target Weekly Loss (kg/week) - Optional
            </label>
            <input
              type="number"
              id="targetWeeklyLoss"
              step="0.1"
              value={targetWeeklyLoss}
              onChange={(e) => setTargetWeeklyLoss(e.target.value)}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="e.g., 0.5"
            />
            <p className="mt-1 text-xs text-gray-500">Recommended: 0.5 - 1.0 kg/week</p>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
          >
            Start Tracking
          </button>
        </form>
      </div>
    </div>
  );
};

