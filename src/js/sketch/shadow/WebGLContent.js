import * as THREE from 'three';
import { sleep } from '@ykob/js-util';

import Camera from './Camera';
import Blob from './Blob';
import Floor from './Floor';
import DirectionalLight from './DirectionalLight';

// ==========
// Define common variables
//
let renderer;
const scene = new THREE.Scene();
const camera = new Camera();
const clock = new THREE.Clock({
  autoStart: false
});

// ==========
// Define unique variables
//
const blob = new Blob();
const floor = new Floor();
const dirLight1 = new DirectionalLight();
const dirLight2 = new DirectionalLight();

// ==========
// Define WebGLContent Class.
//
export default class WebGLContent {
  constructor() {
  }
  start(canvas) {
    renderer = new THREE.WebGL1Renderer({
      alpha: true,
      antialias: true,
      canvas: canvas,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x0e0e0e, 1.0);
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;

    blob.start();
    floor.start();

    dirLight1.position.set(-10, 16, 10);
    dirLight2.position.set(10, 16, -10);

    scene.add(blob);
    scene.add(floor);
    scene.add(dirLight1);
    scene.add(dirLight2);

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
    blob.update(time);
    floor.update(time);
    dirLight1.update(time);
    dirLight2.update(time);

    // Render the 3D scene.
    renderer.render(scene, camera);
  }
  resize(resolution) {
    camera.resize(resolution);
    renderer.setSize(resolution.x, resolution.y);
  }
}
