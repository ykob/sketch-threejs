const THREE = require('three/build/three.js');
const faceapi = require('face-api.js/dist/face-api.js');
const debounce = require('js-util/debounce');

const WebCamera = require('./WebCamera').default;
const Plane = require('./Plane').default;

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

  const webCamera = new WebCamera();
  const plane = new Plane();

  // ==========
  // Define functions
  //
  const render = async () => {
    const time = clock.getDelta();
    plane.render(time);
    renderer.render(scene, camera);
    const results = await faceapi.detectLandmarks(webCamera.video);
  };
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  };
  const resizeCamera = () => {
    camera.aspect = resolution.x / resolution.y;
    camera.updateProjectionMatrix();
  };
  const resizeWindow = async () => {
    resolution.set(document.body.clientWidth, window.innerHeight);
    canvas.width = resolution.x;
    canvas.height = resolution.y;
    resizeCamera();
    renderer.setSize(resolution.x, resolution.y);
    await webCamera.init({
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
  await faceapi.loadFaceLandmarkModel('/sketch-threejs/js/vendor/face-api.js/weights');

  renderer.setClearColor(0xeeeeee, 1.0);
  camera.far = 1000;
  camera.setFocalLength(50);
  camera.position.set(0, 0, 100);
  camera.lookAt(new THREE.Vector3());
  clock.start();

  on();
  await resizeWindow();

  plane.createObj(webCamera);
  scene.add(plane.obj);
  renderLoop();
}
