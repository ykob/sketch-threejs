import * as THREE from 'three';
import sleep from 'js-util/sleep';

import PromiseTextureLoader from '../../common/PromiseTextureLoader';
import Camera from './Camera';
import Figure from './Figure';
import FigureFire from './FigureFire';

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
const figure = new Figure();
const figureFire = new FigureFire();

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
      PromiseTextureLoader('/sketch-threejs/img/sketch/burn/noise.png'),
    ]).then((response) => {
      const noiseTex = response[0];

      noiseTex.wrapS = THREE.RepeatWrapping;
      noiseTex.wrapT = THREE.RepeatWrapping;

      figure.start(noiseTex);
      figureFire.start(noiseTex);


      scene.add(figure);
      scene.add(figureFire);
    });

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
    figure.update(time);
    figureFire.update(time);

    // Render the 3D scene.
    renderer.render(scene, camera);
  }
  resize(resolution) {
    camera.resize(resolution);
    renderer.setSize(resolution.x, resolution.y);
    figure.resize(camera, resolution);
    figureFire.resize(camera, resolution);
  }
}
