import normalizeVector2 from '../modules/common/normalizeVector2';
import Butterfly from '../modules/sketch/butterfly/Butterfly';

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
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 1, 10000);
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

  //
  // common process
  //
  const resizeCamera = () => {
    const x = Math.min((resolution.x / resolution.y) / (CAMERA_SIZE_X / CAMERA_SIZE_Y), 1.0) * CAMERA_SIZE_X;
    const y = Math.min((resolution.y / resolution.x) / (CAMERA_SIZE_Y / CAMERA_SIZE_X), 1.0) * CAMERA_SIZE_Y;
    camera.left   = x * -0.5;
    camera.right  = x *  0.5;
    camera.top    = y *  0.5;
    camera.bottom = y * -0.5;
    camera.updateProjectionMatrix();
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
    resizeWindow();
    on();

    renderer.setClearColor(0xeeeeee, 1.0);
    camera.position.set(250, 500, 1000);
    camera.lookAt(new THREE.Vector3());

    loader.load('/sketch-threejs/img/sketch/butterfly/tex.png', (texture) => {
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;

      for (var i = 0; i < BUTTERFLY_NUM; i++) {
        butterflies[i] = new Butterfly(i, texture);
        butterflies[i].obj.position.set(((i + 1) % 3 - 1) * i * 50, 0, 1800 / BUTTERFLY_NUM * i);
        scene.add(butterflies[i].obj);
      }
      renderLoop();
    });
  }
  init();
}
