import * as THREE from 'three';

import Camera from './Camera';
import Plane from './Plane';

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
const plane = new Plane();
const texLoader = new THREE.TextureLoader();

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

    await Promise.all([
      texLoader.loadAsync('/sketch-threejs/img/sketch/flow_field/noise.jpg'),
    ])
    .then(response => {
      const noiseTex = response[0];

      noiseTex.wrapS = THREE.RepeatWrapping;
      noiseTex.wrapT = THREE.RepeatWrapping;
      noiseTex.format = THREE.RGBFormat;
      noiseTex.type = THREE.FloatType;
      noiseTex.minFilter = THREE.NearestFilter;
      noiseTex.magFilter = THREE.NearestFilter;
      plane.start(noiseTex);
    })

    scene.add(plane);

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
    plane.update(time);

    // Render the 3D scene.
    renderer.render(scene, camera);
  }
  resize(resolution) {
    camera.resize(resolution);
    renderer.setSize(resolution.x, resolution.y);
  }
}
