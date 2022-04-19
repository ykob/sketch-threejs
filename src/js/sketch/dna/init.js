import * as THREE from 'three';
import { debounce } from '@ykob/js-util';
import { sleep } from '@ykob/js-util';

import DnaHelix from './DnaHelix';
import PostEffect from './PostEffect';

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

  // For the post effect.
  const renderTarget = new THREE.WebGLRenderTarget();
  const scenePE = new THREE.Scene();
  const cameraPE = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 2);

  // For the preloader.
  const preloader = document.querySelector('.p-preloader');

  // ==========
  // Define unique variables
  //
  const dnaHelix = new DnaHelix();

  // For the post effect.
  const postEffect = new PostEffect(renderTarget.texture);
  postEffect.createObj();
  scenePE.add(postEffect.obj);

  // ==========
  // Define functions
  //
  const render = () => {
    const time = clock.getDelta();

    dnaHelix.render(time);

    // Render the main scene to frame buffer.
    renderer.setRenderTarget(renderTarget);
    renderer.render(scene, camera);

    // Render the post effect.
    postEffect.render(time);
    renderer.setRenderTarget(null);
    renderer.render(scenePE, cameraPE);
  };
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  };
  const resizeCamera = () => {
    camera.setFocalLength(50);
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
    renderer.setSize(resolution.x, resolution.y);
    renderTarget.setSize(resolution.x, resolution.y);
    postEffect.resize(resolution.x, resolution.y);
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
    window.addEventListener('resize', debounce(resizeWindow, 1000));
  };

  // ==========
  // Initialize
  //
  renderer.setClearColor(0x000000, 1.0);

  camera.aspect = 3 / 2;
  camera.far = 1000;
  camera.position.set(-110, -75, 45);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  scene.add(dnaHelix);

  on();
  resizeWindow();

  preloader.classList.add('is-hidden');
  await sleep(200);

  clock.start();
  renderLoop();
}
