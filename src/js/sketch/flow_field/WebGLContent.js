import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';

import Camera from './Camera';
import Line from './Line';
import Mover from './Mover';
import Points from './Points';

// ==========
// Define common variables
//
let renderer;
let controls;
const scene = new THREE.Scene();
const camera = new Camera();
const clock = new THREE.Clock({
  autoStart: false
});

// ==========
// Define unique variables
//
const line = new Line();
const mover = new Mover();
const points = new Points();
const texLoader = new THREE.TextureLoader();

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
    controls = new OrbitControls(camera, renderer.domElement);

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
      mover.start(renderer, noiseTex);
      line.start(noiseTex, mover.multiTime);
      points.start(noiseTex, mover.multiTime);
    })

    scene.add(line);
    scene.add(mover);
    scene.add(points);

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
    line.update(time);
    mover.update(renderer, time);
    points.update(time);

    // Render the 3D scene.
    renderer.setRenderTarget(null);
    renderer.render(scene, camera);
  }
  resize(resolution) {
    camera.resize(resolution);
    line.resize(resolution);
    mover.resize(resolution);
    points.resize(resolution);
    renderer.setSize(resolution.x, resolution.y);
  }
}
