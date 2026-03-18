# Usage Examples

Here are some ways to use the Historic AR Overlay web app:

## Basic Usage

### Self-Hosted (Local)
1. Clone the repository
2. Open `index.html` in your browser
3. Upload an image or enter an image URL
4. Tap "Start AR" to begin

### GitHub Pages
Visit: `https://yourusername.github.io/Historic-AR-Overlay/`

## Advanced Usage

### Pre-Load Image via Query Parameter

You can automatically load an image when the page loads by adding the `image` query parameter:

```
https://yourusername.github.io/Historic-AR-Overlay/?image=https://example.com/my-image.jpg
```

#### Examples:

1. **Historic Building Photo**
   ```
   ?image=https://upload.wikimedia.org/wikipedia/commons/example.jpg
   ```

2. **Museum Artifact**
   ```
   ?image=https://example-museum.org/exhibits/artifact.png
   ```

3. **Local Artwork**
   ```
   ?image=file:///path/to/image.jpg
   ```
   *(Note: Local files must be served via HTTP/HTTPS, not `file://`)*

### Sharing

Once you've configured an image URL, you can share the link:

**Example Share Links:**
- Individual event: `https://yourusername.github.io/Historic-AR-Overlay/?image=...`
- GitHub Pages URL: Share the base URL for users to upload their own images

## Use Cases

### 1. Historical Overlays
Display historical photos at their original locations to compare past and present.

### 2. Museum Exhibits
Show artifact images or historical reconstructions overlaid on AR view.

### 3. Educational Content
Overlay historical maps, diagrams, or educational images for learning.

### 4. Geographic Documentation
Compare historical and current terrain, landmarks, or modifications.

### 5. Event Documentation
Project event photos or announcements in real-world AR view.

## Tips

- **Best Results**: Use images with transparent backgrounds for blending with the real world
- **Aspect Ratio**: The overlay maintains the image's aspect ratio
- **Distance**: The overlay appears 1 meter in front of the viewer
- **Performance**: Lower resolution images load faster on mobile devices
- **CORS**: Ensure images are from sources that allow CORS or uploaded as files
- **Mobile**: Works best on recent Android (Chrome) or iOS (Safari) devices

## Troubleshooting

### Image not loading?
1. Check the image URL is publicly accessible
2. Ensure it supports CORS
3. Try uploading a local file instead
4. Check browser console for error messages

### AR not starting?
1. Ensure device has AR capabilities
2. Use a supported browser (Chrome/Firefox on Android, Safari on iOS)
3. Grant camera permissions
4. Try a different image file

### Overlay not visible?
1. Ensure AR session has started
2. Move device around to look for the overlay
3. Try resetting and reloading
4. Check if image loaded successfully (status should show ✅)
