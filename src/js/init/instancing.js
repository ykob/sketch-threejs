import normalizeVector2 from '../modules/common/normalizeVector2';
import ForcePerspectiveCamera from '../modules/common/ForcePerspectiveCamera';
import CameraController from '../modules/sketch/instancing/CameraController';
import Debris from '../modules/sketch/instancing/Debris';
import SkyBox from '../modules/sketch/instancing/SkyBox';

const debounce = require('js-util/debounce');

export default function() {
  const canvas = document.getElementById('canvas-webgl');
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    canvas: canvas,
    alpha: true
  });
  const scene = new THREE.Scene();
  const camera = new ForcePerspectiveCamera(45, document.body.clientWidth / window.innerHeight, 1, 100000);
  const cameraController = new CameraController(camera);
  const clock = new THREE.Clock();

  const vectorTouchStart = new THREE.Vector2();
  const vectorTouchMove = new THREE.Vector2();
  const vectorTouchEnd = new THREE.Vector2();

  let isDrag = false;

  //
  // process for this sketch.
  //

  const cubeTexLoader = new THREE.CubeTextureLoader();
  const debris = new Debris();
  const skybox = new SkyBox();

  //
  // common process
  //gul
  const resizeWindow = () => {
    canvas.width = document.body.clientWidth;
    canvas.height = window.innerHeight;
    camera.aspect = document.body.clientWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(document.body.clientWidth, window.innerHeight);
  }
  const render = () => {
    const now = clock.getDelta();
    cameraController.render();
    debris.render(now);
    skybox.render(now);
    renderer.render(scene, camera);
  }
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  }
  const touchStart = (isTouched) => {
    isDrag = true;
  };
  const touchMove = (isTouched) => {
    if (isDrag) {
      cameraController.rotate(
        vectorTouchStart.x - vectorTouchMove.x,
        vectorTouchStart.y - vectorTouchMove.y
      );
    }
  };
  const touchEnd = (isTouched) => {
    isDrag = false;
    cameraController.touchEnd();
  };
  const mouseOut = () => {
    isDrag = false;
  };
  const wheel = (event) => {
    cameraController.zoom(event.deltaY);
  }
  const on = () => {
    window.addEventListener('resize', debounce(() => {
      resizeWindow();
    }), 1000);
    canvas.addEventListener('mousedown', function (event) {
      event.preventDefault();
      vectorTouchStart.set(event.clientX, event.clientY);
      normalizeVector2(vectorTouchStart);
      touchStart(false);
    });
    document.addEventListener('mousemove', function (event) {
      event.preventDefault();
      vectorTouchMove.set(event.clientX, event.clientY);
      normalizeVector2(vectorTouchMove);
      touchMove(false);
    });
    document.addEventListener('mouseup', function (event) {
      event.preventDefault();
      vectorTouchEnd.set(event.clientX, event.clientY);
      normalizeVector2(vectorTouchEnd);
      touchEnd(false);
    });
    document.addEventListener('wheel', function(event) {
      event.preventDefault();
      wheel(event);
    });
    canvas.addEventListener('touchstart', function (event) {
      event.preventDefault();
      vectorTouchStart.set(event.touches[0].clientX, event.touches[0].clientY);
      normalizeVector2(vectorTouchStart);
      touchStart(event.touches[0].clientX, event.touches[0].clientY, true);
    });
    canvas.addEventListener('touchmove', function (event) {
      event.preventDefault();
      vectorTouchMove.set(event.touches[0].clientX, event.touches[0].clientY);
      normalizeVector2(vectorTouchMove);
      touchMove(true);
    });
    canvas.addEventListener('touchend', function (event) {
      event.preventDefault();
      vectorTouchEnd.set(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
      normalizeVector2(vectorTouchEnd);
      touchEnd(true);
    });
  }

  const init = () => {
    renderer.setSize(document.body.clientWidth, window.innerHeight);
    renderer.setClearColor(0xeeeeee, 1.0);

    cubeTexLoader.setPath('../img/sketch/instancing/').load(
      ["cubemap_px.png", "cubemap_nx.png", "cubemap_py.png", "cubemap_ny.png", "cubemap_pz.png", "cubemap_nz.png"],
      (tex) => {
        debris.init(tex);
        skybox.init(tex);
        scene.add(debris.obj);
        scene.add(skybox.obj);
      }
    );

    on();
    resizeWindow();
    renderLoop();
  }
  init();
}
