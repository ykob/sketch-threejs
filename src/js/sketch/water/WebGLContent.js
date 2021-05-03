import * as THREE from 'three';

import Camera from './Camera';
import Water from './Water';

// ==========
// Define common variables
//
let renderer;
const scene = new THREE.Scene();
const camera = new Camera();
const clock = new THREE.Clock({
  autoStart: false
});
const texLoader = new THREE.TextureLoader();

// ==========
// Define unique variables
//
const water = new Water();

// ==========
// Define WebGLContent Class.
//
export default class WebGLContent {
  constructor() {
  }
  async start(canvas) {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: canvas,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0xf9f9f9, 1.0);

    await Promise
      .all([
        texLoader.loadAsync('/sketch-threejs/img/sketch/water/normal.jpg')
      ])
      .then((response) => {
        response[0].wrapT = response[0].wrapS = THREE.RepeatWrapping;
        water.start(response[0]);
      });
      camera.start();
      scene.add(water);
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
    water.update(time);

    // Render the 3D scene.
    renderer.render(scene, camera);
  }
  resize(resolution) {
    camera.resize(resolution);
    renderer.setSize(resolution.x, resolution.y);
  }
}
