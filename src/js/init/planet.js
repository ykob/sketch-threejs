const THREE = require('three/build/three.js');
const debounce = require('js-util/debounce');
const MathEx = require('js-util/MathEx');

const Land = require('../modules/sketch/planet/Land').default;
const Water = require('../modules/sketch/planet/Water').default;
const BackgroundSphere = require('../modules/sketch/planet/BackgroundSphere').default;
const Drag = require('../modules/sketch/planet/Drag').default;

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
  const randomH = Math.random();
  const land = new Land(randomH);
  const water = new Water(randomH);
  const group = new THREE.Group();
  const dd = new Drag(resolution);
  const backgroundSphere = new BackgroundSphere(randomH);

  // ==========
  // Define functions
  //
  const render = () => {
    const time = clock.getDelta();
    dd.render(resolution);
    group.rotation.set(
      MathEx.radians(dd.v.y),
      MathEx.radians(dd.v.x),
      0
    );
    land.render(time);
    water.render(time);
    backgroundSphere.render(time);
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

  renderer.setClearColor(0xeeeeee, 1.0);

  camera.far = 1000;
  camera.setFocalLength(MathEx.step(1, resolution.y / resolution.x) * 15 + 35);
  camera.position.set(0, 0, 300);
  camera.lookAt(new THREE.Vector3(0, 0, 0));

  land.createObj();
  water.createObj();
  backgroundSphere.createObj();

  group.add(land.obj);
  group.add(water.obj);

  scene.add(group);
  scene.add(backgroundSphere.obj);

  clock.start();
  renderLoop();

  return;
}
