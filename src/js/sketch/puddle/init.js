const THREE = require('three');
const { debounce } = require('@ykob/js-util');

const normalizeVector2 = require('../../common/normalizeVector2').default;
const Puddle = require('./Puddle.js').default;

export default function() {
  const canvas = document.getElementById('canvas-webgl');
  const renderer = new THREE.WebGL1Renderer({
    antialias: false,
    canvas: canvas,
    alpha: true,
  });
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(90, document.body.clientWidth / window.innerHeight, 1, 10000);
  const clock = new THREE.Clock();

  const vectorTouchStart = new THREE.Vector2();
  const vectorTouchMove = new THREE.Vector2();
  const vectorTouchEnd = new THREE.Vector2();

  let isDrag = false;

  //
  // process for this sketch.
  //

  let indexPuddle = 0;
  let timeShowPuddle = 0;
  const puddles = [];
  const showPuddle = (time) => {
    timeShowPuddle += time;
    if (timeShowPuddle > 1) {
      puddles[indexPuddle].show();
      indexPuddle = (indexPuddle + 1 >= puddles.length - 1) ? 0 : indexPuddle + 1;
      timeShowPuddle = 0;
    }
  };
  for (var i = 0; i < 20; i++) {
    puddles[i] = new Puddle();
    scene.add(puddles[i].obj);
  }

  //
  // common process
  //
  const resizeWindow = () => {
    canvas.width = document.body.clientWidth;
    canvas.height = window.innerHeight;
    camera.aspect = document.body.clientWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(document.body.clientWidth, window.innerHeight);
  }
  const render = () => {
    const time = clock.getDelta();
    showPuddle(time);
    for (var i = 0; i < puddles.length; i++) {
      puddles[i].render(time);
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
    renderer.setClearColor(0xf1f1f1, 1.0);
    camera.position.set(0, 0, 1000);
    camera.lookAt(new THREE.Vector3());

    on();
    resizeWindow();
    renderLoop();
  }
  init();
}
