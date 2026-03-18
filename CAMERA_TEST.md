# Testing AR Camera

## Quick Debug Checklist

Before deploying, test locally with:

```bash
python -m http.server 8000
# Visit: http://localhost:8000
```

Open **DevTools** (F12) and check the **Console** tab for these messages:

### Expected Console Output

```
=== Historic AR Overlay Initializing ===
✅ navigator.xr is available
Three.js initialized
Event listeners attached
Checking AR support...
✅ Immersive AR is supported!
=== Initialization Complete ===
✅ AR is supported! You can proceed.
```

### If You See Errors

#### Error: "navigator.xr is undefined"
- **Cause**: Device doesn't support WebXR
- **Solution**: 
  - Use a phone with AR support (Android 8+ with Chrome, or iPhone 6S+ with Safari 15+)
  - Check browser version is up to date

#### Error: "Immersive AR is NOT supported"
- **Cause**: Specific browser or device limitation
- **Solution**:
  - Try different browser (Chrome on Android, Safari on iOS)
  - Check if device has ARCore/ARKit installed

#### Controls Still Visible in AR
- **Issue**: This is now fixed - they should hide when AR starts
- **If still see them**: Hard refresh browser (Ctrl+Shift+R)

#### Error During Session Start
- Check console for specific error name
- Try different lighting conditions
- Restart browser

## Testing with Different Images

1. **Upload local file** - Fastest testing
2. **Use URL** - Test external images
3. **Check file size** - Smaller = faster loading

## Performance Notes

- First AR session takes a few seconds to initialize
- Allow device time to validate camera permissions
- Good lighting improves AR tracking

## What Should Happen

1. Load image → Status shows ✅ Overlay ready
2. Press "🚀 Start AR" → Controls hide
3. Camera view appears → Image floats in front 50cm away
4. See both camera feed AND image overlaid
5. Press "🔄 Reset" → Controls reappear

## If Camera Feed Doesn't Appear

Try these in order:

1. **Check browser console** (F12) for errors
2. **Grant camera permission** if prompted
3. **Hard refresh** page (Ctrl+Shift+R)
4. **Test on different URL**:
   - localhost works (development)
   - GitHub Pages works (HTTPS required)
   - Use HTTPS URLs if not localhost
5. **Try different browser**
6. **Close and reopen browser**

## Next: QR Code Integration

Once camera works, you'll integrate:

1. QR code detection library
2. Read position/rotation from QR
3. Place image at QR-detected location
4. User will align phone with QR codes at historic sites

See [README.md](README.md) for full documentation.
