const THREE = require('three');
const debounce = require('js-util/debounce');

const normalizeVector2 = require('../../common/normalizeVector2').default;
import PostEffectBright from './PostEffectBright.js';
import PostEffectBlur from './PostEffectBlur.js';
import PostEffectBloom from './PostEffectBloom.js';
import Points from './Points';

export default function() {
  const canvas = document.getElementById('canvas-webgl');
  const renderer = new THREE.WebGLRenderer({
    antialias: false,
    canvas: canvas,
  });
  const renderBack1 = new THREE.WebGLRenderTarget(document.body.clientWidth, window.innerHeight);
  const renderBack2 = new THREE.WebGLRenderTarget(document.body.clientWidth, window.innerHeight);
  const renderBack3 = new THREE.WebGLRenderTarget(document.body.clientWidth, window.innerHeight);
  const scene = new THREE.Scene();
  const sceneBack = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const cameraBack = new THREE.PerspectiveCamera(45, document.body.clientWidth / window.innerHeight, 1, 10000);
  const clock = new THREE.Clock();

  const vectorTouchStart = new THREE.Vector2();
  const vectorTouchMove = new THREE.Vector2();
  const vectorTouchEnd = new THREE.Vector2();
  let isDrag = false;

  //
  // process for this sketch.
  //

  const points = new Points();
  const postEffectBright = new PostEffectBright(renderBack1.texture);
  const postEffectBlurX = new PostEffectBlur(renderBack2.texture, 1, 0);
  const postEffectBlurY = new PostEffectBlur(renderBack3.texture, 0, 1);
  const postEffectBloom = new PostEffectBloom(renderBack1.texture, renderBack2.texture);
  points.init(renderer);

  //
  // common process
  //
  const resizeWindow = () => {
    canvas.width = document.body.clientWidth;
    canvas.height = window.innerHeight;
    cameraBack.aspect = document.body.clientWidth / window.innerHeight;
    cameraBack.updateProjectionMatrix();
    postEffectBlurX.resize();
    postEffectBlurY.resize();
    renderBack1.setSize(document.body.clientWidth, window.innerHeight);
    renderBack2.setSize(document.body.clientWidth, window.innerHeight);
    renderBack3.setSize(document.body.clientWidth, window.innerHeight);
    renderer.setSize(document.body.clientWidth, window.innerHeight);
  }
  const render = () => {
    const time = clock.getDelta();
    points.render(renderer, time);
    renderer.render(sceneBack, cameraBack, renderBack1);
    scene.add(postEffectBright.obj);
    renderer.render(scene, cameraBack, renderBack2);
    scene.remove(postEffectBright.obj);
    scene.add(postEffectBlurX.obj);
    renderer.render(scene, cameraBack, renderBack3);
    scene.remove(postEffectBlurX.obj);
    scene.add(postEffectBlurY.obj);
    renderer.render(scene, cameraBack, renderBack2);
    scene.remove(postEffectBlurY.obj);
    scene.add(postEffectBloom.obj);
    renderer.render(scene, camera);
    scene.remove(postEffectBloom.obj);
  }
  const renderLoop = () => {
    render();
    requestAnimationFrame(renderLoop);
  }
  const touchStart = (isTouched) => {
    isDrag = true;
    points.touchStart(vectorTouchStart);
  };
  const touchMove = (isTouched) => {
    if (isDrag) points.touchMove(vectorTouchMove);
  };
  const touchEnd = (isTouched) => {
    isDrag = false;
    points.touchEnd();
  };
  const mouseOut = () => {
    isDrag = false;
    points.touchEnd();
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
      normalizeVector2(vectorTouchEnd);
      vectorTouchEnd.set(event.changedTouches[0].clientX, event.changedTouches[0].clientY);
      touchEnd(true);
    });
    window.addEventListener('mouseout', function () {
      event.preventDefault();
      vectorTouchEnd.set(0, 0);
      mouseOut();
    });
  }

  const init = () => {
    renderer.setSize(document.body.clientWidth, window.innerHeight);
    renderer.setClearColor(0x111111, 1.0);
    cameraBack.position.set(0, 0, 1000);
    cameraBack.lookAt(new THREE.Vector3());

    sceneBack.add(points.obj);

    on();
    resizeWindow();
    renderLoop();
  }
  init();
}
