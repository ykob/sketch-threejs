import * as THREE from 'three';
import MathEx from 'js-util/MathEx';

import Camera from './Camera';
import Core from './Core';
import Trail from './Trail';

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
const trail = new Trail();
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
      core.start(noiseTex);
    })

    scene.add(core);
    scene.add(trail);

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
    trail.update(time, core);

    // Render the 3D scene.
    renderer.render(scene, camera);
  }
  resize(resolution) {
    camera.resize(resolution);
    renderer.setSize(resolution.x, resolution.y);
  }
  setCoreAnchor(resolution) {
    const corePositionZ = (vTouch.y / resolution.y * 2.0 - 1.0) * 70;
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
