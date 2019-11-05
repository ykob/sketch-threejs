import * as THREE from 'three';
import sleep from 'js-util/sleep';

import Camera from './Camera';
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

// ==========
// Define unique variables
//
const auraObjs = new Array(3);
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
    renderer.setClearColor(0x0e0e0e, 1.0);

    for (var i = 0; i < auraObjs.length; i++) {
      scene.add(auraObjs[i]);
    }

    camera.start();
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

    // Update each objects.
    for (var i = 0; i < auraObjs.length; i++) {
      auraObjs[i].update(time, camera);
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
