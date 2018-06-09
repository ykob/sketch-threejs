require("babel-polyfill");

const THREE = require('three/build/three.js');
const debounce = require('js-util/debounce');

const WebCamera = require('../modules/sketch/webcam/WebCamera').default;
const Plane = require('../modules/sketch/webcam/Plane').default;
const setting = require('../modules/sketch/webcam/buildSetting').default();

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
  const clock = new THREE.Clock({
    autoStart: false
  });

  camera.far = 50000;
  camera.setFocalLength(24);

  // ==========
  // Define unique variables
  //

  const webCamera = new WebCamera();
  const plane = new Plane();

  // ==========
  // Define functions
  //
  const render = () => {
    const time = clock.getDelta();
    plane.render(time);
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

    return webCamera.init({
      audio: false,
      video: {
        facingMode: `environment`, // environment or user
      }
    });
  };
  const on = () => {
    window.addEventListener('resize', debounce(() => {
      resizeWindow().then(() => {
        plane.resize(webCamera);
      });
    }, 500));
  };

  // ==========
  // Initialize
  //
  renderer.setClearColor(0xeeeeee, 1.0);
  camera.position.set(0, 0, 1000);
  camera.lookAt(new THREE.Vector3());
  clock.start();

  on();
  resizeWindow().then(() => {
    plane.createObj(webCamera);
    scene.add(plane.obj);
    renderLoop();
  });
}
