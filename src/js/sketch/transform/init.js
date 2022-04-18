const THREE = require('three');
const { debounce } = require('@ykob/js-util');

const normalizeVector2 = require('../../common/normalizeVector2').default;
const Butterfly = require('./Butterfly').default;
const Points = require('./Points').default;
const Floor = require('./Floor.js').default;
const PostEffectBright = require('./PostEffectBright.js').default;
const PostEffectBlur = require('./PostEffectBlur.js').default;
const PostEffectBloom = require('./PostEffectBloom.js').default;

export default function() {
  const resolution = {
    x: 0,
    y: 0
  };
  const canvas = document.getElementById('canvas-webgl');
  const renderer = new THREE.WebGL1Renderer({
    antialias: true,
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

  const BUTTERFLY_NUM = 1;
  const PARTICLE_NUM = 32;
  const BRIGHT_MIN = 0.7;

  const butterflies = [];
  const points = new Points(BUTTERFLY_NUM * PARTICLE_NUM);
  const floor = new Floor(resolution);
  const postEffectBright = new PostEffectBright(BRIGHT_MIN, renderBack1.texture);
  const postEffectBlurX = new PostEffectBlur(renderBack2.texture, 1, 0, 1);
  const postEffectBlurY = new PostEffectBlur(renderBack3.texture, 0, 1, 1);
  const postEffectBloom = new PostEffectBloom(BRIGHT_MIN, renderBack1.texture, renderBack2.texture);

  const texArray = [
    '/sketch-threejs/img/sketch/transform/tex.png',
    '/sketch-threejs/img/sketch/transform/flower.jpg'
  ];
  const textures = [];

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
    points.render(time);
    floor.render(renderer, scene, sceneBack, camera, time);
    renderer.setRenderTarget(renderBack1);
    renderer.render(sceneBack, cameraBack);

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
    butterflies[0].isTransform = !butterflies[0].isTransform;
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
    const lookAtY = 60;

    resizeWindow();
    on();

    renderer.setClearColor(0xf9f9f9, 1.0);
    cameraBack.position.set(400.1, 60, -400);
    floor.mirrorCamera.position.set(
      cameraBack.position.x,
      cameraBack.position.y * -1,
      cameraBack.position.z
    );
    cameraBack.lookAt(new THREE.Vector3(0, lookAtY, 0));
    floor.mirrorCamera.lookAt(new THREE.Vector3(0, -lookAtY, 0));

    let countLoaded = 0;
    for (var i = 0; i < texArray.length; i++) {
      const index = i;
      loader.load(texArray[i], (texture) => {
        texture.magFilter = THREE.NearestFilter;
        texture.minFilter = THREE.NearestFilter;
        texture.repeat = THREE.RepeatWrapping;
        textures[index] = texture;
        countLoaded++;
        if (countLoaded >= texArray.length) {
          // create and add 3d objects
          for (var j = 0; j < BUTTERFLY_NUM; j++) {
            butterflies[j] = new Butterfly(j, textures[0], textures[1]);
            sceneBack.add(butterflies[j].obj);
          }
          points.addButterflies(butterflies);
          sceneBack.add(points.obj);
          floor.add(scene, sceneBack);

          // add post effects
          scene.add(postEffectBright.obj);
          scene.add(postEffectBlurX.obj);
          scene.add(postEffectBlurY.obj);
          scene.add(postEffectBloom.obj);

          renderLoop();
        }
      });
    }
  }
  init();
}
