# Quick Start Guide

Get your Historic AR Overlay app running in 5 minutes!

## 📋 What You Get

- ✅ World-locked AR overlay for images
- ✅ Works on Android & iOS with AR support
- ✅ Hosted on GitHub Pages (free)
- ✅ No backend or server needed
- ✅ Upload or link images
- ✅ Share with query parameters

## 🚀 Get Started Now

### 1. Local Testing (2 minutes)

```bash
# If you have Python:
python -m http.server 8000

# Then open: http://localhost:8000
```

Or just open `index.html` in a browser (limited functionality).

### 2. Deploy to GitHub Pages (3 minutes)

```bash
# Initialize and push to GitHub
git add .
git commit -m "Historic AR Overlay"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/Historic-AR-Overlay.git
git push -u origin main
```

Then in GitHub Settings → Pages:
- Select `main` branch
- Select `/(root)` folder
- Save

**Your app is now live at:**
```
https://YOUR_USERNAME.github.io/Historic-AR-Overlay
```

## 📱 Using the App

### On Desktop
1. Open `index.html` (limited - no AR)
2. Try uploading an image
3. See how the UI works

### On Mobile (Android/iOS)

1. **Visit**: `https://YOUR_USERNAME.github.io/Historic-AR-Overlay`

2. **Load Image**:
   - Enter URL and press Enter, OR
   - Click "📤 Upload Image" and select file

3. **Start AR**:
   - Tap "🚀 Start AR"
   - Grant camera permission
   - Overlay appears 1m in front of you

4. **Explore**:
   - Move around to see the overlay
   - It stays locked to the real world
   - Tap "🔄 Reset" to stop

## 🔗 Pre-Load Image

Share with an image already loaded:

```
https://YOUR_USERNAME.github.io/Historic-AR-Overlay/?image=https://example.com/photo.jpg
```

## 🎨 Customize

Edit files to customize:

- **`index.html`**: Change title, buttons, layout
- **`app.js`**: Change overlay size, distance, behavior
- **`README.md`**: Add your description

See [CONFIG.md](CONFIG.md) for detailed customization.

## 🐛 Troubleshooting

| Issue | Solution |
|-------|----------|
| AR not working | Ensure device has AR capability, use Chrome (Android) or Safari (iOS) |
| Image won't load | Check URL is public with CORS enabled, or upload a file |
| App not updating | Hard refresh browser (Ctrl+Shift+R), check GitHub Pages settings |
| Camera permission denied | Grant permission in browser settings |

## 📚 Documentation

- [README.md](README.md) - Full documentation
- [EXAMPLES.md](EXAMPLES.md) - Usage examples
- [CONFIG.md](CONFIG.md) - Customization guide
- [DEPLOYMENT.md](DEPLOYMENT.md) - Deployment details

## 🎯 Use Cases

- 📍 **Historical Overlays**: Show past vs. present locations
- 🏛️ **Museum AR**: Display artifacts and information
- 📚 **Education**: Overlay educational content
- 🗺️ **Geography**: Compare maps and landscapes
- 🎨 **Art**: Display artwork in real environments

## 💡 Pro Tips

1. Use images with transparent backgrounds for better blending
2. Compress images for faster loading on mobile
3. Test on an actual device with AR support
4. Share links with pre-loaded images for specific use cases
5. Check console (F12) for debugging errors

## ✨ What's Included

```
Historic-AR-Overlay/
├── index.html           # Main app UI
├── app.js              # AR functionality
├── README.md           # Full documentation
├── EXAMPLES.md         # Usage examples
├── CONFIG.md           # Customization guide
├── DEPLOYMENT.md       # Deployment instructions
├── QUICKSTART.md       # This file
└── .gitignore          # Git ignore file
```

## 🔐 Security & Privacy

- ✅ All processing happens in your browser
- ✅ No data sent to servers
- ✅ Camera feed never recorded or stored
- ✅ CORS and security headers handled automatically
- ✅ Hosted on GitHub (secure, trusted)

## 🚀 Next Steps

1. ✅ Test locally with Python server
2. ✅ Push to GitHub
3. ✅ Enable GitHub Pages
4. ✅ Test on mobile device
5. ✅ Customize styling and content
6. ✅ Share with others!

## ❓ Questions?

- Check the [README](README.md) for detailed info
- See [DEPLOYMENT.md](DEPLOYMENT.md) for hosting questions
- View [CONFIG.md](CONFIG.md) for customization help
- Check [EXAMPLES.md](EXAMPLES.md) for usage ideas

---

**Ready? Get started now!**

```bash
# Start local server
python -m http.server 8000

# Then visit: http://localhost:8000
```

Happy overlaying! 📍✨
