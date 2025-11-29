# 📱 Installation Guide - Blind Attack 4 for iPhone

## 🎯 What You Got

I've built you a complete **Progressive Web App (PWA)** called "Blind Attack 4" - a Connect 4 game where you can't see the board until someone wins!

### ✨ Features Implemented:

✅ **Blind Gameplay** - Board is hidden during play  
✅ **Bot's Last Move Display** - Only shows the column number (1-7)  
✅ **4 Difficulty Levels** - Easy, Medium, Hard, Very Hard  
✅ **Blunder Detection** - Tracks missed winning moves  
✅ **Replay System** - Animated step-through of all moves  
✅ **Mobile-Optimized UI** - Perfect for iPhone  
✅ **Installable as App** - Works like a native iOS app  
✅ **Works Offline** - After first install, no internet needed  

## 🚀 Installation Methods (Choose One)

### Method 1: Quick Test (ACTIVE NOW!) ⚡

**The server is already running!**

1. **On your iPhone:**
   - Connect to the same WiFi as this computer
   - Open Safari
   - Go to: `http://192.168.0.18:8000`
   - Play immediately!

2. **To install as app:**
   - Tap the Share button in Safari
   - Select "Add to Home Screen"
   - Tap "Add"

**Server Commands:**
- To stop: Press `Ctrl+C` in the terminal
- To restart: `cd blind-attack-4` then `python -m http.server 8000`

---

### Method 2: GitHub Pages (FREE Forever) 🆓

**Best for permanent hosting without keeping your computer on.**

1. **Create GitHub Account** (if you don't have one)
   - Go to [github.com](https://github.com)
   - Sign up for free

2. **Create New Repository**
   - Click "+" → "New repository"
   - Name: `blind-attack-4`
   - Make it Public
   - Click "Create repository"

3. **Upload Your Files**
   - Click "uploading an existing file"
   - Drag all files from `blind-attack-4` folder
   - Click "Commit changes"

4. **Enable GitHub Pages**
   - Go to Settings → Pages
   - Source: Deploy from branch "main"
   - Click "Save"
   - Wait 1-2 minutes

5. **Access Your App**
   - URL: `https://YOUR-USERNAME.github.io/blind-attack-4`
   - Open in Safari on iPhone
   - Add to Home Screen

---

### Method 3: Netlify (EASIEST!) 🌐

**Literally drag and drop - done in 30 seconds.**

1. **Go to [netlify.com](https://www.netlify.com)**
   - Sign up (free)

2. **Deploy**
   - Drag the entire `blind-attack-4` folder onto Netlify
   - Wait 10 seconds
   - Get instant URL like: `https://random-name.netlify.app`

3. **Install on iPhone**
   - Open URL in Safari
   - Add to Home Screen

4. **Optional: Custom Domain**
   - Can change the URL to something like `blind-attack-4.netlify.app`

---

### Method 4: Vercel (Also Super Easy) ⚡

1. Go to [vercel.com](https://vercel.com)
2. Sign up with GitHub
3. Import your GitHub repository
4. Deploy automatically
5. Get URL, add to iPhone

---

## 🎮 How to Play

### Game Setup
1. Open the app
2. Select difficulty (Easy = AI thinks 2 moves ahead, Very Hard = 8 moves ahead)
3. Tap "Start Game"

### During Gameplay
- **You are Yellow** 🟡
- **Bot is Red** 🔴
- Tap buttons **1-7** to drop your piece in that column (1 = leftmost)
- You **cannot see the board** while playing!
- Only the **bot's last move** is shown as a number
- **Blunders** are tracked (when you miss a winning move)

### After Game Ends
- **See the full board** for the first time!
- Check your **total moves** and **blunders**
- **Watch Replay** - Step through or auto-play all moves
- Start a new game or change difficulty

## 🎯 Strategy Tips for Playing Blind

1. **Keep Mental Notes** - Try to remember where you've played
2. **Watch Bot Patterns** - The bot's moves tell you something
3. **Start Center** - Columns 3, 4, 5 offer most opportunities
4. **Count Your Moves** - Know how many pieces you've placed
5. **Practice Easy First** - Build your mental game before going harder

## 📁 Project Structure

```
blind-attack-4/
├── index.html              Main HTML structure
├── styles.css              Beautiful mobile-first design
├── game.js                 Connect 4 engine + Minimax AI
├── app.js                  UI control & replay system
├── manifest.json           PWA configuration
├── service-worker.js       Offline functionality
├── icon-192.png            Small app icon
├── icon-512.png            Large app icon
├── icon.svg                Vector icon source
├── generate-icons.html     Icon generator tool
├── create_icons.py         Python icon generator
├── README.md               Full documentation
├── QUICK-START.md          Quick reference
└── INSTALLATION-GUIDE.md   This file
```

## 🔧 Troubleshooting

### Can't Connect from iPhone?

1. **Check WiFi** - Both devices must be on same network
2. **Try alternate IP** - Use `192.168.56.1:8000` instead
3. **Disable Firewall** - Temporarily to test
4. **Use deployment** - Try GitHub Pages or Netlify instead

### Server Won't Start?

```bash
# Make sure you're in the right folder
cd blind-attack-4

# Try Python 3
python -m http.server 8000

# Or try Python 2
python -m SimpleHTTPServer 8000

# Or use Node.js
npx http-server -p 8000
```

### Icons Not Showing?

```bash
# Regenerate icons
cd blind-attack-4
python create_icons.py
```

Or open `generate-icons.html` in browser and download manually.

### Game Not Working?

1. Open browser console (F12)
2. Check for JavaScript errors
3. Ensure all files are in same folder
4. Try hard refresh (Ctrl+Shift+R or Cmd+Shift+R)

## 🎨 Customization

### Change Colors

Edit `styles.css`:
```css
body {
    background: linear-gradient(135deg, #YOUR_COLOR_1 0%, #YOUR_COLOR_2 100%);
}
```

### Adjust AI Difficulty

Edit `game.js`:
```javascript
const DIFFICULTY_LEVELS = {
    'easy': 2,      // Lower = easier
    'medium': 4,
    'hard': 6,
    'very-hard': 8  // Higher = harder
};
```

### Change Board Size

Edit `game.js`:
```javascript
const ROWS = 6;  // Change to 5 or 7
const COLS = 7;  // Change to 6 or 8
```

## 📊 Tech Stack Details

**Frontend:**
- Pure HTML5, CSS3, JavaScript (ES6+)
- No frameworks = Fast & lightweight (~30KB total!)
- Canvas API for board rendering

**AI:**
- Minimax algorithm with alpha-beta pruning
- Depth-based difficulty (2-8 moves lookahead)
- Position evaluation heuristics

**PWA:**
- Service Worker for offline caching
- Web App Manifest for installation
- Responsive design (mobile-first)

**Browser Support:**
- ✅ Safari (iOS 11.3+)
- ✅ Chrome (all platforms)
- ✅ Firefox
- ✅ Edge

## 🆘 Need Help?

If something isn't working:

1. Check all files are in `blind-attack-4` folder
2. Verify icons were generated (`icon-192.png`, `icon-512.png`)
3. Try deployment methods (GitHub Pages/Netlify) instead of local server
4. Open browser console to see error messages

## 🎉 You're All Set!

Your app is complete and ready to play! Choose your installation method above and start playing Blind Attack 4 on your iPhone! 

**Current Status:** ✅ Local server running at `http://192.168.0.18:8000`

Enjoy the game! 🎯🎮

