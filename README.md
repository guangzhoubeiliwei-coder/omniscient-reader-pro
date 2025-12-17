# Omniscient Reader Pro

**Elite reading tracker for manga, manhwa, novels, and comics**

![Omniscient Reader Pro](./public/icon-512.png)

[![Deploy to GitHub Pages](https://github.com/YOUR_USERNAME/omniscient-reader-pro/actions/workflows/deploy.yml/badge.svg)](https://github.com/YOUR_USERNAME/omniscient-reader-pro/actions/workflows/deploy.yml)

## 🌟 Features

- ✅ **Offline-First** - Full functionality without internet
- 📊 **Reading Analytics** - Track progress, streaks, and statistics
- 🔍 **Online Search** - Optional API integration (MangaDex, AniList, Jikan, ComicVine)
- 🎨 **AMOLED Dark Theme** - Beautiful, battery-friendly interface
- 🔒 **Privacy-Focused** - No tracking, no analytics, your data stays local
- 📱 **PWA Ready** - Install as native app on any device
- 💾 **Export/Import** - Full data backup and restore

## 🚀 Live Demo

**GitHub Pages**: `https://YOUR_USERNAME.github.io/omniscient-reader-pro/`

## 📱 Install as App

### Android APK

1. Visit [PWA Builder](https://www.pwabuilder.com)
2. Enter the GitHub Pages URL
3. Click "Build My App" → Select "Android"
4. Download and install the APK

### iOS / Desktop

1. Open the GitHub Pages URL in your browser
2. Click "Add to Home Screen" (iOS) or install icon (Desktop)
3. App will work fully offline

## 🛠️ Development

### Prerequisites

- Node.js 20+ and npm
- Git

### Setup

```bash
# Clone the repository
git clone https://github.com/YOUR_USERNAME/omniscient-reader-pro.git
cd omniscient-reader-pro

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:8080`

### Build for Production

```bash
npm run build
```

Output will be in the `dist/` folder with all PWA assets.

### Test Locally

```bash
# Build first
npm run build

# Serve the dist folder
npx serve dist
```

## 📦 Deployment to GitHub Pages

### Automatic Deployment (Recommended)

The repository includes a GitHub Actions workflow that automatically deploys to GitHub Pages on every push to `main`.

1. **Create GitHub Repository**
   ```bash
   # Initialize git (if not already done)
   git init
   git add .
   git commit -m "Initial commit with PWA support"
   
   # Add remote and push
   git remote add origin https://github.com/YOUR_USERNAME/omniscient-reader-pro.git
   git branch -M main
   git push -u origin main
   ```

2. **Enable GitHub Pages**
   - Go to repository **Settings** → **Pages**
   - Under **Source**, select **GitHub Actions**
   - The workflow will automatically deploy on push

3. **Access Your App**
   - URL: `https://YOUR_USERNAME.github.io/omniscient-reader-pro/`
   - Wait 2-3 minutes for first deployment

### Manual Deployment

If you prefer manual deployment:

```bash
# Build the project
npm run build

# The dist/ folder is ready to deploy to any static hosting
```

## 🔧 Configuration

### Update Base Path

If your repository name is different from `omniscient-reader-pro`, update `vite.config.ts`:

```typescript
base: mode === 'production' ? '/YOUR-REPO-NAME/' : '/',
```

### PWA Manifest

Edit `public/manifest.json` to customize:
- App name and description
- Theme colors
- Icons
- Shortcuts

### Service Worker

Edit `public/sw.js` to customize:
- Cache strategy
- Cached assets
- Cache size limits

## 📊 PWA Features

### Manifest.json

- **Name**: Omniscient Reader Pro
- **Short Name**: OmniReader
- **Display**: Standalone (fullscreen app experience)
- **Theme Color**: #3b82f6 (blue)
- **Background**: #0a0a0a (AMOLED black)

### Service Worker

- **Strategy**: Cache-first with network fallback
- **Caches**: Static assets, dynamic content, images
- **Offline**: Full app functionality without internet
- **Updates**: Automatic background updates

### Icons

- **192x192**: For Android home screen
- **512x512**: For splash screens and high-res displays

## 🏗️ Tech Stack

- **Framework**: React 18 + TypeScript
- **Build Tool**: Vite 5
- **UI Components**: Radix UI + shadcn/ui
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Storage**: Browser localStorage
- **PWA**: Custom service worker + manifest

## 📝 Data Storage

All data is stored locally in your browser using localStorage:

- **Items**: Reading list with progress tracking
- **History**: Chapter reading history
- **Genres**: Custom genre tags
- **Settings**: App preferences

### Export/Import

- **Export**: Download JSON backup of all data
- **Import**: Restore from JSON backup
- **Format**: Human-readable JSON

## 🔒 Privacy & Security

- ✅ **No external servers** - All data stays on your device
- ✅ **No tracking** - Zero analytics or telemetry
- ✅ **No accounts** - No sign-up required
- ✅ **Offline-first** - Works without internet
- ✅ **Open source** - Full code transparency

Optional external APIs (user-controlled):
- MangaDex API (public, free)
- AniList API (public, free)
- Jikan API (public, free)
- ComicVine API (requires API key)

## 🐛 Troubleshooting

### Service Worker Not Registering

1. Check browser console for errors
2. Ensure you're using HTTPS or localhost
3. Clear browser cache and reload

### App Not Working Offline

1. Open DevTools → Application → Service Workers
2. Verify service worker is "activated and running"
3. Check Cache Storage for cached assets

### Build Errors

```bash
# Clear cache and reinstall
rm -rf node_modules dist
npm install
npm run build
```

## 📄 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📧 Support

For issues and questions, please open an issue on GitHub.

---

**Made with ❤️ for readers everywhere**

*Offline-first • Privacy-focused • No tracking • Your data, your control*
