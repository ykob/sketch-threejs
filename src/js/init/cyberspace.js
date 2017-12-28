const THREE = require('three/build/three.js');
const debounce = require('js-util/debounce');

import GUI from '../modules/sketch/cyberspace/GUI';

export default function() {
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

  camera.setFocalLength(24);

  //
  // process for this sketch.
  //

  const gui = new GUI();

  //
  // common process
  //
  const render = () => {
    const time = clock.getDelta();
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

  const init = () => {
    gui.createObj();

    scene.add(gui.obj);

    renderer.setClearColor(0x000000, 1.0);
    camera.position.set(0, 0, 1000);
    camera.lookAt(new THREE.Vector3());

    clock.start();

    on();
    resizeWindow();
    renderLoop();
  }
  init();
}
