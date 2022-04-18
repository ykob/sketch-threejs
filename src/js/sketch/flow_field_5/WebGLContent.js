import * as THREE from 'three';
import { MathEx } from '@ykob/js-util';

import Camera from './Camera';
import Core from './Core';
import Mover from './Mover';
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

// ==========
// Define unique variables
//
const core = new Core();
const mover = new Mover();
const bg = new Background();
const texLoader = new THREE.TextureLoader();
const vTouch = new THREE.Vector2();
let isTouched = false;

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
      core.start(noiseTex);
      mover.start(renderer, noiseTex);
      bg.start(noiseTex);
    })

    scene.add(core);
    scene.add(mover);
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
    core.update(time, camera);
    mover.update(renderer, time, core);
    bg.update(time);

    // Render the 3D scene.
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  }
  resize(resolution) {
    camera.resize(resolution);
    bg.resize(camera, resolution);
    renderer.setSize(resolution.x, resolution.y);
  }
  setCoreAnchor(resolution) {
    const corePositionZ =
      (vTouch.x / resolution.x * 2.0 - 1.0) * 150 +
      (vTouch.y / resolution.y * 2.0 - 1.0) * 150;
    const height = Math.abs(
      (camera.position.z - corePositionZ) *
        Math.tan(MathEx.radians(camera.fov) / 2) *
        2
    );
    const width = height * camera.aspect;

    core.anchor.set(
      (vTouch.x / resolution.x - 0.5) * width,
      -(vTouch.y / resolution.y - 0.5) * height,
      corePositionZ
    );
  }
  touchStart(e, resolution) {
    if (!e.touches) e.preventDefault();

    vTouch.set(
      (e.touches) ? e.touches[0].clientX : e.clientX,
      (e.touches) ? e.touches[0].clientY : e.clientY
    );
    isTouched = true;
    this.setCoreAnchor(resolution);
  }
  touchMove(e, resolution) {
    if (!e.touches) e.preventDefault();

    if (isTouched === true) {
      vTouch.set(
        (e.touches) ? e.touches[0].clientX : e.clientX,
        (e.touches) ? e.touches[0].clientY : e.clientY
      );
      this.setCoreAnchor(resolution);
    }
  }
  touchEnd() {
    core.anchor.set(0, 0, 0);
    isTouched = false;
  }
}
