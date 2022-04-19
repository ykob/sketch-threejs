import * as THREE from 'three';
import { debounce } from '@ykob/js-util';
import { sleep } from '@ykob/js-util';

import Typo from './Typo';
import Debris from './Debris';
import Background from './Background';

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
  const cameraResolution = new THREE.Vector2();
  const clock = new THREE.Clock({
    autoStart: false
  });
  const texLoader = new THREE.TextureLoader();

  // For the preloader.
  const preloader = document.querySelector('.p-preloader');

  // ==========
  // Define unique variables
  //
  const typo = new Typo();
  const debris = new Debris();
  const bg = new Background();

  let textures;

  // ==========
  // Define functions
  //
  const render = () => {
    const time = clock.getDelta();
    typo.update(time);
    debris.update(time);
    bg.update(time);
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
  renderer.setClearColor(0x111111, 1.0);

  camera.aspect = 3 / 2;
  camera.far = 1000;
  camera.setFocalLength(50);
  camera.position.set(0, 0, 50);
  camera.lookAt(new THREE.Vector3());

  await Promise.all([
    texLoader.loadAsync('../img/sketch/easy_glitch/typo.png'),
    texLoader.loadAsync('../img/sketch/easy_glitch/noise.png'),
  ]).then(response => {
    textures = response;
  });

  if (textures) {
    textures[0].wrapS = THREE.RepeatWrapping;
    textures[0].wrapT = THREE.RepeatWrapping;
    textures[1].wrapS = THREE.RepeatWrapping;
    textures[1].wrapT = THREE.RepeatWrapping;
    textures[1].minFilter = THREE.NearestFilter;
    textures[1].magFilter = THREE.NearestFilter;

    typo.start(textures[0], textures[1]);

    scene.add(typo);
  }

  debris.start();
  bg.start();

  scene.add(debris);
  scene.add(bg);

  on();
  resizeWindow();

  preloader.classList.add('is-hidden');
  await sleep(200);

  clock.start();
  renderLoop();
}
