# 🎯 Blind Attack 4

A Connect 4 game where you can't see the board until someone wins! Play against an AI with 4 difficulty levels, track your blunders, and replay games with animation.

## Features

✨ **Blind Gameplay** - Can't see the board during play, only the bot's last move
🤖 **Smart AI** - Choose from Easy, Medium, Hard, or Very Hard difficulty
🎯 **Blunder Detection** - Tracks when you miss a winning move
📽️ **Replay System** - Watch animated playback of your games step-by-step
📱 **Mobile Optimized** - Perfect for iPhone, installable as PWA

## How to Install on iPhone

### Option 1: Using a Local Server (Recommended)

1. **Install Python** (if not already installed) or use Node.js with `http-server`

2. **Navigate to the game folder:**
   ```bash
   cd blind-attack-4
   ```

3. **Start a local server:**
   
   Using Python:
   ```bash
   # Python 3
   python -m http.server 8000
   
   # Python 2
   python -m SimpleHTTPServer 8000
   ```
   
   Using Node.js (if you have it):
   ```bash
   npx http-server -p 8000
   ```

4. **On your iPhone:**
   - Connect to the same WiFi network as your computer
   - Find your computer's IP address:
     - Windows: Run `ipconfig` in Command Prompt
     - Mac/Linux: Run `ifconfig` or `ip addr`
   - Open Safari and go to: `http://YOUR_IP_ADDRESS:8000`
   - Example: `http://192.168.1.100:8000`

5. **Install as App:**
   - Tap the Share button (square with arrow) in Safari
   - Scroll down and tap "Add to Home Screen"
   - Name it "Blind Attack 4"
   - Tap "Add"

### Option 2: Deploy to GitHub Pages (Free Hosting)

1. Create a GitHub account if you don't have one
2. Create a new repository called "blind-attack-4"
3. Upload all files from the `blind-attack-4` folder
4. Go to repository Settings → Pages
5. Select "main" branch and save
6. Your app will be live at: `https://YOUR_USERNAME.github.io/blind-attack-4`
7. Open this URL in Safari on your iPhone and add to home screen

### Option 3: Deploy to Netlify (Easiest)

1. Go to [netlify.com](https://netlify.com) and sign up
2. Drag and drop the entire `blind-attack-4` folder
3. You'll get a live URL instantly
4. Open in Safari on iPhone and add to home screen

## Generating Icons

Before deploying, you need to generate the icon images:

1. Open `generate-icons.html` in your web browser
2. Click "Download 192x192 Icon" and save as `icon-192.png`
3. Click "Download 512x512 Icon" and save as `icon-512.png`
4. Place both icon files in the `blind-attack-4` folder

## How to Play

1. **Select Difficulty** - Choose from Easy, Medium, Hard, or Very Hard
2. **Start Game** - Begin playing blind!
3. **Make Your Move** - Click buttons 1-7 to drop your piece in that column
4. **Watch for Blunders** - The game tracks when you miss winning moves
5. **See Results** - When the game ends, you'll finally see the board!
6. **Watch Replay** - Step through or auto-play all moves

## Game Rules

- Connect 4 pieces in a row (horizontal, vertical, or diagonal) to win
- You play as Yellow (🟡), AI plays as Red (🔴)
- You cannot see the board during gameplay
- Only the bot's last move is shown (as a column number)
- Blunders are counted when you could have won but chose a different move

## Tech Stack

- **Pure HTML/CSS/JavaScript** - No frameworks needed
- **PWA (Progressive Web App)** - Installable on iPhone
- **Minimax AI** - With alpha-beta pruning for efficient gameplay
- **Canvas API** - For beautiful board rendering

## Project Structure

```
blind-attack-4/
├── index.html          # Main HTML structure
├── styles.css          # Mobile-optimized styles
├── game.js             # Connect 4 game logic & AI
├── app.js              # Application control & UI
├── manifest.json       # PWA manifest
├── service-worker.js   # PWA service worker for offline play
├── icon.svg            # SVG icon source
├── generate-icons.html # Icon generator tool
└── README.md           # This file
```

## Customization

### Change Difficulty Levels

Edit `game.js` and modify the `DIFFICULTY_LEVELS` object:

```javascript
const DIFFICULTY_LEVELS = {
    'easy': 2,      // Searches 2 moves ahead
    'medium': 4,    // Searches 4 moves ahead
    'hard': 6,      // Searches 6 moves ahead
    'very-hard': 8  // Searches 8 moves ahead
};
```

### Change Colors

Edit `styles.css` to change the gradient and colors:

```css
body {
    background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
}
```

### Adjust Board Size

Edit `game.js` constants:

```javascript
const ROWS = 6;
const COLS = 7;
```

## Browser Support

- ✅ Safari (iOS)
- ✅ Chrome (Android & Desktop)
- ✅ Firefox
- ✅ Edge

## License

Free to use and modify for personal projects!

## Credits

Created as a fun twist on the classic Connect 4 game. Enjoy playing blind! 🎯

