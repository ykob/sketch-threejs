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
        texLoader.loadAsync('/sketch-threejs/img/sketch/glass/landscape.jpg')
      ])
      .then((response) => {
        glass = new Glass(response[0].children[0].geometry);
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
    controls.update();

    // Render the 3D scene.
    renderer.render(scene, camera);
  }
  resize(resolution) {
    camera.resize(resolution);
    renderer.setSize(resolution.x, resolution.y);
  }
}
