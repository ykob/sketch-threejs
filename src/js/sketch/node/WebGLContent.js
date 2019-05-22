import * as THREE from 'three';
import sleep from 'js-util/sleep';

import NodePoints from './NodePoints';

const canvas = document.getElementById('canvas-webgl');
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  canvas: canvas,
});
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera();
const cameraResolution = new THREE.Vector2();
const clock = new THREE.Clock({
  autoStart: false
});

const nodePoints = new NodePoints();

const resizeCamera = (resolution) => {
  if (resolution.x > resolution.y) {
    cameraResolution.set(
      (resolution.x >= 1200) ? 1200 : resolution.x,
      (resolution.x >= 1200) ? 800 : resolution.x * 0.66,
    );
  } else {
    cameraResolution.set(
      ((resolution.y >= 1200) ? 800 : resolution.y * 0.66) * 0.6,
      ((resolution.y >= 1200) ? 1200 : resolution.y) * 0.6,
    );
  }
  camera.setViewOffset(
    cameraResolution.x,
    cameraResolution.y,
    (resolution.x - cameraResolution.x) / -2,
    (resolution.y - cameraResolution.y) / -2,
    resolution.x,
    resolution.y
  );
  camera.updateProjectionMatrix();
};

export default class WebGLContent {
  constructor() {
  }
  async init() {
    renderer.setClearColor(0xeeeeee, 1.0);

    camera.aspect = 3 / 2;
    camera.far = 1000;
    camera.setFocalLength(50);
    camera.position.set(0, 0, 50);
    camera.lookAt(new THREE.Vector3());

    scene.add(nodePoints);
  }
  start() {
    this.play();
  }
  stop() {
    this.pause();
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

    // Update each objects.
    nodePoints.update(time);

    // Render the 3D scene.
    renderer.render(scene, camera);
  }
  resize(resolution) {
    canvas.width = resolution.x;
    canvas.height = resolution.y;
    resizeCamera(resolution);
    renderer.setSize(resolution.x, resolution.y);
  }
}
