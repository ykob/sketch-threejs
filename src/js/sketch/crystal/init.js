import * as THREE from 'three';
import debounce from 'js-util/debounce';
import MathEx from 'js-util/MathEx';
import sleep from 'js-util/sleep';

import PromiseTextureLoader from '../../common/PromiseTextureLoader';
import PromiseOBJLoader from '../../common/PromiseOBJLoader';

import ForcePerspectiveCamera from './ForcePerspectiveCamera';
import Crystal from './Crystal';
import CrystalSparkle from './CrystalSparkle';
import Background from './Background';

export default async function() {
  // ==========
  // Define common variables
  //
  const resolution = new THREE.Vector2();
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

  // For the preloader.
  const preloader = document.querySelector('.p-preloader');

  // ==========
  // Define unique variables
  //
  const COUNT = 12;
  const crystals = [];
  const crystalSparkles = [];

  // ==========
  // Define functions
  //
  const render = () => {
    const time = clock.getDelta();
    for (var i = 0; i < crystals.length; i++) {
      crystals[i].update(time);
    }
    camera.update();
    renderer.render(scene, camera);
  };
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  };
  const resizeCamera = () => {
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
  const resizeWindow = () => {
    resolution.set(document.body.clientWidth, window.innerHeight);
    canvas.width = resolution.x;
    canvas.height = resolution.y;
    resizeCamera();
    renderer.setSize(resolution.x, resolution.y);
  };
  const on = () => {
    window.addEventListener('blur', () => {
      // this window is inactive.
      clock.stop();
    });
    window.addEventListener('focus', () => {
      // this window is inactive.
      clock.start();
    });
    window.addEventListener('resize', debounce(resizeWindow, 100));
  };

  // ==========
  // Initialize
  //
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

  for (var i = 0; i < COUNT; i++) {
    const radian = MathEx.radians(i / COUNT * 360);
    crystals[i] = new Crystal(crystalGeometries[i % 3]);
    crystals[i].position.set(
      Math.cos(radian) * 30,
      0,
      Math.sin(radian) * 30
    );
    crystals[i].start(i / COUNT, crystalNormalMap, crystalSurfaceTex);
    scene.add(crystals[i]);
    // crystalSparkles[i] = new CrystalSparkle();
    // scene.add(crystalSparkles[i]);
  }

  on();
  resizeWindow();

  let index = 0;
  camera.lookAnchor.copy(crystals[index % COUNT].position);
  setInterval(() => {
    index++;
    camera.lookAnchor.copy(crystals[index % COUNT].position);
  }, 3000);

  preloader.classList.add('is-hidden');

  clock.start();
  renderLoop();
}
