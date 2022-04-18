import * as THREE from 'three';
import { debounce } from '@ykob/js-util';
import { sleep } from '@ykob/js-util';

import Image from './Image';

const texLoader = new THREE.TextureLoader();

export default async function() {
  // ==========
  // Define common variables
  //
  const resolution = new THREE.Vector2();
  const canvas = document.getElementById('canvas-webgl');
  const renderer = new THREE.WebGL1Renderer({
    alpha: true,
    antialias: true,
    canvas: canvas,
  });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera();
  const clock = new THREE.Clock({
    autoStart: false
  });

  // For the preloader.
  const preloader = document.querySelector('.p-preloader');

  // ==========
  // Define unique variables
  //
  const image = new Image();

  // ==========
  // Define functions
  //
  const render = () => {
    const time = clock.getDelta();
    image.update(time);
    renderer.render(scene, camera);
  };
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  };
  const resizeCamera = () => {
    camera.setViewOffset(
      1200,
      800,
      (resolution.x - 1200) / -2,
      (resolution.y - 800) / -2,
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
    image.resize(resolution);
    renderer.setSize(resolution.x, resolution.y);
  };
  const on = () => {
    window.addEventListener('resize', debounce(resizeWindow, 1000));
  };

  // ==========
  // Initialize
  //
  renderer.setClearColor(0xeeeeee, 1.0);

  camera.aspect = 3 / 2;
  camera.far = 1000;
  camera.setFocalLength(50);
  camera.position.set(0, 0, 300);
  camera.lookAt(new THREE.Vector3());

  on();
  resizeWindow();

  await Promise.all([
    texLoader.loadAsync('/sketch-threejs/img/sketch/dissolve/osaka01.jpg'),
    texLoader.loadAsync('/sketch-threejs/img/sketch/dissolve/osaka02.jpg'),
    texLoader.loadAsync('/sketch-threejs/img/sketch/dissolve/osaka03.jpg'),
    texLoader.loadAsync('/sketch-threejs/img/sketch/dissolve/osaka04.jpg'),
    texLoader.loadAsync('/sketch-threejs/img/sketch/dissolve/osaka05.jpg'),
  ]).then((response) => {
    image.start(resolution, response);
  });

  scene.add(image);

  preloader.classList.add('is-hidden');
  await sleep(200);

  clock.start();
  renderLoop();
}
