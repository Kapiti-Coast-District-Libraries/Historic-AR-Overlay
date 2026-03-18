# 📍 Historic AR Overlay

A web-based AR application that places world-locked image overlays in augmented reality. Built with Three.js and WebXR, it runs entirely in the browser and can be hosted on GitHub Pages.

## Features

✨ **World-Locked AR Overlay** - Images stay positioned in the real world  
📱 **Mobile-First** - Works on smartphones and tablets with ARCore/ARKit  
🌐 **No Backend Required** - Fully client-side, runs anywhere  
🖼️ **Flexible Image Loading** - Load images via URL or file upload  
🚀 **GitHub Pages Ready** - Deploy directly from this repository  

## Requirements

- **Browser**: Chrome, Firefox, Safari, or Edge (latest versions)
- **Device**: Smartphone or tablet with AR capabilities (ARCore on Android, ARKit on iOS)
- **WebXR Support**: Check [caniuse.com/webxr](https://caniuse.com/webxr) for device compatibility

## How to Use

### Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/Historic-AR-Overlay.git
   cd Historic-AR-Overlay
   ```

2. Open `index.html` in a modern web browser, or serve it with a local server:
   ```bash
   python -m http.server 8000
   # or
   npx http-server
   ```

3. Access at `http://localhost:8000`

### On Your Device

1. **Load an Image**:
   - Enter an image URL in the text input and press Enter, OR
   - Click "📤 Upload Image" to select a local file

2. **Start AR**:
   - Tap "🚀 Start AR" to begin the augmented reality session
   - Grant camera permissions when prompted

3. **View the Overlay**:
   - The image will appear as a world-locked overlay
   - Move around to see it from different angles
   - The overlay stays positioned in the world

4. **Reset**:
   - Click "🔄 Reset" to end the AR session or clear images

## Deploying to GitHub Pages

### Step 1: Create a GitHub Repository
```bash
# If starting fresh
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/yourusername/Historic-AR-Overlay.git
git push -u origin main
```

### Step 2: Enable GitHub Pages
1. Go to your repository on GitHub
2. Navigate to **Settings** → **Pages**
3. Under "Source", select **Deploy from a branch**
4. Select **main** branch and **/(root)** folder
5. Click **Save**

### Step 3: Access Your App
Your app will be available at: `https://yourusername.github.io/Historic-AR-Overlay/`

### Using with a Specific Image
You can pass an image URL as a query parameter:
```
https://yourusername.github.io/Historic-AR-Overlay/?image=https://example.com/image.jpg
```

## Technical Details

### Architecture
- **Three.js** - 3D scene and rendering
- **WebXR API** - Augmented reality capabilities
- **HTML5 Canvas** - Real-time rendering
- **Fetch API** - Image loading

### World-Locked Overlay
The overlay is positioned 1 meter in front of the user and moves with their head position, creating the effect that it's locked to the real world. The mesh updates based on the viewer's pose relative to the reference space.

### Browser Compatibility

| Browser | Android | iOS |
|---------|---------|-----|
| Chrome  | ✅      | ⚠️  |
| Firefox | ✅      | ❌  |
| Safari  | -       | ✅  |
| Samsung Internet | ✅ | - |

*Note: iOS support requires iOS 15+ with AR capabilities enabled*

## Troubleshooting

### "WebXR not supported"
- Ensure you're using a compatible device and browser
- Try Chrome or Samsung Internet on Android
- Try Safari on iOS 15+
- Check if your device has AR capabilities

### "Failed to load image"
- Ensure image URL is publicly accessible
- Check CORS headers on the image server
- Try uploading the image file instead

### Camera permission issues
- Grant camera permissions when prompted
- Check browser privacy settings
- Ensure HTTPS is being used (required for camera access)

## Customization

### Changing the Overlay Size
Edit `app.js` and modify the PlaneGeometry dimensions:
```javascript
const geometry = new THREE.PlaneGeometry(2, 2); // Change 2, 2 to desired width, height
```

### Adjusting Overlay Distance
Modify the z-position in `app.js`:
```javascript
this.overlayMesh.position.set(0, 0, -1); // Change -1 to desired distance in meters
```

### Styling
Edit the CSS in `index.html` to customize the UI appearance.

## License

MIT License - feel free to use, modify, and distribute.

## Contributing

Got ideas for improvements? Open an issue or submit a pull request!

---

**Note**: This application requires a modern browser with WebXR support and a device with AR capabilities. It works best on recent Android or iOS devices.
