const THREE = require('three/build/three.js');
const debounce = require('js-util/debounce');
const BlazeCylinder = require('../modules/sketch/blaze/BlazeCylinder').default;

export default function() {
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
  const clock = new THREE.Clock();

  camera.far = 50000;
  camera.setFocalLength(35);

  // ==========
  // Define unique variables
  //

  const blazeCylinder = new BlazeCylinder();

  // ==========
  // Define functions
  //
  const render = () => {
    const time = clock.getDelta();
    blazeCylinder.render(time);
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
    window.addEventListener('resize', debounce(resizeWindow), 1000);
  };

  // ==========
  // Initialize
  //
  const init = () => {
    blazeCylinder.createObj();

    scene.add(blazeCylinder.obj);

    renderer.setClearColor(0x000000, 1.0);
    camera.position.set(0, 0, 3000);
    camera.lookAt(new THREE.Vector3(0, 0, 0));
    clock.start();

    on();
    resizeWindow();
    renderLoop();
  }
  init();
}
