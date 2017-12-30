const THREE = require('three/build/three.js');
const debounce = require('js-util/debounce');
const loadTexs = require('../modules/common/loadTexs').default;
const GUI = require('../modules/sketch/cyberspace/GUI').default;
const FloatPoints = require('../modules/sketch/cyberspace/FloatPoints').default;
const Background = require('../modules/sketch/cyberspace/Background').default;

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

  camera.far = 10000;
  camera.setFocalLength(24);

  //
  // process for this sketch.
  //

  const gui = new GUI();
  const floatPoints = new FloatPoints();
  const bg = new Background();

  const texs = {
    gui1: '/img/sketch/cyberspace/tex_gui01.png',
    gui2: '/img/sketch/cyberspace/tex_gui02.png',
    gui3: '/img/sketch/cyberspace/tex_gui03.png',
    bg: '/img/sketch/cyberspace/tex_bg.png',
  };

  //
  // common process
  //
  const render = () => {
    const time = clock.getDelta();
    gui.render(time);
    floatPoints.render(time);
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
    loadTexs(texs, (loadedTexs) => {
      gui.createObj([loadedTexs.gui1, loadedTexs.gui2, loadedTexs.gui3]);
      floatPoints.createObj();
      bg.createObj(loadedTexs.bg);

      scene.add(gui.obj);
      scene.add(floatPoints.obj);
      scene.add(bg.obj);

      renderer.setClearColor(0x000000, 1.0);
      camera.position.set(0, 0, 1000);
      camera.lookAt(new THREE.Vector3());

      clock.start();

      on();
      resizeWindow();
      renderLoop();
    });
  }
  init();
}
