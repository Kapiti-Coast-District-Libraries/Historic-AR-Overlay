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
        
        this.init();
    }

    async init() {
        this.setupThreeJS();
        this.setupEventListeners();
        await this.checkARSupport();
        this.checkQueryParams();
        this.updateStatus('Ready to start AR session');
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
        
        // Renderer
        const canvas = document.getElementById('canvas');
        this.renderer = new THREE.WebGLRenderer({ 
            canvas, 
            antialias: true, 
            alpha: true,
            preserveDrawingBuffer: true
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
        if (!navigator.xr) {
            this.updateStatus('❌ WebXR not supported on this device', true);
            document.getElementById('startBtn').disabled = true;
            return;
        }

        try {
            const supported = await navigator.xr.isSessionSupported('immersive-ar');
            this.isARSupported = supported;
            
            if (supported) {
                this.updateStatus('✅ AR is supported! You can proceed.');
            } else {
                this.updateStatus('❌ AR is not supported on this device', true);
                document.getElementById('startBtn').disabled = true;
            }
        } catch (error) {
            console.error('AR Support Check Error:', error);
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
            
            const sessionInit = {
                requiredFeatures: ['hit-test', 'dom-overlay'],
                optionalFeatures: ['dom-overlay-for-handheld-ar', 'camera-access'],
                domOverlay: { root: document.body }
            };

            this.xrSession = await navigator.xr.requestSession('immersive-ar', sessionInit);
            
            this.xrRefSpace = await this.xrSession.requestReferenceSpace('local');
            
            // Handle session end
            this.xrSession.addEventListener('end', () => {
                this.xrSession = null;
                document.getElementById('startBtn').disabled = false;
                this.updateStatus('AR session ended. Start a new one to continue.');
            });
            
            // Start rendering loop
            this.renderer.xr.setSession(this.xrSession);
            this.startRenderLoop();
            
            this.updateStatus('✅ AR session active! Move around to see the overlay.');
            document.getElementById('startBtn').disabled = true;
            
        } catch (error) {
            console.error('AR Session Error:', error);
            this.updateStatus(`❌ Failed to start AR: ${error.message}`, true);
            this.xrSession = null;
            document.getElementById('startBtn').disabled = false;
        }
    }

    startRenderLoop() {
        this.renderer.xr.setAnimationLoop((time, frame) => {
            if (frame) {
                // Update overlay to be world-locked to the user's view
                if (this.overlayMesh && frame.session) {
                    try {
                        const pose = frame.getViewerPose(this.xrRefSpace);
                        if (pose) {
                            // Calculate position 1 meter in front of viewer
                            const forward = new THREE.Vector3(0, 0, -1);
                            const quat = new THREE.Quaternion().fromArray(pose.transform.orientation);
                            forward.applyQuaternion(quat);
                            
                            const viewPos = new THREE.Vector3().fromArray(pose.transform.position);
                            this.overlayMesh.position.copy(viewPos.add(forward));
                            
                            // Make overlay face user slightly tilted for better visibility
                            this.overlayMesh.lookAt(viewPos);
                        }
                    } catch (e) {
                        console.warn('Pose calculation error:', e);
                    }
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

        // Create a plane geometry for the image with proper aspect ratio handling
        const imageAspect = texture.image.width / texture.image.height;
        const width = 2;
        const height = width / imageAspect;
        
        const geometry = new THREE.PlaneGeometry(width, height);
        const material = new THREE.MeshBasicMaterial({ 
            map: texture,
            transparent: true,
            side: THREE.DoubleSide,
            toneMapped: false
        });
        
        this.overlayMesh = new THREE.Mesh(geometry, material);
        this.overlayMesh.position.set(0, 0, -1);
        
        this.scene.add(this.overlayMesh);
        this.updateStatus('✅ Overlay ready! Start AR to place it in the world.');
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
                this.xrSession = null;
                document.getElementById('startBtn').disabled = false;
                this.updateStatus('AR session ended. You can start a new one.');
            }).catch((err) => {
                console.error('Error ending session:', err);
                this.xrSession = null;
            });
        } else {
            document.getElementById('urlInput').value = '';
            document.getElementById('imageInput').value = '';
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
