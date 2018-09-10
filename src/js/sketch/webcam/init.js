const THREE = require('three/build/three.js');
const faceapi = require('face-api.js/dist/face-api.js');
const debounce = require('js-util/debounce');
const MathEx = require('js-util/MathEx');

const WebCamera = require('./WebCamera').default;
const Plane = require('./Plane').default;
// const Points = require('./Points').default;

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
  // const FPS_FACE_DETECT = 5;
  // let secFaceDetect = 0;

  // ==========
  // Define unique variables
  //

  const webCamera = new WebCamera();
  const plane = new Plane();
  // const points = new Points();

  // ==========
  // Define functions
  //
  const render = async () => {
    const time = clock.getDelta();
    plane.render(time);
    renderer.render(scene, camera);
    // points.render(time);

    // secFaceDetect += time;
    // if (secFaceDetect >= 1 / FPS_FACE_DETECT) {
    //   const detections = await faceapi.tinyYolov2(webCamera.video, {
    //     scoreThreshold: 0.5,
    //   });
    //   if (detections.length > 0) {
    //     const faceTensors = await faceapi.extractFaceTensors(webCamera.video, detections);
    //     const landmarksByFace = await faceapi.detectLandmarks(faceTensors[0]);
    //     const mouth = landmarksByFace.getMouth();
    //     points.setPositions(landmarksByFace.getPositions(), detections[0].box, webCamera);
    //   }
    // }
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
  // await faceapi.loadTinyYolov2Model('/sketch-threejs/js/vendor/face-api.js/weights');
  // await faceapi.loadFaceLandmarkModel('/sketch-threejs/js/vendor/face-api.js/weights');

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

  renderLoop();
}
