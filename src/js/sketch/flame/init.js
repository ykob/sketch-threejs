const THREE = require('three');
const { debounce } = require('@ykob/js-util');
const { MathEx } = require('@ykob/js-util');
const isiOS = require('../../old/isiOS');
const isAndroid = require('../../old/isAndroid');

const ForcePerspectiveCamera = require('../../common/ForcePerspectiveCamera').default;
const CameraController = require('./CameraController').default;
const FlameCore = require('./FlameCore').default;
const FlameCylinder = require('./FlameCylinder').default;
const FlameStone = require('./FlameStone').default;
const BackgroundSphere = require('./BackgroundSphere').default;

export default function() {
  // ==========
  // Define common variables
  //
  const resolution = new THREE.Vector2();
  const mousemove = new THREE.Vector2();
  const canvas = document.getElementById('canvas-webgl');
  const renderer = new THREE.WebGL1Renderer({
    alpha: true,
    antialias: true,
    canvas: canvas,
  });
  const scene = new THREE.Scene();
  const camera = new ForcePerspectiveCamera();
  const cameraController = new CameraController(camera);
  const clock = new THREE.Clock();

  camera.far = 50000;
  camera.setFocalLength(35);

  // ==========
  // Define unique variables
  //

  const flameCore = new FlameCore();
  const flameCylinder = new FlameCylinder();
  const flameStone = new FlameStone();
  const backgroundSphere = new BackgroundSphere();

  // ==========
  // Define functions
  //
  const render = () => {
    const time = clock.getDelta();
    flameCore.render(time);
    flameCylinder.render(time);
    flameStone.render(time);
    backgroundSphere.render(time);
    cameraController.render(time, mousemove);
    renderer.render(scene, camera);
  };
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  };
  const resizeCamera = () => {
    camera.aspect = resolution.x / resolution.y;
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
    window.addEventListener('resize', debounce(resizeWindow, 1000));
    if (isiOS() || isAndroid()) {
      window.addEventListener('deviceorientation', (event) => {
        if (resolution.x / resolution.y < 1) {
          mousemove.set(
            event.gamma / 60,
            MathEx.clamp((Math.abs(event.beta) - 90), -90, 90) * -0.02
          );
        } else {
          mousemove.set(0, 0);
        }
      });
    } else {
      window.addEventListener('mousemove', (event) => {
        mousemove.set(
          event.clientX / resolution.x * 2.0 - 1.0,
          -(event.clientY / resolution.y * 2.0 - 1.0)
        );
      });
      window.addEventListener('mouseout', (event) => {
        mousemove.set(0, 0);
      });
    }
  };

  // ==========
  // Initialize
  //
  const init = () => {
    flameCore.createObj();
    flameCylinder.createObj();
    flameStone.createObj();
    backgroundSphere.createObj();

    scene.add(flameCore.obj);
    scene.add(flameCylinder.obj);
    scene.add(flameStone.obj);
    scene.add(backgroundSphere.obj);

    renderer.setClearColor(0x000000, 1.0);
    cameraController.init([0, 1500, 3000], [0, -100, 0]);
    clock.start();

    on();
    resizeWindow();
    renderLoop();
  }
  init();
}
