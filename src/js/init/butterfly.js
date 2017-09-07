import normalizeVector2 from '../modules/common/normalizeVector2';
import Butterfly from '../modules/sketch/butterfly/Butterfly';
import Floor from '../modules/sketch/butterfly/Floor.js';
import PostEffectBright from '../modules/sketch/butterfly/PostEffectBright.js';
import PostEffectBlur from '../modules/sketch/butterfly/PostEffectBlur.js';
import PostEffectBloom from '../modules/sketch/butterfly/PostEffectBloom.js';

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
    alpha: true
  });
  const renderBack1 = new THREE.WebGLRenderTarget(0, 0);
  const renderBack2 = new THREE.WebGLRenderTarget(0, 0);
  const renderBack3 = new THREE.WebGLRenderTarget(0, 0);
  const scene = new THREE.Scene();
  const sceneBack = new THREE.Scene();
  const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0, 1);
  const cameraBack = new THREE.PerspectiveCamera(30, 1, 1, 15000);
  const clock = new THREE.Clock();
  const loader = new THREE.TextureLoader();

  const vectorTouchStart = new THREE.Vector2();
  const vectorTouchMove = new THREE.Vector2();
  const vectorTouchEnd = new THREE.Vector2();

  let isDrag = false;

  //
  // process for this sketch.
  //

  const BUTTERFLY_NUM = 12;
  const butterflies = [];
  const floor = new Floor(resolution);
  const postEffectBright = new PostEffectBright(renderBack1.texture);
  const postEffectBlurX = new PostEffectBlur(renderBack2.texture, 1, 0, 1);
  const postEffectBlurY = new PostEffectBlur(renderBack3.texture, 0, 1, 1);
  const postEffectBloom = new PostEffectBloom(renderBack1.texture, renderBack2.texture);

  //
  // common process
  //
  const resizeCamera = () => {
    cameraBack.aspect = resolution.x / resolution.y;
    cameraBack.updateProjectionMatrix();
    floor.resize(resolution);
  };
  const resizeWindow = () => {
    resolution.x = document.body.clientWidth;
    resolution.y = window.innerHeight;
    canvas.width = resolution.x;
    canvas.height = resolution.y;
    resizeCamera();
    postEffectBlurX.resize(resolution);
    postEffectBlurY.resize(resolution);
    renderBack1.setSize(resolution.x, resolution.y);
    renderBack2.setSize(resolution.x, resolution.y);
    renderBack3.setSize(resolution.x, resolution.y);
    renderer.setSize(resolution.x, resolution.y);
  }
  const render = () => {
    const time = clock.getDelta();

    // render 3d objects
    for (var i = 0; i < butterflies.length; i++) {
      butterflies[i].render(renderer, time);
    }
    floor.render(renderer, scene, sceneBack, camera, time);
    renderer.render(sceneBack, cameraBack, renderBack1);

    // render post effects
    postEffectBright.render(renderer, scene, camera, renderBack2);
    postEffectBlurX.render(renderer, scene, camera, renderBack3);
    postEffectBlurY.render(renderer, scene, camera, renderBack2);
    postEffectBloom.render(renderer, scene, camera);
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
    cameraBack.position.set(400, 500, 800);
    floor.mirrorCamera.position.set(
      cameraBack.position.x,
      cameraBack.position.y * -1,
      cameraBack.position.z
    );
    cameraBack.lookAt(new THREE.Vector3(0, lookAtY, 0));
    floor.mirrorCamera.lookAt(new THREE.Vector3(0, -lookAtY, 0));

    loader.load('/sketch-threejs/img/sketch/butterfly/tex.png', (texture) => {
      texture.magFilter = THREE.NearestFilter;
      texture.minFilter = THREE.NearestFilter;

      // add 3d objects
      for (var i = 0; i < BUTTERFLY_NUM; i++) {
        butterflies[i] = new Butterfly(i, texture);
        butterflies[i].obj.position.x = (Math.random() * 2 - 1) * 280;
        butterflies[i].obj.position.z = 1800 / BUTTERFLY_NUM * i;
        sceneBack.add(butterflies[i].obj);
      }
      floor.add(scene, sceneBack);

      // add post effects
      scene.add(postEffectBright.obj);
      scene.add(postEffectBlurX.obj);
      scene.add(postEffectBlurY.obj);
      scene.add(postEffectBloom.obj);

      renderLoop();
    });
  }
  init();
}
