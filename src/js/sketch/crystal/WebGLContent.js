import * as THREE from 'three';
import MathEx from 'js-util/MathEx';
import sleep from 'js-util/sleep';

import PromiseTextureLoader from '../../common/PromiseTextureLoader';
import PromiseOBJLoader from '../../common/PromiseOBJLoader';

import ForcePerspectiveCamera from './ForcePerspectiveCamera';
import Crystal from './Crystal';
import CrystalSparkle from './CrystalSparkle';
import Background from './Background';

// ==========
// Define common variables
//
const canvas = document.getElementById('canvas-webgl');
const renderer = new THREE.WebGLRenderer({
  alpha: true,
  antialias: true,
  canvas: canvas,
});
const scene = new THREE.Scene();
const camera = new ForcePerspectiveCamera();
const cameraResolution = new THREE.Vector2();
const clock = new THREE.Clock({
  autoStart: false
});

// ==========
// Define unique variables
//
const CRYSTALS_COUNT = 12;
const crystals = [];
const crystalSparkles = [];
const lookPosition = new THREE.Vector3();
const panPosition = new THREE.Vector3();
let lookIndex = 0;
let lookTimer = 0;

const bg = new Background();

// ==========
// Define functions
//
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
    renderer.setClearColor(0x0e0e0e, 1.0);

    camera.aspect = 3 / 2;
    camera.far = 1000;
    camera.setFocalLength(50);

    let crystalGeometries;
    let crystalNormalMap;
    let crystalSurfaceTex;

    await Promise.all([
      PromiseOBJLoader('/sketch-threejs/model/crystal/crystal.obj'),
      PromiseTextureLoader('/sketch-threejs/img/sketch/crystal/normal.jpg'),
      PromiseTextureLoader('/sketch-threejs/img/sketch/crystal/surface.jpg'),
    ]).then((response) => {
      crystalGeometries = response[0].children.map((mesh) => {
        return mesh.geometry;
      });
      crystalNormalMap = response[1];
      crystalSurfaceTex = response[2];
    });

    for (var i = 0; i < CRYSTALS_COUNT; i++) {
      const radian = MathEx.radians(i / CRYSTALS_COUNT * 360);
      crystals[i] = new Crystal(crystalGeometries[i % 3]);
      crystals[i].position.set(
        Math.cos(radian) * 30,
        0,
        Math.sin(radian) * 30
      );
      crystals[i].start(i / CRYSTALS_COUNT, crystalNormalMap, crystalSurfaceTex);
      scene.add(crystals[i]);
      // crystalSparkles[i] = new CrystalSparkle();
      // scene.add(crystalSparkles[i]);
    }

    scene.add(bg);

    lookPosition.copy(crystals[lookIndex].position);
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
    for (var i = 0; i < crystals.length; i++) {
      crystals[i].update(time);
    }

    // Update the camera.
    lookTimer += time;
    if (lookTimer > 2) {
      lookIndex = (lookIndex + 1) % CRYSTALS_COUNT;
      lookTimer = 0;
      lookPosition.copy(crystals[lookIndex].position);
    }
    camera.lookAnchor.copy(
      lookPosition.clone().add(
        panPosition.clone().applyQuaternion(camera.quaternion)
      )
    );
    camera.update();

    // Render the 3D scene.
    renderer.render(scene, camera);
  }
  resize(resolution) {
    canvas.width = resolution.x;
    canvas.height = resolution.y;
    resizeCamera(resolution);
    renderer.setSize(resolution.x, resolution.y);
  }
  pan(v) {
    panPosition.copy(v);
  }
}
