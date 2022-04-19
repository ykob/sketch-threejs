import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import UaParser from 'ua-parser-js';
import { debounce } from '@ykob/js-util';
import { sleep } from '@ykob/js-util';
import { MathEx } from '@ykob/js-util';

import BoarHead from './BoarHead';
import Typo from './Typo';
import Confetti from './Confetti';
import BackgroundSphere from './BackgroundSphere';
import PostEffect from './PostEffect';
import Hold from './Hold';

export default async function() {
  // ==========
  // Define common variables
  //
  const uaParser = new UaParser();
  const os = uaParser.getOS().name;
  const resolution = new THREE.Vector2();
  const mouse = new THREE.Vector2();
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
  const objLoader = new OBJLoader();

  // For the post effect.
  const renderTarget1 = new THREE.WebGLRenderTarget();
  const renderTarget2 = new THREE.WebGLRenderTarget();
  const scenePE = new THREE.Scene();
  const cameraPE = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 2);

  // For the preloader.
  const preloader = document.querySelector('.p-preloader');

  // ==========
  // Define unique variables
  //
  let boarHead = null;
  const typo = new Typo();
  const confetti = new Confetti();
  const bg = new BackgroundSphere();

  // For the post effect.
  const postEffect = new PostEffect(
    renderTarget1.texture,
    renderTarget2.texture
  );

  // For hold event.
  const hold = new Hold(os);

  // ==========
  // Define functions
  //
  const render = () => {
    if (clock.running === false) return;

    const time = clock.getDelta();

    // Render the hold acceleration.
    hold.render(time, mouse).then((isOver) => {
      switch (isOver) {
        case 1:
          boarHead.over();
          typo.over();
          confetti.over();
          bg.over();
          break;
        case 3:
          boarHead.coolDown();
          bg.coolDown();
          break;
        case 5:
          boarHead.returnFirstState();
          typo.coolDown();
          confetti.coolDown();
        default:
          break;
      }
    });

    // Render objects in 3D scene.
    boarHead.render(time, hold.v);
    typo.render(time);
    confetti.render(time);
    bg.render(time);

    // Render the main scene to frame buffer.
    boarHead.material.uniforms.drawBrightOnly.value = 0;
    typo.material.uniforms.drawBrightOnly.value = 0;
    confetti.visible = true;
    bg.visible = true;
    renderer.setRenderTarget(renderTarget1);
    renderer.render(scene, camera);

    // Render the only bright to frame buffer.
    boarHead.material.uniforms.drawBrightOnly.value = 1;
    typo.material.uniforms.drawBrightOnly.value = 1;
    confetti.visible = false;
    bg.visible = false;
    renderer.setRenderTarget(renderTarget2);
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
    renderTarget1.setSize(resolution.x, resolution.y);
    renderTarget2.setSize(resolution.x, resolution.y);
    postEffect.resize(resolution.x, resolution.y);
  };

  const on = () => {
    window.addEventListener('blur', () => {
      // this window is inactive.
      clock.stop();
      hold.isEnabled = false;
    });
    window.addEventListener('focus', () => {
      // this window is inactive.
      clock.start();
      hold.isEnabled = true;
    });
    window.addEventListener('resize', debounce(resizeWindow, 100));

    if (os === 'iOS' || os === 'Android') {
      window.addEventListener('deviceorientation', (event) => {
        const x = MathEx.radians((-event.beta + 90) * 0.3);
        const y = MathEx.radians(event.gamma) * Math.cos(MathEx.radians(event.beta));
        boarHead.rotate(x, y);
      });
    } else {
      window.addEventListener('mousemove', (event) => {
        boarHead.rotate(
          MathEx.radians((-(event.clientY / resolution.y * 2.0 - 1.0)) * -20),
          MathEx.radians((event.clientX / resolution.x * 2.0 - 1.0) * 20)
        );
      });
      window.addEventListener('mouseout', (event) => {
        boarHead.rotate(0, 0);
      });
    }

    hold.on(canvas, mouse);
  };

  // ==========
  // Initialize
  //
  renderer.setClearColor(0x000000, 1.0);

  camera.aspect = 3 / 2;
  camera.far = 1000;
  camera.position.z = 140;
  camera.lookAt(new THREE.Vector3());

  // Load an obj file.
  const obj = await objLoader.loadAsync('/sketch-threejs/model/newyear2019/boar_head.obj');
  const boarGeometry = obj.children[0].geometry;

  boarHead = new BoarHead(boarGeometry);
  await typo.loadTexture();

  scene.add(boarHead);
  scene.add(typo);
  scene.add(confetti);
  scene.add(bg);

  // For the post effect.
  scenePE.add(postEffect);

  on();
  resizeWindow();
  mouse.set(resolution.x / 2, resolution.y * 1.5);

  preloader.classList.add('is-hidden');
  await sleep(200);
  hold.start(resolution);

  clock.start();
  renderLoop();
}
