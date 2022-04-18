const THREE = require('three');
const { debounce } = require('@ykob/js-util');
const { MathEx } = require('@ykob/js-util');

const Land = require('./Land').default;
const Water = require('./Water').default;
const Clouds = require('./Clouds').default;
const BackgroundSphere = require('./BackgroundSphere').default;
const Drag = require('./Drag').default;

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

  // ==========
  // Define unique variables
  //
  const randomH = Math.random();
  const land = new Land(randomH);
  const water = new Water(randomH);
  const clouds = new Clouds();
  const bg = new BackgroundSphere(randomH);
  const group = new THREE.Group();
  const dd = new Drag(resolution);

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
    clouds.render(time);
    bg.render(time);
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
  clouds.createObj();
  bg.createObj();

  group.add(land.obj);
  group.add(water.obj);
  group.add(clouds.obj);

  scene.add(group);
  scene.add(bg.obj);

  clock.start();
  renderLoop();

  return;
}
