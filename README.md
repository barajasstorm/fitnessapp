# Weight Tracker PWA

A mobile-first Progressive Web App for tracking weight loss and daily habits. Built with React, TypeScript, and Tailwind CSS.

## Features

- 📱 Mobile-first responsive design
- 💾 Local storage (no backend needed)
- 📊 Weight tracking with 7-day rolling average
- 🏋️ Gym session tracking
- 😊 Mood, sleep, and movement tracking
- 📈 Progress charts and statistics
- 📖 Entry history with editing
- 🔌 Works offline after first load
- 📲 Installable as a PWA on iOS and Android

## Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite
- **Styling**: Tailwind CSS
- **Routing**: React Router v6
- **Charts**: Recharts
- **PWA**: vite-plugin-pwa
- **Storage**: LocalStorage

## Getting Started

### Installation

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Development

The app will run on `http://localhost:5173` by default.

### Building for Production

```bash
npm run build
```

This creates an optimized production build in the `dist/` folder with PWA support.

## PWA Installation

### On iOS (Safari):

1. Open the app in Safari
2. Tap the Share button
3. Scroll down and tap "Add to Home Screen"
4. Tap "Add"

The app will now appear on your home screen and run in standalone mode.

### On Android (Chrome):

1. Open the app in Chrome
2. Tap the three-dot menu
3. Tap "Install app" or "Add to Home Screen"

## Data Model

### UserSettings
- `startWeightKg`: Starting weight in kg
- `goalWeightKg`: Target weight in kg
- `targetWeeklyLossKg`: Optional weekly loss target
- `createdAt`: ISO timestamp

### DailyEntry
- `id`: Unique identifier
- `date`: ISO date (YYYY-MM-DD)
- `weightKg`: Optional daily weight
- `waistCm`: Optional waist measurement
- `mood`: Optional mood rating (1-5)
- `sleepHours`: Optional sleep duration
- `steps`: Optional step count
- `movementLevel`: Optional activity level (low/medium/high)
- `gymSession`: Optional gym session details
  - `didTrain`: Boolean
  - `type`: strength/cardio/mixed
  - `durationMin`: Duration in minutes
  - `intensity`: Rating (1-5)
- `notes`: Optional text notes

## Storage

All data is stored locally in the browser's LocalStorage under the key `weight-tracker-v1`. Data persists across sessions and is not sent to any server.

To reset all data, clear your browser's LocalStorage or remove the app and reinstall.

## Project Structure

```
src/
├── components/
│   ├── Onboarding.tsx      # Initial setup screen
│   ├── Today.tsx           # Daily entry form
│   ├── Progress.tsx        # Charts and stats
│   ├── History.tsx         # Entry list and editing
│   └── BottomNav.tsx       # Navigation bar
├── hooks/
│   └── usePersistentStore.ts  # LocalStorage management
├── types/
│   └── index.ts            # TypeScript interfaces
├── utils/
│   └── helpers.ts          # Utility functions
├── App.tsx                 # Main app component
├── main.tsx               # Entry point
└── index.css              # Global styles
```

## Customizing Icons

The PWA icons are currently SVG placeholders. For better iOS support, you can replace them with PNG images:

1. Create PNG icons at these sizes:
   - `pwa-192x192.png` (192x192)
   - `pwa-512x512.png` (512x512)
   - `apple-touch-icon.png` (180x180)

2. Place them in the `public/` folder

3. Update `vite.config.ts` to reference the PNG files instead of SVG

You can use tools like:
- [PWA Asset Generator](https://github.com/onderceylan/pwa-asset-generator)
- [RealFaviconGenerator](https://realfavicongenerator.net/)

## Browser Support

- iOS Safari 11.3+
- Chrome/Edge (latest)
- Firefox (latest)
- Samsung Internet

## License

This is a personal project for individual use. Feel free to fork and customize for your own needs.
