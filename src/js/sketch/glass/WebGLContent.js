import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Camera from './Camera';
import Glass from './Glass';
import Background from './Background';

// ==========
// Define common variables
//
let renderer;
const scene = new THREE.Scene();
const camera = new Camera();
const clock = new THREE.Clock({
  autoStart: false
});
const objLoader = new OBJLoader();
const texLoader = new THREE.TextureLoader();

// ==========
// Define unique variables
//
let glass;
let controls;
const bg = new Background();
const renderTarget = new THREE.WebGLRenderTarget();

// ==========
// Define WebGLContent Class.
//
export default class WebGLContent {
  constructor() {
  }
  async start(canvas) {
    renderer = new THREE.WebGL1Renderer({
      alpha: true,
      antialias: true,
      canvas: canvas,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x0e0e0e, 1.0);
    
    controls = new OrbitControls(camera, renderer.domElement);
    controls.dampingFactor = 0.1;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    
    await Promise
      .all([
        objLoader.loadAsync('/sketch-threejs/model/glass/glass.obj'),
        texLoader.loadAsync('/sketch-threejs/img/sketch/glass/landscape.jpg'),
        texLoader.loadAsync('/sketch-threejs/img/sketch/glass/roughness.jpg'),
        texLoader.loadAsync('/sketch-threejs/img/sketch/glass/noise.jpg')
      ])
      .then((response) => {
        response[2].wrapT = response[2].wrapS = THREE.RepeatWrapping;
        response[3].wrapT = response[3].wrapS = THREE.RepeatWrapping;
        glass = new Glass(response[0].children[0].geometry);
        glass.start(renderTarget.texture, response[2], response[3]);
        bg.start(response[1]);
      });
      scene.add(glass);
      scene.add(bg);
      camera.start();
  }
  play() {
    clock.start();
    this.update();
  }
  pause() {
    clock.stop();
  }
  update() {
    // When the clock is stopped, it stops the all rendering too.
    if (clock.running === false) return;

    // Calculate msec for this frame.
    const time = clock.getDelta();

    // Update Camera.
    camera.update(time);

    // Update each objects.
    glass.update(time);

    // Render the 3D scene.
    glass.visible = false;
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);
    glass.visible = true;
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);

    controls.update();
  }
  resize(resolution) {
    camera.resize(resolution);
    glass.resize(resolution);
    renderer.setSize(resolution.x, resolution.y);
    renderTarget.setSize(resolution.x, resolution.y);
  }
}
