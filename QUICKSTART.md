# Quick Start Guide

## 🚀 Getting Started

### First Time Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Start development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to `http://localhost:5173`

## 📱 Testing on Your iPhone

### Method 1: Local Network (Recommended for Testing)

1. **Start the dev server with network access:**
   ```bash
   npm run dev -- --host
   ```

2. **Find your computer's IP address:**
   - Mac: System Preferences → Network → Your IP is shown
   - Example: `192.168.1.100`

3. **Open on iPhone:**
   - Make sure iPhone is on the same WiFi network
   - Open Safari and go to `http://YOUR_IP:5173`
   - Example: `http://192.168.1.100:5173`

### Method 2: Production Build (For "Add to Home Screen")

1. **Build the app:**
   ```bash
   npm run build
   ```

2. **Preview the production build:**
   ```bash
   npm run preview -- --host
   ```

3. **Access on iPhone** (same as Method 1 but port 4173)

4. **Install as PWA:**
   - In Safari, tap the Share button
   - Scroll down and tap "Add to Home Screen"
   - Tap "Add"
   - The app icon will appear on your home screen!

## 🎯 First Use

1. **Onboarding:**
   - Enter your current weight (e.g., 100 kg)
   - Enter your goal weight (e.g., 75 kg)
   - Optionally set target weekly loss (e.g., 0.5 kg/week)
   - Tap "Start Tracking"

2. **Daily Logging:**
   - The "Today" tab opens automatically
   - Log your weight, gym session, mood, sleep, etc.
   - Tap "Save Entry" when done

3. **View Progress:**
   - "Progress" tab shows charts and statistics
   - "History" tab shows all past entries
   - Tap any history entry to edit it

## 📊 Features Overview

### Today Tab
- Quick entry form for today's data
- Week summary at the top
- Save/update entries with one tap

### Progress Tab
- Weight chart with 7-day rolling average
- Summary statistics (start, current, goal, change)
- Estimated weeks to goal
- Habit insights (gym vs non-gym weeks)

### History Tab
- All entries grouped by week
- Tap any entry to view/edit details
- Full modal editor for each day

## 🔧 Development Commands

```bash
# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint

# Fix linting issues
npm run lint:fix
```

## 💾 Data Storage

- All data is stored **locally** in your browser
- No server, no cloud, no tracking
- Data persists across sessions
- To reset: Clear browser data or reinstall PWA

### Backing Up Your Data

Your data is in browser LocalStorage under key `weight-tracker-v1`. To backup:

1. Open browser DevTools (F12)
2. Go to Application → Local Storage
3. Find `weight-tracker-v1`
4. Copy the value
5. Save it somewhere safe

To restore: Paste it back into LocalStorage.

## 📱 iOS Safari Tips

### If "Add to Home Screen" doesn't work:
1. Make sure you're using **Safari** (not Chrome/Firefox)
2. The site must be loaded via HTTPS (or localhost for dev)
3. Try clearing Safari cache and reload

### For best experience:
- Use Safari (not in-app browsers)
- Full screen works better in standalone mode
- Safe areas are handled automatically

## 🎨 Customization

### Change Theme Colors
Edit `vite.config.ts` and `index.html`:
- `theme_color`: Main theme color (default: `#2563eb` - blue)
- `background_color`: Splash screen background

### Change App Name
Edit `vite.config.ts` manifest:
- `name`: Full name (shown during install)
- `short_name`: Short name (shown under icon)

### Custom Icons
Replace files in `public/` folder:
- `pwa-192x192.svg` (or .png)
- `pwa-512x512.svg` (or .png)
- `apple-touch-icon.svg` (or .png)

## 🐛 Troubleshooting

### "White screen" on load:
- Check browser console for errors
- Make sure you ran `npm install`
- Try clearing browser cache

### Data disappeared:
- Check if LocalStorage was cleared
- Look for backup (see "Backing Up Your Data")
- iOS Safari in Private mode doesn't persist data

### Charts not showing:
- Make sure you've logged weight in at least 2 entries
- Check that weight values are valid numbers

### PWA not installing:
- Must be HTTPS (or localhost)
- Must have valid manifest
- Try hard refresh (Cmd+Shift+R)

## 📚 Tech Stack Reference

- **React 19** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool & dev server
- **Tailwind CSS v4** - Styling
- **React Router v7** - Navigation
- **Recharts** - Charts
- **vite-plugin-pwa** - PWA functionality

## 🤝 Need Help?

Check the main README.md for:
- Detailed project structure
- Data model documentation
- Browser compatibility
- API reference

Happy tracking! 🎉

