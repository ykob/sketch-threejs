const THREE = require('three');
const { debounce } = require('@ykob/js-util');

const normalizeVector2 = require('../../common/normalizeVector2').default;
const PostEffectBright = require('./PostEffectBright.js').default;
const PostEffectBlur = require('./PostEffectBlur.js').default;
const PostEffectBloom = require('./PostEffectBloom.js').default;
const Points = require('./Points').default;

export default function() {
  const canvas = document.getElementById('canvas-webgl');
  const renderer = new THREE.WebGL1Renderer({
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
    const x = document.body.clientWidth;
    const y = window.innerHeight;

    canvas.width = x;
    canvas.height = y;
    cameraBack.aspect = x / y;
    cameraBack.updateProjectionMatrix();
    postEffectBlurX.resize(x, y);
    postEffectBlurY.resize(x, y);
    renderBack1.setSize(x, y);
    renderBack2.setSize(x, y);
    renderBack3.setSize(x, y);
    renderer.setSize(x, y);
  }
  const render = () => {
    const time = clock.getDelta();
    points.render(renderer, time);
    renderer.setRenderTarget(renderBack1);
    renderer.render(sceneBack, cameraBack);
    scene.add(postEffectBright.obj);
    renderer.setRenderTarget(renderBack2);
    renderer.render(scene, cameraBack);
    scene.remove(postEffectBright.obj);
    scene.add(postEffectBlurX.obj);
    renderer.setRenderTarget(renderBack3);
    renderer.render(scene, cameraBack);
    scene.remove(postEffectBlurX.obj);
    scene.add(postEffectBlurY.obj);
    renderer.setRenderTarget(renderBack2);
    renderer.render(scene, cameraBack);
    scene.remove(postEffectBlurY.obj);
    scene.add(postEffectBloom.obj);
    renderer.setRenderTarget(null);
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
