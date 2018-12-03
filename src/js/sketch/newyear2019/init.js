import * as THREE from 'three';
import debounce from 'js-util/debounce';
import sleep from 'js-util/sleep';
import MathEx from 'js-util/MathEx';

import BoarHead from './BoarHead';
import Typo from './Typo';
import Drag from './Drag';

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
  const camera = new THREE.PerspectiveCamera();
  const clock = new THREE.Clock({
    autoStart: false
  });

  // For the preloader.
  const preloader = document.querySelector('.p-preloader');

  // ==========
  // Define unique variables
  //
  const boarHead = new BoarHead();
  const typo = new Typo();
  const dd = new Drag(resolution);

  // ==========
  // Define functions
  //
  const render = () => {
    const time = clock.getDelta();
    dd.render(resolution);
    boarHead.render(time, dd.v.y, dd.v.x);
    typo.render(time);
    renderer.render(scene, camera);
  };
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  };
  const resizeCamera = () => {
    camera.setFocalLength(
      Math.min(resolution.x / 1200, 1) * 50 * MathEx.step(1, resolution.x / resolution.y)
      + Math.min(resolution.x / 818, 1) * 50 * MathEx.step(1, resolution.y / resolution.x)
    );
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
  };
  const on = () => {
    const touchstart = (e) => {
      dd.touchStart(e);
    }
    const touchmove = (e) => {
      dd.touchMove(e);
    }
    const touchend = (e) => {
      dd.touchEnd(e);
    }
    canvas.addEventListener('mousedown', touchstart, { passive: false });
    window.addEventListener('mousemove', touchmove, { passive: false });
    window.addEventListener('mouseup', touchend);
    canvas.addEventListener('touchstart', touchstart, { passive: false });
    window.addEventListener('touchmove', touchmove, { passive: false });
    window.addEventListener('touchend', touchend);

    window.addEventListener('resize', debounce(resizeWindow, 100));
  };

  // ==========
  // Initialize
  //
  renderer.setClearColor(0x111111, 1.0);

  camera.aspect = 3 / 2;
  camera.far = 1000;
  camera.position.set(0, 0, 120);
  camera.lookAt(new THREE.Vector3());

  await boarHead.createObj();
  await typo.createObj();

  scene.add(boarHead.obj);
  scene.add(typo.obj);

  on();
  resizeWindow();

  preloader.classList.add('is-hidden');
  await sleep(200);

  clock.start();
  renderLoop();
}
