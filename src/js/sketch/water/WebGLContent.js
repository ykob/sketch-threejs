import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Camera from './Camera';
import Water from './Water';
import Image from './Image';
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
const texLoader = new THREE.TextureLoader();

// ==========
// Define unique variables
//
const water = new Water();
const image = new Image();
const bg = new Background();
const renderTarget = new THREE.WebGLRenderTarget();
let controls;

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

    controls = new OrbitControls(camera, renderer.domElement);
    controls.dampingFactor = 0.1;
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.enableZoom = false;
    controls.maxPolarAngle = Math.PI / 180 * 80;

    await Promise
      .all([
        texLoader.loadAsync('/sketch-threejs/img/sketch/water/normal.jpg'),
        texLoader.loadAsync('/sketch-threejs/img/sketch/water/image.jpg')
      ])
      .then((response) => {
        response[0].wrapT = response[0].wrapS = THREE.RepeatWrapping;
        water.start(renderTarget.texture, response[0]);
        image.start(response[1]);
      });
      camera.start();
      scene.add(image);
      scene.add(water);
      scene.add(bg);
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
    water.visible = false;
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);
    water.visible = true;
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);

    controls.update();
  }
  resize(resolution) {
    camera.resize(resolution);
    water.resize(resolution);
    renderer.setSize(resolution.x, resolution.y);
    renderTarget.setSize(resolution.x, resolution.y);
  }
}
