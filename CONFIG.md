# Configuration Guide

## Customizing the AR Overlay App

This guide shows how to customize various aspects of the Historic AR Overlay web app.

## HTML Customization

Edit `index.html` to modify the UI:

### Change App Title
```html
<title>Your Custom Title</title>
```

### Modify Header
```html
<h1>📍 Your Custom Header</h1>
```

### Update Help Text
```html
<div id="info">
    <p>Your custom instructions here</p>
</div>
```

### Style Changes
Edit the `<style>` section to customize:
- Colors
- Button styling
- Layout
- Typography

---

## JavaScript Customization

Edit `app.js` to modify behavior:

### Change Overlay Distance
The overlay appears at different distances. Modify in `startRenderLoop()`:

```javascript
// Default: 1 meter in front
const forward = new THREE.Vector3(0, 0, -1);
// Change to 2 meters: new THREE.Vector3(0, 0, -2);
```

### Change Overlay Size
Modify in `createOverlay()`:

```javascript
const width = 2;  // Change this value (in meters)
const height = width / imageAspect;
```

### Adjust Lighting
Modify ambient and directional light intensity in `setupThreeJS()`:

```javascript
// Brighter
const ambientLight = new THREE.AmbientLight(0xffffff, 2.0);

// Darker
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
```

### Enable Debug Mode
Add logging throughout the app to track what's happening:

```javascript
// Add to any method:
console.log('Debug info:', variableName);
```

---

## Feature Customization

### Add Custom Initial Image
In `index.html`, pre-populate the input:

```html
<input 
    type="text" 
    id="urlInput" 
    placeholder="Enter image URL or use file upload"
    value="https://example.com/default-image.jpg"
>
```

### Add New Buttons
In `index.html` controls section:

```html
<button id="myButton">🎨 My Custom Button</button>
```

In `app.js`:

```javascript
document.getElementById('myButton').addEventListener('click', () => {
    // Your custom function
});
```

### Modify UI Colors

In `index.html` CSS:

```css
button {
    background: #FF6B6B;  /* Change to your color */
}

button:hover {
    background: #FF5252;  /* Change to your hover color */
}
```

---

## Performance Optimization

### For Large Images
Compress images or use lower resolution versions:

```javascript
// In createOverlay(), before creating mesh:
texture.minFilter = THREE.LinearFilter;
texture.magFilter = THREE.LinearFilter;
```

### For Low-End Devices
Reduce rendering quality:

```javascript
this.renderer.setPixelRatio(0.5);  // In setupThreeJS()
```

---

## Advanced Customization

### Multiple Overlays
Add support for multiple images:

```javascript
this.overlays = [];  // Store multiple meshes

// Add overlay:
this.overlays.push(mesh);

// Update render loop to handle all overlays
```

### Animation
Add animations to overlays:

```javascript
// In startRenderLoop():
if (this.overlayMesh) {
    this.overlayMesh.rotation.y += 0.01;  // Rotate
}
```

### Transparency Control
Allow users to adjust overlay opacity:

```javascript
// In HTML:
<input type="range" id="opacitySlider" min="0" max="1" step="0.1" value="1">

// In JS:
document.getElementById('opacitySlider').addEventListener('input', (e) => {
    if (this.overlayMesh) {
        this.overlayMesh.material.opacity = e.target.value;
    }
});
```

---

## Environment Variables

Currently, the app is fully client-side with no backend needed. For future server integration:

1. Create a `.env` file (if using build tools)
2. Add variables as needed
3. Update documentation

---

## Testing Customizations

1. **Local Testing**: Serve with `python -m http.server` or similar
2. **Mobile Testing**: Use ngrok to tunnel local server to mobile
3. **Console Checking**: Open DevTools (F12) to see errors

---

## Common Issues

### Changes Not Appearing
- Clear browser cache (Ctrl+Shift+Delete)
- Use Ctrl+Shift+R for hard refresh
- Check console for syntax errors (F12)

### Performance Issues
- Reduce image resolution
- Lower pixel ratio
- Optimize geometry complexity

### AR Not Working After Changes
- Ensure all THREE.js code is valid
- Check WebXR features are still requested
- Test in a supported browser/device

---

For more examples, see [EXAMPLES.md](EXAMPLES.md)
