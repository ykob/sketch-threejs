import * as THREE from 'three';
import UaParser from 'ua-parser-js';
import debounce from 'js-util/debounce';
import sleep from 'js-util/sleep';
import MathEx from 'js-util/MathEx';

import promiseOBJLoader from '../../common/PromiseOBJLoader';
import BoarHead from './BoarHead';
import Typo from './Typo';
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
  const boarHead = new BoarHead();
  const typo = new Typo();
  const bg = new BackgroundSphere();

  // For the post effect.
  const postEffect = new PostEffect(
    renderTarget1.texture,
    renderTarget2.texture
  );

  // For hold event.
  const hold = new Hold();
  const holdBtn = document.querySelector('.p-hold-button');
  const holdProgress = document.querySelector('.p-hold-button__progress-in');

  // ==========
  // Define functions
  //
  const render = () => {
    const time = clock.getDelta();

    // Render the hold acceleration.
    hold.render(time);

    // Render objects in 3D scene.
    boarHead.render(time, hold.v);
    typo.render(time);
    bg.render(time);

    // Render the main scene to frame buffer.
    boarHead.uniforms.drawBrightOnly.value = 0;
    typo.obj.visible = true;
    bg.obj.visible = true;
    renderer.render(scene, camera, renderTarget1);

    // Render the only bright to frame buffer.
    boarHead.uniforms.drawBrightOnly.value = 1;
    typo.obj.visible = false;
    bg.obj.visible = false;
    renderer.render(scene, camera, renderTarget2);

    // Update holding progress.
    holdProgress.style = `transform: skewX(-45deg) translateX(${50 - hold.v}%);`;

    // Render the post effect.
    postEffect.render(time);
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

    window.addEventListener('mousedown', (event) => {
      hold.isHolding = true;
    });
    window.addEventListener('mouseup', (event) => {
      hold.a = 0;
      hold.isHolding = false;
    });
    window.addEventListener('mouseleave', (event) => {
      hold.a = 0;
      hold.isHolding = false;
    });
    holdBtn.addEventListener('touchstart', (event) => {
      event.preventDefault();
      holdBtn.classList.add('is-pressed');
      holdBtn.classList.remove('is-released');
      hold.isHolding = true;
    });
    holdBtn.addEventListener('touchend', (event) => {
      event.preventDefault();
      hold.a = 0;
      holdBtn.classList.remove('is-pressed');
      holdBtn.classList.add('is-released');
      hold.isHolding = false;
    });
  };

  // ==========
  // Initialize
  //
  renderer.setClearColor(0x000000, 1.0);

  camera.aspect = 3 / 2;
  camera.far = 1000;
  camera.position.z = 120;
  camera.lookAt(new THREE.Vector3());

  // Load an obj file.
  const obj = await promiseOBJLoader('/sketch-threejs/model/newyear2019/boar_head.obj');
  const boarGeometry = obj.children[0].geometry;

  boarHead.createObj(boarGeometry);
  await typo.createObj();
  bg.createObj();

  scene.add(boarHead.obj);
  scene.add(typo.obj);
  scene.add(bg.obj);

  // For the post effect.
  postEffect.createObj();
  scenePE.add(postEffect.obj);

  on();
  resizeWindow();

  preloader.classList.add('is-hidden');
  await sleep(200);
  holdBtn.classList.add('is-shown');

  clock.start();
  renderLoop();
}
