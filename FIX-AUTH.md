# 🔐 Fix GitHub Authentication

## Problem
Git is using credentials for `marc17044` but you're trying to push to `mem7635/blind-attack-4`.

## Solution: Clear Cached Credentials

### Option 1: Use GitHub Desktop (EASIEST)
1. Download GitHub Desktop: https://desktop.github.com/
2. Sign in with your mem7635 account
3. File → Add Local Repository
4. Select: `C:\Users\Marc\Desktop\attach4\blind-attack-4`
5. Click "Publish repository"
6. Done! ✅

### Option 2: Clear Windows Credentials (Command Line)

Run these commands in PowerShell:

```powershell
# Clear cached Git credentials
git credential-manager erase https://github.com

# Or clear from Windows Credential Manager
cmdkey /delete:git:https://github.com
```

Then try pushing again - it will ask for new credentials:
```bash
git push -u origin main
```

### Option 3: Use Personal Access Token

1. Go to: https://github.com/settings/tokens
2. Click "Generate new token" → "Classic"
3. Give it a name: "Blind Attack 4"
4. Check: `repo` (all)
5. Click "Generate token"
6. **COPY THE TOKEN** (you won't see it again!)

Then push with:
```bash
git push -u origin main
```

When prompted:
- Username: `mem7635`
- Password: `paste-your-token-here`

### Option 4: Configure Git to Use Correct Account

```bash
# Set your Git identity for this project
git config user.name "mem7635"
git config user.email "your-email@example.com"

# Clear credential cache
git config --unset credential.helper

# Try pushing again
git push -u origin main
```

## Which Option Should You Choose?

- **Easiest:** Option 1 (GitHub Desktop)
- **Quickest:** Option 3 (Personal Access Token)
- **Most control:** Option 2 (Clear credentials)

## After Successfully Pushing

You'll see output like:
```
Enumerating objects: 18, done.
Counting objects: 100% (18/18), done.
...
To https://github.com/mem7635/blind-attack-4.git
 * [new branch]      main -> main
```

Then continue to enable GitHub Pages!

