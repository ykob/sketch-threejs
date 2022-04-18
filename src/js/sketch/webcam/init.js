const THREE = require('three');
const { debounce } = require('@ykob/js-util');
const { MathEx } = require('@ykob/js-util');

const WebCamera = require('./WebCamera').default;
const Plane = require('./Plane').default;
const Points = require('./Points').default;
const Pole = require('./Pole').default;
const LandmarkPoints = require('./LandmarkPoints').default;
const BackgroundSphere = require('./BackgroundSphere').default;

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

  const webCamera = new WebCamera();
  const plane = new Plane();
  const points = new Points();
  const pole = new Pole();
  const landmarkPoints = new LandmarkPoints();
  const bg = new BackgroundSphere(0);
  const cTracker = new clm.tracker();

  // ==========
  // Define functions
  //
  const render = async () => {
    const time = clock.getDelta();
    const landmarks = cTracker.getCurrentPosition();
    const score = cTracker.getScore();

    webCamera.render(landmarks, score);
    plane.render(time, webCamera.force.v);
    points.render(time, webCamera.force.v);
    pole.render(time, webCamera.force.v);
    landmarkPoints.render(time, landmarks, score, webCamera);
    bg.render(time, webCamera.force.v);
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
  points.createObj();
  pole.createObj();
  landmarkPoints.createObj();
  bg.createObj();

  plane.obj.renderOrder = 10;
  points.obj.renderOrder = 2;
  pole.obj.renderOrder = 1;
  landmarkPoints.obj.renderOrder = 20;

  scene.add(plane.obj);
  scene.add(points.obj);
  scene.add(pole.obj);
  scene.add(landmarkPoints.obj);
  scene.add(bg.obj);

  cTracker.init(pModel);
  cTracker.start(webCamera.video);

  renderLoop();
}
