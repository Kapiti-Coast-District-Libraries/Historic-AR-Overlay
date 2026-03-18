# Architecture & Technical Details

## Overview

The Historic AR Overlay is a browser-based AR application that combines modern web technologies to deliver world-locked augmented reality experiences without requiring any backend infrastructure.

## Technology Stack

### Frontend Technologies

```
┌─────────────────────────────────────────┐
│     Historic AR Overlay Web App         │
├─────────────────────────────────────────┤
│  HTML5 • CSS3 • JavaScript (ES6+)       │
├─────────────────────────────────────────┤
│  Three.js (3D Graphics Engine)          │
│  WebXR API (AR/VR Support)              │
│  Canvas 2D Context (Image Processing)   │
├─────────────────────────────────────────┤
│  Modern Web Browser                     │
│  (Chrome, Firefox, Safari, Edge)        │
└─────────────────────────────────────────┘
```

### Key Libraries

1. **Three.js** (r128)
   - 3D scene management
   - WebGL rendering
   - Material and geometry handling
   - Camera and lighting

2. **WebXR API** (W3C Standard)
   - AR session creation
   - Device pose tracking
   - Hit testing support
   - Reference space management

3. **HTML5 Canvas**
   - Real-time rendering
   - Image texture handling
   - Pixel-level operations

## Architecture Diagram

```
┌──────────────────────────────────────────────────┐
│              User Interface Layer                │
│  ┌────────────────────────────────────────────┐  │
│  │ HTML UI: Buttons, Input Fields, Status    │  │
│  └────────────────────────────────────────────┘  │
└─────────────────┬──────────────────────────────┘
                  │
┌─────────────────┴──────────────────────────────┐
│           Application Layer (app.js)           │
│  ┌────────────────────────────────────────────┐ │
│  │ AROverlay Class: Main Application Logic   │ │
│  │ • Session Management                      │ │
│  │ • Event Handling                          │ │
│  │ • State Management                        │ │
│  └────────────────────────────────────────────┘ │
└─────────────────┬──────────────────────────────┘
                  │
        ┌─────────┴──────────┬──────────────┐
        │                    │              │
┌───────▼────────┐  ┌───────▼────────┐  ┌──▼──────────┐
│  Three.js      │  │    WebXR       │  │  File I/O   │
│  Scene Graph   │  │    Device      │  │  Image Load │
│  Rendering     │  │    Tracking    │  │  User Input │
└────────────────┘  └────────────────┘  └─────────────┘
        │                    │              │
        └─────────────────┬──┴──────────────┘
                          │
        ┌─────────────────▼──────────────────┐
        │ WebGL Renderer (Canvas)            │
        │ • AR Camera Feed                   │
        │ • 3D Mesh Overlay                  │
        └────────────────────────────────────┘
```

## Data Flow

### Image Loading Flow

```
User Input
    │
    ├─► URL Input ──► Fetch Image ──┐
    │                                 │
    └─► File Upload ──► Read File ───┤
                                      │
                      Decode Image ◄──┘
                          │
                          ▼
                  Create Canvas Texture
                          │
                          ▼
                  Configure Material
                          │
                          ▼
                  Create Mesh Geometry
                          │
                          ▼
                  Add to Scene
                          │
                          ▼
                    Ready for AR
```

### AR Session Flow

```
User Taps "Start AR"
        │
        ▼
Check WebXR Support
        │
        ├─ Supported ─► Request Session ─► Grant Permissions
        │                    │
        │                    ▼
        │           Initialize Reference Space
        │                    │
        │                    ▼
        │           Setup Animation Loop
        │                    │
        │                    ▼
        │           Track Device Pose
        │                    │
        │                    ▼
        ├─────► Update Overlay Position
        │                    │
        │                    ▼
        │              Render Frame
        │                    │
        │                    └─► Repeat
        │
        └─ Not Supported ─► Show Error
```

### World-Locking Algorithm

```
Every Frame:
    1. Get device pose from WebXR reference space
    2. Extract position (P) and orientation (Q)
    3. Calculate forward vector: V = (0, 0, -1)
    4. Rotate forward by device orientation: V' = V rotated by Q
    5. Mesh position = P + V'
    6. Mesh orientation = lookAt(P)
    
Result: Overlay appears 1 meter in front of user
        at all times, stays locked to world coordinates
```

## Component Details

### AROverlay Class

The main application controller with these responsibilities:

```javascript
AROverlay {
    // State Management
    - scene (THREE.Scene)
    - camera (THREE.PerspectiveCamera)
    - renderer (THREE.WebGLRenderer)
    - xrSession (WebXR Session)
    - overlayMesh (THREE.Mesh)
    
    // Core Methods
    - init() - Initialize app
    - setupThreeJS() - Configure 3D engine
    - checkARSupport() - Verify AR capabilities
    - startARSession() - Begin AR experience
    - startRenderLoop() - Animation loop
    - loadImageFromURL() - Load remote image
    - handleFileUpload() - Load local file
    - createOverlay() - Create 3D mesh
    - reset() - Clean up and reset state
    
    // Utilities
    - updateStatus() - Update UI status
    - onWindowResize() - Handle resize
}
```

## Rendering Pipeline

