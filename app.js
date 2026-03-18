import * as THREE from "https://cdn.jsdelivr.net/npm/three@0.158/build/three.module.js";
import { ARButton } from "https://cdn.jsdelivr.net/npm/three@0.158/examples/jsm/webxr/ARButton.js";

let camera, scene, renderer;
let imagePlane;
let overlayMaterial;

init();

function init() {

scene = new THREE.Scene();

camera = new THREE.PerspectiveCamera();

renderer = new THREE.WebGLRenderer({
alpha: true,
antialias: true
});

renderer.setSize(window.innerWidth, window.innerHeight);
renderer.xr.enabled = true;

document.body.appendChild(renderer.domElement);


/* Lighting */

const light = new THREE.HemisphereLight(0xffffff, 0xbbbbff, 1);
scene.add(light);


/* Load overlay image */

const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("overlay.jpg");


/* Create AR image plane */

const geometry = new THREE.PlaneGeometry(0.5, 0.5);

overlayMaterial = new THREE.MeshBasicMaterial({
map: texture,
transparent: true,
opacity: 1
});

imagePlane = new THREE.Mesh(geometry, overlayMaterial);

/* Place 1 meter in front of user */

imagePlane.position.set(0, 0, -1);

scene.add(imagePlane);


/* DOM Overlay */

const overlay = document.getElementById("overlay");

const button = ARButton.createButton(renderer, {
requiredFeatures: ["local-floor"],
optionalFeatures: ["dom-overlay"],
domOverlay: { root: overlay }
});

button.style.display = "none";

document.body.appendChild(button);


/* Start AR button */

document.getElementById("startButton").onclick = () => {

document.getElementById("startButton").style.display = "none";

button.click();

};


/* Opacity slider */

const slider = document.getElementById("opacitySlider");

slider.addEventListener("input", (e) => {

overlayMaterial.opacity = parseFloat(e.target.value);

});


renderer.setAnimationLoop(render);

}


function render() {

renderer.render(scene, camera);

}