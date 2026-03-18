// Query parameter handler
function getQueryParam(name) {
    const url = new URL(window.location);
    return url.searchParams.get(name);
}

// AR Overlay Application
class AROverlay {
    constructor() {
        this.scene = null;
        this.camera = null;
        this.renderer = null;
        this.xrSession = null;
        this.xrRefSpace = null;
        this.overlayMesh = null;
        this.imageTexture = null;
        this.isARSupported = false;
        this.selectedImageUrl = null;
        this.overlayWorldPosition = null; // Fixed world position for overlay
        this.cameraFeedCanvas = null;
        
        this.init();
    }

    async init() {
        console.log('=== Historic AR Overlay Initializing ===');
        this.setupThreeJS();
        console.log('Three.js initialized');
        this.setupEventListeners();
        console.log('Event listeners attached');
        await this.checkARSupport();
        this.checkQueryParams();
        this.updateStatus('Ready to start AR session');
        console.log('=== Initialization Complete ===');
    }

    setupThreeJS() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = null; // Transparent background for AR
        
        // Camera - will be replaced by XR camera
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            1000
        );
        this.camera.position.z = 0;
        
        // Renderer
        const canvas = document.getElementById('canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas, 
            antialias: true, 
            alpha: true,
            preserveDrawingBuffer: true,
            xrCompatible: true
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(window.devicePixelRatio);
        this.renderer.xr.enabled = true;
        
        // Lighting
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        this.scene.add(ambientLight);
        
        const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
        directionalLight.position.set(5, 10, 7);
        this.scene.add(directionalLight);
        
        // Handle window resize
        window.addEventListener('resize', () => this.onWindowResize());
    }

    setupEventListeners() {
        document.getElementById('startBtn').addEventListener('click', () => this.startARSession());
        document.getElementById('resetBtn').addEventListener('click', () => this.reset());
        document.getElementById('uploadBtn').addEventListener('click', () => {
            document.getElementById('imageInput').click();
        });
        
        document.getElementById('imageInput').addEventListener('change', (e) => {
            this.handleFileUpload(e);
        });
        
        document.getElementById('urlInput').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                const url = document.getElementById('urlInput').value.trim();
                if (url) {
                    this.loadImageFromURL(url);
                }
            }
        });
    }

    checkQueryParams() {
        // Check for image URL in query parameters
        const imageUrl = getQueryParam('image');
        if (imageUrl) {
            document.getElementById('urlInput').value = imageUrl;
            this.loadImageFromURL(imageUrl);
        }
    }

    async checkARSupport() {
        console.log('Checking AR support...');
        
        if (!navigator.xr) {
            console.error('❌ WebXR not available - navigator.xr undefined');
            this.updateStatus('❌ WebXR not supported on this device', true);
            document.getElementById('startBtn').disabled = true;
            return;
        }

        console.log('✅ navigator.xr is available');

        try {
            const supported = await navigator.xr.isSessionSupported('immersive-ar');
            this.isARSupported = supported;
            
            console.log('AR Session Support Check Result:', supported);
            
            if (supported) {
                console.log('✅ Immersive AR is supported!');
                this.updateStatus('✅ AR is supported! You can proceed.');
                document.getElementById('startBtn').disabled = false;
            } else {
                console.error('❌ Immersive AR is NOT supported on this device');
                this.updateStatus('❌ AR is not supported on this device', true);
                document.getElementById('startBtn').disabled = true;
            }
        } catch (error) {
            console.error('AR Support Check Error:', error);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            this.updateStatus('⚠️ Error checking AR support: ' + error.message, true);
            document.getElementById('startBtn').disabled = true;
        }
    }

    async startARSession() {
        if (!this.isARSupported) {
            this.updateStatus('AR is not supported on this device', true);
            return;
        }

        if (!this.overlayMesh) {
            this.updateStatus('❌ Please load an image first', true);
            return;
        }

        try {
            this.updateStatus('🔄 Initializing AR session...');
            console.log('Requesting immersive-ar session...');
            
            // Minimal configuration for better compatibility
            const sessionInit = {
                requiredFeatures: ['local'],
                optionalFeatures: []
            };

            console.log('Session init config:', sessionInit);
            this.xrSession = await navigator.xr.requestSession('immersive-ar', sessionInit);
            console.log('✅ XR Session created:', this.xrSession);
            
            this.xrRefSpace = await this.xrSession.requestReferenceSpace('local');
            console.log('✅ Reference space created');
            
            // Handle session end
            this.xrSession.addEventListener('end', () => {
                console.log('XR Session ended');
                this.xrSession = null;
                this.showControls();
                document.getElementById('startBtn').disabled = false;
                this.updateStatus('AR session ended. Start a new one to continue.');
            });

            this.xrSession.addEventListener('select', () => {
                console.log('XR Select event');
            });
            
            // Hide controls during AR
            this.hideControls();
            
            // Start rendering loop
            if (this.renderer.xr.setSession) {
                this.renderer.xr.setSession(this.xrSession);
                console.log('Renderer XR session set');
            }
            this.startRenderLoop();
            
            this.updateStatus('✅ AR Camera Active! Image placed in front of you.');
            document.getElementById('startBtn').disabled = true;
            
        } catch (error) {
            console.error('AR Session Error:', error);
            console.error('Error name:', error.name);
            console.error('Error message:', error.message);
            console.error('Error stack:', error.stack);
            this.updateStatus(`❌ Failed to start AR: ${error.message}`, true);
            this.xrSession = null;
            document.getElementById('startBtn').disabled = false;
        }
    }

    hideControls() {
        // Hide UI controls during AR session
        const ui = document.getElementById('ui');
        if (ui) {
            ui.style.display = 'none';
        }
    }

    showControls() {
        // Show UI controls when AR ends
        const ui = document.getElementById('ui');
        if (ui) {
            ui.style.display = 'flex';
        }
    }

    startRenderLoop() {
        this.renderer.xr.setAnimationLoop((time, frame) => {
            if (frame) {
                try {
                    const pose = frame.getViewerPose(this.xrRefSpace);
                    
                    // Place overlay directly in front of user (hardcoded position)
                    if (this.overlayMesh) {
                        if (!this.overlayWorldPosition) {
                            // First frame: calculate initial position directly in front
                            this.overlayWorldPosition = new THREE.Vector3(0, 0, -0.5);
                            console.log('Overlay positioned at:', this.overlayWorldPosition);
                        }
                        
                        // Keep overlay at fixed position (appears to float in front)
                        this.overlayMesh.position.copy(this.overlayWorldPosition);
                    }
                } catch (e) {
                    console.warn('Render loop error:', e);
                }

                this.renderer.render(this.scene, this.camera);
            }
        });
    }

    loadImageFromURL(url) {
        if (!url.trim()) {
            this.updateStatus('Please enter a valid URL', true);
            return;
        }

        this.updateStatus('🔄 Loading image from URL...');
        const textureLoader = new THREE.TextureLoader();
        
        textureLoader.load(
            url,
            (texture) => {
                this.selectedImageUrl = url;
                this.createOverlay(texture);
                this.updateStatus('✅ Image loaded! Tap "🚀 Start AR" to begin.');
            },
            (progress) => {
                const percent = (progress.loaded / progress.total * 100).toFixed(0);
                this.updateStatus(`🔄 Loading... ${percent}%`);
            },
            (error) => {
                console.error('Texture loading error:', error);
                this.updateStatus('❌ Failed to load image. Check URL or try uploading a file.', true);
            }
        );
    }

    handleFileUpload(event) {
        const file = event.target.files[0];
        if (!file) return;

        this.updateStatus('🔄 Loading image from file...');
        const reader = new FileReader();
        
        reader.onload = (e) => {
            const canvas = document.createElement('canvas');
            const img = new Image();
            
            img.onload = () => {
                canvas.width = img.width;
                canvas.height = img.height;
                const ctx = canvas.getContext('2d');
                ctx.drawImage(img, 0, 0);
                
                const texture = new THREE.CanvasTexture(canvas);
                texture.minFilter = THREE.LinearFilter;
                texture.magFilter = THREE.LinearFilter;
                
                this.selectedImageUrl = file.name;
                this.createOverlay(texture);
                this.updateStatus('✅ Image loaded! Tap "🚀 Start AR" to begin.');
            };
            
            img.onerror = () => {
                this.updateStatus('❌ Failed to load image file', true);
            };
            
            img.src = e.target.result;
        };
        
        reader.onerror = () => {
            this.updateStatus('❌ Failed to read file', true);
        };
        
        reader.readAsDataURL(file);
    }

    createOverlay(texture) {
        // Remove previous overlay if it exists
        if (this.overlayMesh) {
            this.scene.remove(this.overlayMesh);
        }

        this.imageTexture = texture;

        // Create a plane geometry for the image with proper aspect ratio
        // Size it to be a good viewing size when placed directly in front of user
        const imageAspect = texture.image.width / texture.image.height;
        const height = 1.5; // 1.5 meters tall
        const width = height * imageAspect;
        
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({ 
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
            toneMapped: false
        });
        
        this.overlayMesh = new THREE.Mesh(geometry, material);
        // Position will be set during AR rendering
        
        this.scene.add(this.overlayMesh);
        this.updateStatus('✅ Overlay ready! Tap "🚀 Start AR" to see it.');
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    updateStatus(message, isError = false) {
        const status = document.getElementById('status');
        status.textContent = message;
        status.className = isError ? 'error' : 'success';
        console.log(message);
    }

    reset() {
        if (this.xrSession) {
            this.xrSession.end().then(() => {
                console.log('XR Session ended by user');
                this.xrSession = null;
                this.overlayWorldPosition = null;
                this.showControls();
                document.getElementById('startBtn').disabled = false;
                this.updateStatus('AR session ended. You can start a new one.');
            }).catch((err) => {
                console.error('Error ending session:', err);
                this.xrSession = null;
                this.overlayWorldPosition = null;
                this.showControls();
                document.getElementById('startBtn').disabled = false;
            });
        } else {
            document.getElementById('urlInput').value = '';
            document.getElementById('imageInput').value = '';
            this.overlayWorldPosition = null;
            document.getElementById('repositionBtn').style.display = 'none';
            if (this.overlayMesh) {
                this.scene.remove(this.overlayMesh);
                this.overlayMesh = null;
            }
            this.updateStatus('Reset. Ready to load a new image and start AR.');
            document.getElementById('startBtn').disabled = false;
        }
    }
}

// Initialize app when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    new AROverlay();
});
