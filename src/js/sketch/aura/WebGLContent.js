import * as THREE from 'three';
import sleep from 'js-util/sleep';

import Camera from './Camera';
import CameraAura from './CameraAura';
import AuraObject from './AuraObject';

// ==========
// Define common variables
//
let renderer;
const scene = new THREE.Scene();
const camera = new Camera();
const clock = new THREE.Clock({
  autoStart: false
});
const sceneAura = new THREE.Scene();
const cameraAura = new CameraAura();

// ==========
// Define unique variables
//
const auraObjs = new Array(6);
for (var i = 0; i < auraObjs.length; i++) {
  const alpha = i / auraObjs.length;
  auraObjs[i] = new AuraObject(alpha);
}

// ==========
// Define WebGLContent Class.
//
export default class WebGLContent {
  constructor() {
  }
  start(canvas) {
    renderer = new THREE.WebGLRenderer({
      alpha: true,
      antialias: true,
      canvas: canvas,
    });
    renderer.setPixelRatio(window.devicePixelRatio);
    renderer.setClearColor(0x000000, 1.0);

    for (var i = 0; i < auraObjs.length; i++) {
      scene.add(auraObjs[i]);
    }

    camera.start();
    cameraAura.start();
    for (var i = 0; i < auraObjs.length; i++) {
      auraObjs[i].start();
    }
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
    cameraAura.update(camera);

    // Update each objects.
    for (var i = 0; i < auraObjs.length; i++) {
      auraObjs[i].update(time, renderer, sceneAura, camera, cameraAura);
    }

    // Render the 3D scene.
    renderer.render(scene, camera);
  }
  resize(resolution) {
    camera.resize(resolution);
    for (var i = 0; i < auraObjs.length; i++) {
      auraObjs[i].resize(camera);
    }
    renderer.setSize(resolution.x, resolution.y);
  }
}
