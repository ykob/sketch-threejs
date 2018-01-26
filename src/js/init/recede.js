const THREE = require('three/build/three.js');
const debounce = require('js-util/debounce');
const loadTexs = require('../modules/common/loadTexs').default;
const Points = require('../modules/sketch/recede/Points').default;

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
  camera.setFocalLength(24);

  // ==========
  // Define unique variables
  //

  const texsSrc = {
    points: '../img/sketch/image_data/elephant.png'
  };
  const points = new Points();

  // ==========
  // Define functions
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

  // ==========
  // Initialize
  //
  const init = () => {
    loadTexs(texsSrc, (loadedTexs) => {
      renderer.setClearColor(0xeeeeee, 1.0);
      camera.position.set(0, 0, 1000);
      camera.lookAt(new THREE.Vector3());
      clock.start();

      points.createObj(loadedTexs.points);

      scene.add(points.obj);

      on();
      resizeWindow();
      renderLoop();
    });
  }
  init();
}