```
1. Scene Setup
   └─► Create THREE.Scene
   └─► Add lights (ambient + directional)
   └─► Setup camera (will be replaced by XR)

2. Image Loading
   └─► Load texture from URL/file
   └─► Create PlaneGeometry with aspect ratio
   └─► Create MeshBasicMaterial
   └─► Create Mesh and add to scene

3. AR Initialization
   └─► Request WebXR session (immersive-ar)
   └─► Create reference space (local)
   └─► Attach session to renderer

4. Render Loop
   └─► Get viewer pose
   └─► Calculate overlay position
   └─► Update mesh transform
   └─► Render with WebGLRenderer
   └─► Repeat at ~60 FPS

5. Reference Frame
   └─► Viewer position: P
   └─► Viewer orientation: Q
   └─► Target: Mesh 1m in front facing viewer
```

## WebXR Integration

### XR Session Features Used

- **immersive-ar**: Augmented Reality mode
- **hit-test**: Intersection detection (optional)
- **dom-overlay**: UI overlay on camera view
- **local reference space**: World-locked coordinates

### Device Pose Tracking

```
WebXR provides per-frame:
- Position (x, y, z) in world space
- Orientation (quaternion) rotated from world
- View matrices for stereo rendering (if applicable)

We use these to position overlays relative to device
```

## Performance Considerations

### Optimization Techniques

1. **Texture Management**
   - Apply filters for quality
   - Handle CORS for external images
   - Support data URLs for uploaded files

2. **Rendering**
   - Use WebGL hardware acceleration
   - Single mesh for overlay (not multiple)
   - Efficient material properties

3. **Memory**
   - Reuse geometries when possible
   - Clean up meshes when resetting
   - Limit active listeners

4. **Mobile Optimization**
   - Hardware-accelerated rendering
   - Efficient pose calculations
   - Minimal DOM updates

## Browser Compatibility

### Desktop Browsers
| Feature | Chrome | Firefox | Safari | Edge |
|---------|--------|---------|--------|------|
| Three.js | ✅ | ✅ | ✅ | ✅ |
| WebGL | ✅ | ✅ | ✅ | ✅ |
| WebXR AR | ⚠️ | ⚠️ | ⚠️ | ⚠️ |

*WebXR AR requires compatible headset or mobile device*

### Mobile Browsers
| Feature | Chrome (Android) | Firefox (Android) | Safari (iOS) |
|---------|------------------|-------------------|--------------|
| Three.js | ✅ | ✅ | ✅ |
| WebGL | ✅ | ✅ | ✅ |
| WebXR AR | ✅* | ✅* | ✅ (15+) |

*Requires ARCore (Google) or ARKit (Apple) support*

## Security & Privacy

### Client-Side Only
- No server involved
- All processing in user's browser
- No data transmission

### Privacy Features
- Camera feed never stored
- Image URLs never logged
- No tracking or analytics
- HTTPS required for camera access

### CORS Handling
- External images must have proper CORS headers
- File uploads work without CORS restrictions
- Same-origin resources always work

## File Structure

```
Historic-AR-Overlay/
├── index.html              # UI and initialization
├── app.js                  # Core application logic
├── README.md              # Main documentation
├── QUICKSTART.md          # Getting started guide
├── DEPLOYMENT.md          # GitHub Pages setup
├── CONFIG.md              # Customization guide
├── EXAMPLES.md            # Usage examples
├── ARCHITECTURE.md        # This file
└── .gitignore             # Git configuration
```

## Dependencies

### External Libraries
- **Three.js r128** - 3D Graphics (CDN)
  ```
  https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js
  ```

### Browser APIs
- **WebXR Device API** - AR capabilities (built-in)
- **Canvas 2D** - Image handling (built-in)
- **FileReader API** - File upload (built-in)
- **Fetch API** - Image loading (built-in)

## Scalability

### Current Limitations
- Single overlay mesh
- Static image (no video)
- No multi-user support
- One AR session at a time

### Potential Enhancements
- Multiple overlays
- Video texture support
- Networking for shared experiences
- Persistent world anchors
- Physics simulation
- Hand tracking integration

## Development Notes

### Adding Features

1. **New Properties**
   ```javascript
   this.newProperty = initialValue; // In constructor
   ```

2. **New Methods**
   ```javascript
   methodName() {
       // Implementation
   }
   ```

3. **Event Listeners**
   ```javascript
   element.addEventListener('event', () => this.method());
   ```

4. **Rendering Pipeline**
   ```javascript
   // Update in startRenderLoop
   if (this.overlayMesh) {
       // Custom logic
   }
   ```

### Debugging

- Open DevTools: F12
- Check console for errors
- Use `console.log()` for debugging
- Monitor WebXR events
- Test on actual AR device when possible

## Performance Metrics

Typical Performance Characteristics:
- **Load Time**: 2-5 seconds (depends on image)
- **Frame Rate**: 60 FPS (on capable devices)
- **Memory Usage**: 50-100 MB typical
- **CPU Usage**: 15-30% typical
- **Battery Impact**: Moderate (camera + rendering)

---

For implementation questions, see [CONFIG.md](CONFIG.md)
For deployment questions, see [DEPLOYMENT.md](DEPLOYMENT.md)
For usage examples, see [EXAMPLES.md](EXAMPLES.md)
