const THREE = require('three/build/three.js');
const debounce = require('js-util/debounce');
const MathEx = require('js-util/MathEx');

const BuddhaHead = require('./BuddhaHead').default;
const Typo = require('./Typo').default;
const Wave = require('./Wave').default;
const Points = require('./Points').default;
const BackgroundSphere = require('./BackgroundSphere').default;
const Drag = require('./Drag').default;

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

  // ==========
  // Define unique variables
  //
  const buddhaHead = new BuddhaHead();
  const typo = new Typo();
  const wave = new Wave();
  const points = new Points();
  const bg = new BackgroundSphere();
  const dd = new Drag(resolution);

  // ==========
  // Define functions
  //
  const render = () => {
    const time = clock.getDelta();
    dd.render(resolution);
    buddhaHead.render(time, dd.v.y, dd.v.x);
    typo.render(time);
    wave.render(time);
    points.render(time);
    renderer.render(scene, camera);
  };
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  };
  const resizeCamera = () => {
    camera.aspect = resolution.x / resolution.y;
    camera.updateProjectionMatrix();
    camera.setFocalLength(MathEx.step(1, resolution.y / resolution.x) * 15 + 35);
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

    window.addEventListener('resize', debounce(resizeWindow, 1000));
  };

  // ==========
  // Initialize
  //
  on();
  resizeWindow();

  renderer.setClearColor(0x090909, 1.0);

  camera.far = 1000;
  camera.position.set(0, 14, 80);
  camera.lookAt(new THREE.Vector3(0, 14, 0));

  await buddhaHead.createObj();
  await typo.createObj();
  wave.createObj();
  points.createObj();
  bg.createObj();

  typo.obj.renderOrder = 10;

  scene.add(buddhaHead.obj);
  scene.add(typo.obj);
  scene.add(wave.obj);
  scene.add(points.obj);
  scene.add(bg.obj);

  clock.start();
  renderLoop();
}
