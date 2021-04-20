import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';

import Camera from './Camera';
import CameraAura from './CameraAura';
import AuraSkull from './AuraSkull';
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
const sceneAura = new THREE.Scene();
const cameraAura = new CameraAura();
const objLoader = new OBJLoader();
const texLoader = new THREE.TextureLoader();

// ==========
// Define unique variables
//
const auraSkull = new AuraSkull();
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
    renderer.setClearColor(0x000000, 1.0);

    await Promise.all([
      objLoader.loadAsync('/sketch-threejs/model/skull/SkullHead.obj'),
      texLoader.loadAsync('/sketch-threejs/img/sketch/splash/noise.png'),
    ]).then((response) => {
      const geometrySkullHead = response[0].children[1].geometry;
      const geometrySkullJaw = response[0].children[0].geometry;
      const noiseTex = response[1];

      noiseTex.wrapS = THREE.RepeatWrapping;
      noiseTex.wrapT = THREE.RepeatWrapping;

      camera.start();
      cameraAura.start();

      auraSkull.start(geometrySkullHead, geometrySkullJaw, noiseTex);
      bg.start();

      scene.add(auraSkull);
      scene.add(bg);
    });
  }
  play() {
    clock.start();
    this.update();
  }
  pause() {
    clock.stop();
  }
  update(dd) {
    // When the clock is stopped, it stops the all rendering too.
    if (clock.running === false) return;

    // Calculate msec for this frame.
    const time = clock.getDelta();

    // Update Camera.
    camera.update(time);
    cameraAura.update(camera);

    // Update each objects.
    auraSkull.update(time, renderer, camera, sceneAura, cameraAura, dd);

    // Render the 3D scene.
    renderer.render(scene, camera);
  }
  resize(resolution) {
    camera.resize(resolution);
    auraSkull.resize(resolution);
    renderer.setSize(resolution.x, resolution.y);
  }
}
