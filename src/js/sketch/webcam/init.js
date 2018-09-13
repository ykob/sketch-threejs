const THREE = require('three/build/three.js');
const Clm = require('clmtrackr/build/clmtrackr.js');
const pModel = require('clmtrackr/models/model_pca_20_svm.js');
const debounce = require('js-util/debounce');
const MathEx = require('js-util/MathEx');

const WebCamera = require('./WebCamera').default;
const Plane = require('./Plane').default;
const Points = require('./Points').default;

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
  const points = new Points();
  const cTracker = new Clm.tracker();

  // ==========
  // Define functions
  //
  const render = async () => {
    const time = clock.getDelta();
    plane.render(time, cTracker);
    // points.render(time, cTracker, webCamera);
    renderer.render(scene, camera);
    return;
  };
  const renderLoop = async () => {
    await render();
    requestAnimationFrame(renderLoop);
    return;
  };
  const resizeCamera = () => {
    camera.aspect = resolution.x / resolution.y;
    camera.updateProjectionMatrix();
    camera.setFocalLength(MathEx.step(1, resolution.y / resolution.x) * 15 + 35);
  };
  const resizeWindow = async () => {
    resolution.set(document.body.clientWidth, window.innerHeight);
    canvas.width = resolution.x;
    canvas.height = resolution.y;
    resizeCamera();
    renderer.setSize(resolution.x, resolution.y);
    await webCamera.init();
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
  camera.far = 1000;
  camera.position.set(0, 0, 100);
  camera.lookAt(new THREE.Vector3());
  clock.start();

  on();
  await resizeWindow();

  plane.createObj(webCamera);
  // points.createObj();

  scene.add(plane.obj);
  // scene.add(points.obj);

  cTracker.init(pModel);
  cTracker.start(webCamera.video);

  renderLoop();
}
