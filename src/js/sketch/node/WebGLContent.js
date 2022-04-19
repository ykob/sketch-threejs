import * as THREE from 'three';
import { sleep } from '@ykob/js-util';

import NodePoints from './NodePoints';
import NodeLine from './NodeLine';

const canvas = document.getElementById('canvas-webgl');
const renderer = new THREE.WebGL1Renderer({
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

let nodePoints;
let nodeLine;

const resizeCamera = (resolution) => {
  camera.aspect = resolution.x / resolution.y;
  camera.updateProjectionMatrix();
};

export default class WebGLContent {
  constructor() {
  }
  async init(resolution) {
    renderer.setClearColor(0xffc600, 1.0);

    camera.aspect = 3 / 2;
    camera.far = 1000;
    camera.setFocalLength(50);
    camera.position.set(0, 0, 50);
    camera.lookAt(new THREE.Vector3());

    nodePoints = new NodePoints(camera);
    nodeLine = new NodeLine();

    scene.add(nodePoints);
    scene.add(nodeLine);

    this.resize(resolution);
  }
  start() {
    this.play();
  }
  stop() {
    this.pause();
  }
  play() {
    clock.start();
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
    nodePoints.update(time, camera);
    nodeLine.update(nodePoints, camera);

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
