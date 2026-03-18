# Troubleshooting & Camera Issues

## Camera Not Working

### Common Causes & Solutions

#### 1. WebXR Not Supported
**Error**: "WebXR not supported on this device"

**Solution**:
- Use a device with AR capabilities (ARCore on Android, ARKit on iOS)
- Use a supported browser:
  - **Android**: Chrome, Firefox, Samsung Internet
  - **iOS**: Safari 15+ (requires iOS 15+)
- Desktop browsers don't support immersive AR

**Check Support**:
```javascript
// Open DevTools console and run:
navigator.xr ? console.log("WebXR available") : console.log("WebXR not available");
navigator.xr.isSessionSupported('immersive-ar').then(supported => {
    console.log("AR supported:", supported);
});
```

#### 2. Permission Issues
**Error**: "Failed to start AR" or camera doesn't activate

**Solution**:
1. Check if camera permissions are granted:
   - Android: Settings > Apps > [App] > Permissions > Camera
   - iOS: Settings > [App] > Camera
2. HTTPS is required for camera access (not available on `file://`)
3. Grant permission when prompted
4. Try a different browser

#### 3. HTTPS Required
**Issue**: Works on localhost, fails on GitHub Pages or domain

**Solution**:
- Camera access only works with HTTPS
- `http://localhost:8000` works (exception)
- GitHub Pages automatically uses HTTPS ✅
- Deploy to HTTPS-enabled server

#### 4. Reference Space Issues
**Error**: "Failed to create reference space"

**Solution**:
- Try reloading the page
- Close and reopen the browser
- Update your device OS and browser
- Check if immersive AR sessions have quota limits on your device

#### 5. Viewport/Session Issues
**Error**: "Session ended immediately" or overlay not visible

**Solution**:
- Ensure sufficient lighting (poor lighting can affect AR tracking)
- Don't rotate device rapidly
- Allow app to initialize fully before moving
- Check console for specific error messages

---

## Debugging Steps

### Step 1: Check WebXR Support
Open browser DevTools (F12) and run in console:

```javascript
if (navigator.xr) {
    console.log("✅ WebXR API available");
    navigator.xr.isSessionSupported('immersive-ar').then(supported => {
        console.log("✅ Immersive AR supported:", supported);
    }).catch(err => {
        console.error("❌ AR check failed:", err);
    });
} else {
    console.log("❌ WebXR not available");
}
```

### Step 2: Check Browser Console
1. **Open DevTools**: F12 or Ctrl+Shift+I
2. **Look for errors** in the Console tab
3. **Check warnings** about permissions or features
4. Copy error messages and search for solutions

### Step 3: Test Image Loading
```javascript
// In console:
const img = new Image();
img.onload = () => console.log("✅ Image loaded");
img.onerror = () => console.error("❌ Image failed to load");
img.src = "your-image-url-here";
```

### Step 4: Test on Different Device/Browser

| Device | Browser | Status | Note |
|--------|---------|--------|------|
| Android Phone | Chrome | ✅ Best | Requires ARCore |
| Android Phone | Firefox | ✅ Good | Requires ARCore |
| iPhone | Safari | ✅ Good | Requires iOS 15+ |
| iPad | Safari | ✅ Good | Requires iPadOS 15+ |
| Desktop | Chrome | ❌ No AR | Can test non-AR features |
| Desktop (headset) | Chrome | ✅ Works | With VR headset |

### Step 5: Enable Verbose Logging
The app logs to console automatically. Check for:

```
✅ AR is supported
🔄 Initializing AR session...
✅ AR session active
✅ Overlay placed at world position
```

If you see ❌ messages, these indicate problems.

---

## Testing Locally

### Best Practice: Use Python HTTP Server

```bash
# In project directory:
python -m http.server 8000

# Visit:
# http://localhost:8000

# Note: Camera will work on localhost
```

### Why Not Just Open HTML File?
- ❌ Permissions don't work (`file://` protocol)
- ❌ Some APIs are restricted
- ❌ Canvas origins mismatch
- ✅ Use HTTP server instead

---

## Mobile Testing

### For Development
1. **Option A**: Use ngrok to tunnel localhost
```bash
pip install ngrok
ngrok http 8000
# Share the HTTPS URL with your phone
```

2. **Option B**: Test on GitHub Pages
Deploy to GitHub Pages and access from phone

3. **Option C**: Use Android debugging (if developer)
```bash
adb reverse tcp:8000 tcp:8000  # Android
# Then visit http://localhost:8000 on device
```

### Testing Checklist
- [ ] Device has good lighting
- [ ] Camera permissions granted
- [ ] Browser is up to date
- [ ] Network is stable
- [ ] URL is HTTPS (except localhost)
- [ ] Device has AR-capable hardware
- [ ] Image URL is publicly accessible

---

## Known Limitations

### Device Support
- Older Android devices may not have ARCore
- Older iPhones (pre-iPhone 6S) don't support AR
- Some Android devices don't have compass calibration

### Browser Limitations
- Desktop browsers don't support immersive AR
- Some browsers have limited WebXR support
- Private browsing may restrict permissions

### Environmental Factors
- Poor lighting reduces AR tracking quality
- Fast movement may lose tracking
- Featureless surfaces (plain walls) are harder to track
- Reflective surfaces cause issues

---

## If AR Still Doesn't Work

### Last Resort Options

1. **Fall Back to Non-AR Mode**:
   Create a 2D preview that doesn't require AR

2. **Try Different Device**:
   Test on another phone to rule out device issues

3. **Check Specific Device Support**:
   Visit [caniuse.com/webxr](https://caniuse.com/webxr) for device compatibility

4. **Report Issues**:
   Check browser error logs and WebXR specs

---

## Error Messages Reference

| Error | Cause | Solution |
|-------|-------|----------|
| "WebXR not supported" | Device/browser incompatibility | Use supported device/browser |
| "Immersive AR not supported" | Device lacks AR capability | Use ARCore/ARKit device |
| "Permission denied" | Camera access denied | Grant camera permission |
| "NotAllowedError" | Security/privacy restriction | Check HTTPS, permissions |
| "NotSupportedError" | Feature not available | Try different browser |
| "InvalidStateError" | Session already running | Close previous session |
| "AbortError" | User canceled or error occurred | Try again, check console |

---

## Performance Tips

### If AR is Laggy
1. **Close background apps** to free memory
2. **Reduce image resolution** before uploading
3. **Lower device brightness** to reduce GPU load
4. **Move to well-lit area** for better tracking
5. **Clear browser cache** (F12 > Application > Clear storage)

### If Images Load Slowly
1. **Compress images** before uploading
2. **Use smaller dimensions** (< 2MB recommended)
3. **Check network speed** (WiFi recommended, not cellular)
4. **Use CDN for URLs** instead of local servers

---

## Still Having Issues?

1. **Check the console log** (F12) for specific errors
2. **Compare with working example** - try official WebXR demos
3. **Test different images** - verify it's not image-specific
4. **Try different device** - check if it's hardware-specific
5. **Review this guide** - common solutions listed above

For more details, see [README.md](README.md) or [ARCHITECTURE.md](ARCHITECTURE.md)
