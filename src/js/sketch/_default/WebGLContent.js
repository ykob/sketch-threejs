import * as THREE from 'three';
import sleep from 'js-util/sleep';

import Camera from './Camera';

// ==========
// Define common variables
//
let renderer;
const scene = new THREE.Scene();
const camera = new THREE.Camera();
const clock = new THREE.Clock({
  autoStart: false
});

// ==========
// Define unique variables
//

// ==========
// Define WebGLContent Class.
//
extend default class WebGLContent {
  constructor() {
  }
  start(canvas) {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: canvas,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x0e0e0e, 1.0);

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

    // Update each objects.

    // Render the 3D scene.
    renderer.render(scene, camera);
  }
  resize(resolution) {
    canvas.width = resolution.x;
    canvas.height = resolution.y;
    camera.resize(resolution);
    renderer.setSize(resolution.x, resolution.y);
  }
}
