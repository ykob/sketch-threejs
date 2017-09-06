import normalizeVector2 from '../modules/common/normalizeVector2';
import Butterfly from '../modules/sketch/butterfly/Butterfly';
import Floor from '../modules/sketch/butterfly/Floor.js';

const debounce = require('js-util/debounce');

export default function() {
  const resolution = {
    x: 0,
    y: 0
  };
  const canvas = document.getElementById('canvas-webgl');
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    canvas: canvas,
  });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, resolution.x / resolution.y, 1, 15000);
  const clock = new THREE.Clock();
  const loader = new THREE.TextureLoader();

  const vectorTouchStart = new THREE.Vector2();
  const vectorTouchMove = new THREE.Vector2();
  const vectorTouchEnd = new THREE.Vector2();

  const CAMERA_SIZE_X = 640;
  const CAMERA_SIZE_Y = 480;

  let isDrag = false;

  //
  // process for this sketch.
  //

  const BUTTERFLY_NUM = 7;
  const butterflies = [];
  const floor = new Floor(resolution);

  //
  // common process
  //
  const resizeCamera = () => {
    camera.aspect = resolution.x / resolution.y;
    camera.updateProjectionMatrix();
    floor.resize(resolution);
  };
  const resizeWindow = () => {
    resolution.x = document.body.clientWidth;
    resolution.y = window.innerHeight;
    canvas.width = resolution.x;
    canvas.height = resolution.y;
    resizeCamera();
    renderer.setSize(resolution.x, resolution.y);
  }
  const render = () => {
    const time = clock.getDelta();
    for (var i = 0; i < butterflies.length; i++) {
      butterflies[i].render(renderer, time);
    }
    floor.render(renderer, scene, time);
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
    if (isDrag) {}
  };
  const touchEnd = (isTouched) => {
    isDrag = false;
  };
  const mouseOut = () => {
    isDrag = false;
  };
  const on = () => {
    window.addEventListener('resize', debounce(resizeWindow), 1000);
    canvas.addEventListener('mousedown', function (event) {
      event.preventDefault();
      vectorTouchStart.set(event.clientX, event.clientY);
      normalizeVector2(vectorTouchStart);
      touchStart(false);
    });
    canvas.addEventListener('mousemove', function (event) {
      event.preventDefault();
      vectorTouchMove.set(event.clientX, event.clientY);
      normalizeVector2(vectorTouchMove);
      touchMove(false);
    });
    canvas.addEventListener('mouseup', function (event) {
      event.preventDefault();
      vectorTouchEnd.set(event.clientX, event.clientY);
      normalizeVector2(vectorTouchEnd);
      touchEnd(false);
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
    window.addEventListener('mouseout', function () {
      event.preventDefault();
      vectorTouchEnd.set(0, 0);
      mouseOut();
    });
  }

  const init = () => {
    const lookAtY = 100;

    resizeWindow();
    on();

    renderer.setClearColor(0xeeeeee, 1.0);
    camera.position.set(300, 600, 600);
    floor.mirrorCamera.position.set(
      camera.position.x,
      camera.position.y * -1,
      camera.position.z
    );
    camera.lookAt(new THREE.Vector3(0, lookAtY, 0));
    floor.mirrorCamera.lookAt(new THREE.Vector3(0, -lookAtY, 0));

    loader.load('/sketch-threejs/img/sketch/butterfly/tex.png', (texture) => {
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;

      for (var i = 0; i < BUTTERFLY_NUM; i++) {
        butterflies[i] = new Butterfly(i, texture);
        butterflies[i].obj.position.x = ((i + 1) % 3 - 1) * i * 50;
        butterflies[i].obj.position.z = 1800 / BUTTERFLY_NUM * i;
        scene.add(butterflies[i].obj);
      }
      scene.add(floor.obj);
      renderLoop();
    });
  }
  init();
}
