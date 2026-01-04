import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { usePersistentStore } from './hooks/usePersistentStore';
import { Onboarding } from './components/Onboarding';
import { Today } from './components/Today';
import { Progress } from './components/Progress';
import { History } from './components/History';
import { BottomNav } from './components/BottomNav';

function App() {
  const { settings, entries, updateSettings, upsertEntry } = usePersistentStore();

  if (!settings) {
    return <Onboarding onComplete={updateSettings} />;
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          <Route
            path="/"
            element={
              <Today
                settings={settings}
                entries={entries}
                onSaveEntry={upsertEntry}
              />
            }
          />
          <Route
            path="/progress"
            element={<Progress settings={settings} entries={entries} />}
          />
          <Route
            path="/history"
            element={<History entries={entries} onUpdateEntry={upsertEntry} />}
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
        <BottomNav />
      </div>
    </BrowserRouter>
  );
}

export default App;
